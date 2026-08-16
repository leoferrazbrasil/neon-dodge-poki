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

test('a exceção do namespace SVG é literal e não libera outras URLs', () => {
  assert.equal(scanRuntimeFiles([{ name: 'a', content: "createElementNS('http://www.w3.org/2000/svg', 'svg')" }]).ok, true);
  assert.equal(scanRuntimeFiles([{ name: 'b', content: "src='http://www.w3.org/2000/svg/evil.js'" }]).ok, false);
  assert.equal(scanRuntimeFiles([{ name: 'c', content: "fetch('https://cdn.example.com/a.js')" }]).ok, false);
  assert.equal(scanRuntimeFiles([{ name: 'd', content: "url('http://exemplo.com/f.woff')" }]).ok, false);
});
