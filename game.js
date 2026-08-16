const LOGICAL_SIZES = Object.freeze([
  { width: 640, height: 360 },
  { width: 836, height: 470 },
  { width: 1031, height: 580 }
]);

const LOCAL_STRINGS = Object.freeze({
  en: { title: 'Neon Dodge', start: 'Tap to start', controlHint: 'Each tap switches lanes', paused: 'PAUSED', takeABreath: 'Take a breath.', menu: 'MENU', readyWhen: 'Ready when you are.', runComplete: 'RUN COMPLETE', oneMore: 'One more?', pause: 'Pause', resume: 'Resume', restart: 'Restart', score: 'Score', best: 'Best', storageNotice: 'This session score will not be saved.', customize: 'Customize', collection: 'Neon collection', nextMilestone: 'Next: {label} at {seconds}s', unlocked: 'Unlocked: {label}', noNewReward: 'Keep going to unlock the next form.', equipped: 'Equipped', equip: 'Equip', form: 'Form', skin: 'Skin', equipment: 'Equipment', theme: 'Theme', defaultReward: 'Your current loadout is ready.' },
  'pt-BR': { title: 'Neon Dodge', start: 'Toque para começar', controlHint: 'Cada toque alterna a faixa', paused: 'PAUSADO', takeABreath: 'Respire um pouco.', menu: 'MENU', readyWhen: 'Quando quiser, estamos prontos.', runComplete: 'FIM DA RODADA', oneMore: 'Mais uma?', pause: 'Pausar', resume: 'Continuar', restart: 'Reiniciar', score: 'Pontos', best: 'Recorde', storageNotice: 'A pontuação desta sessão não será salva.', customize: 'Personalizar', collection: 'Coleção neon', nextMilestone: 'Próximo: {label} em {seconds}s', unlocked: 'Desbloqueado: {label}', noNewReward: 'Continue para liberar a próxima forma.', equipped: 'Equipado', equip: 'Usar', form: 'Forma', skin: 'Skin', equipment: 'Equipamento', theme: 'Tema', defaultReward: 'Seu visual atual está pronto.' },
  es: { title: 'Neon Dodge', start: 'Toca para empezar', controlHint: 'Cada toque cambia de carril', pause: 'Pausa', resume: 'Continuar', restart: 'Reiniciar', score: 'Puntuación', best: 'Mejor', storageNotice: 'La puntuación de esta sesión no se guardará.' },
  fr: { title: 'Neon Dodge', start: 'Touchez pour commencer', controlHint: 'Chaque touche change de voie', pause: 'Pause', resume: 'Reprendre', restart: 'Recommencer', score: 'Score', best: 'Record', storageNotice: 'Le score de cette session ne sera pas sauvegardé.' },
  it: { title: 'Neon Dodge', start: 'Tocca per iniziare', controlHint: 'Ogni tocco cambia corsia', pause: 'Pausa', resume: 'Riprendi', restart: 'Ricomincia', score: 'Punteggio', best: 'Record', storageNotice: 'Il punteggio di questa sessione non verrà salvato.' },
  de: { title: 'Neon Dodge', start: 'Tippen zum Starten', controlHint: 'Jeder Tipp wechselt die Spur', pause: 'Pause', resume: 'Fortsetzen', restart: 'Neustart', score: 'Punkte', best: 'Bestwert', storageNotice: 'Der Punktestand dieser Sitzung wird nicht gespeichert.' },
  tr: { title: 'Neon Dodge', start: 'Başlamak için dokun', controlHint: 'Her dokunuş şeridi değiştirir', pause: 'Duraklat', resume: 'Devam et', restart: 'Yeniden başlat', score: 'Skor', best: 'En iyi', storageNotice: 'Bu oturumun skoru kaydedilmeyecek.' }
});

export const GAME_STATES = Object.freeze({
  BOOTING: 'Booting',
  READY: 'Ready',
  PLAYING: 'Playing',
  PAUSED: 'Paused',
  MENU: 'Menu',
  GAME_OVER: 'Game Over'
});

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
  const knownRewards = new Set([
    ...initial.unlocked,
    ...NEON_MILESTONES.map(item => item.id)
  ]);
  if (!value || value.version !== 1 || !Array.isArray(value.unlocked)) return initial;
  const unlocked = [...new Set([...initial.unlocked, ...value.unlocked.filter(id => knownRewards.has(id))])];
  const equipped = { ...initial.equipped, ...(value.equipped || {}) };
  for (const [type, fallback] of Object.entries(initial.equipped)) {
    if (equipped[type] !== null && !unlocked.includes(equipped[type])) equipped[type] = fallback;
  }
  return {
    version: 1,
    highestMilestone: Math.max(0, Number(value.highestMilestone) || 0),
    unlocked,
    equipped
  };
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
  const progression = {
    ...previous,
    unlocked,
    equipped,
    highestMilestone: Math.max(previous.highestMilestone, ...newlyUnlocked.map(item => item.threshold), 0)
  };
  return { progression, newlyUnlocked, nextMilestone: getNextMilestone(progression) };
}

const sleep = milliseconds => milliseconds > 0
  ? new Promise(resolve => setTimeout(resolve, milliseconds))
  : Promise.resolve();

export function createPokiMock({ commercialBreakDuration = 0 } = {}) {
  const events = [];
  return {
    events,
    async init() { events.push('init'); },
    async gameLoadingFinished() { events.push('gameLoadingFinished'); },
    async gameplayStart() { events.push('gameplayStart'); },
    async gameplayStop() { events.push('gameplayStop'); },
    async commercialBreak() {
      events.push('commercialBreak');
      await sleep(commercialBreakDuration);
    }
  };
}

export function createPokiController(sdk) {
  let gameplayActive = false;
  let gameplayStopped = true;
  let loadingFinished = false;
  let commercialBreakBusy = false;
  let initialized = false;

  return {
    async finishLoading(resourcesPromise = Promise.resolve(), shaderPromise = Promise.resolve()) {
      if (!initialized) {
        initialized = true;
        await Promise.resolve().then(() => sdk.init()).catch(() => undefined);
      }
      await Promise.all([
        Promise.resolve(resourcesPromise).catch(() => undefined),
        Promise.resolve(shaderPromise).catch(() => undefined)
      ]);
      if (!loadingFinished) {
        loadingFinished = true;
        await Promise.resolve().then(() => sdk.gameLoadingFinished()).catch(() => undefined);
      }
    },
    async startGameplay() {
      if (gameplayActive) return false;
      gameplayActive = true;
      gameplayStopped = false;
      await Promise.resolve().then(() => sdk.gameplayStart()).catch(() => undefined);
      return true;
    },
    async stopGameplay() {
      if (!gameplayActive || gameplayStopped) return false;
      gameplayActive = false;
      gameplayStopped = true;
      await Promise.resolve().then(() => sdk.gameplayStop()).catch(() => undefined);
      return true;
    },
    async runCommercialBreak() {
      if (commercialBreakBusy) return false;
      commercialBreakBusy = true;
      try {
        await Promise.resolve().then(() => sdk.commercialBreak()).catch(() => undefined);
      } finally {
        commercialBreakBusy = false;
      }
      return true;
    },
    isGameplayActive: () => gameplayActive,
    isLoadingFinished: () => loadingFinished
  };
}

export function createStorageAdapter(storage, notify = () => {}) {
  const key = 'neon-dodge-best-score';
  const reportFailure = () => {
    notify('sessionNotPersisted');
    return false;
  };
  return {
    readBestScore() {
      try {
        if (!storage) {
          notify('sessionNotPersisted');
          return 0;
        }
        return Math.max(0, Number.parseInt(storage?.getItem(key) ?? '0', 10) || 0);
      } catch {
        notify('sessionNotPersisted');
        return 0;
      }
    },
    writeBestScore(score) {
      try {
        if (!storage) return reportFailure();
        storage.setItem(key, String(Math.max(0, Math.floor(score))));
        return true;
      } catch {
        return reportFailure();
      }
    }
  };
}

export function createProgressionStore(storage, notify = () => {}) {
  let progression = createInitialProgression();
  let loaded = false;
  const reportFailure = () => {
    notify('sessionNotPersisted');
    return false;
  };
  const save = () => {
    try {
      if (!storage) return reportFailure();
      storage.setItem(PROGRESSION_KEY, JSON.stringify(progression));
      return true;
    } catch {
      return reportFailure();
    }
  };
  const readProgression = () => {
    if (loaded) return progression;
    loaded = true;
    try {
      if (!storage) return reportFailure(), progression;
      const raw = storage.getItem(PROGRESSION_KEY);
      progression = normalizeProgression(raw ? JSON.parse(raw) : progression);
    } catch {
      reportFailure();
      progression = createInitialProgression();
    }
    return progression;
  };
  return {
    readProgression,
    getProgression: () => readProgression(),
    completeRun(elapsed) {
      readProgression();
      const result = resolveProgression(progression, elapsed);
      progression = result.progression;
      save();
      return result;
    },
    equipReward(rewardId) {
      readProgression();
      const reward = NEON_MILESTONES.find(item => item.id === rewardId);
      if (!reward || !progression.unlocked.includes(reward.id)) return progression;
      progression = {
        ...progression,
        equipped: { ...progression.equipped, [reward.type]: reward.id }
      };
      save();
      return progression;
    }
  };
}

export function createGameStateMachine(controller) {
  let state = GAME_STATES.BOOTING;
  return {
    getState: () => state,
    async finishLoading() {
      if (state === GAME_STATES.BOOTING) state = GAME_STATES.READY;
    },
    async inputStart() {
      if ([GAME_STATES.READY, GAME_STATES.PAUSED, GAME_STATES.MENU].includes(state)) {
        await controller.startGameplay();
        state = GAME_STATES.PLAYING;
      }
    },
    async pause() {
      if (state === GAME_STATES.PLAYING) {
        await controller.stopGameplay();
        state = GAME_STATES.PAUSED;
      }
    },
    async openMenu() {
      if (state === GAME_STATES.PLAYING) {
        await controller.stopGameplay();
        state = GAME_STATES.MENU;
      } else if (state === GAME_STATES.READY) {
        state = GAME_STATES.MENU;
      }
    },
    async die() {
      if (state === GAME_STATES.PLAYING) {
        await controller.stopGameplay();
        state = GAME_STATES.GAME_OVER;
      }
    },
    async restartAfterGameOver() {
      if (state === GAME_STATES.GAME_OVER) {
        await controller.runCommercialBreak();
        state = GAME_STATES.READY;
      }
    }
  };
}

function laneY(lane) {
  return lane === 0 ? 0.36 : 0.64;
}

function overlaps(a, b) {
  return Math.abs(a.x - b.x) < (a.width + b.width) / 2
    && Math.abs(a.y - b.y) < (a.height + b.height) / 2;
}

export function getDifficultyProfile(elapsed) {
  const time = Math.max(0, elapsed);
  const lerp = (start, end, amount) => start + (end - start) * Math.max(0, Math.min(1, amount));
  if (time < 15) return { speed: lerp(0.26, 0.30, time / 15), spawnInterval: lerp(1.30, 1.18, time / 15) };
  if (time < 45) return { speed: lerp(0.30, 0.39, (time - 15) / 30), spawnInterval: lerp(1.18, 0.90, (time - 15) / 30) };
  if (time < 90) return { speed: lerp(0.39, 0.48, (time - 45) / 45), spawnInterval: lerp(0.90, 0.74, (time - 45) / 45) };
  return { speed: 0.52, spawnInterval: 0.72 };
}

export function createGameWorld({ random = Math.random } = {}) {
  const player = { x: 0.16, y: laneY(0), width: 0.07, height: 0.12, lane: 0, targetLane: 0 };
  const obstacles = [];
  let elapsed = 0;
  let score = 0;
  let speed = 0.26;
  let spawnInterval = 1.3;
  let spawnTimer = 0.9;
  let lastSpawnLane = null;
  let sameLaneStreak = 0;
  let obstacleSerial = 0;
  let running = false;

  const chooseSpawnLane = () => {
    if (elapsed < 15) {
      return lastSpawnLane === null ? 0 : lastSpawnLane === 0 ? 1 : 0;
    }
    let lane = random() > 0.5 ? 1 : 0;
    if (lane === lastSpawnLane && sameLaneStreak >= 1) lane = lane === 0 ? 1 : 0;
    return lane;
  };

  const spawnObstacle = ({ x = 1.12, lane } = {}) => {
    const nextLane = Number.isInteger(lane) ? lane : chooseSpawnLane();
    sameLaneStreak = nextLane === lastSpawnLane ? sameLaneStreak + 1 : 0;
    lastSpawnLane = nextLane;
    obstacles.push({ x, y: laneY(nextLane), width: 0.08, height: 0.16, lane: nextLane, kind: obstacleSerial % 3 });
    obstacleSerial += 1;
  };

  return {
    reset({ obstacleX, obstacleLane } = {}) {
      obstacles.length = 0;
      player.lane = 0;
      player.targetLane = 0;
      player.y = laneY(0);
      elapsed = 0;
      score = 0;
      speed = 0.26;
      spawnInterval = 1.3;
      spawnTimer = 0.9;
      lastSpawnLane = null;
      sameLaneStreak = 0;
      obstacleSerial = 0;
      running = true;
      if (Number.isFinite(obstacleX)) spawnObstacle({ x: obstacleX, lane: obstacleLane ?? 0 });
    },
    update(dt, input = {}) {
      if (!running) return;
      const safeDt = Math.min(0.05, Math.max(0, Number(dt) || 0));
      if (input.switchLane) player.targetLane = player.targetLane === 0 ? 1 : 0;
      player.y += (laneY(player.targetLane) - player.y) * Math.min(1, safeDt * 14);
      if (Math.abs(player.y - laneY(player.targetLane)) < 0.002) player.lane = player.targetLane;
      elapsed += safeDt;
      score = Math.floor(elapsed * 10);
      ({ speed, spawnInterval } = getDifficultyProfile(elapsed));
      spawnTimer -= safeDt;
      if (spawnTimer <= 0) {
        spawnObstacle();
        spawnTimer += spawnInterval;
      }
      for (const obstacle of obstacles) obstacle.x -= speed * safeDt;
      while (obstacles.length && obstacles[0].x < -0.2) obstacles.shift();
    },
    snapshot() {
      return { elapsed, score, speed, spawnInterval, player: { ...player }, obstacles: obstacles.map(obstacle => ({ ...obstacle })) };
    },
    isCollision() { return obstacles.some(obstacle => overlaps(player, obstacle)); },
    stop() { running = false; },
    isRunning: () => running
  };
}

function selectLogicalSize(width) {
  if (width < 700) return LOGICAL_SIZES[0];
  if (width < 930) return LOGICAL_SIZES[1];
  return LOGICAL_SIZES[2];
}

export function getVisualStyle(progression) {
  const theme = progression?.equipped?.theme || 'theme-city';
  const skin = progression?.equipped?.skin || 'skin-cyan';
  const form = progression?.equipped?.form || 'form-default';
  const themes = {
    'theme-city': { background: '#080b22', lane: '#20c7f5', accent: '#24306b', playerAccent: '#73e6ff', obstacleAccent: '#ffb3c2' },
    'theme-crystal': { background: '#101936', lane: '#75e7ff', accent: '#344c86', playerAccent: '#d4fbff', obstacleAccent: '#f2b5ff' },
    'theme-cosmic': { background: '#170d2f', lane: '#d68cff', accent: '#5b2f79', playerAccent: '#f4d8ff', obstacleAccent: '#ff9dbd' }
  };
  const skins = { 'skin-cyan': '#fbe047', 'skin-magenta': '#ff6bd6', 'skin-amber': '#ffb347' };
  const activeTheme = themes[theme] || themes['theme-city'];
  return {
    ...activeTheme,
    theme: themes[theme] ? theme : 'theme-city',
    player: skins[skin] || skins['skin-cyan'],
    obstacle: '#fa416b',
    form,
    equipment: progression?.equipped?.equipment || null,
    formScale: form === 'form-advanced' ? 1.08 : form === 'form-evolved' ? 1.04 : 1
  };
}

const PLAYER_SHAPES = Object.freeze({
  'form-default': Object.freeze([[-0.5, -0.35], [-0.2, -0.5], [0.3, -0.42], [0.5, -0.12], [0.42, 0.35], [0.05, 0.5], [-0.4, 0.35]]),
  'form-evolved': Object.freeze([[-0.5, 0], [-0.2, -0.48], [0.25, -0.35], [0.5, 0], [0.25, 0.35], [-0.2, 0.48]]),
  'form-advanced': Object.freeze([[-0.5, 0], [-0.25, -0.2], [-0.12, -0.5], [0.12, -0.22], [0.5, 0], [0.12, 0.22], [0.12, 0.5], [-0.12, 0.22]])
});

const OBSTACLE_SHAPES = Object.freeze({
  0: Object.freeze([[-0.5, -0.25], [-0.25, -0.5], [0.25, -0.5], [0.5, -0.25], [0.25, 0.5], [-0.25, 0.5]]),
  1: Object.freeze([[0, -0.5], [0.35, -0.25], [0.5, 0], [0.35, 0.25], [0, 0.5], [-0.35, 0.25], [-0.5, 0], [-0.35, -0.25]]),
  2: Object.freeze([[-0.5, -0.5], [0.5, -0.5], [0.5, -0.25], [-0.18, -0.25], [-0.18, 0.25], [0.5, 0.25], [0.5, 0.5], [-0.5, 0.5]])
});

const SCENE_DECORATIONS = Object.freeze({
  'theme-city': Object.freeze([
    Object.freeze({ kind: 'building', x: 0.05, y: 0.1, width: 0.08, height: 0.18, tone: 'accent' }),
    Object.freeze({ kind: 'building', x: 0.18, y: 0.16, width: 0.06, height: 0.12, tone: 'lane' }),
    Object.freeze({ kind: 'building', x: 0.78, y: 0.1, width: 0.1, height: 0.18, tone: 'accent' }),
    Object.freeze({ kind: 'beacon', x: 0.92, y: 0.19, width: 0.012, height: 0.18, tone: 'playerAccent' })
  ]),
  'theme-crystal': Object.freeze([
    Object.freeze({ kind: 'crystal', x: 0.1, y: 0.16, width: 0.1, height: 0.22, tone: 'lane' }),
    Object.freeze({ kind: 'crystal', x: 0.24, y: 0.1, width: 0.06, height: 0.16, tone: 'accent' }),
    Object.freeze({ kind: 'crystal', x: 0.82, y: 0.14, width: 0.12, height: 0.24, tone: 'playerAccent' }),
    Object.freeze({ kind: 'beacon', x: 0.94, y: 0.2, width: 0.012, height: 0.2, tone: 'lane' })
  ]),
  'theme-cosmic': Object.freeze([
    Object.freeze({ kind: 'star', x: 0.1, y: 0.12, width: 0.06, height: 0.06, tone: 'playerAccent' }),
    Object.freeze({ kind: 'panel', x: 0.2, y: 0.1, width: 0.12, height: 0.08, tone: 'accent' }),
    Object.freeze({ kind: 'orb', x: 0.82, y: 0.14, width: 0.1, height: 0.1, tone: 'lane' }),
    Object.freeze({ kind: 'star', x: 0.94, y: 0.22, width: 0.05, height: 0.05, tone: 'playerAccent' })
  ])
});

export function getPlayerShape(form = 'form-default') {
  return PLAYER_SHAPES[form] || PLAYER_SHAPES['form-default'];
}

export function getObstacleShape(kind = 0) {
  return OBSTACLE_SHAPES[Math.abs(Number(kind)) % 3] || OBSTACLE_SHAPES[0];
}

export function getSceneDecorations(theme = 'theme-city') {
  return SCENE_DECORATIONS[theme] || SCENE_DECORATIONS['theme-city'];
}

function hexToRgba(hex, alpha = 1) {
  const value = hex.replace('#', '');
  const red = Number.parseInt(value.slice(0, 2), 16) / 255;
  const green = Number.parseInt(value.slice(2, 4), 16) / 255;
  const blue = Number.parseInt(value.slice(4, 6), 16) / 255;
  return [red, green, blue, alpha];
}

function rgbaToCss([red, green, blue, alpha]) {
  return `rgba(${Math.round(red * 255)}, ${Math.round(green * 255)}, ${Math.round(blue * 255)}, ${alpha})`;
}

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
}

function toPixels(shape, centerX, centerY, width, height, scaleX, scaleY) {
  return shape.map(([x, y]) => [(centerX + x * width) * scaleX, (centerY + y * height) * scaleY]);
}

function drawSceneArt(style, size, drawRect, drawPolygon) {
  const scaleX = size.width;
  const scaleY = size.height;
  const colorFor = tone => hexToRgba(style[tone] || style.accent, 0.42);
  for (const item of getSceneDecorations(style.theme)) {
    const x = item.x * scaleX;
    const y = item.y * scaleY;
    const width = item.width * scaleX;
    const height = item.height * scaleY;
    if (item.kind === 'building' || item.kind === 'beacon' || item.kind === 'panel') {
      drawRect(x, y, width, height, colorFor(item.tone));
    } else if (item.kind === 'crystal') {
      drawPolygon([[x, y - height / 2], [x + width / 2, y], [x, y + height / 2], [x - width / 2, y]], colorFor(item.tone));
    } else if (item.kind === 'star') {
      drawPolygon([[x, y - height / 2], [x + width * 0.18, y - height * 0.18], [x + width / 2, y], [x + width * 0.18, y + height * 0.18], [x, y + height / 2], [x - width * 0.18, y + height * 0.18], [x - width / 2, y], [x - width * 0.18, y - height * 0.18]], colorFor(item.tone));
    } else if (item.kind === 'orb') {
      drawPolygon([[x, y - height / 2], [x + width * 0.35, y - height * 0.35], [x + width / 2, y], [x + width * 0.35, y + height * 0.35], [x, y + height / 2], [x - width * 0.35, y + height * 0.35], [x - width / 2, y], [x - width * 0.35, y - height * 0.35]], colorFor(item.tone));
    }
  }
}

function drawPlayerArt(style, player, size, drawRect, drawPolygon) {
  const scaleX = size.width;
  const scaleY = size.height;
  const playerWidth = player.width * style.formScale;
  const playerHeight = player.height * style.formScale;
  drawPolygon(toPixels(getPlayerShape(style.form), player.x, player.y, playerWidth, playerHeight, scaleX, scaleY), hexToRgba(style.player));
  drawRect((player.x - playerWidth * 0.25) * scaleX, (player.y - playerHeight * 0.1) * scaleY, playerWidth * 0.5 * scaleX, playerHeight * 0.2 * scaleY, hexToRgba(style.playerAccent, 0.95));
  drawRect((player.x - playerWidth * 0.08) * scaleX, (player.y - playerHeight * 0.04) * scaleY, playerWidth * 0.16 * scaleX, playerHeight * 0.08 * scaleY, hexToRgba(style.background));
  if (style.equipment === 'equipment-visor') {
    drawRect((player.x - playerWidth * 0.7) * scaleX, (player.y - playerHeight * 0.68) * scaleY, playerWidth * 0.18 * scaleX, playerHeight * 1.36 * scaleY, hexToRgba(style.lane, 0.85));
  }
}

function drawObstacleArt(style, obstacle, size, drawRect, drawPolygon) {
  const scaleX = size.width;
  const scaleY = size.height;
  drawPolygon(toPixels(getObstacleShape(obstacle.kind), obstacle.x, obstacle.y, obstacle.width, obstacle.height, scaleX, scaleY), hexToRgba(style.obstacle));
  if (obstacle.kind === 1) {
    drawPolygon(toPixels([[-0.22, 0], [0, -0.22], [0.22, 0], [0, 0.22]], obstacle.x, obstacle.y, obstacle.width, obstacle.height, scaleX, scaleY), hexToRgba(style.obstacleAccent));
  } else {
    drawRect((obstacle.x - obstacle.width * 0.2) * scaleX, (obstacle.y - obstacle.height * 0.08) * scaleY, obstacle.width * 0.4 * scaleX, obstacle.height * 0.16 * scaleY, hexToRgba(style.obstacleAccent));
  }
}

function createWebGLRenderer(canvas, gl) {
  const vertexSource = `attribute vec2 a_position; uniform vec2 u_resolution; void main() { vec2 zeroToOne = a_position / u_resolution; vec2 zeroToTwo = zeroToOne * 2.0; vec2 clipSpace = zeroToTwo - 1.0; gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1); }`;
  const fragmentSource = `precision mediump float; uniform vec4 u_color; void main() { gl_FragColor = u_color; }`;
  const program = gl.createProgram();
  gl.attachShader(program, createShader(gl, gl.VERTEX_SHADER, vertexSource));
  gl.attachShader(program, createShader(gl, gl.FRAGMENT_SHADER, fragmentSource));
  gl.linkProgram(program);
  const positionLocation = gl.getAttribLocation(program, 'a_position');
  const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
  const colorLocation = gl.getUniformLocation(program, 'u_color');
  const buffer = gl.createBuffer();
  const size = { ...LOGICAL_SIZES[2] };

  const drawRect = (x, y, width, height, color) => {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([x, y, x + width, y, x, y + height, x, y + height, x + width, y, x + width, y + height]), gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.uniform4f(colorLocation, color[0], color[1], color[2], color[3]);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  };
  const drawPolygon = (points, color) => {
    const vertices = [];
    for (let index = 1; index < points.length - 1; index += 1) {
      vertices.push(points[0][0], points[0][1], points[index][0], points[index][1], points[index + 1][0], points[index + 1][1]);
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.uniform4f(colorLocation, color[0], color[1], color[2], color[3]);
    gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 2);
  };

  return {
    resize() {
      const cssWidth = Math.max(320, canvas.clientWidth || 640);
      Object.assign(size, selectLogicalSize(cssWidth));
      const dpr = Math.min(2, globalThis.devicePixelRatio || 1);
      canvas.width = Math.round(size.width * dpr);
      canvas.height = Math.round(size.height * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    },
    render(snapshot, progression) {
      const style = getVisualStyle(progression);
      gl.useProgram(program);
      gl.uniform2f(resolutionLocation, size.width, size.height);
      gl.clearColor(...hexToRgba(style.background));
      gl.clear(gl.COLOR_BUFFER_BIT);
      const scaleX = size.width;
      const scaleY = size.height;
      drawSceneArt(style, size, drawRect, drawPolygon);
      drawRect(0, scaleY * 0.49, scaleX, scaleY * 0.02, hexToRgba(style.accent));
      drawRect(0, scaleY * 0.35, scaleX, scaleY * 0.008, hexToRgba(style.lane, 0.7));
      drawRect(0, scaleY * 0.63, scaleX, scaleY * 0.008, hexToRgba(style.lane, 0.7));
      drawPlayerArt(style, snapshot.player, size, drawRect, drawPolygon);
      for (const obstacle of snapshot.obstacles) {
        drawObstacleArt(style, obstacle, size, drawRect, drawPolygon);
      }
    },
    destroy() { gl.deleteBuffer(buffer); gl.deleteProgram(program); }
  };
}

function createCanvasRenderer(canvas, ctx) {
  const size = { ...LOGICAL_SIZES[2] };
  const drawRect = (x, y, width, height, color) => {
    ctx.fillStyle = rgbaToCss(color);
    ctx.fillRect(x, y, width, height);
  };
  const drawPolygon = (points, color) => {
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (let index = 1; index < points.length; index += 1) ctx.lineTo(points[index][0], points[index][1]);
    ctx.closePath();
    ctx.fillStyle = rgbaToCss(color);
    ctx.fill();
  };
  return {
    resize() {
      Object.assign(size, selectLogicalSize(Math.max(320, canvas.clientWidth || 640)));
      const dpr = Math.min(2, globalThis.devicePixelRatio || 1);
      canvas.width = Math.round(size.width * dpr);
      canvas.height = Math.round(size.height * dpr);
      ctx.setTransform(canvas.width / size.width, 0, 0, canvas.height / size.height, 0, 0);
    },
    render(snapshot, progression) {
      const style = getVisualStyle(progression);
      ctx.fillStyle = style.background;
      ctx.fillRect(0, 0, size.width, size.height);
      drawSceneArt(style, size, drawRect, drawPolygon);
      drawRect(0, size.height * 0.49, size.width, size.height * 0.02, hexToRgba(style.accent));
      drawRect(0, size.height * 0.35, size.width, size.height * 0.008, hexToRgba(style.lane, 0.7));
      drawRect(0, size.height * 0.63, size.width, size.height * 0.008, hexToRgba(style.lane, 0.7));
      drawPlayerArt(style, snapshot.player, size, drawRect, drawPolygon);
      for (const obstacle of snapshot.obstacles) drawObstacleArt(style, obstacle, size, drawRect, drawPolygon);
    },
    destroy() {}
  };
}

export function createRenderer(canvas) {
  if (!canvas) return { resize() {}, render() {}, destroy() {} };
  let gl = null;
  try { gl = canvas.getContext('webgl2') || canvas.getContext('webgl'); } catch { gl = null; }
  if (gl) return createWebGLRenderer(canvas, gl);
  let ctx = null;
  try { ctx = canvas.getContext('2d'); } catch { ctx = null; }
  return ctx ? createCanvasRenderer(canvas, ctx) : { resize() {}, render() {}, destroy() {} };
}

export function createAudio() {
  let context = null;
  let muted = false;
  const tone = (frequency, duration) => {
    if (muted || !context) return;
    try {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.035, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + duration);
    } catch { /* audio is optional */ }
  };
  return {
    unlock() {
      try {
        const AudioContextConstructor = globalThis.AudioContext || globalThis.webkitAudioContext;
        if (!context && AudioContextConstructor) context = new AudioContextConstructor();
        if (context?.state === 'suspended') context.resume().catch(() => undefined);
      } catch { context = null; }
    },
    laneChange() { tone(520, 0.08); },
    collision() { tone(120, 0.18); },
    setMuted(value) { muted = Boolean(value); }
  };
}

function selectLocale(language = '') {
  if (LOCAL_STRINGS[language]) return language;
  const base = language.split('-')[0];
  return Object.keys(LOCAL_STRINGS).find(locale => locale.split('-')[0] === base) || 'en';
}

function readEmbeddedStrings(documentRef) {
  try {
    const raw = documentRef?.querySelector('#strings-data')?.textContent;
    return raw ? JSON.parse(raw) : LOCAL_STRINGS;
  } catch {
    return LOCAL_STRINGS;
  }
}

function getStorage(windowRef) {
  try { return windowRef?.localStorage ?? null; } catch { return null; }
}

function setVisible(element, visible) {
  if (!element) return;
  element.hidden = !visible;
}

const REWARD_NAMES = Object.freeze({
  en: {
    'form-default': 'Starter Form',
    'skin-cyan': 'Cyan Skin',
    'theme-city': 'Neon City',
    'form-evolved': 'Pulse Form',
    'skin-magenta': 'Magenta Skin',
    'skin-amber': 'Amber Skin',
    'equipment-visor': 'Neon Visor',
    'theme-crystal': 'Crystal Tunnel',
    'form-advanced': 'Plasma Form',
    'theme-cosmic': 'Cosmic Lab'
  },
  'pt-BR': {
    'form-default': 'Forma Inicial',
    'skin-cyan': 'Skin Ciano',
    'theme-city': 'Cidade Neon',
    'form-evolved': 'Forma Pulse',
    'skin-magenta': 'Skin Magenta',
    'skin-amber': 'Skin Âmbar',
    'equipment-visor': 'Visor Neon',
    'theme-crystal': 'Túnel Cristal',
    'form-advanced': 'Forma Plasma',
    'theme-cosmic': 'Laboratório Cósmico'
  }
});

function replaceTokens(template, values) {
  return Object.entries(values).reduce((result, [key, value]) => result.replace(`{${key}}`, String(value)), template);
}

export async function bootstrap({
  sdk = createPokiMock(),
  loadStrings = async () => LOCAL_STRINGS,
  compileShaders = async () => {},
  onReady = () => {},
  documentRef = globalThis.document,
  windowRef = globalThis.window
} = {}) {
  const controller = createPokiController(sdk);
  const loadedStrings = Promise.resolve().then(loadStrings).catch(() => LOCAL_STRINGS);
  const compiledShaders = Promise.resolve().then(compileShaders).catch(() => undefined);
  await controller.finishLoading(loadedStrings, compiledShaders);
  if (!documentRef) {
    await onReady();
    return { controller };
  }

  const canvas = documentRef.querySelector('#game-canvas');
  const renderer = createRenderer(canvas);
  const audio = createAudio();
  const strings = readEmbeddedStrings(documentRef);
  const locale = selectLocale(windowRef?.navigator?.language || 'en');
  const text = strings[locale] || strings.en || LOCAL_STRINGS.en;
  if (documentRef.documentElement) documentRef.documentElement.lang = locale;
  const copy = key => text[key] || strings.en?.[key] || LOCAL_STRINGS.en[key] || key;
  const notifyStorage = key => {
    const notice = documentRef.querySelector('#storage-notice');
    if (notice && key === 'sessionNotPersisted') {
      notice.textContent = copy('storageNotice');
      setVisible(notice, true);
    }
  };
  const storage = createStorageAdapter(getStorage(windowRef), notifyStorage);
  const progressionStore = createProgressionStore(getStorage(windowRef), notifyStorage);
  let latestProgression = progressionStore.readProgression();
  let latestProgressionResult = { newlyUnlocked: [], nextMilestone: getNextMilestone(latestProgression) };
  const world = createGameWorld();
  const machine = createGameStateMachine(controller);
  const bestScore = storage.readBestScore();
  const elements = {
    shell: documentRef.querySelector('#game-shell'),
    ready: documentRef.querySelector('#ready-panel'),
    pause: documentRef.querySelector('#pause-panel'),
    menu: documentRef.querySelector('#menu-panel'),
    gameOver: documentRef.querySelector('#game-over-panel'),
    score: documentRef.querySelector('#score-value'),
    best: documentRef.querySelector('#best-value'),
    title: documentRef.querySelector('#game-title'),
    start: documentRef.querySelector('#start-label'),
    playingHint: documentRef.querySelector('#playing-hint'),
    mobileControls: documentRef.querySelector('#mobile-controls'),
    pauseButton: documentRef.querySelector('#pause-button'),
    restartButton: documentRef.querySelector('#restart-button'),
    readyProgression: documentRef.querySelector('#ready-progression'),
    gameOverReward: documentRef.querySelector('#game-over-reward'),
    gameOverNext: documentRef.querySelector('#game-over-next'),
    loadoutList: documentRef.querySelector('#loadout-list'),
    customizeButton: documentRef.querySelector('#customize-button')
  };

  documentRef.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.dataset.i18n;
    element.textContent = copy(key);
  });
  if (elements.title) elements.title.textContent = copy('title');
  if (elements.start) elements.start.textContent = copy('start');
  if (elements.pauseButton) {
    elements.pauseButton.textContent = 'Ⅱ';
    elements.pauseButton.setAttribute('aria-label', copy('pause'));
  }
  if (elements.restartButton) elements.restartButton.textContent = copy('restart');
  if (elements.best) elements.best.textContent = String(bestScore);

  await machine.finishLoading();
  setVisible(elements.ready, true);
  setVisible(elements.pause, false);
  setVisible(elements.menu, false);
  setVisible(elements.gameOver, false);
  await onReady();

  const rewardName = rewardId => REWARD_NAMES[locale]?.[rewardId] || REWARD_NAMES.en[rewardId] || rewardId;
  const rewardTypeName = type => copy(type);
  const nextMilestoneText = milestone => milestone
    ? replaceTokens(copy('nextMilestone'), { label: rewardName(milestone.id), seconds: milestone.threshold })
    : copy('defaultReward');
  const renderLoadout = () => {
    if (!elements.loadoutList) return;
    elements.loadoutList.replaceChildren();
    for (const rewardId of latestProgression.unlocked) {
      const milestone = NEON_MILESTONES.find(item => item.id === rewardId);
      const type = milestone?.type || rewardId.split('-')[0];
      const equipped = latestProgression.equipped[type] === rewardId;
      const row = documentRef.createElement('div');
      row.className = 'loadout-item';
      row.dataset.type = type;
      row.dataset.equipped = String(equipped);
      const label = documentRef.createElement('span');
      const labelText = `${rewardTypeName(type)}: ${rewardName(rewardId)}`;
      label.textContent = labelText;
      row.append(label);
      if (equipped) {
        const marker = documentRef.createElement('span');
        marker.textContent = copy('equipped');
        row.append(marker);
      } else if (milestone) {
        row.dataset.action = 'equip';
        row.dataset.rewardId = rewardId;
        row.setAttribute('role', 'button');
        row.tabIndex = 0;
        row.setAttribute('aria-label', `${labelText}. ${copy('equip')}`);
        const action = documentRef.createElement('span');
        action.className = 'loadout-action';
        action.textContent = copy('equip');
        row.append(action);
      }
      elements.loadoutList.append(row);
    }
  };
  const syncProgressionUi = () => {
    const next = latestProgressionResult.nextMilestone || getNextMilestone(latestProgression);
    const nextText = nextMilestoneText(next);
    if (elements.readyProgression) elements.readyProgression.textContent = nextText;
    if (elements.gameOverReward) {
      const rewards = latestProgressionResult.newlyUnlocked || [];
      elements.gameOverReward.textContent = rewards.length
        ? replaceTokens(copy('unlocked'), { label: rewards.map(reward => rewardName(reward.id)).join(', ') })
        : next ? copy('noNewReward') : copy('defaultReward');
    }
    if (elements.gameOverNext) elements.gameOverNext.textContent = nextText;
    renderLoadout();
  };
  const syncUi = () => {
    const state = machine.getState();
    setVisible(elements.ready, state === GAME_STATES.READY);
    setVisible(elements.pause, state === GAME_STATES.PAUSED);
    setVisible(elements.menu, state === GAME_STATES.MENU);
    setVisible(elements.gameOver, state === GAME_STATES.GAME_OVER);
    setVisible(elements.playingHint, state === GAME_STATES.PLAYING);
    setVisible(elements.mobileControls, state === GAME_STATES.PLAYING);
    if (elements.shell) elements.shell.dataset.state = state;
    syncProgressionUi();
  };
  const refreshHud = snapshot => {
    if (elements.score) elements.score.textContent = String(snapshot.score);
  };
  const switchLane = () => {
    audio.unlock();
    audio.laneChange();
    world.update(0, { switchLane: true });
  };
  const startFromInput = async () => {
    audio.unlock();
    const wasReady = machine.getState() === GAME_STATES.READY;
    await machine.inputStart();
    if (wasReady) world.reset();
    if (machine.getState() === GAME_STATES.PLAYING) runCompleted = false;
    syncUi();
  };
  const restart = async () => {
    await machine.restartAfterGameOver();
    world.reset();
    latestProgressionResult = { newlyUnlocked: [], nextMilestone: getNextMilestone(latestProgression) };
    syncUi();
  };
  const equipReward = rewardId => {
    latestProgression = progressionStore.equipReward(rewardId);
    latestProgressionResult = { newlyUnlocked: [], nextMilestone: getNextMilestone(latestProgression) };
    syncUi();
  };
  const handlePointer = event => {
    if (event.target.closest?.('[data-action="customize"]')) {
      machine.openMenu().then(syncUi);
      return;
    }
    if (event.target.closest?.('[data-action="equip"]')) {
      const rewardId = event.target.closest('[data-action="equip"]').dataset.rewardId;
      equipReward(rewardId);
      return;
    }
    if (event.target.closest?.('[data-action="switch-lane"]')) {
      if (machine.getState() === GAME_STATES.PLAYING) switchLane();
      return;
    }
    if (event.target.closest?.('[data-action="pause"]')) {
      machine.pause().then(syncUi);
      return;
    }
    if (event.target.closest?.('[data-action="restart"]')) {
      restart();
      return;
    }
    if (event.target.closest?.('[data-action="menu"]')) {
      machine.openMenu().then(syncUi);
      return;
    }
    if (event.target.closest?.('[data-action="resume"]')) {
      if (machine.getState() === GAME_STATES.MENU) startFromInput();
      return;
    }
    const state = machine.getState();
    if (state === GAME_STATES.PLAYING) switchLane();
    else if (state === GAME_STATES.GAME_OVER) restart();
    else if (state === GAME_STATES.MENU) return;
    else startFromInput();
  };
  documentRef.addEventListener('pointerdown', handlePointer, { passive: true });
  windowRef?.addEventListener('keydown', event => {
    if (event.repeat) return;
    if (['Space', 'ArrowUp', 'ArrowDown', 'Escape', 'KeyP'].includes(event.code)) event.preventDefault();
    const actionTarget = event.target.closest?.('[data-action]');
    if (actionTarget?.dataset.action === 'equip') {
      if (event.code === 'Enter' || event.code === 'Space') equipReward(actionTarget.dataset.rewardId);
      return;
    }
    if (actionTarget?.dataset.action === 'resume') {
      if (event.code === 'Enter' || event.code === 'Space') startFromInput();
      return;
    }
    const state = machine.getState();
    if (state === GAME_STATES.MENU) return;
    if (event.code === 'Escape' || event.code === 'KeyP') {
      if (state === GAME_STATES.PLAYING) machine.pause().then(syncUi);
      else if (state === GAME_STATES.PAUSED) startFromInput();
      return;
    }
    if (event.code === 'Space') {
      if (state === GAME_STATES.PLAYING) switchLane();
      else if (state === GAME_STATES.GAME_OVER) restart();
      else startFromInput();
      return;
    }
    if (event.code === 'ArrowUp' || event.code === 'ArrowDown') {
      if (state === GAME_STATES.PLAYING) switchLane();
      else startFromInput();
    }
  }, { passive: false });
  documentRef.addEventListener('visibilitychange', () => {
    if (documentRef.visibilityState === 'hidden') machine.pause().then(syncUi);
  });
  windowRef?.addEventListener('blur', () => machine.pause().then(syncUi));
  windowRef?.addEventListener('resize', () => renderer.resize());
  renderer.resize();
  world.reset();
  syncUi();

  let runCompleted = false;
  let lastTime = 0;
  const frame = timestamp => {
    const dt = lastTime ? (timestamp - lastTime) / 1000 : 0;
    lastTime = timestamp;
    if (machine.getState() === GAME_STATES.PLAYING) {
      world.update(dt);
      const snapshot = world.snapshot();
      refreshHud(snapshot);
      if (!runCompleted && world.isCollision()) {
        runCompleted = true;
        audio.collision();
        world.stop();
        storage.writeBestScore(Math.max(bestScore, snapshot.score));
        if (elements.best) elements.best.textContent = String(Math.max(bestScore, snapshot.score));
        latestProgressionResult = progressionStore.completeRun(snapshot.elapsed);
        latestProgression = latestProgressionResult.progression;
        machine.die().then(syncUi);
      }
    }
    renderer.render(world.snapshot(), latestProgression);
    windowRef?.requestAnimationFrame?.(frame);
  };
  windowRef?.requestAnimationFrame?.(frame);
  return { controller, machine, world, renderer, storage, progression: progressionStore };
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  const pokiSdk = createPokiMock({ commercialBreakDuration: 420 });
  globalThis.PokiSDK = pokiSdk;
  window.PokiSDK = pokiSdk;
  window.addEventListener('DOMContentLoaded', () => {
    bootstrap({ sdk: pokiSdk }).catch(() => undefined);
  }, { once: true });
}
