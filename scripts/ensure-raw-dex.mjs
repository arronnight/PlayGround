// Generates the gitignored raw dex file required by the admin AddPokemon tab
// at build time. The repository ships the processed dex under public/data/ but
// not src/assets/data/raw/ (ignored), so a clean clone cannot build without it.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const projectDir = process.argv[2];
if (!projectDir) {
	console.error('usage: ensure-raw-dex.mjs <PROJECT_DIR>');
	process.exit(1);
}

const appDir = join(projectDir, 'openmon');
const target = join(appDir, 'src/assets/data/raw/dex/pokedex.json');
const source = join(appDir, 'public/data/pokedex-full.json');

if (existsSync(target)) {
	console.log(`raw dex already present: ${target}`);
	process.exit(0);
}
if (!existsSync(source)) {
	console.error(`missing source dex: ${source}`);
	process.exit(1);
}

const dex = JSON.parse(readFileSync(source, 'utf8'));
const meters = (value) => (typeof value === 'number' ? `${value / 10} m` : undefined);

const out = dex.map((p) => ({
	id: p.id,
	name: { english: p.name },
	type: (p.types ?? []).map((t) => t.charAt(0).toUpperCase() + t.slice(1)),
	base: {
		HP: p.stats?.hp ?? 0,
		Attack: p.stats?.attack ?? 0,
		Defense: p.stats?.defense ?? 0,
		'Sp. Attack': p.stats?.specialAttack ?? 0,
		'Sp. Defense': p.stats?.specialDefense ?? 0,
		Speed: p.stats?.speed ?? 0
	},
	species: p.name,
	description: p.description ?? '',
	profile: {
		height: meters(p.height),
		weight: meters(p.weight),
		ability: (p.abilities ?? []).map((a) => [a])
	}
}));

mkdirSync(dirname(target), { recursive: true });
writeFileSync(target, JSON.stringify(out));
console.log(`wrote ${target} (${out.length} entries)`);
