import test from 'node:test';
import assert from 'node:assert/strict';

import {
  NEON_MILESTONES,
  getLoadoutSections,
  getThemePalette,
  getSkinColor,
  getPlayerHull,
  createInitialProgression,
  createProgressionStore,
  findReward
} from '../game.js';

const memoryStorage = () => {
  const data = new Map();
  return { getItem: k => (data.has(k) ? data.get(k) : null), setItem: (k, v) => data.set(k, String(v)), removeItem: k => data.delete(k) };
};

test('a coleção agrupa por tipo em ordem estável', () => {
  const sections = getLoadoutSections(createInitialProgression());
  assert.deepEqual(sections.map(s => s.type), ['form', 'skin', 'equipment', 'theme']);
  assert.deepEqual(sections, getLoadoutSections(createInitialProgression()));
});

test('todo item do catálogo aparece, bloqueado ou não', () => {
  const todos = getLoadoutSections(createInitialProgression()).flatMap(s => s.items.map(i => i.id));
  for (const milestone of NEON_MILESTONES) assert.ok(todos.includes(milestone.id), `ausente: ${milestone.id}`);
  for (const inicial of ['form-default', 'skin-cyan', 'theme-city']) assert.ok(todos.includes(inicial));
  assert.equal(new Set(todos).size, todos.length, 'nenhum item duplicado');
});

test('dentro de cada tipo os itens seguem a ordem de conquista', () => {
  for (const section of getLoadoutSections(createInitialProgression())) {
    const limiares = section.items.map(i => i.threshold);
    assert.deepEqual(limiares, [...limiares].sort((a, b) => a - b), section.type);
  }
});

test('no início só os itens iniciais estão liberados e equipados', () => {
  const sections = getLoadoutSections(createInitialProgression());
  const liberados = sections.flatMap(s => s.items.filter(i => i.unlocked).map(i => i.id));
  assert.deepEqual(liberados.sort(), ['form-default', 'skin-cyan', 'theme-city']);
  const equipados = sections.flatMap(s => s.items.filter(i => i.equipped).map(i => i.id));
  assert.deepEqual(equipados.sort(), ['form-default', 'skin-cyan', 'theme-city']);
});

test('cada tipo tem no máximo um item equipado', () => {
  const store = createProgressionStore(memoryStorage());
  store.applyMilestones(200);
  for (const section of getLoadoutSections(store.getProgression())) {
    assert.ok(section.items.filter(i => i.equipped).length <= 1, section.type);
  }
});

test('o item bloqueado informa o segundo que o libera', () => {
  const bloqueados = getLoadoutSections(createInitialProgression()).flatMap(s => s.items.filter(i => !i.unlocked));
  assert.ok(bloqueados.length >= 6);
  for (const item of bloqueados) {
    assert.ok(item.threshold > 0);
    assert.equal(item.equipped, false);
    assert.equal(NEON_MILESTONES.find(m => m.id === item.id).threshold, item.threshold);
  }
});

test('conquistar tudo não deixa nenhum item bloqueado', () => {
  const store = createProgressionStore(memoryStorage());
  store.applyMilestones(200);
  const restantes = getLoadoutSections(store.getProgression()).flatMap(s => s.items.filter(i => !i.unlocked));
  assert.deepEqual(restantes, []);
});

test('a pré-visualização tem dados próprios para cada tipo de item', () => {
  for (const forma of ['form-default', 'form-evolved', 'form-advanced']) {
    assert.ok(getPlayerHull(forma).length >= 3);
  }
  const skins = ['skin-cyan', 'skin-magenta', 'skin-amber'].map(getSkinColor);
  assert.equal(new Set(skins).size, 3);
  const temas = ['theme-city', 'theme-crystal', 'theme-cosmic'].map(getThemePalette);
  assert.equal(new Set(temas.map(t => t.background)).size, 3);
  for (const tema of temas) {
    for (const chave of ['background', 'accent', 'lane', 'playerAccent']) assert.match(tema[chave], /^#[0-9a-f]{6}$/i);
  }
});

test('as tabelas de cor da coleção são as mesmas usadas pelo jogo', () => {
  assert.equal(getThemePalette('theme-city').background, '#080b22');
  assert.equal(getSkinColor('skin-cyan'), '#fbe047');
  assert.equal(getThemePalette('inexistente'), getThemePalette('theme-city'));
  assert.equal(getSkinColor('inexistente'), getSkinColor('skin-cyan'));
});

test('o agrupamento tolera progressão corrompida', () => {
  for (const entrada of [null, undefined, {}, { unlocked: 'nada', equipped: 7 }]) {
    const sections = getLoadoutSections(entrada);
    assert.equal(sections.length, 4);
    assert.ok(sections.every(s => s.items.length > 0));
  }
});

test('itens iniciais podem ser reequipados após conquistar os avançados', () => {
  const store = createProgressionStore(memoryStorage());
  store.applyMilestones(200);
  assert.equal(store.getProgression().equipped.form, 'form-advanced');
  assert.equal(store.equipReward('form-default').equipped.form, 'form-default');
  assert.equal(store.equipReward('skin-cyan').equipped.skin, 'skin-cyan');
  assert.equal(store.equipReward('theme-city').equipped.theme, 'theme-city');
});

test('equipar continua recusando item bloqueado ou inexistente', () => {
  const store = createProgressionStore(memoryStorage());
  const inicial = JSON.stringify(store.getProgression().equipped);
  for (const id of ['form-advanced', 'theme-cosmic', 'nao-existe', '', null]) {
    assert.equal(JSON.stringify(store.equipReward(id).equipped), inicial, `aceitou ${id}`);
  }
});

test('o catálogo de recompensas cobre marcos e itens iniciais', () => {
  for (const milestone of NEON_MILESTONES) assert.equal(findReward(milestone.id).type, milestone.type);
  assert.equal(findReward('form-default').type, 'form');
  assert.equal(findReward('skin-cyan').type, 'skin');
  assert.equal(findReward('theme-city').type, 'theme');
  assert.equal(findReward('inexistente'), null);
});
