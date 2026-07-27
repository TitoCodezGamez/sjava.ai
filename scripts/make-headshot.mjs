// Pre-builds the headshot into public/ as plain static files.
//
// Astro's <Image> optimises at build time, which needs sharp in the build
// container. Cloudflare's builder does not reliably have it, and when it is
// missing Astro silently falls back to emitting /_image?href=... URLs. Those
// need a server to answer them, so on a static deploy they 404 and the photo
// never appears. Doing the work here removes that dependency: the deploy just
// serves two files that already exist.
//
// Re-run after replacing the source: node scripts/make-headshot.mjs
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const sharp = require('sharp');

const SRC = new URL('../src/assets/images/headshot.jpeg', import.meta.url).pathname;
const OUT = new URL('../public/', import.meta.url).pathname;

// Rendered at 19rem (~304px) wide, so 1x covers it and 2x covers retina.
const SIZES = [
  { file: 'headshot.webp', size: 420 },
  { file: 'headshot@2x.webp', size: 840 },
];

for (const { file, size } of SIZES) {
  const info = await sharp(SRC)
    .resize(size, size, { fit: 'cover' })
    .webp({ quality: 82 })
    .toFile(`${OUT}${file}`);
  console.log(`wrote public/${file} ${info.width}x${info.height} ${(info.size / 1024).toFixed(1)}kB`);
}
