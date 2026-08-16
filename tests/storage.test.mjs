import test from 'node:test';
import assert from 'node:assert/strict';
import { createStorageAdapter } from '../game.js';

test('persistência retorna fallback e avisa quando localStorage lança', () => {
  const storage = {
    getItem() { throw new Error('blocked'); },
    setItem() { throw new Error('blocked'); }
  };
  const notifications = [];
  const adapter = createStorageAdapter(storage, message => notifications.push(message));
  assert.equal(adapter.readBestScore(), 0);
  assert.equal(adapter.writeBestScore(12), false);
  assert.deepEqual(notifications, ['sessionNotPersisted', 'sessionNotPersisted']);
});

test('persistência normaliza score e mantém o maior valor', () => {
  const values = new Map();
  const storage = {
    getItem(key) { return values.get(key) ?? null; },
    setItem(key, value) { values.set(key, value); }
  };
  const adapter = createStorageAdapter(storage);
  assert.equal(adapter.readBestScore(), 0);
  assert.equal(adapter.writeBestScore(12.9), true);
  assert.equal(adapter.readBestScore(), 12);
});

test('persistência de score continua independente da progressão', () => {
  const values = new Map();
  const storage = {
    getItem(key) { return values.get(key) ?? null; },
    setItem(key, value) { values.set(key, value); }
  };
  const adapter = createStorageAdapter(storage);
  adapter.writeBestScore(21);
  assert.equal(values.get('neon-dodge-best-score'), '21');
  assert.equal(values.has('neon-dodge-progression-v1'), false);
});
