import test from 'node:test';
import assert from 'node:assert/strict';

import {
  NEON_MILESTONES,
  getRunObjective,
  createProgressionStore,
  createInitialProgression,
  getActiveBeacons,
  getDifficultyProfile,
  createGameWorld
} from '../game.js';

const memoryStorage = () => {
  const data = new Map();
  return {
    getItem: key => (data.has(key) ? data.get(key) : null),
    setItem: (key, value) => data.set(key, String(value)),
    removeItem: key => data.delete(key)
  };
};

test('sempre existe um objetivo, do primeiro segundo ao fim da tabela', () => {
  for (let elapsed = 0; elapsed <= 200; elapsed += 0.5) {
    const objective = getRunObjective(elapsed);
    assert.ok(objective, `sem objetivo em ${elapsed}s`);
    assert.ok(['milestone', 'best', 'record'].includes(objective.kind));
    assert.ok(objective.ratio >= 0 && objective.ratio <= 1);
  }
});

test('o objetivo inicial é o primeiro marco e não a morte', () => {
  const objective = getRunObjective(0);
  assert.equal(objective.kind, 'milestone');
  assert.equal(objective.target, NEON_MILESTONES[0].threshold);
  assert.equal(objective.from, 0);
  assert.equal(objective.ratio, 0);
});

test('a fração cresce de forma monotônica dentro de cada trecho', () => {
  let previous = -1;
  for (let elapsed = 0; elapsed < NEON_MILESTONES[0].threshold; elapsed += 0.25) {
    const ratio = getRunObjective(elapsed).ratio;
    assert.ok(ratio >= previous);
    previous = ratio;
  }
  assert.ok(previous > 0.9);
});

test('cada marco é alvo exatamente até ser cruzado', () => {
  for (const milestone of NEON_MILESTONES) {
    assert.equal(getRunObjective(milestone.threshold - 0.1).id, milestone.id);
    assert.notEqual(getRunObjective(milestone.threshold + 0.1).id, milestone.id);
  }
});

test('a janela iminente coincide com o farol já visível na tela', () => {
  const milestone = NEON_MILESTONES[0];
  const objective = getRunObjective(milestone.threshold - 2.5);
  assert.equal(objective.imminent, true);
  assert.ok(getActiveBeacons(milestone.threshold - 2.5).some(beacon => beacon.id === milestone.id));
  assert.equal(getRunObjective(milestone.threshold - 4).imminent, false);
});

test('após o último marco o recorde pessoal vira o alvo', () => {
  const last = NEON_MILESTONES[NEON_MILESTONES.length - 1].threshold;
  const objective = getRunObjective(last + 10, { bestSeconds: last + 40 });
  assert.equal(objective.kind, 'best');
  assert.equal(objective.target, last + 40);
  assert.ok(objective.ratio > 0 && objective.ratio < 1);
});

test('superado o recorde, o medidor entra em estado de recorde e permanece cheio', () => {
  const last = NEON_MILESTONES[NEON_MILESTONES.length - 1].threshold;
  const objective = getRunObjective(last + 60, { bestSeconds: last + 10 });
  assert.equal(objective.kind, 'record');
  assert.equal(objective.ratio, 1);
  assert.equal(objective.imminent, false);
});

test('o objetivo continua sendo o marco mesmo para quem já o desbloqueou', () => {
  const owned = NEON_MILESTONES.map(item => item.id);
  const objective = getRunObjective(5, { unlocked: owned });
  assert.equal(objective.kind, 'milestone');
  assert.equal(objective.owned, true);
});

test('o tipo do objetivo alimenta o código de cor da coleção', () => {
  const tipos = new Set(NEON_MILESTONES.map(item => getRunObjective(item.threshold - 0.5).type));
  for (const tipo of tipos) assert.ok(['form', 'skin', 'equipment', 'theme'].includes(tipo));
  assert.equal(getRunObjective(999, { bestSeconds: 0 }).type, 'record');
});

test('o objetivo é puro e tolera entradas inválidas', () => {
  assert.deepEqual(getRunObjective(12.5), getRunObjective(12.5));
  assert.equal(getRunObjective(-5).target, NEON_MILESTONES[0].threshold);
  assert.equal(getRunObjective(Number.NaN).target, NEON_MILESTONES[0].threshold);
});

test('a recompensa é aplicada durante a corrida, não apenas na morte', () => {
  const store = createProgressionStore(memoryStorage());
  assert.deepEqual(store.applyMilestones(10).newlyUnlocked, []);
  const earned = store.applyMilestones(16);
  assert.equal(earned.newlyUnlocked.length, 1);
  assert.equal(earned.newlyUnlocked[0].id, NEON_MILESTONES[0].id);
  assert.equal(store.getProgression().equipped.form, NEON_MILESTONES[0].id);
});

test('aplicar marcos é idempotente e a morte não duplica recompensa', () => {
  const store = createProgressionStore(memoryStorage());
  store.applyMilestones(16);
  assert.deepEqual(store.applyMilestones(16).newlyUnlocked, []);
  assert.deepEqual(store.completeRun(16).newlyUnlocked, []);
  assert.equal(store.getProgression().unlocked.filter(id => id === NEON_MILESTONES[0].id).length, 1);
});

test('a primeira recompensa cabe na primeira sessão', () => {
  assert.ok(NEON_MILESTONES[0].threshold <= 15);
  const store = createProgressionStore(memoryStorage());
  assert.equal(store.applyMilestones(NEON_MILESTONES[0].threshold).newlyUnlocked.length, 1);
});

test('a falha de storage não impede a recompensa em corrida', () => {
  const broken = { getItem: () => { throw new Error('bloqueado'); }, setItem: () => { throw new Error('bloqueado'); }, removeItem: () => {} };
  const store = createProgressionStore(broken);
  const earned = store.applyMilestones(16);
  assert.equal(earned.newlyUnlocked.length, 1);
  assert.equal(store.getProgression().equipped.form, NEON_MILESTONES[0].id);
});

test('o objetivo visível não altera core loop, hitbox nem dificuldade', () => {
  const world = createGameWorld({ random: () => 0.5 });
  world.reset();
  for (let step = 0; step < 60; step += 1) world.update(0.05);
  const snapshot = world.snapshot();
  assert.equal(snapshot.player.width, 0.07);
  assert.equal(snapshot.player.height, 0.12);
  assert.equal(getDifficultyProfile(0).speed, 0.26);
  assert.equal(getDifficultyProfile(200).spawnInterval, 0.72);
  assert.deepEqual(createInitialProgression().unlocked, ['form-default', 'skin-cyan', 'theme-city']);
});

test('a celebração exibe a recompensa conquistada, não a seguinte', () => {
  const store = createProgressionStore(memoryStorage());
  const earned = store.applyMilestones(NEON_MILESTONES[0].threshold);
  const conquistada = earned.newlyUnlocked[earned.newlyUnlocked.length - 1];
  const proxima = getRunObjective(NEON_MILESTONES[0].threshold, { unlocked: store.getProgression().unlocked });
  assert.equal(conquistada.id, NEON_MILESTONES[0].id);
  assert.notEqual(conquistada.id, proxima.id);
  assert.notEqual(conquistada.type, proxima.type);
});

test('cada marco entrega uma recompensa única e sequencial', () => {
  const store = createProgressionStore(memoryStorage());
  const conquistas = [];
  for (const milestone of NEON_MILESTONES) {
    const earned = store.applyMilestones(milestone.threshold);
    assert.equal(earned.newlyUnlocked.length, 1, `marco ${milestone.threshold}s`);
    conquistas.push(earned.newlyUnlocked[0].id);
  }
  assert.deepEqual(conquistas, NEON_MILESTONES.map(item => item.id));
});
