import test from 'node:test';
import assert from 'node:assert/strict';
import { createPokiMock, createPokiController, createGameStateMachine, createGameWorld } from '../game.js';

test('gameplayStart ignora uma segunda chamada consecutiva', async () => {
  const sdk = createPokiMock();
  const controller = createPokiController(sdk);
  await controller.startGameplay();
  await controller.startGameplay();
  assert.deepEqual(sdk.events, ['gameplayStart']);
});

test('gameplayStop ignora uma segunda chamada consecutiva', async () => {
  const sdk = createPokiMock();
  const controller = createPokiController(sdk);
  await controller.startGameplay();
  await controller.stopGameplay();
  await controller.stopGameplay();
  assert.deepEqual(sdk.events, ['gameplayStart', 'gameplayStop']);
});

test('Game Over executa commercialBreak antes de voltar a Ready', async () => {
  const sdk = createPokiMock();
  const controller = createPokiController(sdk);
  const machine = createGameStateMachine(controller);
  await machine.finishLoading();
  await machine.inputStart();
  await machine.die();
  await machine.restartAfterGameOver();
  assert.equal(machine.getState(), 'Ready');
  assert.deepEqual(sdk.events, ['gameplayStart', 'gameplayStop', 'commercialBreak']);
});

test('reiniciar não inicia gameplay sem novo input físico', async () => {
  const sdk = createPokiMock();
  const controller = createPokiController(sdk);
  const machine = createGameStateMachine(controller);
  await machine.finishLoading();
  await machine.inputStart();
  await machine.die();
  await machine.restartAfterGameOver();
  assert.equal(controller.isGameplayActive(), false);
  assert.equal(sdk.events.includes('gameplayStart'), true);
  assert.equal(sdk.events.filter(event => event === 'gameplayStart').length, 1);
});

test('trocar faixa altera o destino do jogador', () => {
  const world = createGameWorld({ random: () => 0.5 });
  world.reset();
  world.update(0.016, { switchLane: true });
  assert.equal(world.snapshot().player.targetLane, 1);
});

test('colisão só ocorre quando os retângulos da mesma faixa se sobrepõem', () => {
  const world = createGameWorld({ random: () => 0.5 });
  world.reset({ obstacleX: 0.16, obstacleLane: 0 });
  assert.equal(world.isCollision(), true);
  world.reset({ obstacleX: 0.16, obstacleLane: 1 });
  assert.equal(world.isCollision(), false);
});
