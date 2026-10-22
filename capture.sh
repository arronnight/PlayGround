#!/usr/bin/env bash
set -euo pipefail

started_at="$(date +%s)"
trap 'rc=$?; printf "[capture.sh] exit %s after %ss\n" "$rc" "$(( $(date +%s) - started_at ))"' EXIT

cd "$(dirname "$0")"
/usr/bin/time -p node - <<'NODE'
const { createRequire } = require('node:module');
const { existsSync, mkdirSync, readFileSync, statSync } = require('node:fs');
const { join, resolve, sep } = require('node:path');

const started = Date.now();
const elapsed = (from = started) => `${Date.now() - from}ms`;
const log = message => console.log(`[capture] ${message}`);
const fail = (message, exitCode = 1) => {
  const error = new Error(message);
  error.exitCode = exitCode;
  throw error;
};
const transient = message => fail(message, 75);
const timed = async (label, work) => {
  const from = Date.now();
  try {
    return await work();
  } finally {
    log(`${label}: ${elapsed(from)}`);
  }
};

const url = process.env.CAPTURE_URL;
const output = process.env.CAPTURE_DIR;
if (!url || !output) fail('Set CAPTURE_URL and CAPTURE_DIR.');
const projectDir = resolve(process.env.PROJECT_DIR || process.cwd());
const outputDir = resolve(output);
if (outputDir === projectDir || outputDir.startsWith(projectDir + sep)) {
  fail('CAPTURE_DIR must be outside PROJECT_DIR.');
}
mkdirSync(outputDir, { recursive: true });
log(`url ${url}`);
log(`output ${outputDir}`);

let chromium;
let config;
try {
  const runtime = join(process.env.HOME, '.local/share/omgithub-playwright');
  const requireFromRuntime = createRequire(join(runtime, 'package.json'));
  chromium = requireFromRuntime('playwright').chromium;
  const configPath = join(runtime, process.platform === 'darwin' ? 'metal.json' : 'linux.json');
  config = JSON.parse(readFileSync(configPath, 'utf8'));
  if (process.platform === 'linux' && !process.env.DISPLAY) {
    const displayPath = join(runtime, 'display');
    if (existsSync(displayPath)) process.env.DISPLAY = ':' + readFileSync(displayPath, 'utf8').trim();
  }
} catch (error) {
  console.error(`[capture] temporary failure: browser runtime unavailable: ${error.message}`);
  process.exit(75);
}

const viewports = [['desktop', 1440, 900], ['mobile', 390, 844]];
(async () => {
let browser;
let exitCode = 0;
try {
  browser = await timed('launch browser', () =>
    chromium.launch({ ...config.browser.launchOptions, timeout: 30000 })
  ).catch(error => transient(`browser launch failed: ${error.message}`));

  for (const [name, width, height] of viewports) {
    const page = await timed(`new ${name} page`, () =>
      browser.newPage({ viewport: { width, height } })
    ).catch(error => transient(`browser page failed: ${error.message}`));
    page.setDefaultTimeout(30000);
    page.on('pageerror', error => console.error(`[capture] ${name} pageerror: ${error.message}`));
    try {
      const response = await timed(`goto ${name}`, () =>
        page.goto(url, { waitUntil: 'load', timeout: 45000 })
      ).catch(error => transient(`navigation failed for ${name}: ${error.message}`));
      if (!response) transient(`no HTTP response for ${name}`);
      if (!response.ok()) {
        const code = [408, 429, 500, 502, 503, 504].includes(response.status()) ? 75 : 1;
        fail(`HTTP ${response.status()} loading ${url}`, code);
      }

      await timed(`wait app shell ${name}`, () =>
        page.waitForFunction(() => {
          const visible = element => !!element && element.offsetParent !== null;
          return ['btn-power', 'desktop-power-btn'].some(id => visible(document.getElementById(id)));
        }, null, { timeout: 30000 })
      ).catch(error => fail(`app shell did not render for ${name}: ${error.message}`, 1));
      await timed(`wait fonts ${name}`, () =>
        page.evaluate(() => document.fonts.ready)
      ).catch(() => {});
      await page.waitForTimeout(500);

      const alreadyPlaying = await page.evaluate(() =>
        [...document.querySelectorAll('#handheld-sub-text, #desktop-sub-text')]
          .some(element => /NOW PLAYING/i.test(element.textContent || ''))
      );
      if (!alreadyPlaying) {
        const clicked = await page.evaluate(() => {
          const visible = element => !!element && element.offsetParent !== null;
          for (const id of ['desktop-power-btn', 'btn-power']) {
            const element = document.getElementById(id);
            if (visible(element)) {
              element.click();
              return id;
            }
          }
          return null;
        });
        if (!clicked) fail(`visible POWER control not found for ${name}`, 1);
        log(`power clicked for ${name}: ${clicked}`);
      } else {
        log(`already playing for ${name}`);
      }

      await timed(`wait gameplay ${name}`, () =>
        page.waitForFunction(() => {
          const playing = [...document.querySelectorAll('#handheld-sub-text, #desktop-sub-text')]
            .some(element => /NOW PLAYING/i.test(element.textContent || ''));
          if (playing) return true;
          const start = document.querySelector('.ejs_start_button');
          if (start && start.offsetParent !== null) {
            start.click();
            return false;
          }
          return false;
        }, null, { timeout: 75000 })
      ).catch(error => fail(`game did not start for ${name}: ${error.message}`, 1));

      await timed(`wait rendered pixels ${name}`, async () => {
        const deadline = Date.now() + 30000;
        let mean = 0;
        let menuOpacity = 1;
        while (Date.now() < deadline) {
          const sample = await page.evaluate(() => {
            const canvas = document.querySelector('.ejs_canvas');
            let mean = 0;
            if (canvas) {
              try {
                const probe = document.createElement('canvas');
                probe.width = 32;
                probe.height = 32;
                const context = probe.getContext('2d');
                context.drawImage(canvas, 0, 0, 32, 32);
                const pixels = context.getImageData(0, 0, 32, 32).data;
                let total = 0;
                for (let index = 0; index < pixels.length; index += 4) {
                  total += (pixels[index] + pixels[index + 1] + pixels[index + 2]) / 3;
                }
                mean = total / (pixels.length / 4);
              } catch {
                mean = 0;
              }
            }
            const menu = document.querySelector('.ejs_menu_bar');
            const menuOpacity = menu ? Number.parseFloat(getComputedStyle(menu).opacity || '0') : 0;
            return { mean, menuOpacity };
          });
          mean = sample.mean;
          menuOpacity = sample.menuOpacity;
          if (mean >= 15 && menuOpacity <= 0.05) return;
          await page.waitForTimeout(250);
        }
        fail(`rendered gameplay stayed blank or obscured for ${name} (mean ${mean.toFixed(1)}, menu ${menuOpacity})`, 1);
      });
      await page.waitForTimeout(500);

      const filename = join(outputDir, `final-${name}.png`);
      await timed(`screenshot ${name}`, () =>
        page.screenshot({ path: filename, timeout: 30000 })
      ).catch(error => {
        if (error.name === 'TimeoutError' || !browser.isConnected()) transient(`screenshot failed for ${name}: ${error.message}`);
        fail(`screenshot failed for ${name}: ${error.message}`, 1);
      });
      const bytes = statSync(filename).size;
      const header = readFileSync(filename).subarray(0, 8).toString('hex');
      if (header !== '89504e470d0a1a0a' || bytes < 10000) {
        fail(`rendered screenshot is invalid for ${name}: ${bytes} bytes`, 1);
      }
      log(`wrote ${filename} (${bytes} bytes)`);
    } finally {
      await timed(`close ${name} page`, () => page.close()).catch(error => {
        console.error(`[capture] close page failed: ${error.message}`);
        exitCode = exitCode || 75;
      });
    }
  }
} catch (error) {
  console.error(`[capture] ${error.exitCode === 75 ? 'temporary failure' : 'failure'}: ${error.message}`);
  exitCode = error.exitCode || 1;
} finally {
  if (browser) {
    await timed('close browser', () => browser.close()).catch(error => {
      console.error(`[capture] close browser failed: ${error.message}`);
      exitCode = exitCode || 75;
    });
  }
  log(`finished in ${elapsed()}`);
  process.exitCode = exitCode;
}
})().catch(error => {
  console.error(`[capture] failure: ${error.message}`);
  process.exitCode = error.exitCode || 1;
});
NODE
