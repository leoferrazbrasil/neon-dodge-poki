import test from 'node:test';
import assert from 'node:assert/strict';
import { createPokiMock, createPokiController, bootstrap } from '../game.js';

test('loading finished só ocorre depois do init e dos shaders', async () => {
  const sdk = createPokiMock();
  const controller = createPokiController(sdk);
  await controller.finishLoading(Promise.resolve(), Promise.resolve());
  assert.deepEqual(sdk.events, ['init', 'gameLoadingFinished']);
});

test('bootstrap publica Ready depois de gameLoadingFinished', async () => {
  const sdk = createPokiMock();
  const readyStates = [];
  await bootstrap({
    sdk,
    loadStrings: async () => ({}),
    compileShaders: async () => {},
    onReady: () => readyStates.push(true)
  });
  assert.deepEqual(sdk.events, ['init', 'gameLoadingFinished']);
  assert.deepEqual(readyStates, [true]);
});
