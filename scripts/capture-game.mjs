// APEX GP capture probe: game-aware readiness for a WebGL canvas app.
//
// The generic harness waits for `body`, which proves nothing here — the page
// shell (empty #app div) parses instantly while the renderer boots for much
// longer, and a crashed tab can still serve a bare body. Rendered content for
// this project means the engine booted: window.__APEX__.ready === true.
//
// Exit codes: 75 = temporary navigation/browser infrastructure failure
// (controller retries), 1 = script usage error or a real rendering defect.
import { createRequire } from 'node:module';
import { readFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const runtime = join(process.env.HOME, '.local/share/omgithub-playwright');
const require = createRequire(join(runtime, 'package.json'));
const { chromium } = require('playwright');
const config = JSON.parse(readFileSync(join(runtime, 'linux.json'), 'utf8'));
if (!process.env.DISPLAY) {
  process.env.DISPLAY = ':' + readFileSync(join(runtime, 'display'), 'utf8').trim();
}

const url = process.env.CAPTURE_URL;
const output = process.env.CAPTURE_DIR;
if (!url || !output) {
  console.error('Set CAPTURE_URL and CAPTURE_DIR.');
  process.exit(1);
}
mkdirSync(output, { recursive: true });

const transient = (error) => {
  throw Object.assign(error instanceof Error ? error : new Error(String(error)), { exitCode: 75 });
};

let exitCode = 0;
for (const [name, width, height] of [['desktop', 1440, 900], ['mobile', 390, 844]]) {
  // A fresh browser per viewport: two SwiftShader WebGL sessions in one
  // browser share the GPU process, and the second tab inherits the first
  // tab's memory pressure (the failure mode that killed the mobile shot).
  let browser;
  try {
    browser = await chromium.launch({ ...config.browser.launchOptions, timeout: 30000 }).catch(transient);
    const page = await browser.newPage({ viewport: { width, height } }).catch(transient);
    try {
      page.setDefaultTimeout(30000);
      let crashed = false;
      page.on('crash', () => { crashed = true; });
      page.on('pageerror', (error) => console.error(`[${name} pageerror]`, error.message));
      const response = await page.goto(url, { waitUntil: 'load', timeout: 45000 }).catch(transient);
      const status = response?.status();
      if (!response?.ok()) {
        throw Object.assign(new Error(`HTTP ${status} loading preview`), {
          exitCode: !response || [408, 429, 500, 502, 503, 504].includes(status) ? 75 : 1,
        });
      }
      try {
        await page.waitForFunction(() => window.__APEX__?.ready === true, null, { timeout: 90000 });
      } catch {
        if (crashed) transient(new Error(`tab crashed before first render (${name})`));
        throw Object.assign(
          new Error(`no rendered content on ${name}: engine never signalled ready`),
          { exitCode: 1 },
        );
      }
      await page.waitForTimeout(1500); // let a full frame and the HUD settle
      await page.screenshot({ path: join(output, `final-${name}.png`), timeout: 30000 }).catch((error) => {
        if (error.name === 'TimeoutError' || !browser.isConnected()) transient(error);
        throw error;
      });
      console.log(`captured final-${name}.png`);
    } finally {
      await page.close().catch(() => {});
    }
  } catch (error) {
    console.error(`[${name}]`, error.message || error);
    exitCode = error.exitCode === 75 ? Math.max(exitCode, 75) : 1;
    if (exitCode === 1) break; // a real defect: further evidence would mislead
  } finally {
    await browser?.close().catch(() => { exitCode = Math.max(exitCode, 75); });
  }
}
process.exit(exitCode);
