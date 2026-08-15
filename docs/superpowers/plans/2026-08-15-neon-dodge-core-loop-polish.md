# Neon Dodge Core Loop Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tornar o primeiro toque imediatamente compreensível e calibrar o ritmo dos obstáculos para uma progressão justa e retentiva.

**Architecture:** Adicionar uma função pura `getDifficultyProfile(elapsed)` e um diretor determinístico dentro de `createGameWorld()`. O diretor controla velocidade, intervalo e faixa inicial sem alterar os contratos do PokiSDK. O HTML receberá uma instrução explícita de onboarding, enquanto o restante do renderer e do áudio permanecerá inalterado.

**Tech Stack:** JavaScript ES modules, Node.js built-in `node:test`, HTML/CSS local e WebGL já existente.

## Global Constraints

- O primeiro input inicia a rodada, mas não troca a faixa na mesma interação.
- Ready deve comunicar `Toque para começar` e `Cada toque alterna a faixa`.
- Opening: 0–15 s, velocidade 0,26 → 0,30 e intervalo 1,30 → 1,18 s.
- Rising: 15–45 s, velocidade 0,30 → 0,39 e intervalo 1,18 → 0,90 s.
- Challenge: 45–90 s, velocidade 0,39 → 0,48 e intervalo 0,90 → 0,74 s.
- Endless: 90 s+, velocidade máxima 0,52 e intervalo mínimo 0,72 s.
- O primeiro obstáculo entra aproximadamente após 0,9 s.
- O diretor não cria bloqueio simultâneo das duas faixas.
- `gameplayStart`, `gameplayStop`, `commercialBreak`, zero requests e bundle limpo permanecem inalterados.
- Partículas, novos efeitos visuais e expansão sonora ficam fora desta iteração.

---

### Task 1: Criar contratos de dificuldade e onboarding

**Files:**
- Create: `tests/core-loop-polish.test.mjs`
- Modify: `game.js`
- Modify: `index.html`

**Interfaces:**
- Produces `getDifficultyProfile(elapsed)` com `{ speed, spawnInterval }`.
- `createGameWorld().snapshot()` passa a incluir `spawnInterval`.
- `index.html` contém o texto exato `Toque para começar` e `Cada toque alterna a faixa`.

- [ ] **Step 1: Escrever testes que falhem com os parâmetros atuais**

```js
import fs from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';
import { createGameWorld, getDifficultyProfile } from '../game.js';

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
  for (let index = 0; index < 17; index += 1) world.update(0.05);
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
});
```

- [ ] **Step 2: Rodar o teste isolado e observar RED**

Run: `node --test tests/core-loop-polish.test.mjs`

Expected: FAIL porque `getDifficultyProfile` não existe, o snapshot ainda não expõe `spawnInterval` e o onboarding ainda não contém a segunda instrução.

- [ ] **Step 3: Commitar somente o teste RED**

```bash
git add tests/core-loop-polish.test.mjs
git commit -m "test: define core loop polish contracts"
```

### Task 2: Implementar diretor determinístico e fair play

**Files:**
- Modify: `game.js`
- Modify: `tests/core-loop-polish.test.mjs`

**Interfaces:**
- `getDifficultyProfile(elapsed)` interpola linearmente os quatro segmentos e aplica os limites finais.
- `createGameWorld()` usa `spawnInterval`, velocidade e seleção de faixa do perfil atual.

- [ ] **Step 1: Implementar o perfil puro de dificuldade**

```js
export function getDifficultyProfile(elapsed) {
  const time = Math.max(0, elapsed);
  const lerp = (start, end, amount) => start + (end - start) * Math.max(0, Math.min(1, amount));
  if (time < 15) return { speed: lerp(0.26, 0.30, time / 15), spawnInterval: lerp(1.30, 1.18, time / 15) };
  if (time < 45) return { speed: lerp(0.30, 0.39, (time - 15) / 30), spawnInterval: lerp(1.18, 0.90, (time - 15) / 30) };
  if (time < 90) return { speed: lerp(0.39, 0.48, (time - 45) / 45), spawnInterval: lerp(0.90, 0.74, (time - 45) / 45) };
  return { speed: 0.52, spawnInterval: 0.72 };
}
```

- [ ] **Step 2: Alterar o mundo para usar o diretor**

Inicializar `spawnTimer` em `0.9`, guardar `lastSpawnLane`, escolher lane `0` e depois `1` alternadamente durante os primeiros 15 segundos, atualizar o perfil a cada frame e incluir `spawnInterval` no snapshot. Depois de 15 segundos, permitir aleatoriedade, mas trocar a lane quando a escolha repetir duas vezes seguidas.

- [ ] **Step 3: Rodar o teste isolado até GREEN**

Run: `node --test tests/core-loop-polish.test.mjs`

Expected: PASS nos três testes, sem mudar os testes existentes.

- [ ] **Step 4: Rodar a suíte completa**

Run: `npm test`

Expected: todos os testes existentes e novos aprovados.

- [ ] **Step 5: Commitar o diretor**

```bash
git add game.js tests/core-loop-polish.test.mjs
git commit -m "feat: calibrate obstacle director for retention"
```

### Task 3: Tornar o onboarding inequívoco

**Files:**
- Modify: `index.html`
- Modify: `strings.json`
- Modify: `game.js`

**Interfaces:**
- Adiciona a chave `controlHint` ao dicionário local.
- `#hint-label` exibe a instrução de controle no Ready e em estado discreto durante Playing.
- O primeiro evento em `startFromInput()` continua chamando apenas `machine.inputStart()` e `world.reset()`.

- [ ] **Step 1: Atualizar o dicionário local**

Adicionar `controlHint` em inglês e português: `Each tap switches lanes` e `Cada toque alterna a faixa`, mantendo os demais locales com fallback em inglês.

- [ ] **Step 2: Renderizar a instrução no Ready e no Playing**

Manter `#hint-label` no painel inicial e adicionar uma cópia discreta no HUD/overlay durante Playing, sem cobrir o canvas nem criar nova animação.

- [ ] **Step 3: Verificar que o primeiro input não troca lane**

Adicionar uma asserção ao teste de onboarding usando o controlador de jogo: após `inputStart()`, `player.targetLane` deve continuar em `0`; somente um segundo `update(0, { switchLane: true })` pode levá-lo a `1`.

- [ ] **Step 4: Rodar testes e auditoria**

Run: `npm test`

Run: `npm run check:build`

Expected: suíte verde e runtime ainda sem requests externas, `console.log` ou dependências novas.

- [ ] **Step 5: Commitar o onboarding**

```bash
git add index.html strings.json game.js tests/core-loop-polish.test.mjs
git commit -m "feat: clarify first touch onboarding"
```

### Task 4: Executar playtest local e publicar a iteração

**Files:**
- Modify: `docs/superpowers/specs/2026-08-15-neon-dodge-core-loop-polish-design.md`
- Modify: `docs/superpowers/plans/2026-08-15-neon-dodge-core-loop-polish.md`
- Modify: `README.md`

- [ ] **Step 1: Rodar a suíte final e auditoria**

Run: `npm test`

Run: `npm run check:build`

Expected: todos os testes aprovados e runtime abaixo de 8 MB.

- [ ] **Step 2: Fazer playtest no navegador em 1031x580, 390x844 e viewport desktop**

Verificar: texto de primeiro toque, primeiro obstáculo após abertura, uma faixa sempre segura, progressão sem pico abrupto, Game Over compreensível e retorno `commercialBreak()` → Ready.

- [ ] **Step 3: Registrar evidências no cofre**

Atualizar `D:\LEONARDO\Games\cofre-games\03 - Entrega\Validação.md` com data, parâmetros finais, resultado do playtest e tamanho do runtime. Não registrar dados pessoais, tokens ou credenciais.

- [ ] **Step 4: Atualizar documentação do repositório**

Adicionar ao README uma seção curta com a curva de dificuldade e os comandos `npm test`/`npm run check:build`.

- [ ] **Step 5: Commitar e publicar em main**

```bash
git add README.md docs tests game.js index.html strings.json
git commit -m "feat: polish Neon Dodge core loop"
git push origin main
```

## Self-review do plano

- Cobertura: onboarding, first input, quatro fases, limites, fair play, testes, auditoria, playtest e cofre estão cobertos nas Tasks 1–4.
- Consistência: `getDifficultyProfile`, `spawnInterval`, `lastSpawnLane`, `#hint-label` e `controlHint` são os nomes únicos usados em testes e implementação.
- Escopo: nenhum efeito visual/sonoro avançado, backend, rede ou SDK oficial foi incluído.
- Placeholders: nenhum `TODO`, `TBD`, `FIXME` ou etapa vaga permanece.
