import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { buildThumbnail } from '../tools/build-thumbnail.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const json = JSON.parse(fs.readFileSync(path.join(root, 'strings.json'), 'utf8'));
const source = fs.readFileSync(path.join(root, 'game.js'), 'utf8');
const LOCALES = ['en', 'pt-BR', 'es', 'fr', 'it', 'de', 'tr'];

test('a cobertura EFIGS mais português e turco está completa', () => {
  const keys = Object.keys(json.en);
  assert.ok(keys.length >= 28);
  for (const locale of LOCALES) {
    assert.ok(json[locale], `locale ausente: ${locale}`);
    const missing = keys.filter(key => !(key in json[locale]));
    assert.deepEqual(missing, [], `${locale} sem: ${missing.join(', ')}`);
  }
});

test('nenhuma tradução ficou igual ao inglês por esquecimento', () => {
  // cognatos legítimos: a forma correta no idioma coincide com o inglês
  const ignore = new Set(['title', 'menu', 'pause', 'form', 'skin', 'theme', 'equipment', 'score']);
  for (const locale of LOCALES.filter(item => item !== 'en')) {
    const copied = Object.keys(json.en).filter(key => !ignore.has(key) && json[locale][key] === json.en[key]);
    assert.deepEqual(copied, [], `${locale} repete o inglês em: ${copied.join(', ')}`);
  }
});

test('os marcadores de substituição sobrevivem à tradução', () => {
  for (const locale of LOCALES) {
    assert.match(json[locale].nextMilestone, /\{label\}/);
    assert.match(json[locale].nextMilestone, /\{seconds\}/);
    assert.match(json[locale].unlocked, /\{label\}/);
  }
});

test('o recuo embutido no runtime cobre os mesmos idiomas e chaves', () => {
  for (const locale of LOCALES) {
    const marker = locale.includes('-') ? `'${locale}': {` : `${locale}: {`;
    assert.ok(source.includes(marker), `runtime sem ${locale}`);
  }
  for (const key of Object.keys(json.en)) {
    assert.ok(source.includes(`${key}:`), `runtime sem a chave ${key}`);
  }
});

test('a thumbnail é quadrada, full bleed e de 628 pixels', () => {
  const svg = buildThumbnail();
  assert.match(svg, /width="628"/);
  assert.match(svg, /height="628"/);
  assert.match(svg, /viewBox="0 0 628 628"/);
  assert.match(svg, /<rect width="628" height="628"/);
});

test('a thumbnail é determinística e não usa texto nem recursos externos', () => {
  const first = buildThumbnail();
  assert.equal(first, buildThumbnail());
  assert.ok(!/<text/.test(first));
  assert.ok(!/<image/.test(first));
  assert.ok(!/https?:/.test(first.replace('http://www.w3.org/2000/svg', '')));
});

test('a thumbnail apresenta NOVA e os Glitches em uma única ideia visual', () => {
  const svg = buildThumbnail();
  const poligonos = svg.match(/<polygon/g) || [];
  assert.ok(poligonos.length >= 18, `apenas ${poligonos.length} polígonos`);
  assert.ok(svg.includes('#ff4fa3'));
  assert.ok(svg.includes('#ff7a1f'));
  assert.ok(svg.includes('#fbe047'));
});

test('o arquivo publicado da thumbnail acompanha o gerador', () => {
  const disco = fs.readFileSync(path.join(root, 'store', 'thumbnail-628.svg'), 'utf8');
  assert.equal(disco.trim(), buildThumbnail().trim());
});

test('os metadados de submissão declaram os itens exigidos pela plataforma', () => {
  const doc = fs.readFileSync(path.join(root, 'store', 'METADADOS.md'), 'utf8');
  for (const item of ['Faixa etária', 'Controles', 'Localização', 'Thumbnail', 'Privacidade', 'Pendências']) {
    assert.ok(doc.includes(item), `metadado ausente: ${item}`);
  }
});
