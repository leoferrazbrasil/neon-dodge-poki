import test from 'node:test';
import assert from 'node:assert/strict';
import { createInitialProgression, resolveProgression, getNextMilestone, NEON_MILESTONES, createProgressionStore } from '../game.js';

test('progressão começa com loadout inicial e primeiro marco em 15 segundos', () => {
  const state = createInitialProgression();
  assert.deepEqual(state.unlocked, ['form-default', 'skin-cyan', 'theme-city']);
  assert.equal(getNextMilestone(state).threshold, 15);
});

test('uma rodada de 46 segundos libera os marcos novos em ordem', () => {
  const result = resolveProgression(createInitialProgression(), 46);
  assert.deepEqual(result.newlyUnlocked.map(reward => reward.id), ['form-evolved', 'skin-magenta', 'skin-amber']);
  assert.equal(result.progression.highestMilestone, 45);
  assert.equal(result.nextMilestone.threshold, 60);
});

test('marcos já liberados não são entregues novamente', () => {
  const first = resolveProgression(createInitialProgression(), 46);
  const second = resolveProgression(first.progression, 46);
  assert.deepEqual(second.newlyUnlocked, []);
  assert.equal(second.progression.unlocked.length, first.progression.unlocked.length);
});

test('marcos da especificação formam uma escada crescente', () => {
  assert.deepEqual(NEON_MILESTONES.map(item => item.threshold), [15, 30, 45, 60, 90, 120, 150]);
});

test('progressão continua em memória quando localStorage é bloqueado', () => {
  const messages = [];
  const blocked = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('blocked'); } };
  const store = createProgressionStore(blocked, message => messages.push(message));
  const result = store.completeRun(16);
  assert.equal(result.progression.unlocked.includes('form-evolved'), true);
  assert.equal(store.getProgression().unlocked.includes('form-evolved'), true);
  assert.equal(messages.includes('sessionNotPersisted'), true);
});

test('equipar conteúdo bloqueado não altera o loadout', () => {
  const store = createProgressionStore(null);
  assert.deepEqual(store.equipReward('equipment-visor').equipped, createInitialProgression().equipped);
});
