import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { buildCover, COVER_FORMATS } from '../tools/build-covers.mjs';

const formato = id => COVER_FORMATS.find(item => item.id === id);
const buildThumbnail = () => buildCover(formato('thumbnail-628'));

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
  const disco = fs.readFileSync(path.join(root, 'store', 'covers', 'thumbnail-628.svg'), 'utf8');
  assert.equal(disco.trim(), buildThumbnail().trim());
});

test('os metadados de submissão declaram os itens exigidos pela plataforma', () => {
  const doc = fs.readFileSync(path.join(root, 'store', 'METADADOS.md'), 'utf8');
  for (const item of ['Faixa etária', 'Controles', 'Localização', 'Thumbnail', 'Privacidade', 'Pendências']) {
    assert.ok(doc.includes(item), `metadado ausente: ${item}`);
  }
});

test('os três formatos de capa exigidos pelo CrazyGames existem com as dimensões corretas', () => {
  const exigidos = { landscape: [1920, 1080], portrait: [800, 1200], square: [800, 800] };
  for (const [id, [largura, altura]] of Object.entries(exigidos)) {
    const spec = COVER_FORMATS.find(item => item.id === id);
    assert.ok(spec, `formato ausente: ${id}`);
    assert.equal(spec.width, largura, id);
    assert.equal(spec.height, altura, id);
    const svg = buildCover(spec);
    assert.match(svg, new RegExp(`viewBox="0 0 ${largura} ${altura}"`));
    assert.match(svg, new RegExp(`<rect width="${largura}" height="${altura}"`), `${id} não é full bleed`);
  }
});

test('as capas seguem as proibições de Game Covers', () => {
  for (const spec of COVER_FORMATS) {
    const svg = buildCover(spec);
    assert.ok(!/<image/.test(svg), `${spec.id} usa imagem externa`);
    assert.ok(!/stroke=/.test(svg), `${spec.id} desenha borda`);
    const textos = [...svg.matchAll(/<text[^>]*>([^<]*)<\/text>/g)].map(m => m[1]);
    for (const texto of textos) {
      assert.equal(texto, 'NEON DODGE', `${spec.id} escreve algo além do título: ${texto}`);
    }
    if (!spec.title) assert.deepEqual(textos, [], `${spec.id} não deveria ter texto`);
  }
});

test('os PNG publicados existem e batem com as dimensões declaradas', () => {
  for (const spec of COVER_FORMATS) {
    const arquivo = path.join(root, 'store', 'covers', `${spec.id}.png`);
    const bytes = fs.readFileSync(arquivo);
    assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', `${spec.id} não é PNG`);
    assert.equal(bytes.readUInt32BE(16), spec.width, `${spec.id} largura`);
    assert.equal(bytes.readUInt32BE(20), spec.height, `${spec.id} altura`);
    assert.ok(bytes.length < 50 * 1024 * 1024, `${spec.id} excede o limite`);
  }
});

test('as capas são determinísticas e reproduzíveis a partir do gerador', () => {
  for (const spec of COVER_FORMATS) {
    assert.equal(buildCover(spec), buildCover(spec), spec.id);
    const disco = fs.readFileSync(path.join(root, 'store', 'covers', `${spec.id}.svg`), 'utf8');
    assert.equal(disco.trim(), buildCover(spec).trim(), `${spec.id} descolou do gerador`);
  }
});

test('o pacote do CrazyGames declara audiência 13+, PEGI 12 e os controles', () => {
  const doc = fs.readFileSync(path.join(root, 'store', 'crazygames', 'SUBMISSION.md'), 'utf8');
  assert.match(doc, /aged 13 or over/i);
  assert.match(doc, /PEGI 12 compliant/i);
  assert.ok(!/9\s*[-–to]+\s*12/.test(doc), 'o pacote não pode posicionar o jogo para 9 a 12 anos');
  for (const item of ['Short description', 'Long description', 'Controls', 'Age rating', 'Languages', 'Preview videos']) {
    assert.ok(doc.includes(item), `seção ausente: ${item}`);
  }
  assert.ok(!/[ãõçáéíóúâêô]/i.test(doc.replace(/Portuguese \(Brazil\)/g, '')), 'o pacote deve estar em inglês');
});
