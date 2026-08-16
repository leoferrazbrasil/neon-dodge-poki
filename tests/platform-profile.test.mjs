import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

import { readPlatformProfile, exposePlatformGlobals, createPlatformMock, createPokiMock, createPlatformController, createPokiController } from '../game.js';

const fakeDoc = platform => ({ documentElement: { dataset: platform === undefined ? {} : { platform } } });

test('o perfil padrão é neutro e não expõe global de portal nenhum', () => {
  assert.equal(readPlatformProfile(fakeDoc()), 'neutral');
  const alvo = {};
  assert.equal(exposePlatformGlobals(createPlatformMock(), 'neutral', alvo), null);
  assert.deepEqual(Object.keys(alvo), []);
});

test('perfil desconhecido ou malicioso recai para neutro', () => {
  for (const valor of ['crazygames', 'POKI', '', 'outro', undefined, null]) {
    assert.equal(readPlatformProfile(fakeDoc(valor)), 'neutral', String(valor));
  }
  assert.equal(readPlatformProfile(undefined), 'neutral');
  assert.equal(readPlatformProfile({}), 'neutral');
});

test('somente o perfil poki declarado expõe o global da Poki', () => {
  assert.equal(readPlatformProfile(fakeDoc('poki')), 'poki');
  const alvo = {};
  const sdk = createPlatformMock();
  assert.equal(exposePlatformGlobals(sdk, 'poki', alvo), sdk);
  assert.deepEqual(Object.keys(alvo), ['PokiSDK']);
});

test('o runtime publicado não declara perfil de portal algum', () => {
  const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.ok(!/data-platform=/.test(html), 'index.html não deve declarar plataforma no pacote neutro');
});

test('o runtime nunca atribui um global de portal incondicionalmente', () => {
  const source = fs.readFileSync(new URL('../game.js', import.meta.url), 'utf8');
  assert.ok(!/^\s*(?:globalThis|window)\.PokiSDK\s*=/m.test(source), 'atribuição direta encontrada');
  assert.match(source, /if \(profile !== 'poki'\) return null;/);
});

test('a interface visível não menciona portal nenhum', () => {
  const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const css = fs.readFileSync(new URL('../styles.css', import.meta.url), 'utf8');
  const strings = fs.readFileSync(new URL('../strings.json', import.meta.url), 'utf8');
  for (const [nome, conteudo] of [['index.html', html], ['styles.css', css], ['strings.json', strings]]) {
    assert.ok(!/poki|crazygames|kongregate|armorgames/i.test(conteudo), `${nome} menciona um portal`);
  }
});

test('os aliases da Poki continuam apontando para o adaptador neutro', () => {
  assert.equal(createPokiMock, createPlatformMock);
  assert.equal(createPokiController, createPlatformController);
});

test('nenhum texto da interface fica abaixo de 12px em devicePixelRatio 1', () => {
  const css = fs.readFileSync(new URL('../styles.css', import.meta.url), 'utf8');
  const fixos = [...css.matchAll(/font-size:\s*(\d+(?:\.\d+)?)px/g)].map(m => Number(m[1]));
  const pisos = [...css.matchAll(/font-size:\s*clamp\((\d+(?:\.\d+)?)px/g)].map(m => Number(m[1]));
  const pequenos = [...fixos, ...pisos].filter(valor => valor < 12);
  assert.deepEqual(pequenos, [], `tamanhos abaixo de 12px: ${pequenos.join(', ')}`);
});
