import fs from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';
import { createGameWorld, getDifficultyProfile, createInitialProgression, getVisualStyle, getPlayerShape, getObstacleShape, getSceneDecorations } from '../game.js';

test('perfil de dificuldade respeita fases e limites aprovados', () => {
  assert.deepEqual(getDifficultyProfile(0), { speed: 0.26, spawnInterval: 1.3 });
  assert.deepEqual(getDifficultyProfile(120), { speed: 0.52, spawnInterval: 0.72 });
  for (const elapsed of [0, 15, 30, 45, 60, 90, 180]) {
    const profile = getDifficultyProfile(elapsed);
    assert.ok(profile.speed <= 0.52);
    assert.ok(profile.spawnInterval >= 0.72);
  }
});

test('primeiro obstáculo aguarda abertura e a sequência inicial alterna faixas', () => {
  const world = createGameWorld({ random: () => 0.9 });
  world.reset();
  for (let index = 0; index < 18; index += 1) world.update(0.05);
  const first = world.snapshot().obstacles[0];
  assert.equal(first.lane, 0);
  for (let index = 0; index < 28; index += 1) world.update(0.05);
  const lanes = world.snapshot().obstacles.map(obstacle => obstacle.lane);
  assert.ok(lanes.includes(1));
});

test('onboarding explica iniciar e alternar faixa', () => {
  const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(html, /Toque para começar/);
  assert.match(html, /Cada toque alterna a faixa/);
  assert.match(html, /id="hint-label"[^>]*data-i18n="controlHint"/);
  assert.match(html, /id="hint-label"[^>]*>Each tap switches lanes<\/p>/);
});

test('mock Poki fica exposto no escopo global do navegador', () => {
  const source = fs.readFileSync(new URL('../game.js', import.meta.url), 'utf8');
  // o global de portal passou a ser condicionado ao perfil declarado
  assert.match(source, /exposePlatformGlobals/);
});

test('locale ativo atualiza o idioma semântico do documento', () => {
  const source = fs.readFileSync(new URL('../game.js', import.meta.url), 'utf8');
  assert.match(source, /documentElement\.lang\s*=\s*locale/);
});

test('onboarding mostra o próximo marco e a tela de recompensa', () => {
  const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(html, /id="ready-progression"/);
  assert.match(html, /id="game-over-reward"/);
  assert.match(html, /id="game-over-next"/);
  assert.match(html, /data-action="customize"/);
  assert.match(html, /class="mobile-controls"[^>]*hidden/);
});

test('loadout inicial usa a identidade Cidade Neon', () => {
  const style = getVisualStyle(createInitialProgression());
  assert.equal(style.background, '#080b22');
  assert.equal(style.player, '#fbe047');
});

test('identidade visual narrativa preserva as hitboxes do core loop', () => {
  const world = createGameWorld({ random: () => 0.5 });
  world.reset({ obstacleX: 0.16, obstacleLane: 0 });
  const obstacle = world.snapshot().obstacles[0];
  const style = getVisualStyle(createInitialProgression());
  assert.equal(obstacle.width, 0.08);
  assert.equal(obstacle.height, 0.16);
  assert.equal(obstacle.kind, 0);
  assert.equal(style.form, 'form-default');
  assert.equal(style.theme, 'theme-city');
  assert.match(style.playerAccent, /^#/);
  assert.match(style.obstacleAccent, /^#/);
});

test('formas de NOVA e variantes de Glitch têm silhuetas determinísticas', () => {
  const starter = getPlayerShape('form-default');
  const pulse = getPlayerShape('form-evolved');
  const plasma = getPlayerShape('form-advanced');
  const drone = getObstacleShape(0);
  const prism = getObstacleShape(1);
  assert.ok(starter.length >= 4);
  assert.ok(pulse.length >= 4);
  assert.ok(plasma.length >= 4);
  assert.notDeepEqual(starter, pulse);
  assert.notDeepEqual(pulse, plasma);
  assert.notDeepEqual(drone, prism);
});

test('cada tema possui cenário visual procedural próprio', () => {
  const city = getSceneDecorations('theme-city');
  const crystal = getSceneDecorations('theme-crystal');
  const cosmic = getSceneDecorations('theme-cosmic');
  assert.ok(city.length > 0);
  assert.ok(crystal.length > 0);
  assert.ok(cosmic.length > 0);
  assert.notDeepEqual(city, crystal);
  assert.notDeepEqual(crystal, cosmic);
  assert.ok(city.every(item => item.kind && Number.isFinite(item.x)));
});

test('a coleção usa cards uniformes e alvos de toque acessíveis', () => {
  const css = fs.readFileSync(new URL('../styles.css', import.meta.url), 'utf8');
  const source = fs.readFileSync(new URL('../game.js', import.meta.url), 'utf8');
  // o card inteiro é o controle: sem pílula interna competindo com o CTA primário
  assert.ok(!css.includes('.loadout-action'), 'a pílula interna de ação deve ter sido removida');
  assert.ok(!source.includes('loadout-action'), 'o runtime não deve mais criar a pílula de ação');
  assert.match(source, /card\.type = 'button'/);
  assert.match(css, /\.loadout-item[^}]*min-height:\s*(?:[6-9]\d|1\d\d)px/s);
  // altura uniforme com 7 idiomas: o nome reserva sempre duas linhas
  assert.match(css, /\.loadout-name[^}]*line-clamp:\s*2/s);
  assert.match(css, /\.loadout-item[^}]*touch-action:\s*manipulation/s);
  // grade que se adapta à largura, sem coluna fixa
  assert.match(css, /\.loadout-grid[^}]*repeat\(auto-fill, minmax\(/s);
  assert.match(css, /\.loadout-item:focus-visible/);
  assert.match(css, /orientation:\s*portrait/);
  assert.match(css, /\.menu-panel \.loadout-list[^}]*min-height:\s*0/s);
  assert.match(source, /if \(state === GAME_STATES\.MENU\) return;/);
});
