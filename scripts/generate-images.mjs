// One-off generator for the site's raster identity assets:
//   src/app/apple-icon.png       180×180 home-screen icon
//   src/app/favicon.ico          32×32 PNG wrapped in an ICO container
//   src/app/opengraph-image.png  1200×630 share card
//
// Run with `node scripts/generate-images.mjs` and commit the results.
// Uses `sharp`, which ships as a dependency of Next itself — nothing is
// added to this project's dependency budget. The PNGs are committed so
// nothing is generated at build or runtime (static-export discipline).

import { writeFile } from "node:fs/promises";
import { createRequire } from "node:module";

const sharp = createRequire(import.meta.url)("sharp");

// Same geometric KO mark as src/app/icon.svg.
const mark = (scale, x, y) => `
  <g transform="translate(${x} ${y}) scale(${scale})" fill="none"
     stroke-width="5" stroke-linecap="round">
    <path d="M18 18v28M18 32L29.5 18.5M18 32L29.5 45.5" stroke="#ece9e2"/>
    <circle cx="43.5" cy="32" r="8.5" stroke="#f59e0b"/>
  </g>`;

const iconSvg = (size) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#0d0c0a"/>
  ${mark(1, 0, 0)}
</svg>`;

const ogSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#0d0c0a"/>
  ${mark(1.8, 78, 120)}
  <text x="96" y="400" font-family="Liberation Mono" font-weight="bold"
        font-size="104" fill="#ece9e2">Kai Okah</text>
  <text x="96" y="470" font-family="Liberation Mono" font-size="34"
        fill="#9b968a">Software engineering student &#183; UDE Essen</text>
  <rect x="96" y="510" width="64" height="6" rx="3" fill="#f59e0b"/>
</svg>`;

// A valid .ico is a tiny directory header followed by image data; modern
// browsers accept PNG-encoded entries.
function pngToIco(png, size) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(1, 4); // image count
  const entry = Buffer.alloc(16);
  entry.writeUInt8(size, 0); // width
  entry.writeUInt8(size, 1); // height
  entry.writeUInt16LE(1, 4); // color planes
  entry.writeUInt16LE(32, 6); // bits per pixel
  entry.writeUInt32LE(png.length, 8);
  entry.writeUInt32LE(22, 12); // data offset (6 + 16)
  return Buffer.concat([header, entry, png]);
}

const apple = await sharp(Buffer.from(iconSvg(180))).png().toBuffer();
await writeFile("src/app/apple-icon.png", apple);

const fav32 = await sharp(Buffer.from(iconSvg(32))).png().toBuffer();
await writeFile("src/app/favicon.ico", pngToIco(fav32, 32));

const og = await sharp(Buffer.from(ogSvg)).png().toBuffer();
await writeFile("src/app/opengraph-image.png", og);

console.log("wrote apple-icon.png, favicon.ico, opengraph-image.png");
