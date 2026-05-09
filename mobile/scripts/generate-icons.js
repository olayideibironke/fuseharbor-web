/* Generates brand-colored placeholder PNGs for FuseHarbor mobile.
 * - assets/icon.png            1024x1024  iOS app marketing icon (RGB, no alpha)
 * - assets/splash.png          2048x2048  splash screen, warm background
 * - assets/adaptive-icon.png   1024x1024  Android (kept for completeness)
 *
 * Design language: graphite (#23262b) circular FH badge on warm-white,
 * copper (#c97a2b) accent dot — matches the FuseHarbor website BrandMark.
 */
const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const COLORS = {
  graphite: [0x23, 0x26, 0x2b],
  copper: [0xc9, 0x7a, 0x2b],
  warmWhite: [0xf7, 0xf4, 0xee],
  white: [0xff, 0xfd, 0xf9],
};

function fillBackground(png, [r, g, b]) {
  const { width, height, data } = png;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (width * y + x) << 2;
      data[idx] = r;
      data[idx + 1] = g;
      data[idx + 2] = b;
      data[idx + 3] = 255;
    }
  }
}

function fillCircle(png, cx, cy, radius, [r, g, b]) {
  const { width, height, data } = png;
  const r2 = radius * radius;
  const xMin = Math.max(0, Math.floor(cx - radius));
  const xMax = Math.min(width - 1, Math.ceil(cx + radius));
  const yMin = Math.max(0, Math.floor(cy - radius));
  const yMax = Math.min(height - 1, Math.ceil(cy + radius));
  for (let y = yMin; y <= yMax; y++) {
    for (let x = xMin; x <= xMax; x++) {
      const dx = x - cx;
      const dy = y - cy;
      if (dx * dx + dy * dy <= r2) {
        const idx = (width * y + x) << 2;
        data[idx] = r;
        data[idx + 1] = g;
        data[idx + 2] = b;
        data[idx + 3] = 255;
      }
    }
  }
}

function fillRing(png, cx, cy, rOuter, rInner, color) {
  const { width, height, data } = png;
  const ro2 = rOuter * rOuter;
  const ri2 = rInner * rInner;
  const xMin = Math.max(0, Math.floor(cx - rOuter));
  const xMax = Math.min(width - 1, Math.ceil(cx + rOuter));
  const yMin = Math.max(0, Math.floor(cy - rOuter));
  const yMax = Math.min(height - 1, Math.ceil(cy + rOuter));
  for (let y = yMin; y <= yMax; y++) {
    for (let x = xMin; x <= xMax; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const d2 = dx * dx + dy * dy;
      if (d2 <= ro2 && d2 >= ri2) {
        const idx = (width * y + x) << 2;
        data[idx] = color[0];
        data[idx + 1] = color[1];
        data[idx + 2] = color[2];
        data[idx + 3] = 255;
      }
    }
  }
}

function makeIcon(size = 1024) {
  const png = new PNG({ width: size, height: size, colorType: 2 });
  // Warm background — premium soft surface
  fillBackground(png, COLORS.warmWhite);
  // Outer halo ring in sand-like tone for depth
  fillRing(png, size / 2, size / 2, size * 0.46, size * 0.42, [0xe7, 0xd9, 0xc8]);
  // Main graphite badge
  fillCircle(png, size / 2, size / 2, size * 0.33, COLORS.graphite);
  // Copper accent dot (echoes the BrandMark)
  fillCircle(png, size * 0.66, size * 0.66, size * 0.06, COLORS.copper);
  return png;
}

function makeSplash(size = 2048) {
  const png = new PNG({ width: size, height: size, colorType: 2 });
  fillBackground(png, COLORS.warmWhite);
  // Subtle outer ring
  fillRing(png, size / 2, size / 2, size * 0.16, size * 0.155, [0xde, 0xd6, 0xcb]);
  // Brand badge centered
  fillCircle(png, size / 2, size / 2, size * 0.115, COLORS.graphite);
  // Copper dot
  fillCircle(png, size / 2 + size * 0.07, size / 2 + size * 0.07, size * 0.022, COLORS.copper);
  return png;
}

const assetsDir = path.join(__dirname, '..', 'assets');
fs.mkdirSync(assetsDir, { recursive: true });

const writes = [
  { name: 'icon.png', png: makeIcon(1024) },
  { name: 'adaptive-icon.png', png: makeIcon(1024) },
  { name: 'splash.png', png: makeSplash(2048) },
];

let pending = writes.length;
for (const { name, png } of writes) {
  const target = path.join(assetsDir, name);
  png
    .pack()
    .pipe(fs.createWriteStream(target))
    .on('finish', () => {
      console.log(`wrote ${target}`);
      if (--pending === 0) console.log('all assets generated.');
    })
    .on('error', (err) => {
      console.error(`failed to write ${name}:`, err);
      process.exit(1);
    });
}
