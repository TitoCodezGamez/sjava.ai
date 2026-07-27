// Generates public/og.png (1200x630) for link previews.
// Mirrors the site's dark hero: network field, circular portrait, name + title.
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const sharp = require('sharp');
import { writeFileSync } from 'node:fs';

const W = 1200;
const H = 630;
const OUT = new URL('../public/og.png', import.meta.url).pathname;
const HEADSHOT = new URL('../src/assets/images/headshot.jpeg', import.meta.url).pathname;

// Palette lifted from themes.css (dark theme)
const BG = '#111110';
const LINE = 'rgb(176,224,197)';
const NODE = 'rgb(216,240,226)';
const ACCENT = '#52b788';
const TEXT = '#f5f5f2';

// Deterministic RNG so the card is byte-identical on every regeneration
let seed = 20260727;
const rnd = () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
};

// ── Network field ────────────────────────────────────────────────────────────
const AVATAR = 330;
const AVATAR_CX = 900;
const AVATAR_CY = H / 2;

const nodes = [];
for (let i = 0; i < 46; i++) {
  const x = rnd() * W;
  const y = rnd() * H;
  // Keep the field off the text column and off the portrait itself
  const overText = x < 620 && y > 150 && y < 500;
  const onFace = Math.hypot(x - AVATAR_CX, y - AVATAR_CY) < AVATAR / 2 + 30;
  if (overText || onFace) continue;
  nodes.push({ x, y, r: 1.6 + rnd() * 1.6 });
}

const R = 165;
let edges = '';
for (let i = 0; i < nodes.length; i++) {
  for (let j = i + 1; j < nodes.length; j++) {
    const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
    if (d >= R) continue;
    const a = (1 - d / R) * 0.34;
    edges += `<line x1="${nodes[i].x.toFixed(1)}" y1="${nodes[i].y.toFixed(1)}" x2="${nodes[j].x.toFixed(1)}" y2="${nodes[j].y.toFixed(1)}" stroke="${LINE}" stroke-opacity="${a.toFixed(3)}" stroke-width="1"/>`;
  }
}

const dots = nodes
  .map(
    (n) =>
      `<circle cx="${n.x.toFixed(1)}" cy="${n.y.toFixed(1)}" r="${n.r.toFixed(2)}" fill="${NODE}" fill-opacity="0.55"/>`
  )
  .join('');

// ── Card ─────────────────────────────────────────────────────────────────────
const bg = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="wash" cx="72%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#1b4332" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="${BG}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="halo">
      <stop offset="0%" stop-color="${ACCENT}" stop-opacity="0.42"/>
      <stop offset="68%" stop-color="${ACCENT}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="${BG}"/>
  <rect width="${W}" height="${H}" fill="url(#wash)"/>
  ${edges}
  ${dots}
  <circle cx="${AVATAR_CX}" cy="${AVATAR_CY}" r="${AVATAR * 0.62}" fill="url(#halo)"/>

  <text x="90" y="262" font-family="Inter, Helvetica Neue, Helvetica, Arial, sans-serif"
        font-size="24" font-weight="600" letter-spacing="2.2" fill="${ACCENT}">
    PRINCIPAL ENGINEER, GOOGLE DEEPMIND
  </text>
  <text x="88" y="352" font-family="Playfair Display, Georgia, Times New Roman, serif"
        font-size="64" font-weight="600" fill="${TEXT}">
    Sara Javanmardi
  </text>
  <text x="90" y="412" font-family="Inter, Helvetica Neue, Helvetica, Arial, sans-serif"
        font-size="27" fill="#a8a8a3">
    Over a decade in machine learning and AI,
  </text>
  <text x="90" y="450" font-family="Inter, Helvetica Neue, Helvetica, Arial, sans-serif"
        font-size="27" fill="#a8a8a3">
    with extensive experience in deployment.
  </text>
  <text x="90" y="536" font-family="Inter, Helvetica Neue, Helvetica, Arial, sans-serif"
        font-size="25" font-weight="500" fill="${ACCENT}">
    sjava.ai
  </text>
</svg>`;

const mask = Buffer.from(
  `<svg width="${AVATAR}" height="${AVATAR}"><circle cx="${AVATAR / 2}" cy="${AVATAR / 2}" r="${AVATAR / 2}" fill="#fff"/></svg>`
);

const avatar = await sharp(HEADSHOT)
  .resize(AVATAR, AVATAR, { fit: 'cover', position: 'top' })
  .composite([{ input: mask, blend: 'dest-in' }])
  .png()
  .toBuffer();

const png = await sharp(Buffer.from(bg))
  .composite([
    { input: avatar, left: Math.round(AVATAR_CX - AVATAR / 2), top: Math.round(AVATAR_CY - AVATAR / 2) },
  ])
  .png({ compressionLevel: 9 })
  .toBuffer();

writeFileSync(OUT, png);
const meta = await sharp(png).metadata();
console.log(`wrote ${OUT} ${meta.width}x${meta.height} ${(png.length / 1024).toFixed(1)}kB`);
