# Neon Dodge Evolução Neon Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a local, cosmetic progression loop to Neon Dodge so every completed run reveals a reward and a concrete next milestone without changing the skill-based gameplay.

**Architecture:** Keep progression as a pure domain model plus a fault-tolerant storage adapter inside `game.js`, because the project currently centralizes its browser runtime in that module. Pass the resulting visual loadout into the existing WebGL/Canvas renderers and update the existing Ready, Menu, and Game Over panels with lightweight localized UI; the Poki controller and commercial-break state machine remain unchanged.

**Tech Stack:** Native ES modules, HTML5, CSS, WebGL/Canvas fallback, Node.js built-in test runner, localStorage guarded by `try/catch`.

## Global Constraints

- Preserve the `base-offline` build: no CDN, external script, external font, analytics request, or network dependency.
- Keep every read/write of browser storage inside `try/catch`; a storage failure must leave the game playable.
- Keep `gameplayStart()` tied only to physical input and preserve the consecutive start/stop locks.
- Keep `commercialBreak()` only on explicit Game Over restart intent; never auto-start gameplay after the break.
- Rewards remain cosmetic: no changes to speed, collision, spawn, lane switching, or player tolerance.
- Preserve the 16:9 responsive canvas and local fallback renderer.
- Add no account, chat, online leaderboard, purchase, premium currency, or external service.
- Maintain the current compact bundle and run `npm test` plus `npm run check:build` before delivery.

---

### Task 1: Build the progression domain and persistence contract

**Files:**
- Modify: `game.js` near `createStorageAdapter` and the exported domain functions.
- Modify: `tests/storage.test.mjs`.
- Create: `tests/progression.test.mjs`.

**Interfaces:**
- Produces `NEON_MILESTONES`, `createInitialProgression()`, `resolveProgression(state, elapsed)`, `getNextMilestone(state)`, and `createProgressionStore(storage, notify)`.
- `resolveProgression(state, elapsed)` returns `{ progression, newlyUnlocked, nextMilestone }` without mutating its input.
- `createProgressionStore(storage, notify)` returns `readProgression()`, `completeRun(elapsed)`, `equipReward(rewardId)`, and `getProgression()`.

- [ ] **Step 1: Add failing pure-model tests**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { createInitialProgression, resolveProgression, getNextMilestone, NEON_MILESTONES } from '../game.js';

test('progressão começa com loadout inicial e primeiro marco em 15 segundos', () => {
  const state = createInitialProgression();
  assert.deepEqual(state.unlocked, ['form-default', 'skin-cyan', 'theme-city']);
  assert.equal(getNextMilestone(state).threshold, 15);
});

test('uma rodada de 46 segundos libera os marcos novos em ordem', () => {
  const result = resolveProgression(createInitialProgression(), 46);
  assert.deepEqual(result.newlyUnlocked.map(reward => reward.id), ['form-evolved', 'skin-magenta', 'skin-amber']);
  assert.equal(result.progression.highestMilestone, 45);
  assert.equal(result.nextMilestone.threshold, 60);
});

test('marcos já liberados não são entregues novamente', () => {
  const first = resolveProgression(createInitialProgression(), 46);
  const second = resolveProgression(first.progression, 46);
  assert.deepEqual(second.newlyUnlocked, []);
  assert.equal(second.progression.unlocked.length, first.progression.unlocked.length);
});

test('marcos da especificação formam uma escada crescente', () => {
  assert.deepEqual(NEON_MILESTONES.map(item => item.threshold), [15, 30, 45, 60, 90, 120, 150]);
});
```

- [ ] **Step 2: Run the new tests and confirm the expected failure**

Run: `node --test tests/progression.test.mjs`

Expected: FAIL because the progression exports do not exist yet.

- [ ] **Step 3: Implement the pure progression model**

Add the following immutable definitions and functions to `game.js`:

```js
const PROGRESSION_KEY = 'neon-dodge-progression-v1';

export const NEON_MILESTONES = Object.freeze([
  { threshold: 15, id: 'form-evolved', type: 'form', label: 'Pulse Form' },
  { threshold: 30, id: 'skin-magenta', type: 'skin', label: 'Magenta Skin' },
  { threshold: 45, id: 'skin-amber', type: 'skin', label: 'Amber Skin' },
  { threshold: 60, id: 'equipment-visor', type: 'equipment', label: 'Neon Visor' },
  { threshold: 90, id: 'theme-crystal', type: 'theme', label: 'Crystal Tunnel' },
  { threshold: 120, id: 'form-advanced', type: 'form', label: 'Plasma Form' },
  { threshold: 150, id: 'theme-cosmic', type: 'theme', label: 'Cosmic Lab' }
]);

export function createInitialProgression() {
  return {
    version: 1,
    highestMilestone: 0,
    unlocked: ['form-default', 'skin-cyan', 'theme-city'],
    equipped: { form: 'form-default', skin: 'skin-cyan', equipment: null, theme: 'theme-city' }
  };
}

function normalizeProgression(value) {
  const initial = createInitialProgression();
  if (!value || value.version !== 1 || !Array.isArray(value.unlocked)) return initial;
  const unlocked = [...new Set([...initial.unlocked, ...value.unlocked])];
  const equipped = { ...initial.equipped, ...(value.equipped || {}) };
  for (const [type, fallback] of Object.entries(initial.equipped)) {
    if (equipped[type] !== null && !unlocked.includes(equipped[type])) equipped[type] = fallback;
  }
  return { version: 1, highestMilestone: Math.max(0, Number(value.highestMilestone) || 0), unlocked, equipped };
}

export function getNextMilestone(state) {
  const normalized = normalizeProgression(state);
  return NEON_MILESTONES.find(item => !normalized.unlocked.includes(item.id)) || null;
}

export function resolveProgression(state, elapsed) {
  const previous = normalizeProgression(state);
  const safeElapsed = Math.max(0, Number(elapsed) || 0);
  const newlyUnlocked = NEON_MILESTONES.filter(item => safeElapsed >= item.threshold && !previous.unlocked.includes(item.id));
  const unlocked = [...previous.unlocked, ...newlyUnlocked.map(item => item.id)];
  const equipped = { ...previous.equipped };
  for (const reward of newlyUnlocked) equipped[reward.type] = reward.id;
  const progression = { ...previous, unlocked, equipped, highestMilestone: Math.max(previous.highestMilestone, ...newlyUnlocked.map(item => item.threshold), 0) };
  return { progression, newlyUnlocked, nextMilestone: getNextMilestone(progression) };
}
```

- [ ] **Step 4: Implement the fault-tolerant progression store**

Add `createProgressionStore(storage, notify)` using only `getItem` and `setItem` inside `try/catch`. `readProgression()` must return a normalized state and use the in-memory state when storage is unavailable. `completeRun(elapsed)` must call `resolveProgression`, save the new state, and return its result. `equipReward(rewardId)` must only equip an unlocked milestone reward and return the unchanged state for invalid IDs.

- [ ] **Step 5: Add storage failure and equip tests**

```js
import { createInitialProgression, createProgressionStore } from '../game.js';

test('progressão continua em memória quando localStorage é bloqueado', () => {
  const messages = [];
  const blocked = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('blocked'); } };
  const store = createProgressionStore(blocked, message => messages.push(message));
  const result = store.completeRun(16);
  assert.equal(result.progression.unlocked.includes('form-evolved'), true);
  assert.equal(store.getProgression().unlocked.includes('form-evolved'), true);
  assert.equal(messages.includes('sessionNotPersisted'), true);
});

test('equipar conteúdo bloqueado não altera o loadout', () => {
  const store = createProgressionStore(null);
  assert.deepEqual(store.equipReward('equipment-visor').equipped, createInitialProgression().equipped);
});
```

- [ ] **Step 6: Run the domain and storage tests**

Run: `node --test tests/progression.test.mjs tests/storage.test.mjs`

Expected: PASS with all progression and storage tests passing.

### Task 2: Add localized progression UI and collection controls

**Files:**
- Modify: `index.html` progression markup, buttons, and embedded strings.
- Modify: `strings.json` with the same keys as embedded strings.
- Modify: `styles.css` for reward cards, loadout rows, and compact collection controls.
- Modify: `tests/core-loop-polish.test.mjs`.

**Interfaces:**
- DOM IDs: `#ready-progression`, `#game-over-reward`, `#game-over-next`, `#loadout-list`, `#customize-button`, `#collection-title`.
- Actions: `data-action="customize"`, `data-action="equip"`, and `data-reward-id`.

- [ ] **Step 1: Add failing markup tests**

```js
test('onboarding mostra o próximo marco e a tela de recompensa', () => {
  const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(html, /id="ready-progression"/);
  assert.match(html, /id="game-over-reward"/);
  assert.match(html, /id="game-over-next"/);
  assert.match(html, /data-action="customize"/);
});
```

- [ ] **Step 2: Add the minimal localized markup**

Add to Ready:

```html
<p id="ready-progression" class="progression-copy" aria-live="polite"></p>
<button id="customize-button" class="secondary-button" type="button" data-action="customize" data-i18n="customize">Customize</button>
```

Add to Game Over:

```html
<p id="game-over-reward" class="reward-copy" aria-live="polite"></p>
<p id="game-over-next" class="progression-copy" aria-live="polite"></p>
```

Add to Menu:

```html
<h3 id="collection-title" data-i18n="collection">Neon collection</h3>
<div id="loadout-list" class="loadout-list" aria-live="polite"></div>
```

Add localized keys `customize`, `collection`, `nextMilestone`, `unlocked`, `noNewReward`, `equipped`, `equip`, `form`, `skin`, `equipment`, `theme`, `seconds`, and `defaultReward` to the English and Portuguese dictionaries; use English fallback for incomplete secondary locales.

- [ ] **Step 3: Add compact responsive styles**

Style `.secondary-button`, `.progression-copy`, `.reward-copy`, `.loadout-list`, `.loadout-item`, and `.loadout-item[data-equipped="true"]`. Keep the collection inside the existing panel, preserve readable contrast, and keep touch targets at least 44px high.

- [ ] **Step 4: Run markup and build validation**

Run: `node --test tests/core-loop-polish.test.mjs`

Expected: PASS with the existing onboarding tests plus the new progression markup test.

### Task 3: Connect persistence, rewards, loadout, and visual themes to runtime

**Files:**
- Modify: `game.js` bootstrap UI wiring, renderer signatures, and collision completion path.
- Modify: `tests/poki-state.test.mjs` for lifecycle regression coverage.
- Modify: `tests/core-loop-polish.test.mjs` for theme and milestone constants.

**Interfaces:**
- `getVisualStyle(progression)` returns `{ background, lane, player, obstacle, accent, formScale }` for the current equipped loadout.
- Renderer methods accept `render(snapshot, progression)` while remaining backward-compatible when progression is omitted.
- `syncProgressionUi(result)` updates Ready, Game Over, and Menu without starting gameplay.

- [ ] **Step 1: Add failing visual-domain and lifecycle tests**

```js
import { createInitialProgression, getVisualStyle } from '../game.js';

test('loadout inicial usa a identidade Cidade Neon', () => {
  const style = getVisualStyle(createInitialProgression());
  assert.equal(style.background, '#080b22');
  assert.equal(style.player, '#fbe047');
});

test('desbloqueio visual não altera o contrato de start e stop', async () => {
  const sdk = createPokiMock();
  const controller = createPokiController(sdk);
  const machine = createGameStateMachine(controller);
  await machine.finishLoading();
  await machine.inputStart();
  await machine.die();
  await machine.restartAfterGameOver();
  assert.deepEqual(sdk.events, ['gameplayStart', 'gameplayStop', 'commercialBreak']);
});
```

- [ ] **Step 2: Implement the visual style mapper and renderer input**

Use these local palettes:

```js
export function getVisualStyle(progression) {
  const theme = progression?.equipped?.theme || 'theme-city';
  const skin = progression?.equipped?.skin || 'skin-cyan';
  const form = progression?.equipped?.form || 'form-default';
  const themes = {
    'theme-city': { background: '#080b22', lane: '#20c7f5', accent: '#24306b' },
    'theme-crystal': { background: '#101936', lane: '#75e7ff', accent: '#344c86' },
    'theme-cosmic': { background: '#170d2f', lane: '#d68cff', accent: '#5b2f79' }
  };
  const skins = { 'skin-cyan': '#fbe047', 'skin-magenta': '#ff6bd6', 'skin-amber': '#ffb347' };
  return { ...themes[theme] || themes['theme-city'], player: skins[skin] || skins['skin-cyan'], obstacle: '#fa416b', formScale: form === 'form-advanced' ? 1.08 : form === 'form-evolved' ? 1.04 : 1 };
}
```

Update both renderers to use the style values. Draw the equipment as a small accent rectangle behind the player only when `equipped.equipment === 'equipment-visor'`; do not change the world hitbox.

- [ ] **Step 3: Wire the progression store into bootstrap**

Instantiate `const progression = createProgressionStore(getStorage(windowRef), notifyStorage);`, read it before the first Ready sync, and use a `let latestProgression = progression.getProgression()` variable. On collision, call `const result = progression.completeRun(snapshot.elapsed)` exactly once before `machine.die()`, save best score as before, and sync the reward UI. On explicit `equip` action, call `progression.equipReward(id)`, update `latestProgression`, and refresh the collection. On `restart`, preserve the existing order: `restartAfterGameOver()`, then `world.reset()`, then Ready UI; no automatic `inputStart()`.

- [ ] **Step 4: Implement the UI formatter and collection list**

Use the active locale dictionary with English fallback. Render `nextMilestone.threshold` and the reward label, show `noNewReward` when no new reward was produced, and generate one button per unlocked reward with `data-reward-id`. Mark the active item with `data-equipped="true"`. Only expose `equip` buttons for rewards not already equipped.

- [ ] **Step 5: Add the customize transition safely**

Allow `createGameStateMachine.openMenu()` from `READY` as well as `PLAYING`; call `controller.stopGameplay()` only when the current state is `PLAYING`. A physical Resume input from `MENU` may start gameplay as it does today. The customize button must never call `startGameplay()` directly.

- [ ] **Step 6: Run the complete unit suite**

Run: `npm test`

Expected: PASS with all existing tests and all new progression/lifecycle tests passing.

### Task 4: Verify bundle, document evidence, and publish the implementation

**Files:**
- Modify: `README.md` with the progression contract and local-only persistence note.
- Modify: `D:\LEONARDO\Games\cofre-games\03 - Projetos\Neon Dodge\02 - Decisões\Evolução Neon - Especificação.md` only if implementation evidence requires a status update.
- Modify: `D:\LEONARDO\Games\cofre-games\03 - Projetos\Neon Dodge\04 - Validação\Validação.md` with test/build evidence.
- Modify: `D:\LEONARDO\Games\cofre-games\03 - Projetos\Neon Dodge\05 - Entrega\Matriz de plataformas.md` with the updated retention status.

- [ ] **Step 1: Run the build validator**

Run: `npm run check:build`

Expected: exit 0 and a runtime report below the project budget with no external requests.

- [ ] **Step 2: Run a clean repository check**

Run: `git diff --check` and `git status --short`

Expected: no whitespace errors; only intentional feature files are changed.

- [ ] **Step 3: Update project documentation with evidence**

Record the exact test command, test count, build byte report, persistence fallback result, and lifecycle result in the vault validation note. Change the matrix from “progression/meta loop missing” to “implemented locally; human playtest and retention metrics pending”. Do not claim platform submission readiness from local tests.

- [ ] **Step 4: Commit and push the finished implementation**

```bash
git add game.js index.html styles.css strings.json tests docs README.md
git commit -m "feat: add Neon Evolution progression loop"
git push origin main
```

Expected: `main` matches `origin/main`, with no unrelated files staged.

## Execution record

- [x] Progression domain and storage adapter implemented.
- [x] Reward, collection, and loadout UI implemented.
- [x] Visual themes integrated into WebGL and Canvas fallback.
- [x] Poki lifecycle and commercial-break contract preserved.
- [x] `npm test` verified with 27 passing tests.
- [x] `npm run check:build` verified with 51.386 bytes across four runtime files.
- [x] Local browser smoke test verified Ready, collection, loadout, portrait and landscape layouts with no console warnings/errors.
