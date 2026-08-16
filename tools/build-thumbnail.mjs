import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { getPlayerParts, getGlitchParts, getGlitchTone, getVisualStyle, createInitialProgression } from '../game.js';

const SIZE = 628;

const place = (points, cx, cy, scale) => points
  .map(([x, y]) => `${(cx + x * scale).toFixed(2)},${(cy + y * scale).toFixed(2)}`)
  .join(' ');

export function buildThumbnail() {
  const style = { ...getVisualStyle(createInitialProgression()), form: 'form-advanced' };
  const layers = [];

  layers.push(`<rect width="${SIZE}" height="${SIZE}" fill="${style.background}"/>`);
  for (let index = 0; index < 5; index += 1) {
    const y = 118 + index * 22;
    layers.push(`<rect x="0" y="${y}" width="${SIZE}" height="3" fill="${style.lane}" opacity="${0.05 + index * 0.03}"/>`);
  }
  layers.push(`<rect x="0" y="238" width="${SIZE}" height="230" fill="${style.accent}" opacity="0.3"/>`);
  layers.push(`<rect x="0" y="232" width="${SIZE}" height="7" fill="${style.lane}" opacity="0.9"/>`);
  layers.push(`<rect x="0" y="468" width="${SIZE}" height="7" fill="${style.lane}" opacity="0.9"/>`);
  for (let x = -30; x < SIZE; x += 78) {
    layers.push(`<rect x="${x}" y="348" width="46" height="11" fill="${style.lane}" opacity="0.6"/>`);
  }

  const glitch = getGlitchParts(2);
  for (const part of glitch) {
    const color = part.tone === 'glitch' ? getGlitchTone(2) : style[part.tone] || style.accent;
    layers.push(`<polygon points="${place(part.points, 484, 292, 168)}" fill="${color}" opacity="${part.alpha}"/>`);
  }
  const shard = getGlitchParts(1);
  for (const part of shard) {
    const color = part.tone === 'glitch' ? getGlitchTone(1) : style[part.tone] || style.accent;
    layers.push(`<polygon points="${place(part.points, 566, 424, 128)}" fill="${color}" opacity="${part.alpha}"/>`);
  }
  for (const part of getPlayerParts('form-advanced', { elapsed: 0.46, laneOffset: 0.08 })) {
    layers.push(`<polygon points="${place(part.points, 214, 352, 268)}" fill="${style[part.tone] || style.accent}" opacity="${part.alpha}"/>`);
  }

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}" shape-rendering="geometricPrecision">`,
    ...layers,
    '</svg>'
  ].join('\n');
}

const here = path.dirname(fileURLToPath(import.meta.url));
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const target = path.resolve(here, '..', 'store', 'thumbnail-628.svg');
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, buildThumbnail(), 'utf8');
  process.stdout.write(`Thumbnail written: ${target}\n`);
}
