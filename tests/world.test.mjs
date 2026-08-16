import test from 'node:test';
import assert from 'node:assert/strict';

import {
  NEON_MILESTONES,
  getRoadBands,
  getParallaxOffset,
  wrapParallaxX,
  getLaneDashes,
  getActiveBeacons,
  getSceneDecorations,
  getDifficultyProfile
} from '../game.js';

test('a estrada declara leito, bordas e guias de faixa', () => {
  const bands = getRoadBands();
  const ids = bands.map(band => band.id);
  assert.ok(ids.includes('bed'));
  assert.ok(ids.includes('edge-top'));
  assert.ok(ids.includes('edge-bottom'));
  assert.ok(ids.includes('guide-top'));
  assert.ok(ids.includes('guide-bottom'));
  assert.ok(bands.every(band => Number.isFinite(band.y) && band.height > 0 && band.alpha > 0));
});

test('as guias de faixa continuam alinhadas às faixas jogáveis', () => {
  const bands = getRoadBands();
  assert.equal(bands.find(band => band.id === 'guide-top').y, 0.35);
  assert.equal(bands.find(band => band.id === 'guide-bottom').y, 0.63);
});

test('o deslocamento de paralaxe é puro e cresce com a profundidade', () => {
  assert.equal(getParallaxOffset(10, 0.3, 0.38), getParallaxOffset(10, 0.3, 0.38));
  assert.equal(getParallaxOffset(0, 0.3, 1), 0);
  assert.ok(getParallaxOffset(1, 0.3, 1) > getParallaxOffset(1, 0.3, 0.12));
});

test('o deslocamento de paralaxe nunca escapa da largura de repetição', () => {
  for (let elapsed = 0; elapsed <= 200; elapsed += 7) {
    const offset = getParallaxOffset(elapsed, 0.52, 1);
    assert.ok(offset >= 0 && offset < 1.2);
  }
});

test('a envoltória de paralaxe mantém a decoração dentro da faixa de tela', () => {
  for (let offset = 0; offset < 1.2; offset += 0.05) {
    const x = wrapParallaxX(0.5, offset);
    assert.ok(x >= -0.1 && x < 1.1);
  }
});

test('a marcação da pista cobre a tela inteira e é determinística', () => {
  const first = getLaneDashes(12.5, 0.3);
  const second = getLaneDashes(12.5, 0.3);
  assert.deepEqual(first, second);
  assert.ok(first.length >= 10);
  assert.ok(first[0].x <= 0);
  assert.ok(first[first.length - 1].x >= 1);
  assert.ok(first.every(dash => dash.y === 0.49));
});

test('a marcação da pista avança conforme o tempo de corrida', () => {
  const start = getLaneDashes(0, 0.3)[0].x;
  const later = getLaneDashes(0.2, 0.3)[0].x;
  assert.notEqual(start, later);
});

test('cada marco de progressão vira um farol que atravessa a pista', () => {
  for (const milestone of NEON_MILESTONES) {
    const beacons = getActiveBeacons(milestone.threshold);
    const beacon = beacons.find(item => item.id === milestone.id);
    assert.ok(beacon, `farol ausente para ${milestone.id}`);
    assert.ok(Math.abs(beacon.x - 0.16) < 1e-9);
  }
});

test('o farol entra pela direita antes do marco e sai pela esquerda depois', () => {
  const milestone = NEON_MILESTONES[0];
  const before = getActiveBeacons(milestone.threshold - 2).find(item => item.id === milestone.id);
  const after = getActiveBeacons(milestone.threshold + 0.5).find(item => item.id === milestone.id);
  assert.ok(before.x > 0.16);
  assert.ok(after.x < 0.16);
});

test('nenhum farol permanece visível fora da sua janela', () => {
  assert.deepEqual(getActiveBeacons(6), []);
  assert.deepEqual(getActiveBeacons(200), []);
});

test('os faróis não interferem no gameplay nem carregam colisão', () => {
  const beacon = getActiveBeacons(15)[0];
  assert.equal(beacon.width, undefined);
  assert.equal(beacon.height, undefined);
  assert.equal(beacon.lane, undefined);
});

test('a curva de dificuldade permanece intacta após a camada de mundo', () => {
  assert.equal(getDifficultyProfile(0).speed, 0.26);
  assert.equal(getDifficultyProfile(200).speed, 0.52);
  assert.equal(getDifficultyProfile(200).spawnInterval, 0.72);
});

test('cada tema declara três profundidades de paralaxe', () => {
  for (const theme of ['theme-city', 'theme-crystal', 'theme-cosmic']) {
    const depths = new Set(getSceneDecorations(theme).map(item => item.depth));
    assert.equal(depths.size, 3, `${theme} deveria ter três camadas`);
    assert.ok(getSceneDecorations(theme).every(item => item.depth > 0));
  }
});
