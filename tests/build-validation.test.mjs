import test from 'node:test';
import assert from 'node:assert/strict';
import { scanRuntimeFiles } from '../tools/validate-build.mjs';

test('auditoria rejeita URL externa no runtime', () => {
  const result = scanRuntimeFiles(['<script src="https://cdn.example/game.js"></script>']);
  assert.equal(result.ok, false);
});

test('auditoria aceita apenas conteúdo local limpo', () => {
  const result = scanRuntimeFiles([
    '<script type="module" src="./game.js"></script>',
    'const value = 1;'
  ]);
  assert.equal(result.ok, true);
});
