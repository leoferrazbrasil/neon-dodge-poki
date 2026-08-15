# Neon Dodge Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir e validar um MVP WebGL puro de desvio em duas faixas, com UX responsivo, Mock PokiSDK assíncrono e build local sem requests externas.

**Architecture:** O jogo será um módulo ES local em `game.js`, com funções puras exportadas para testes e bootstrap DOM protegido por `typeof window`. Um controlador FSM isolará as transições `Booting`, `Ready`, `Playing`, `Paused`, `Menu` e `Game Over`; renderer, input, áudio e persistência serão adaptadores internos. O Mock PokiSDK será injetável nos testes e atribuído a `window.PokiSDK` em produção.

**Tech Stack:** HTML5, CSS local, JavaScript ES modules, WebGL2 com fallback WebGL1/Canvas 2D, Web Audio API, Node.js built-in `node:test`, sem dependências runtime ou CDN.

## Global Constraints

- Nenhum `fetch`, `XMLHttpRequest`, import remoto, tag `link` externa, CDN, Google Fonts, Google Analytics ou serviço de terceiros.
- O bundle inicial deve permanecer abaixo de 8 MB.
- Todas as leituras e gravações de `localStorage` devem estar em `try/catch` e nunca podem bloquear o loop.
- `gameplayStart()` só pode ocorrer a partir do primeiro input físico de uma sessão de gameplay.
- `gameplayStop()` deve ocorrer em morte, pausa sistêmica, abertura de menu e encerramento de gameplay.
- `gameplayStart()` e `gameplayStop()` não podem ocorrer duas vezes consecutivas sem a transição oposta.
- `commercialBreak()` ocorre no toque de reinício após Game Over e devolve o jogo a `Ready`; o novo gameplay exige outro input físico.
- `PokiSDK.gameLoadingFinished()` ocorre uma vez depois de `init()`, shaders e recursos locais estarem prontos e antes de exibir `Ready`.
- A composição lógica do canvas é 16:9 e usa as referências 640x360, 836x470 ou 1031x580.
- Controles de toque devem ser visíveis em smartphones e tablets detectados por user agent/touch capability.
- O build final não conterá `console.log`, overlays de debug, testes ou ferramentas de desenvolvimento.
- Textos de UI vivem em `strings.json`, local, com mensagens essenciais em en, pt-BR, es, fr, it, de e tr.

---

### Task 1: Preparar o harness local e os contratos testáveis

**Files:**
- Create: `package.json`
- Create: `tests/poki-state.test.mjs`
- Create: `tests/storage.test.mjs`
- Create: `tests/loading.test.mjs`

**Interfaces:**
- Consumes: nenhum código de produção; esta tarefa define os comandos de validação.
- Produces: `npm test` executando `node --test tests/*.test.mjs` sem dependências externas.

- [ ] **Step 1: Criar os testes iniciais que expressem os contratos ausentes**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { createPokiMock, createPokiController } from '../game.js';

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
```

- [ ] **Step 2: Criar os testes de falha de armazenamento e carregamento**

```js
test('persistência retorna fallback e avisa quando localStorage lança', async () => {
  const storage = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('blocked'); } };
  const notifications = [];
  const { readBestScore, writeBestScore } = createStorageAdapter(storage, message => notifications.push(message));
  assert.equal(readBestScore(), 0);
  assert.equal(writeBestScore(12), false);
  assert.equal(notifications.length, 2);
});

test('loading finished só ocorre depois do init e dos shaders', async () => {
  const sdk = createPokiMock();
  const controller = createPokiController(sdk);
  await controller.finishLoading(Promise.resolve(), Promise.resolve());
  assert.deepEqual(sdk.events, ['init', 'gameLoadingFinished']);
});
```

- [ ] **Step 3: Configurar o script de teste**

```json
{
  "private": true,
  "type": "module",
  "scripts": {
    "test": "node --test tests/*.test.mjs",
    "check:build": "node tools/validate-build.mjs"
  }
}
```

- [ ] **Step 4: Rodar os testes para confirmar falha por contratos ainda inexistentes**

Run: `npm test`

Expected: FAIL com erros de módulo/export ausente, não erro de sintaxe do teste.

- [ ] **Step 5: Commitar somente o harness**

```bash
git add package.json tests
git commit -m "test: define Poki and storage contracts"
```

### Task 2: Implementar Mock PokiSDK, FSM e persistência tolerante

**Files:**
- Create: `game.js`
- Modify: `tests/poki-state.test.mjs`
- Modify: `tests/storage.test.mjs`
- Modify: `tests/loading.test.mjs`

**Interfaces:**
- Produces `createPokiMock()` com `init()`, `gameLoadingFinished()`, `gameplayStart()`, `gameplayStop()`, `commercialBreak()` e array interno de eventos para teste.
- Produces `createPokiController(sdk)` com `finishLoading(initPromise, shaderPromise)`, `startGameplay()`, `stopGameplay()`, `runCommercialBreak()`, `isGameplayActive()`.
- Produces `createStorageAdapter(storage, notify)` com `readBestScore()` e `writeBestScore(score)`.
- Produces `createGameStateMachine(controller)` com estado inicial `Booting` e métodos de transição explícitos.

- [ ] **Step 1: Rodar os testes da Task 1 e confirmar o RED**

Run: `npm test`

Expected: FAIL porque `game.js` ainda não exporta os contratos.

- [ ] **Step 2: Implementar o Mock e o controlador com locks**

```js
export function createPokiMock() {
  const events = [];
  return {
    events,
    async init() { events.push('init'); },
    async gameLoadingFinished() { events.push('gameLoadingFinished'); },
    async gameplayStart() { events.push('gameplayStart'); },
    async gameplayStop() { events.push('gameplayStop'); },
    async commercialBreak() { events.push('commercialBreak'); }
  };
}

export function createPokiController(sdk) {
  let gameplayActive = false;
  let loadingFinished = false;
  let commercialBreakBusy = false;
  return {
    async finishLoading(initPromise, shaderPromise) {
      await Promise.resolve().then(() => sdk.init()).catch(() => undefined);
      await Promise.all([initPromise, shaderPromise]);
      if (!loadingFinished) {
        loadingFinished = true;
        await sdk.gameLoadingFinished();
      }
    },
    async startGameplay() {
      if (!gameplayActive) { gameplayActive = true; await sdk.gameplayStart(); }
    },
    async stopGameplay() {
      if (gameplayActive) { gameplayActive = false; await sdk.gameplayStop(); }
    },
    async runCommercialBreak() {
      if (commercialBreakBusy) return;
      commercialBreakBusy = true;
      try { await sdk.commercialBreak(); } finally { commercialBreakBusy = false; }
    },
    isGameplayActive: () => gameplayActive
  };
}
```

- [ ] **Step 3: Implementar armazenamento protegido**

```js
export function createStorageAdapter(storage, notify = () => {}) {
  const key = 'neon-dodge-best-score';
  const failed = message => { notify(message); return false; };
  return {
    readBestScore() {
      try { return Math.max(0, Number.parseInt(storage?.getItem(key) ?? '0', 10) || 0); }
      catch { notify('sessionNotPersisted'); return 0; }
    },
    writeBestScore(score) {
      try { storage?.setItem(key, String(Math.max(0, Math.floor(score)))); return true; }
      catch { return failed('sessionNotPersisted'); }
    }
  };
}
```

- [ ] **Step 4: Implementar a FSM sem iniciar gameplay automaticamente**

```js
export const GAME_STATES = Object.freeze({ BOOTING: 'Booting', READY: 'Ready', PLAYING: 'Playing', PAUSED: 'Paused', MENU: 'Menu', GAME_OVER: 'Game Over' });

export function createGameStateMachine(controller) {
  let state = GAME_STATES.BOOTING;
  return {
    getState: () => state,
    async finishLoading() { if (state === GAME_STATES.BOOTING) state = GAME_STATES.READY; },
    async inputStart() { if (state === GAME_STATES.READY || state === GAME_STATES.PAUSED || state === GAME_STATES.MENU) { await controller.startGameplay(); state = GAME_STATES.PLAYING; } },
    async pause() { if (state === GAME_STATES.PLAYING) { await controller.stopGameplay(); state = GAME_STATES.PAUSED; } },
    async openMenu() { if (state === GAME_STATES.PLAYING) { await controller.stopGameplay(); state = GAME_STATES.MENU; } },
    async die() { if (state === GAME_STATES.PLAYING) { await controller.stopGameplay(); state = GAME_STATES.GAME_OVER; } },
    async restartAfterGameOver() { if (state === GAME_STATES.GAME_OVER) { await controller.runCommercialBreak(); state = GAME_STATES.READY; } }
  };
}
```

- [ ] **Step 5: Rodar os testes e corrigir até GREEN**

Run: `npm test`

Expected: PASS for SDK locks, storage fallback/notification, loading order and Game Over → commercialBreak → Ready.

- [ ] **Step 6: Commitar o núcleo testado**

```bash
git add game.js tests
git commit -m "feat: add Poki lifecycle and resilient game state"
```

### Task 3: Adicionar dicionário local e shell responsivo

**Files:**
- Create: `index.html`
- Create: `styles.css`
- Create: `strings.json`
- Modify: `game.js`

**Interfaces:**
- `index.html` fornece `#game-shell`, `#game-canvas`, `#hud`, `#ready-panel`, `#pause-panel`, `#menu-panel`, `#game-over-panel`, `#storage-notice` e controles táteis.
- `strings.json` fornece chaves `title`, `start`, `pause`, `resume`, `restart`, `score`, `best`, `storageNotice` por locale.
- `game.js` carrega apenas `./strings.json` localmente e possui fallback embutido em inglês se a leitura falhar.

- [ ] **Step 1: Criar o dicionário local mínimo**

```json
{
  "en": { "title": "Neon Dodge", "start": "Tap to start", "pause": "Pause", "resume": "Resume", "restart": "Restart", "score": "Score", "best": "Best", "storageNotice": "This session score will not be saved." },
  "pt-BR": { "title": "Neon Dodge", "start": "Toque para começar", "pause": "Pausar", "resume": "Continuar", "restart": "Reiniciar", "score": "Pontos", "best": "Recorde", "storageNotice": "A pontuação desta sessão não será salva." },
  "es": { "title": "Neon Dodge", "start": "Toca para empezar", "pause": "Pausa", "resume": "Continuar", "restart": "Reiniciar", "score": "Puntuación", "best": "Mejor", "storageNotice": "La puntuación de esta sesión no se guardará." },
  "fr": { "title": "Neon Dodge", "start": "Touchez pour commencer", "pause": "Pause", "resume": "Reprendre", "restart": "Recommencer", "score": "Score", "best": "Record", "storageNotice": "Le score de cette session ne sera pas sauvegardé." },
  "it": { "title": "Neon Dodge", "start": "Tocca per iniziare", "pause": "Pausa", "resume": "Riprendi", "restart": "Ricomincia", "score": "Punteggio", "best": "Record", "storageNotice": "Il punteggio di questa sessione non verrà salvato." },
  "de": { "title": "Neon Dodge", "start": "Tippen zum Starten", "pause": "Pause", "resume": "Fortsetzen", "restart": "Neustart", "score": "Punkte", "best": "Bestwert", "storageNotice": "Der Punktestand dieser Sitzung wird nicht gespeichert." },
  "tr": { "title": "Neon Dodge", "start": "Başlamak için dokun", "pause": "Duraklat", "resume": "Devam et", "restart": "Yeniden başlat", "score": "Skor", "best": "En iyi", "storageNotice": "Bu oturumun skoru kaydedilmeyecek." }
}
```

- [ ] **Step 2: Criar o HTML sem dependências remotas**

Use `<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">`, um único `<script type="module" src="./game.js"></script>` e nenhum `<link>` externo. Todos os painéis devem existir no DOM, mas apenas um estado pode estar visível.

- [ ] **Step 3: Criar CSS 16:9 e mobile-first**

Use `aspect-ratio: 16 / 9`, `object-fit: contain`, `touch-action: none`, `env(safe-area-inset-*)`, botões com área mínima de 44px e media query baseada em `pointer: coarse` para manter controles táteis visíveis em touch devices. Não use imagens, fontes ou imports externos.

- [ ] **Step 4: Adicionar detecção e input sem duplicação**

No `game.js`, defina `const isTouchDevice = navigator.maxTouchPoints > 0 || /Android|iPhone|iPad|Tablet/i.test(navigator.userAgent);`, mostre os controles se verdadeiro, use `pointerdown` como evento único e ignore `keydown` repetido. `Space`, `Escape` e `P` devem respeitar a FSM.

- [ ] **Step 5: Validar o shell no navegador e em teste estático**

Run: `rg -n "https?://|fetch\\(|XMLHttpRequest|console\\.log|<link[^>]+href=|<script[^>]+src=.+//" index.html styles.css game.js strings.json`

Expected: nenhum resultado em arquivos de runtime; o único `src` permitido é `./game.js`.

- [ ] **Step 6: Commitar o shell**

```bash
git add index.html styles.css strings.json game.js
git commit -m "feat: add responsive local game shell"
```

### Task 4: Implementar renderer WebGL, gameplay e game feel

**Files:**
- Modify: `game.js`
- Modify: `styles.css`
- Modify: `index.html`

**Interfaces:**
- `createRenderer(canvas)` retorna `{ resize(), render(snapshot), destroy() }` e seleciona WebGL2 → WebGL1 → Canvas 2D.
- `createGameWorld()` retorna `{ reset(), update(dt, input), snapshot(), isCollision() }`.
- `createAudio()` retorna `{ unlock(), laneChange(), collision(), setMuted() }` e nunca lança para o loop.

- [ ] **Step 1: Escrever testes puros de movimento, colisão e progressão**

```js
test('trocar faixa altera somente o destino do jogador', () => {
  const world = createGameWorld({ random: () => 0.5 });
  world.reset();
  world.update(0.016, { switchLane: true });
  assert.equal(world.snapshot().player.targetLane, 1);
});

test('colisão encerra a rodada quando os retângulos se sobrepõem', () => {
  const world = createGameWorld({ random: () => 0.5 });
  world.reset({ obstacleX: 0.16, obstacleLane: 0 });
  assert.equal(world.isCollision(), true);
});
```

- [ ] **Step 2: Rodar os testes para confirmar RED**

Run: `npm test`

Expected: FAIL apenas porque `createGameWorld` ainda não existe.

- [ ] **Step 3: Implementar mundo determinístico e pool de obstáculos**

Manter um array fixo de obstáculos reutilizáveis, evitar alocações dentro de `requestAnimationFrame`, limitar partículas a um pool pequeno, usar duas lanes lógicas e aumentar `speed`/`spawnInterval` gradualmente com o tempo. Nunca gerar obstáculo sem uma faixa segura.

- [ ] **Step 4: Implementar renderer geométrico local**

Criar shaders mínimos com strings locais, buffers reutilizáveis e desenho de retângulos/linhas/partículas por cor. Calcular a viewport interna a partir de 640x360, 836x470 ou 1031x580; limitar `devicePixelRatio` a 2; redimensionar em `resize` sem distorcer a câmera.

- [ ] **Step 5: Implementar áudio sintético tolerante**

Criar `AudioContext` apenas após input, silenciar/retomar em pausa e capturar qualquer falha de contexto sem interromper o jogo.

- [ ] **Step 6: Integrar loop e HUD**

Usar um único `requestAnimationFrame`, calcular `dt` com teto de 50ms, atualizar o mundo apenas em `Playing`, renderizar todos os estados e atualizar score/best no HUD. Ao morrer, chamar a transição `die()` antes de exibir Game Over; no restart, aguardar `runCommercialBreak()` antes de `Ready`.

- [ ] **Step 7: Rodar testes e validar interação local**

Run: `npm test`

Expected: PASS em todos os testes, sem warnings. Abrir `index.html` por servidor local somente para teste de módulo, confirmar Ready após loading, primeiro input iniciando gameplay, colisão, pausa, menu e commercialBreak mock.

- [ ] **Step 8: Commitar o gameplay**

```bash
git add game.js styles.css index.html tests
git commit -m "feat: implement Neon Dodge gameplay and renderer"
```

### Task 5: Implementar bootstrap Poki, loading e eventos de ciclo de vida

**Files:**
- Modify: `game.js`
- Modify: `index.html`
- Modify: `styles.css`
- Modify: `tests/loading.test.mjs`

**Interfaces:**
- `window.PokiSDK` recebe o Mock local completo.
- `bootstrap()` executa `init` seguro, prepara renderer/áudio/textos, chama `gameLoadingFinished()` uma vez e só então habilita `Ready`.

- [ ] **Step 1: Adicionar teste de ordem de bootstrap e visibilidade Ready**

```js
test('bootstrap não publica Ready antes de gameLoadingFinished', async () => {
  const sdk = createPokiMock();
  const readyStates = [];
  await bootstrap({ sdk, loadStrings: async () => ({}), compileShaders: async () => {}, onReady: () => readyStates.push(true) });
  assert.deepEqual(sdk.events, ['init', 'gameLoadingFinished']);
  assert.deepEqual(readyStates, [true]);
});
```

- [ ] **Step 2: Rodar o teste para confirmar RED**

Run: `npm test tests/loading.test.mjs`

Expected: FAIL porque `bootstrap` ainda não está exportado.

- [ ] **Step 3: Implementar bootstrap idempotente e exposição global**

Criar `window.PokiSDK = createPokiMock()` somente quando `window` existir; aguardar `Promise.all` para strings, renderer/shaders e init tratado; chamar `onReady` depois de `gameLoadingFinished`; em caso de falha de strings, usar o dicionário inglês local embutido.

- [ ] **Step 4: Ligar `visibilitychange`, `blur`, `resize` e teclas globais**

Em `Playing`, `visibilitychange`/`blur` devem chamar pausa uma vez. `resize` chama `renderer.resize()`. `Escape`/`P` não devem iniciar gameplay a partir de `Booting` ou `Ready` sem o input direcional previsto.

- [ ] **Step 5: Rodar testes e verificação manual do loading**

Run: `npm test`

Expected: PASS e painel Ready inexistente/oculto até o evento de carregamento terminar.

- [ ] **Step 6: Commitar o ciclo de vida**

```bash
git add game.js index.html styles.css tests
git commit -m "feat: gate ready state behind Poki loading lifecycle"
```

### Task 6: Criar auditoria de build e executar validação final

**Files:**
- Create: `tools/validate-build.mjs`
- Modify: `package.json`

**Interfaces:**
- `npm run check:build` falha com código diferente de zero em URL externa, API de rede, `console.log`, arquivo acima de 8 MB ou asset não local.
- A auditoria considera somente os arquivos de runtime `index.html`, `styles.css`, `game.js` e `strings.json`; testes e ferramentas ficam fora do diretório de entrega.

- [ ] **Step 1: Escrever teste/checagem de auditoria que falhe com um fixture proibido**

```js
test('auditoria rejeita URL externa no runtime', () => {
  assert.equal(scanRuntimeFiles(['<script src="https://cdn.example/game.js"></script>']).ok, false);
});
```

- [ ] **Step 2: Implementar `scanRuntimeFiles` e medição de bytes**

Verificar `https?://`, `fetch(`, `XMLHttpRequest`, `WebSocket`, `console.log`, `<link` com `href`, imports não relativos e qualquer arquivo runtime maior que 8 * 1024 * 1024 bytes. Permitir apenas `./game.js` como script e `./strings.json` como recurso local.

- [ ] **Step 3: Rodar auditoria estática e testes**

Run: `npm test`

Run: `npm run check:build`

Expected: ambos PASS com saída resumida, sem logs de debug e sem requests.

- [ ] **Step 4: Fazer verificação de tamanho e árvore final**

Run: `Get-ChildItem index.html,styles.css,game.js,strings.json | Measure-Object -Property Length -Sum`

Expected: soma muito abaixo de 8 MB; nenhum asset binário ou fonte externa.

- [ ] **Step 5: Executar teste visual responsivo**

Abrir por servidor HTTP local em viewport desktop, 640x360, 836x470, 1031x580, portrait e landscape. Confirmar letterboxing sem distorção, controles touch forçados, botões com foco, aviso de storage e ausência de travamento em modo anônimo simulado por storage que lança.

- [ ] **Step 6: Revisar status Git e commitar somente arquivos do MVP**

```bash
git status --short
git add index.html styles.css game.js strings.json package.json tests tools
git commit -m "chore: validate Poki-ready clean build"
```

Não adicionar `CrazyGames/`, `Poki/` ou temporários de inspeção ao commit; preservar qualquer conteúdo preexistente não relacionado.

## Self-review do plano

- Cobertura: loading lifecycle, `gameLoadingFinished`, locks start/stop, commercial break, FSM, input mobile/desktop, 16:9, WebGL fallback, áudio, persistência com aviso, i18n local, ausência de rede, limite de bundle, auditoria e validação visual estão cobertos nas Tasks 1–6.
- Escopo: não há backend, multiplayer, AUDS, Netlib, Chat API ou CLI Poki porque o jogo é single-player e a política de rede zero é obrigatória para este MVP.
- Consistência: os nomes `createPokiMock`, `createPokiController`, `createStorageAdapter`, `createGameStateMachine`, `createRenderer`, `createGameWorld`, `createAudio` e `bootstrap` são usados de forma consistente nos testes e nas tarefas.
- Placeholders: nenhum `TODO`, `TBD`, `FIXME` ou instrução vaga permanece no plano.
