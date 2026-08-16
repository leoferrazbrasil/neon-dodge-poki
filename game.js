const LOGICAL_SIZES = Object.freeze([
  { width: 640, height: 360 },
  { width: 836, height: 470 },
  { width: 1031, height: 580 }
]);

const LOCAL_STRINGS = Object.freeze({
  en: { title: 'Neon Dodge', start: 'Tap to start', controlHint: 'Each tap switches lanes', paused: 'PAUSED', takeABreath: 'Take a breath.', menu: 'MENU', readyWhen: 'Ready when you are.', runComplete: 'RUN COMPLETE', oneMore: 'One more?', pause: 'Pause', resume: 'Resume', restart: 'Restart', score: 'Score', best: 'Best', storageNotice: 'This session score will not be saved.', customize: 'Customize', collection: 'Neon collection', nextMilestone: 'Next: {label} at {seconds}s', unlocked: 'Unlocked: {label}', noNewReward: 'Keep going to unlock the next form.', equipped: 'Equipped', equip: 'Equip', form: 'Form', skin: 'Skin', equipment: 'Equipment', theme: 'Theme', seconds: 'seconds', defaultReward: 'Your current loadout is ready.' },
  'pt-BR': { title: 'Neon Dodge', start: 'Toque para começar', controlHint: 'Cada toque alterna a faixa', paused: 'PAUSADO', takeABreath: 'Respire um pouco.', menu: 'MENU', readyWhen: 'Quando quiser, estamos prontos.', runComplete: 'FIM DA RODADA', oneMore: 'Mais uma?', pause: 'Pausar', resume: 'Continuar', restart: 'Reiniciar', score: 'Pontos', best: 'Recorde', storageNotice: 'A pontuação desta sessão não será salva.', customize: 'Personalizar', collection: 'Coleção neon', nextMilestone: 'Próximo: {label} em {seconds}s', unlocked: 'Desbloqueado: {label}', noNewReward: 'Continue para liberar a próxima forma.', equipped: 'Equipado', equip: 'Usar', form: 'Forma', skin: 'Skin', equipment: 'Equipamento', theme: 'Tema', seconds: 'segundos', defaultReward: 'Seu visual atual está pronto.' },
  es: { title: 'Neon Dodge', start: 'Toca para empezar', controlHint: 'Cada toque cambia de carril', paused: 'PAUSA', takeABreath: 'Respira un momento.', menu: 'MENÚ', readyWhen: 'Cuando quieras, estamos listos.', runComplete: 'FIN DE LA PARTIDA', oneMore: '¿Otra vez?', pause: 'Pausa', resume: 'Continuar', restart: 'Reiniciar', score: 'Puntuación', best: 'Mejor', storageNotice: 'La puntuación de esta sesión no se guardará.', customize: 'Personalizar', collection: 'Colección neón', nextMilestone: 'Siguiente: {label} a los {seconds}s', unlocked: 'Desbloqueado: {label}', noNewReward: 'Sigue jugando para liberar la próxima forma.', equipped: 'Equipado', equip: 'Usar', form: 'Forma', skin: 'Aspecto', equipment: 'Equipo', theme: 'Tema', seconds: 'segundos', defaultReward: 'Tu equipo actual está listo.' },
  fr: { title: 'Neon Dodge', start: 'Touchez pour commencer', controlHint: 'Chaque touche change de voie', paused: 'PAUSE', takeABreath: 'Respirez un instant.', menu: 'MENU', readyWhen: 'Quand vous voulez, on est prêts.', runComplete: 'PARTIE TERMINÉE', oneMore: 'Encore une ?', pause: 'Pause', resume: 'Reprendre', restart: 'Recommencer', score: 'Score', best: 'Record', storageNotice: 'Le score de cette session ne sera pas sauvegardé.', customize: 'Personnaliser', collection: 'Collection néon', nextMilestone: 'Suivant : {label} à {seconds}s', unlocked: 'Débloqué : {label}', noNewReward: 'Continuez pour débloquer la forme suivante.', equipped: 'Équipé', equip: 'Utiliser', form: 'Forme', skin: 'Apparence', equipment: 'Équipement', theme: 'Thème', seconds: 'secondes', defaultReward: 'Votre équipement actuel est prêt.' },
  it: { title: 'Neon Dodge', start: 'Tocca per iniziare', controlHint: 'Ogni tocco cambia corsia', paused: 'PAUSA', takeABreath: 'Prendi fiato.', menu: 'MENU', readyWhen: 'Quando vuoi, siamo pronti.', runComplete: 'PARTITA FINITA', oneMore: 'Un\'altra?', pause: 'Pausa', resume: 'Riprendi', restart: 'Ricomincia', score: 'Punteggio', best: 'Record', storageNotice: 'Il punteggio di questa sessione non verrà salvato.', customize: 'Personalizza', collection: 'Collezione neon', nextMilestone: 'Prossimo: {label} a {seconds}s', unlocked: 'Sbloccato: {label}', noNewReward: 'Continua per sbloccare la prossima forma.', equipped: 'Equipaggiato', equip: 'Usa', form: 'Forma', skin: 'Aspetto', equipment: 'Equipaggiamento', theme: 'Tema', seconds: 'secondi', defaultReward: 'Il tuo equipaggiamento è pronto.' },
  de: { title: 'Neon Dodge', start: 'Tippen zum Starten', controlHint: 'Jeder Tipp wechselt die Spur', paused: 'PAUSE', takeABreath: 'Atme kurz durch.', menu: 'MENÜ', readyWhen: 'Wir sind bereit, wenn du es bist.', runComplete: 'RUNDE BEENDET', oneMore: 'Noch mal?', pause: 'Pause', resume: 'Fortsetzen', restart: 'Neustart', score: 'Punkte', best: 'Bestwert', storageNotice: 'Der Punktestand dieser Sitzung wird nicht gespeichert.', customize: 'Anpassen', collection: 'Neon-Sammlung', nextMilestone: 'Nächstes: {label} bei {seconds}s', unlocked: 'Freigeschaltet: {label}', noNewReward: 'Spiel weiter, um die nächste Form freizuschalten.', equipped: 'Ausgerüstet', equip: 'Nutzen', form: 'Form', skin: 'Skin', equipment: 'Ausrüstung', theme: 'Thema', seconds: 'Sekunden', defaultReward: 'Deine Ausrüstung ist bereit.' },
  tr: { title: 'Neon Dodge', start: 'Başlamak için dokun', controlHint: 'Her dokunuş şeridi değiştirir', paused: 'DURAKLADI', takeABreath: 'Biraz nefes al.', menu: 'MENÜ', readyWhen: 'Hazır olduğunda başlıyoruz.', runComplete: 'TUR BİTTİ', oneMore: 'Bir tur daha?', pause: 'Duraklat', resume: 'Devam et', restart: 'Yeniden başlat', score: 'Skor', best: 'En iyi', storageNotice: 'Bu oturumun skoru kaydedilmeyecek.', customize: 'Özelleştir', collection: 'Neon koleksiyonu', nextMilestone: 'Sıradaki: {label} {seconds}sn\'de', unlocked: 'Açıldı: {label}', noNewReward: 'Sonraki formu açmak için devam et.', equipped: 'Kuşanıldı', equip: 'Kullan', form: 'Form', skin: 'Görünüm', equipment: 'Ekipman', theme: 'Tema', seconds: 'saniye', defaultReward: 'Mevcut donanımın hazır.' }
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

const IMMINENT_WINDOW = 2.6;
const REWARD_HOLD = 1.6;

export function getRunObjective(elapsed, { unlocked = [], bestSeconds = 0 } = {}) {
  const time = Math.max(0, Number(elapsed) || 0);
  const best = Math.max(0, Number(bestSeconds) || 0);
  const target = NEON_MILESTONES.find(item => item.threshold > time);
  if (target) {
    const index = NEON_MILESTONES.indexOf(target);
    const from = index === 0 ? 0 : NEON_MILESTONES[index - 1].threshold;
    const span = target.threshold - from;
    const remaining = target.threshold - time;
    return {
      kind: 'milestone',
      id: target.id,
      type: target.type,
      label: target.label,
      target: target.threshold,
      from,
      ratio: span > 0 ? Math.min(1, Math.max(0, (time - from) / span)) : 1,
      remaining,
      imminent: remaining <= IMMINENT_WINDOW,
      owned: unlocked.includes(target.id)
    };
  }
  const last = NEON_MILESTONES[NEON_MILESTONES.length - 1].threshold;
  if (best > time) {
    const from = Math.max(last, 0);
    const span = best - from;
    const remaining = best - time;
    return {
      kind: 'best',
      id: 'personal-best',
      type: 'best',
      label: 'Personal Best',
      target: best,
      from,
      ratio: span > 0 ? Math.min(1, Math.max(0, (time - from) / span)) : 1,
      remaining,
      imminent: remaining <= IMMINENT_WINDOW,
      owned: false
    };
  }
  return { kind: 'record', id: 'record', type: 'record', label: 'Record', target: time, from: last, ratio: 1, remaining: 0, imminent: false, owned: false };
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

const PLATFORM_PROFILES = Object.freeze(['neutral', 'poki']);

export function createPlatformMock({ commercialBreakDuration = 0 } = {}) {
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

export function createPlatformController(sdk) {
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

const STARTER_REWARDS = Object.freeze(['form-default', 'skin-cyan', 'theme-city']);

export function findReward(rewardId) {
  const milestone = NEON_MILESTONES.find(item => item.id === rewardId);
  if (milestone) return { id: milestone.id, type: milestone.type };
  if (STARTER_REWARDS.includes(rewardId)) return { id: rewardId, type: rewardId.split('-')[0] };
  return null;
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
    applyMilestones(elapsed) {
      readProgression();
      const result = resolveProgression(progression, elapsed);
      if (!result.newlyUnlocked.length) return { ...result, progression };
      progression = result.progression;
      save();
      return result;
    },
    completeRun(elapsed) {
      readProgression();
      const result = resolveProgression(progression, elapsed);
      progression = result.progression;
      save();
      return result;
    },
    equipReward(rewardId) {
      readProgression();
      const reward = findReward(rewardId);
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

const THEME_PALETTES = Object.freeze({
  'theme-city': Object.freeze({ background: '#080b22', lane: '#20c7f5', accent: '#24306b', playerAccent: '#73e6ff', obstacleAccent: '#ffb3c2' }),
  'theme-crystal': Object.freeze({ background: '#101936', lane: '#75e7ff', accent: '#344c86', playerAccent: '#d4fbff', obstacleAccent: '#f2b5ff' }),
  'theme-cosmic': Object.freeze({ background: '#170d2f', lane: '#d68cff', accent: '#5b2f79', playerAccent: '#f4d8ff', obstacleAccent: '#ff9dbd' })
});

const SKIN_COLORS = Object.freeze({ 'skin-cyan': '#fbe047', 'skin-magenta': '#ff6bd6', 'skin-amber': '#ffb347' });

const LOADOUT_TYPES = Object.freeze(['form', 'skin', 'equipment', 'theme']);

export function getThemePalette(id = 'theme-city') {
  return THEME_PALETTES[id] || THEME_PALETTES['theme-city'];
}

export function getSkinColor(id = 'skin-cyan') {
  return SKIN_COLORS[id] || SKIN_COLORS['skin-cyan'];
}

export function getLoadoutSections(progression) {
  const state = normalizeProgression(progression);
  const catalog = [
    ...STARTER_REWARDS.map(id => ({ id, type: id.split('-')[0], threshold: 0 })),
    ...NEON_MILESTONES.map(item => ({ id: item.id, type: item.type, threshold: item.threshold }))
  ];
  return LOADOUT_TYPES.map(type => ({
    type,
    items: catalog
      .filter(entry => entry.type === type)
      .sort((a, b) => a.threshold - b.threshold)
      .map(entry => ({
        id: entry.id,
        type,
        threshold: entry.threshold,
        unlocked: state.unlocked.includes(entry.id),
        equipped: state.equipped[type] === entry.id
      }))
  })).filter(section => section.items.length > 0);
}

export function getVisualStyle(progression) {
  const theme = progression?.equipped?.theme || 'theme-city';
  const skin = progression?.equipped?.skin || 'skin-cyan';
  const form = progression?.equipped?.form || 'form-default';
  const themes = THEME_PALETTES;
  const skins = SKIN_COLORS;
  const activeTheme = themes[theme] || themes['theme-city'];
  return {
    ...activeTheme,
    theme: themes[theme] ? theme : 'theme-city',
    player: skins[skin] || skins['skin-cyan'],
    obstacle: '#fa416b',
    glitchTones: GLITCH_TONES,
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
    Object.freeze({ kind: 'star', x: 0.12, y: 0.07, width: 0.03, height: 0.03, tone: 'playerAccent', depth: 0.12 }),
    Object.freeze({ kind: 'star', x: 0.58, y: 0.05, width: 0.024, height: 0.024, tone: 'lane', depth: 0.12 }),
    Object.freeze({ kind: 'building', x: 0.05, y: 0.10, width: 0.08, height: 0.18, tone: 'accent', depth: 0.38 }),
    Object.freeze({ kind: 'building', x: 0.18, y: 0.16, width: 0.06, height: 0.12, tone: 'lane', depth: 0.38 }),
    Object.freeze({ kind: 'building', x: 0.44, y: 0.12, width: 0.09, height: 0.16, tone: 'accent', depth: 0.38 }),
    Object.freeze({ kind: 'building', x: 0.78, y: 0.10, width: 0.10, height: 0.18, tone: 'accent', depth: 0.38 }),
    Object.freeze({ kind: 'beacon', x: 0.92, y: 0.19, width: 0.012, height: 0.18, tone: 'playerAccent', depth: 0.38 }),
    Object.freeze({ kind: 'rail', x: 0.10, y: 0.79, width: 0.07, height: 0.05, tone: 'lane', depth: 1 }),
    Object.freeze({ kind: 'rail', x: 0.52, y: 0.79, width: 0.07, height: 0.05, tone: 'lane', depth: 1 }),
    Object.freeze({ kind: 'rail', x: 0.86, y: 0.79, width: 0.07, height: 0.05, tone: 'lane', depth: 1 })
  ]),
  'theme-crystal': Object.freeze([
    Object.freeze({ kind: 'star', x: 0.30, y: 0.06, width: 0.028, height: 0.028, tone: 'playerAccent', depth: 0.12 }),
    Object.freeze({ kind: 'star', x: 0.72, y: 0.08, width: 0.022, height: 0.022, tone: 'lane', depth: 0.12 }),
    Object.freeze({ kind: 'crystal', x: 0.10, y: 0.16, width: 0.10, height: 0.22, tone: 'lane', depth: 0.38 }),
    Object.freeze({ kind: 'crystal', x: 0.24, y: 0.10, width: 0.06, height: 0.16, tone: 'accent', depth: 0.38 }),
    Object.freeze({ kind: 'crystal', x: 0.50, y: 0.14, width: 0.08, height: 0.20, tone: 'accent', depth: 0.38 }),
    Object.freeze({ kind: 'crystal', x: 0.82, y: 0.14, width: 0.12, height: 0.24, tone: 'playerAccent', depth: 0.38 }),
    Object.freeze({ kind: 'beacon', x: 0.94, y: 0.20, width: 0.012, height: 0.20, tone: 'lane', depth: 0.38 }),
    Object.freeze({ kind: 'shard', x: 0.16, y: 0.79, width: 0.06, height: 0.06, tone: 'lane', depth: 1 }),
    Object.freeze({ kind: 'shard', x: 0.58, y: 0.79, width: 0.06, height: 0.06, tone: 'lane', depth: 1 }),
    Object.freeze({ kind: 'shard', x: 0.90, y: 0.79, width: 0.06, height: 0.06, tone: 'lane', depth: 1 })
  ]),
  'theme-cosmic': Object.freeze([
    Object.freeze({ kind: 'star', x: 0.10, y: 0.12, width: 0.06, height: 0.06, tone: 'playerAccent', depth: 0.12 }),
    Object.freeze({ kind: 'star', x: 0.62, y: 0.06, width: 0.04, height: 0.04, tone: 'lane', depth: 0.12 }),
    Object.freeze({ kind: 'star', x: 0.94, y: 0.22, width: 0.05, height: 0.05, tone: 'playerAccent', depth: 0.12 }),
    Object.freeze({ kind: 'panel', x: 0.20, y: 0.10, width: 0.12, height: 0.08, tone: 'accent', depth: 0.38 }),
    Object.freeze({ kind: 'panel', x: 0.48, y: 0.16, width: 0.10, height: 0.07, tone: 'accent', depth: 0.38 }),
    Object.freeze({ kind: 'orb', x: 0.82, y: 0.14, width: 0.10, height: 0.10, tone: 'lane', depth: 0.38 }),
    Object.freeze({ kind: 'orb', x: 0.34, y: 0.20, width: 0.06, height: 0.06, tone: 'playerAccent', depth: 0.38 }),
    Object.freeze({ kind: 'shard', x: 0.14, y: 0.79, width: 0.06, height: 0.06, tone: 'lane', depth: 1 }),
    Object.freeze({ kind: 'shard', x: 0.56, y: 0.79, width: 0.06, height: 0.06, tone: 'lane', depth: 1 }),
    Object.freeze({ kind: 'shard', x: 0.92, y: 0.79, width: 0.06, height: 0.06, tone: 'lane', depth: 1 })
  ])
});

const PARALLAX_SPAN = 1.2;
const DASH_STEP = 0.12;
const DASH_LENGTH = 0.07;
const BEACON_TRAVEL = 0.4;

const ROAD_BANDS = Object.freeze([
  Object.freeze({ id: 'bed', y: 0.28, height: 0.44, tone: 'accent', alpha: 0.28 }),
  Object.freeze({ id: 'edge-top', y: 0.272, height: 0.012, tone: 'lane', alpha: 0.9 }),
  Object.freeze({ id: 'edge-bottom', y: 0.716, height: 0.012, tone: 'lane', alpha: 0.9 }),
  Object.freeze({ id: 'guide-top', y: 0.35, height: 0.008, tone: 'lane', alpha: 0.5 }),
  Object.freeze({ id: 'guide-bottom', y: 0.63, height: 0.008, tone: 'lane', alpha: 0.5 })
]);

export function getRoadBands() {
  return ROAD_BANDS;
}

export function getParallaxOffset(elapsed, speed, depth) {
  const travelled = Math.max(0, Number(elapsed) || 0) * Math.max(0, Number(speed) || 0) * Math.max(0, Number(depth) || 0);
  return travelled % PARALLAX_SPAN;
}

export function wrapParallaxX(x, offset) {
  return (((x - offset) % PARALLAX_SPAN) + PARALLAX_SPAN) % PARALLAX_SPAN - 0.1;
}

export function getLaneDashes(elapsed, speed) {
  const offset = (Math.max(0, Number(elapsed) || 0) * Math.max(0, Number(speed) || 0)) % DASH_STEP;
  const dashes = [];
  for (let x = -DASH_STEP; x < PARALLAX_SPAN; x += DASH_STEP) {
    dashes.push({ x: x - offset, width: DASH_LENGTH, y: 0.49, height: 0.02 });
  }
  return dashes;
}

export function getActiveBeacons(elapsed) {
  const time = Math.max(0, Number(elapsed) || 0);
  const beacons = [];
  for (const milestone of NEON_MILESTONES) {
    const x = 0.16 + (milestone.threshold - time) * BEACON_TRAVEL;
    if (x >= -0.18 && x <= 1.18) beacons.push({ id: milestone.id, threshold: milestone.threshold, x });
  }
  return beacons;
}

const PLAYER_HULLS = Object.freeze({
  'form-default': Object.freeze([[-0.42, -0.20], [-0.10, -0.32], [0.26, -0.24], [0.46, 0], [0.26, 0.24], [-0.10, 0.32], [-0.42, 0.20]]),
  'form-evolved': Object.freeze([[-0.46, 0], [-0.18, -0.34], [0.20, -0.28], [0.46, 0], [0.20, 0.28], [-0.18, 0.34]]),
  'form-advanced': Object.freeze([[-0.44, -0.10], [-0.16, -0.30], [0.22, -0.26], [0.48, 0], [0.22, 0.26], [-0.16, 0.30], [-0.44, 0.10]])
});

const PLAYER_FORM_EXTRAS = Object.freeze({
  'form-default': Object.freeze([]),
  'form-evolved': Object.freeze([
    Object.freeze({ id: 'pulse-fin-top', points: Object.freeze([[-0.20, -0.34], [0.02, -0.52], [0.10, -0.44], [-0.10, -0.28]]), tone: 'playerAccent', alpha: 0.85 }),
    Object.freeze({ id: 'pulse-fin-bottom', points: Object.freeze([[-0.10, 0.28], [0.10, 0.44], [0.02, 0.52], [-0.20, 0.34]]), tone: 'playerAccent', alpha: 0.85 })
  ]),
  'form-advanced': Object.freeze([
    Object.freeze({ id: 'crown-top', points: Object.freeze([[-0.10, -0.30], [0.04, -0.54], [0.18, -0.30]]), tone: 'playerAccent', alpha: 0.9 }),
    Object.freeze({ id: 'crown-bottom', points: Object.freeze([[-0.10, 0.30], [0.18, 0.30], [0.04, 0.54]]), tone: 'playerAccent', alpha: 0.9 }),
    Object.freeze({ id: 'plasma-spike', points: Object.freeze([[0.44, -0.11], [0.60, 0], [0.44, 0.11]]), tone: 'lane', alpha: 0.9 })
  ])
});

const PLAYER_BODY = Object.freeze([
  Object.freeze({ id: 'wing-top', points: Object.freeze([[-0.30, -0.24], [-0.04, -0.50], [0.10, -0.42], [-0.08, -0.18]]), tone: 'player', alpha: 0.75 }),
  Object.freeze({ id: 'wing-bottom', points: Object.freeze([[-0.08, 0.18], [0.10, 0.42], [-0.04, 0.50], [-0.30, 0.24]]), tone: 'player', alpha: 0.75 })
]);

const PLAYER_FACE = Object.freeze([
  Object.freeze({ id: 'visor-plate', points: Object.freeze([[0.08, -0.17], [0.30, -0.13], [0.40, 0], [0.30, 0.13], [0.08, 0.17]]), tone: 'playerAccent', alpha: 0.95 }),
  Object.freeze({ id: 'visor-lens', points: Object.freeze([[0.14, -0.09], [0.28, -0.065], [0.35, 0], [0.28, 0.065], [0.14, 0.09]]), tone: 'background', alpha: 1 }),
  Object.freeze({ id: 'core-ring', points: Object.freeze([[-0.16, -0.17], [0.02, 0], [-0.16, 0.17], [-0.34, 0]]), tone: 'lane', alpha: 0.9 })
]);

const THRUSTER_POINTS = Object.freeze([[-0.36, -0.17], [-0.36, 0.17]]);
const CORE_POINTS = Object.freeze([[-0.16, -0.08], [-0.06, 0], [-0.16, 0.08], [-0.26, 0]]);

const GLITCH_PARTS = Object.freeze({
  0: Object.freeze([
    Object.freeze({ id: 'drone-fin', points: Object.freeze([[-0.5, -0.34], [-0.30, -0.20], [-0.30, 0.20], [-0.5, 0.34]]), tone: 'glitch', alpha: 0.6 }),
    Object.freeze({ id: 'drone-pod-top', points: Object.freeze([[-0.30, -0.46], [0.30, -0.46], [0.24, -0.20], [-0.24, -0.20]]), tone: 'glitch', alpha: 0.8 }),
    Object.freeze({ id: 'drone-pod-bottom', points: Object.freeze([[-0.24, 0.20], [0.24, 0.20], [0.30, 0.46], [-0.30, 0.46]]), tone: 'glitch', alpha: 0.8 }),
    Object.freeze({ id: 'drone-body', points: Object.freeze([[-0.5, -0.20], [0.5, -0.20], [0.5, 0.20], [-0.5, 0.20]]), tone: 'glitch', alpha: 1 }),
    Object.freeze({ id: 'drone-eye-plate', points: Object.freeze([[-0.16, -0.13], [0.34, -0.13], [0.34, 0.13], [-0.16, 0.13]]), tone: 'background', alpha: 0.9 }),
    Object.freeze({ id: 'drone-eye-lens', points: Object.freeze([[0.02, -0.07], [0.26, -0.07], [0.26, 0.07], [0.02, 0.07]]), tone: 'obstacleAccent', alpha: 1 })
  ]),
  1: Object.freeze([
    Object.freeze({ id: 'shard-spike-left', points: Object.freeze([[-0.34, -0.10], [-0.5, 0.02], [-0.30, 0.14]]), tone: 'glitch', alpha: 0.75 }),
    Object.freeze({ id: 'shard-spike-right', points: Object.freeze([[0.30, 0.14], [0.5, 0.02], [0.34, -0.10]]), tone: 'glitch', alpha: 0.75 }),
    Object.freeze({ id: 'shard-core', points: Object.freeze([[0, -0.5], [0.34, -0.16], [0.30, 0.30], [0, 0.5], [-0.30, 0.30], [-0.34, -0.16]]), tone: 'glitch', alpha: 1 }),
    Object.freeze({ id: 'shard-facet', points: Object.freeze([[0, -0.30], [0.18, -0.05], [0, 0.28], [-0.18, -0.05]]), tone: 'background', alpha: 0.75 }),
    Object.freeze({ id: 'shard-glint', points: Object.freeze([[0, -0.34], [0.08, -0.14], [0, -0.02], [-0.08, -0.14]]), tone: 'obstacleAccent', alpha: 1 })
  ]),
  2: Object.freeze([
    Object.freeze({ id: 'portal-spine', points: Object.freeze([[-0.5, -0.5], [-0.18, -0.5], [-0.18, 0.5], [-0.5, 0.5]]), tone: 'glitch', alpha: 1 }),
    Object.freeze({ id: 'portal-arm-top', points: Object.freeze([[-0.18, -0.5], [0.5, -0.5], [0.5, -0.24], [-0.18, -0.24]]), tone: 'glitch', alpha: 1 }),
    Object.freeze({ id: 'portal-arm-bottom', points: Object.freeze([[-0.18, 0.24], [0.5, 0.24], [0.5, 0.5], [-0.18, 0.5]]), tone: 'glitch', alpha: 1 }),
    Object.freeze({ id: 'portal-pillar', points: Object.freeze([[-0.42, -0.34], [-0.26, -0.34], [-0.26, 0.34], [-0.42, 0.34]]), tone: 'background', alpha: 0.55 }),
    Object.freeze({ id: 'portal-mouth-top', points: Object.freeze([[-0.10, -0.42], [0.42, -0.42], [0.42, -0.30], [-0.10, -0.30]]), tone: 'obstacleAccent', alpha: 1 }),
    Object.freeze({ id: 'portal-mouth-bottom', points: Object.freeze([[-0.10, 0.30], [0.42, 0.30], [0.42, 0.42], [-0.10, 0.42]]), tone: 'obstacleAccent', alpha: 1 })
  ])
});

const GLITCH_TONES = Object.freeze(['#fa416b', '#ff7a1f', '#ff4fa3']);

export function getGlitchTone(kind = 0) {
  return GLITCH_TONES[Math.abs(Number(kind) || 0) % 3];
}

export function getGlitchParts(kind = 0) {
  return GLITCH_PARTS[Math.abs(Number(kind) || 0) % 3] || GLITCH_PARTS[0];
}

export function getPlayerHull(form = 'form-default') {
  return PLAYER_HULLS[form] || PLAYER_HULLS['form-default'];
}

export function getPlayerParts(form = 'form-default', { elapsed = 0, laneOffset = 0 } = {}) {
  const time = Math.max(0, Number(elapsed) || 0);
  const stretch = 1 + Math.min(1, Math.abs(Number(laneOffset) || 0) / 0.14) * 1.4;
  const pulse = 0.62 + 0.38 * Math.abs(Math.sin(time * 3.4));
  const thruster = {
    id: 'thruster',
    points: [[-0.36 - 0.16 * stretch, THRUSTER_POINTS[0][1] * 0.7], THRUSTER_POINTS[0], THRUSTER_POINTS[1], [-0.36 - 0.16 * stretch, THRUSTER_POINTS[1][1] * 0.7]],
    tone: 'playerAccent',
    alpha: 0.5
  };
  const hull = { id: 'hull', points: getPlayerHull(form), tone: 'player', alpha: 1 };
  const core = { id: 'core', points: CORE_POINTS, tone: 'playerAccent', alpha: pulse };
  return [thruster, ...PLAYER_BODY, hull, ...PLAYER_FACE, core, ...(PLAYER_FORM_EXTRAS[form] || PLAYER_FORM_EXTRAS['form-default'])];
}

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

function drawSceneArt(style, size, snapshot, drawRect, drawPolygon) {
  const scaleX = size.width;
  const scaleY = size.height;
  const elapsed = snapshot?.elapsed || 0;
  const speed = snapshot?.speed || 0;
  for (const item of getSceneDecorations(style.theme)) {
    const depth = item.depth || 0.38;
    const wrapped = wrapParallaxX(item.x, getParallaxOffset(elapsed, speed, depth));
    const x = wrapped * scaleX;
    const y = item.y * scaleY;
    const width = item.width * scaleX;
    const height = item.height * scaleY;
    const alpha = depth < 0.2 ? 0.55 : depth < 0.6 ? 0.42 : 0.6;
    const color = hexToRgba(style[item.tone] || style.accent, alpha);
    if (item.kind === 'building' || item.kind === 'beacon' || item.kind === 'panel' || item.kind === 'rail') {
      drawRect(x, y, width, height, color);
    } else if (item.kind === 'crystal' || item.kind === 'shard') {
      drawPolygon([[x, y - height / 2], [x + width / 2, y], [x, y + height / 2], [x - width / 2, y]], color);
    } else if (item.kind === 'star') {
      drawPolygon([[x, y - height / 2], [x + width * 0.18, y - height * 0.18], [x + width / 2, y], [x + width * 0.18, y + height * 0.18], [x, y + height / 2], [x - width * 0.18, y + height * 0.18], [x - width / 2, y], [x - width * 0.18, y - height * 0.18]], color);
    } else if (item.kind === 'orb') {
      drawPolygon([[x, y - height / 2], [x + width * 0.35, y - height * 0.35], [x + width / 2, y], [x + width * 0.35, y + height * 0.35], [x, y + height / 2], [x - width * 0.35, y + height * 0.35], [x - width / 2, y], [x - width * 0.35, y - height * 0.35]], color);
    }
  }
}

function drawBeaconArt(style, size, snapshot, drawRect) {
  const scaleX = size.width;
  const scaleY = size.height;
  for (const beacon of getActiveBeacons(snapshot?.elapsed || 0)) {
    const x = beacon.x * scaleX;
    const width = 0.014 * scaleX;
    drawRect(x, 0.12 * scaleY, width, 0.16 * scaleY, hexToRgba(style.playerAccent, 0.5));
    drawRect(x, 0.72 * scaleY, width, 0.16 * scaleY, hexToRgba(style.playerAccent, 0.5));
    drawRect(x - width * 0.9, 0.1 * scaleY, width * 2.8, 0.024 * scaleY, hexToRgba(style.lane, 0.85));
    drawRect(x - width * 0.9, 0.876 * scaleY, width * 2.8, 0.024 * scaleY, hexToRgba(style.lane, 0.85));
  }
}

function drawRoadArt(style, size, snapshot, drawRect) {
  const scaleX = size.width;
  const scaleY = size.height;
  for (const band of getRoadBands()) {
    drawRect(0, band.y * scaleY, scaleX, band.height * scaleY, hexToRgba(style[band.tone] || style.accent, band.alpha));
  }
  for (const dash of getLaneDashes(snapshot?.elapsed || 0, snapshot?.speed || 0)) {
    drawRect(dash.x * scaleX, dash.y * scaleY, dash.width * scaleX, dash.height * scaleY, hexToRgba(style.lane, 0.65));
  }
}

function drawWorldArt(style, size, snapshot, drawRect, drawPolygon) {
  drawSceneArt(style, size, snapshot, drawRect, drawPolygon);
  drawRoadArt(style, size, snapshot, drawRect);
  drawBeaconArt(style, size, snapshot, drawRect);
}

function drawParts(parts, style, entity, size, scale, drawPolygon, overrides = {}) {
  const width = entity.width * scale;
  const height = entity.height * scale;
  for (const part of parts) {
    const color = overrides[part.tone] || style[part.tone] || style.accent;
    drawPolygon(toPixels(part.points, entity.x, entity.y, width, height, size.width, size.height), hexToRgba(color, part.alpha));
  }
}

function drawPlayerArt(style, player, size, drawRect, drawPolygon, snapshot) {
  const laneOffset = player.y - laneY(player.lane);
  const parts = getPlayerParts(style.form, { elapsed: snapshot?.elapsed || 0, laneOffset });
  drawParts(parts, style, player, size, style.formScale, drawPolygon);
  if (style.equipment === 'equipment-visor') {
    const playerWidth = player.width * style.formScale;
    const playerHeight = player.height * style.formScale;
    drawRect((player.x - playerWidth * 0.7) * size.width, (player.y - playerHeight * 0.68) * size.height, playerWidth * 0.18 * size.width, playerHeight * 1.36 * size.height, hexToRgba(style.lane, 0.85));
  }
}

function drawObstacleArt(style, obstacle, size, drawRect, drawPolygon) {
  drawParts(getGlitchParts(obstacle.kind), style, obstacle, size, 1, drawPolygon, { glitch: getGlitchTone(obstacle.kind) });
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
      drawWorldArt(style, size, snapshot, drawRect, drawPolygon);
      drawPlayerArt(style, snapshot.player, size, drawRect, drawPolygon, snapshot);
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
      drawWorldArt(style, size, snapshot, drawRect, drawPolygon);
      drawPlayerArt(style, snapshot.player, size, drawRect, drawPolygon, snapshot);
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

const REWARD_CHORD = Object.freeze([523.25, 659.25, 783.99, 1046.5]);

export function createAudio() {
  let context = null;
  let muted = false;
  const tone = (frequency, duration, delay = 0) => {
    if (muted || !context) return;
    try {
      const startAt = context.currentTime + delay;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.035, startAt);
      gain.gain.exponentialRampToValueAtTime(0.001, startAt + duration);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start(startAt);
      oscillator.stop(startAt + duration);
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
    milestoneNear() { tone(660, 0.06); },
    reward() {
      REWARD_CHORD.forEach((frequency, index) => tone(frequency, 0.18, index * 0.075));
    },
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
  sdk = createPlatformMock(),
  loadStrings = async () => LOCAL_STRINGS,
  compileShaders = async () => {},
  onReady = () => {},
  documentRef = globalThis.document,
  windowRef = globalThis.window
} = {}) {
  const controller = createPlatformController(sdk);
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
    signalMeter: documentRef.querySelector('#signal-meter'),
    signalFill: documentRef.querySelector('#signal-fill'),
    signalChip: documentRef.querySelector('#signal-chip'),
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
  const svgTag = (name, attrs) => {
    const node = documentRef.createElementNS('http://www.w3.org/2000/svg', name);
    for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, String(value));
    return node;
  };
  const createSwatch = (type, id) => {
    const svg = svgTag('svg', { viewBox: '0 0 40 40', 'aria-hidden': 'true', focusable: 'false' });
    const palette = getThemePalette(latestProgression.equipped.theme);
    if (type === 'form') {
      svg.append(svgTag('polygon', {
        points: getPlayerHull(id).map(([x, y]) => `${20 + x * 34},${20 + y * 34}`).join(' '),
        fill: getSkinColor(latestProgression.equipped.skin)
      }));
      svg.append(svgTag('circle', { cx: 26, cy: 20, r: 4.4, fill: palette.playerAccent }));
      svg.append(svgTag('circle', { cx: 27, cy: 20, r: 2, fill: palette.background }));
    } else if (type === 'skin') {
      svg.append(svgTag('circle', { cx: 20, cy: 20, r: 14, fill: getSkinColor(id) }));
      svg.append(svgTag('circle', { cx: 20, cy: 20, r: 14, fill: 'none', stroke: palette.background, 'stroke-width': 2 }));
    } else if (type === 'theme') {
      const tones = getThemePalette(id);
      [tones.background, tones.accent, tones.lane, tones.playerAccent].forEach((tone, index) => {
        svg.append(svgTag('rect', { x: 6, y: 6 + index * 7.5, width: 28, height: 6, rx: 2, fill: tone }));
      });
    } else {
      svg.append(svgTag('rect', { x: 8, y: 12, width: 24, height: 16, rx: 4, fill: palette.accent }));
      svg.append(svgTag('rect', { x: 12, y: 17, width: 16, height: 6, rx: 3, fill: palette.lane }));
    }
    return svg;
  };
  const createLockIcon = () => {
    const svg = svgTag('svg', { viewBox: '0 0 24 24', 'aria-hidden': 'true', focusable: 'false', class: 'loadout-lock' });
    svg.append(svgTag('rect', { x: 5, y: 10.5, width: 14, height: 10, rx: 2.5, fill: '#fbe047' }));
    svg.append(svgTag('path', { d: 'M8.4 10.5V8.2a3.6 3.6 0 0 1 7.2 0v2.3', fill: 'none', stroke: '#fbe047', 'stroke-width': 2.2, 'stroke-linecap': 'round' }));
    svg.append(svgTag('circle', { cx: 12, cy: 15.4, r: 1.7, fill: '#0a0d24' }));
    return svg;
  };
  const renderLoadout = () => {
    if (!elements.loadoutList) return;
    elements.loadoutList.replaceChildren();
    for (const section of getLoadoutSections(latestProgression)) {
      const group = documentRef.createElement('section');
      group.className = 'loadout-group';
      const heading = documentRef.createElement('h4');
      heading.className = 'loadout-group-title';
      heading.textContent = rewardTypeName(section.type);
      group.append(heading);
      const grid = documentRef.createElement('div');
      grid.className = 'loadout-grid';
      for (const item of section.items) {
        const name = rewardName(item.id);
        const card = documentRef.createElement('button');
        card.type = 'button';
        card.className = 'loadout-item';
        card.dataset.type = item.type;
        card.dataset.equipped = String(item.equipped);
        card.dataset.locked = String(!item.unlocked);
        const swatch = documentRef.createElement('span');
        swatch.className = 'loadout-swatch';
        swatch.append(createSwatch(item.type, item.id));
        if (!item.unlocked) swatch.append(createLockIcon());
        const text = documentRef.createElement('span');
        text.className = 'loadout-text';
        const title = documentRef.createElement('span');
        title.className = 'loadout-name';
        title.textContent = name;
        const status = documentRef.createElement('span');
        status.className = 'loadout-status';
        status.textContent = item.equipped
          ? copy('equipped')
          : item.unlocked ? copy('equip') : `${item.threshold} ${copy('seconds')}`;
        text.append(title, status);
        card.append(swatch, text);
        if (!item.unlocked) {
          card.disabled = true;
          card.setAttribute('aria-disabled', 'true');
          card.setAttribute('aria-label', `${name}. ${item.threshold} ${copy('seconds')}`);
        } else if (item.equipped) {
          card.disabled = true;
          card.setAttribute('aria-current', 'true');
          card.setAttribute('aria-label', `${name}. ${copy('equipped')}`);
        } else {
          card.dataset.action = 'equip';
          card.dataset.rewardId = item.id;
          card.setAttribute('aria-label', `${name}. ${copy('equip')}`);
        }
        grid.append(card);
      }
      group.append(grid);
      elements.loadoutList.append(group);
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
    setVisible(elements.signalMeter, state === GAME_STATES.PLAYING);
    setVisible(elements.mobileControls, state === GAME_STATES.PLAYING);
    if (elements.shell) elements.shell.dataset.state = state;
    syncProgressionUi();
  };
  const refreshHud = snapshot => {
    if (elements.score) elements.score.textContent = String(snapshot.score);
    const objective = getRunObjective(snapshot.elapsed, {
      unlocked: latestProgression.unlocked,
      bestSeconds: Math.max(bestScore, snapshot.score) / 10
    });
    const rewarding = snapshot.elapsed < rewardHoldUntil && lastEarned;
    const shown = rewarding ? lastEarned : objective;
    if (elements.signalFill) elements.signalFill.style.width = `${Math.round((rewarding ? 1 : objective.ratio) * 100)}%`;
    if (elements.signalChip) elements.signalChip.dataset.type = shown.type;
    if (elements.signalMeter) {
      elements.signalMeter.dataset.state = rewarding ? 'reward' : objective.kind === 'record' ? 'record' : objective.imminent ? 'imminent' : 'tracking';
      elements.signalMeter.setAttribute('aria-label', rewarding
        ? replaceTokens(copy('unlocked'), { label: rewardName(lastEarned.id) })
        : objective.kind === 'record'
          ? copy('runComplete')
          : replaceTokens(copy('nextMilestone'), { label: objective.kind === 'best' ? copy('best') : rewardName(objective.id), seconds: Math.ceil(objective.target) }));
    }
    const beat = Math.floor(objective.remaining);
    if (objective.imminent && objective.kind !== 'record' && beat !== lastBeat && beat >= 0 && beat <= 2) {
      lastBeat = beat;
      audio.milestoneNear();
    }
    if (!objective.imminent) lastBeat = -1;
    if (elements.playingHint && !elements.playingHint.hidden && (laneSwitches >= 2 || snapshot.elapsed >= 6)) {
      setVisible(elements.playingHint, false);
    }
  };
  const switchLane = () => {
    audio.unlock();
    audio.laneChange();
    laneSwitches += 1;
    world.update(0, { switchLane: true });
  };
  const startFromInput = async () => {
    audio.unlock();
    const wasReady = machine.getState() === GAME_STATES.READY;
    await machine.inputStart();
    if (wasReady) world.reset();
    if (machine.getState() === GAME_STATES.PLAYING) {
      runCompleted = false;
      laneSwitches = 0;
      rewardHoldUntil = 0;
      lastEarned = null;
      lastBeat = -1;
    }
    syncUi();
  };
  const restart = async () => {
    await machine.restartAfterGameOver();
    world.reset();
    laneSwitches = 0;
    rewardHoldUntil = 0;
    lastEarned = null;
    lastBeat = -1;
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
  let laneSwitches = 0;
  let rewardHoldUntil = 0;
  let lastEarned = null;
  let lastBeat = -1;
  let lastTime = 0;
  const frame = timestamp => {
    const dt = lastTime ? (timestamp - lastTime) / 1000 : 0;
    lastTime = timestamp;
    if (machine.getState() === GAME_STATES.PLAYING) {
      world.update(dt);
      const snapshot = world.snapshot();
      const earned = progressionStore.applyMilestones(snapshot.elapsed);
      if (earned.newlyUnlocked.length) {
        latestProgressionResult = earned;
        latestProgression = earned.progression;
        rewardHoldUntil = snapshot.elapsed + REWARD_HOLD;
        lastEarned = earned.newlyUnlocked[earned.newlyUnlocked.length - 1];
        audio.reward();
        syncProgressionUi();
      }
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

// Aliases mantidos para a integração Poki, que consome estes nomes.
export const createPokiMock = createPlatformMock;
export const createPokiController = createPlatformController;

export function readPlatformProfile(documentRef = globalThis.document) {
  const declared = documentRef?.documentElement?.dataset?.platform;
  return PLATFORM_PROFILES.includes(declared) ? declared : 'neutral';
}

// O perfil neutro não expõe global de nenhum portal. CrazyGames proíbe branding
// de outros portais no jogo, e a Poki injeta o SDK real pela própria plataforma.
export function exposePlatformGlobals(sdk, profile, target = globalThis) {
  if (profile !== 'poki') return null;
  target.PokiSDK = sdk;
  return sdk;
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  const platformSdk = createPlatformMock({ commercialBreakDuration: 420 });
  const profile = readPlatformProfile(document);
  exposePlatformGlobals(platformSdk, profile, globalThis);
  exposePlatformGlobals(platformSdk, profile, window);
  window.addEventListener('DOMContentLoaded', () => {
    bootstrap({ sdk: platformSdk }).catch(() => undefined);
  }, { once: true });
}
