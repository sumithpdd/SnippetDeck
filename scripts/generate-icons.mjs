/**
 * Generates PNG extension icons from an inline SVG.
 * Run once: node scripts/generate-icons.mjs
 * Requires: npm install --save-dev sharp
 */
import sharp from 'sharp';
import { mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const iconsDir = resolve(__dirname, '../extension/public/icons');
mkdirSync(iconsDir, { recursive: true });

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <rect width="128" height="128" rx="24" fill="#0f172a"/>
  <rect x="20" y="36" width="88" height="10" rx="5" fill="#38bdf8"/>
  <rect x="20" y="56" width="64" height="10" rx="5" fill="#334155"/>
  <rect x="20" y="76" width="72" height="10" rx="5" fill="#334155"/>
  <rect x="20" y="96" width="48" height="10" rx="5" fill="#334155"/>
</svg>`;

const sizes = [16, 48, 128];

for (const size of sizes) {
  await sharp(Buffer.from(svg))
    .resize(size, size)
    .png()
    .toFile(resolve(iconsDir, `icon${size}.png`));
  console.log(`✓ icon${size}.png`);
}

console.log(`Icons written to extension/public/icons/`);
