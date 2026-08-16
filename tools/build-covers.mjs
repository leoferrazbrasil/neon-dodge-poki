import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { getPlayerParts, getGlitchParts, getGlitchTone, getVisualStyle, createInitialProgression } from '../game.js';

// Formatos exigidos pelo CrazyGames em Game Covers, mais o quadrado usado pela Poki.
export const COVER_FORMATS = Object.freeze([
  Object.freeze({ id: 'landscape', width: 1920, height: 1080, title: true }),
  Object.freeze({ id: 'portrait', width: 800, height: 1200, title: true }),
  Object.freeze({ id: 'square', width: 800, height: 800, title: true }),
  Object.freeze({ id: 'thumbnail-628', width: 628, height: 628, title: false })
]);

const TITLE_STACK = "Arial Black, Arial, Helvetica, sans-serif";

const place = (points, cx, cy, scale) => points
  .map(([x, y]) => `${(cx + x * scale).toFixed(2)},${(cy + y * scale).toFixed(2)}`)
  .join(' ');

const escapeText = value => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function buildCover({ width, height, title = false }, gameTitle = 'NEON DODGE') {
  const style = { ...getVisualStyle(createInitialProgression()), form: 'form-advanced' };
  const unit = Math.min(width, height);
  const roadTop = height * 0.42;
  const roadHeight = height * 0.34;
  const layers = [`<rect width="${width}" height="${height}" fill="${style.background}"/>`];

  for (let index = 0; index < 6; index += 1) {
    const y = height * 0.10 + index * height * 0.035;
    layers.push(`<rect x="0" y="${y.toFixed(1)}" width="${width}" height="${Math.max(2, height * 0.005).toFixed(1)}" fill="${style.lane}" opacity="${(0.05 + index * 0.025).toFixed(3)}"/>`);
  }
  layers.push(`<rect x="0" y="${roadTop.toFixed(1)}" width="${width}" height="${roadHeight.toFixed(1)}" fill="${style.accent}" opacity="0.32"/>`);
  const edge = Math.max(4, height * 0.011);
  layers.push(`<rect x="0" y="${(roadTop - edge).toFixed(1)}" width="${width}" height="${edge.toFixed(1)}" fill="${style.lane}" opacity="0.92"/>`);
  layers.push(`<rect x="0" y="${(roadTop + roadHeight).toFixed(1)}" width="${width}" height="${edge.toFixed(1)}" fill="${style.lane}" opacity="0.92"/>`);
  const dashY = roadTop + roadHeight / 2 - height * 0.008;
  const dashStep = width * 0.062;
  for (let x = -dashStep * 0.4; x < width; x += dashStep) {
    layers.push(`<rect x="${x.toFixed(1)}" y="${dashY.toFixed(1)}" width="${(dashStep * 0.58).toFixed(1)}" height="${(height * 0.016).toFixed(1)}" fill="${style.lane}" opacity="0.62"/>`);
  }

  const laneA = roadTop + roadHeight * 0.28;
  const laneB = roadTop + roadHeight * 0.74;
  const glitchScale = unit * 0.24;
  const cast = [
    { kind: 2, x: width * 0.66, y: laneA, scale: glitchScale },
    { kind: 1, x: width * 0.86, y: laneB, scale: glitchScale * 0.78 },
    { kind: 0, x: width * 0.5, y: laneB, scale: glitchScale * 0.66 }
  ];
  for (const item of cast) {
    for (const part of getGlitchParts(item.kind)) {
      const color = part.tone === 'glitch' ? getGlitchTone(item.kind) : style[part.tone] || style.accent;
      layers.push(`<polygon points="${place(part.points, item.x, item.y, item.scale)}" fill="${color}" opacity="${part.alpha}"/>`);
    }
  }
  for (const part of getPlayerParts('form-advanced', { elapsed: 0.46, laneOffset: 0.09 })) {
    layers.push(`<polygon points="${place(part.points, width * 0.22, laneA, unit * 0.4)}" fill="${style[part.tone] || style.accent}" opacity="${part.alpha}"/>`);
  }

  if (title) {
    const size = unit * 0.13;
    layers.push(`<text x="${(width / 2).toFixed(1)}" y="${(roadTop - height * 0.09).toFixed(1)}" font-family="${TITLE_STACK}" font-size="${size.toFixed(1)}" font-weight="900" letter-spacing="${(size * 0.06).toFixed(1)}" fill="${style.player}" text-anchor="middle">${escapeText(gameTitle)}</text>`);
  }

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" shape-rendering="geometricPrecision">`,
    ...layers,
    '</svg>'
  ].join('\n');
}

const here = path.dirname(fileURLToPath(import.meta.url));
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const dir = path.resolve(here, '..', 'store', 'covers');
  fs.mkdirSync(dir, { recursive: true });
  for (const format of COVER_FORMATS) {
    const target = path.join(dir, `${format.id}.svg`);
    fs.writeFileSync(target, buildCover(format), 'utf8');
    process.stdout.write(`${format.id}: ${format.width}x${format.height} -> ${target}\n`);
  }
}
