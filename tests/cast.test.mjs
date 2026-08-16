import test from 'node:test';
import assert from 'node:assert/strict';

import {
  createGameWorld,
  createInitialProgression,
  getVisualStyle,
  getPlayerParts,
  getPlayerHull,
  getGlitchParts,
  getGlitchTone
} from '../game.js';

const FORMS = ['form-default', 'form-evolved', 'form-advanced'];
const KINDS = [0, 1, 2];

function isConvex(points) {
  let sign = 0;
  for (let index = 0; index < points.length; index += 1) {
    const a = points[index];
    const b = points[(index + 1) % points.length];
    const c = points[(index + 2) % points.length];
    const cross = (b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0]);
    if (cross === 0) continue;
    const current = Math.sign(cross);
    if (sign === 0) sign = current;
    else if (current !== sign) return false;
  }
  return true;
}

test('toda parte de NOVA é convexa e renderiza corretamente no leque de triângulos', () => {
  for (const form of FORMS) {
    for (const part of getPlayerParts(form)) {
      assert.ok(isConvex(part.points), `${form}/${part.id} não é convexa`);
      assert.ok(part.points.length >= 3);
    }
  }
});

test('toda parte de Glitch é convexa, incluindo o Portal antes côncavo', () => {
  for (const kind of KINDS) {
    for (const part of getGlitchParts(kind)) {
      assert.ok(isConvex(part.points), `glitch ${kind}/${part.id} não é convexa`);
    }
  }
});

test('os cascos das três formas são convexos', () => {
  for (const form of FORMS) assert.ok(isConvex(getPlayerHull(form)), form);
});

test('NOVA declara pelo menos oito partes em qualquer forma', () => {
  for (const form of FORMS) assert.ok(getPlayerParts(form).length >= 8, form);
});

test('cada Glitch declara pelo menos cinco partes', () => {
  for (const kind of KINDS) assert.ok(getGlitchParts(kind).length >= 5, String(kind));
});

test('NOVA tem casco, visor, lente e núcleo identificáveis', () => {
  const ids = getPlayerParts('form-default').map(part => part.id);
  for (const id of ['thruster', 'hull', 'visor-plate', 'visor-lens', 'core-ring', 'core']) {
    assert.ok(ids.includes(id), `parte ausente: ${id}`);
  }
});

test('cada forma acrescenta partes próprias sem perder a base', () => {
  const base = getPlayerParts('form-default').length;
  assert.ok(getPlayerParts('form-evolved').length > base);
  assert.ok(getPlayerParts('form-advanced').length > base);
  assert.notDeepEqual(getPlayerHull('form-default'), getPlayerHull('form-advanced'));
});

test('a composição de NOVA é pura para a mesma entrada', () => {
  const first = getPlayerParts('form-evolved', { elapsed: 4.2, laneOffset: 0.05 });
  const second = getPlayerParts('form-evolved', { elapsed: 4.2, laneOffset: 0.05 });
  assert.deepEqual(first, second);
});

test('o núcleo pulsa dentro de uma faixa visível de opacidade', () => {
  for (let elapsed = 0; elapsed < 6; elapsed += 0.13) {
    const core = getPlayerParts('form-default', { elapsed }).find(part => part.id === 'core');
    assert.ok(core.alpha >= 0.62 && core.alpha <= 1);
  }
});

test('o propulsor alonga na troca de faixa e recolhe quando NOVA se estabiliza', () => {
  const still = getPlayerParts('form-default', { laneOffset: 0 }).find(part => part.id === 'thruster');
  const moving = getPlayerParts('form-default', { laneOffset: 0.14 }).find(part => part.id === 'thruster');
  assert.ok(moving.points[0][0] < still.points[0][0]);
});

test('as três variantes de Glitch têm silhueta e cor próprias', () => {
  const ids = KINDS.map(kind => getGlitchParts(kind).map(part => part.id).join('|'));
  assert.equal(new Set(ids).size, 3);
  const tones = KINDS.map(getGlitchTone);
  assert.equal(new Set(tones).size, 3);
  assert.ok(tones.every(tone => /^#[0-9a-f]{6}$/i.test(tone)));
});

test('a cor base do Glitch permanece a do MVP para a primeira variante', () => {
  assert.equal(getGlitchTone(0), getVisualStyle(createInitialProgression()).obstacle);
});

test('a paleta de Glitch é exposta pelo estilo ativo', () => {
  const style = getVisualStyle(createInitialProgression());
  assert.equal(style.glitchTones.length, 3);
  assert.deepEqual([...style.glitchTones], KINDS.map(getGlitchTone));
});

test('toda parte usa um token de paleta conhecido', () => {
  const style = getVisualStyle(createInitialProgression());
  const allowed = new Set(['player', 'playerAccent', 'lane', 'accent', 'background', 'obstacle', 'obstacleAccent', 'glitch']);
  const parts = [...FORMS.flatMap(form => getPlayerParts(form)), ...KINDS.flatMap(kind => getGlitchParts(kind))];
  for (const part of parts) {
    assert.ok(allowed.has(part.tone), `token desconhecido: ${part.tone}`);
    if (part.tone !== 'glitch') assert.ok(style[part.tone], `token sem cor: ${part.tone}`);
    assert.ok(part.alpha > 0 && part.alpha <= 1);
  }
});

test('o elenco composto não altera as hitboxes do core loop', () => {
  const world = createGameWorld({ random: () => 0.5 });
  world.reset({ obstacleX: 0.5, obstacleLane: 1 });
  const snapshot = world.snapshot();
  assert.equal(snapshot.player.width, 0.07);
  assert.equal(snapshot.player.height, 0.12);
  assert.equal(snapshot.obstacles[0].width, 0.08);
  assert.equal(snapshot.obstacles[0].height, 0.16);
});

test('a variante de Glitch continua determinística pelo serial de spawn', () => {
  const run = () => {
    const world = createGameWorld({ random: () => 0.5 });
    world.reset();
    for (let step = 0; step < 400; step += 1) world.update(0.05);
    return world.snapshot().obstacles.map(obstacle => obstacle.kind);
  };
  assert.deepEqual(run(), run());
});
