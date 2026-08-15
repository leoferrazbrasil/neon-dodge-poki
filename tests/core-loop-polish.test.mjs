import fs from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';
import { createGameWorld, getDifficultyProfile } from '../game.js';

test('perfil de dificuldade respeita fases e limites aprovados', () => {
  assert.deepEqual(getDifficultyProfile(0), { speed: 0.26, spawnInterval: 1.3 });
  assert.deepEqual(getDifficultyProfile(120), { speed: 0.52, spawnInterval: 0.72 });
  for (const elapsed of [0, 15, 30, 45, 60, 90, 180]) {
    const profile = getDifficultyProfile(elapsed);
    assert.ok(profile.speed <= 0.52);
    assert.ok(profile.spawnInterval >= 0.72);
  }
});

test('primeiro obstáculo aguarda abertura e a sequência inicial alterna faixas', () => {
  const world = createGameWorld({ random: () => 0.9 });
  world.reset();
  for (let index = 0; index < 18; index += 1) world.update(0.05);
  const first = world.snapshot().obstacles[0];
  assert.equal(first.lane, 0);
  for (let index = 0; index < 28; index += 1) world.update(0.05);
  const lanes = world.snapshot().obstacles.map(obstacle => obstacle.lane);
  assert.ok(lanes.includes(1));
});

test('onboarding explica iniciar e alternar faixa', () => {
  const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(html, /Toque para começar/);
  assert.match(html, /Cada toque alterna a faixa/);
});

test('mock Poki fica exposto no escopo global do navegador', () => {
  const source = fs.readFileSync(new URL('../game.js', import.meta.url), 'utf8');
  assert.match(source, /globalThis\.PokiSDK/);
});
