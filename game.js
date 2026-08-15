const LOGICAL_SIZES = Object.freeze([
  { width: 640, height: 360 },
  { width: 836, height: 470 },
  { width: 1031, height: 580 }
]);

const LOCAL_STRINGS = Object.freeze({
  en: { title: 'Neon Dodge', start: 'Tap to start', hint: 'Switch lanes. Stay alive.', paused: 'PAUSED', takeABreath: 'Take a breath.', menu: 'MENU', readyWhen: 'Ready when you are.', runComplete: 'RUN COMPLETE', oneMore: 'One more?', pause: 'Pause', resume: 'Resume', restart: 'Restart', score: 'Score', best: 'Best', storageNotice: 'This session score will not be saved.' },
  'pt-BR': { title: 'Neon Dodge', start: 'Toque para começar', hint: 'Troque de faixa. Continue vivo.', paused: 'PAUSADO', takeABreath: 'Respire um pouco.', menu: 'MENU', readyWhen: 'Quando quiser, estamos prontos.', runComplete: 'FIM DA RODADA', oneMore: 'Mais uma?', pause: 'Pausar', resume: 'Continuar', restart: 'Reiniciar', score: 'Pontos', best: 'Recorde', storageNotice: 'A pontuação desta sessão não será salva.' },
  es: { title: 'Neon Dodge', start: 'Toca para empezar', pause: 'Pausa', resume: 'Continuar', restart: 'Reiniciar', score: 'Puntuación', best: 'Mejor', storageNotice: 'La puntuación de esta sesión no se guardará.' },
  fr: { title: 'Neon Dodge', start: 'Touchez pour commencer', pause: 'Pause', resume: 'Reprendre', restart: 'Recommencer', score: 'Score', best: 'Record', storageNotice: 'Le score de cette session ne sera pas sauvegardé.' },
  it: { title: 'Neon Dodge', start: 'Tocca per iniziare', pause: 'Pausa', resume: 'Riprendi', restart: 'Ricomincia', score: 'Punteggio', best: 'Record', storageNotice: 'Il punteggio di questa sessione non verrà salvato.' },
  de: { title: 'Neon Dodge', start: 'Tippen zum Starten', pause: 'Pause', resume: 'Fortsetzen', restart: 'Neustart', score: 'Punkte', best: 'Bestwert', storageNotice: 'Der Punktestand dieser Sitzung wird nicht gespeichert.' },
  tr: { title: 'Neon Dodge', start: 'Başlamak için dokun', pause: 'Duraklat', resume: 'Devam et', restart: 'Yeniden başlat', score: 'Skor', best: 'En iyi', storageNotice: 'Bu oturumun skoru kaydedilmeyecek.' }
});

export const GAME_STATES = Object.freeze({
  BOOTING: 'Booting',
  READY: 'Ready',
  PLAYING: 'Playing',
  PAUSED: 'Paused',
  MENU: 'Menu',
  GAME_OVER: 'Game Over'
});

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

export function createGameWorld({ random = Math.random } = {}) {
  const player = { x: 0.16, y: laneY(0), width: 0.07, height: 0.12, lane: 0, targetLane: 0 };
  const obstacles = [];
  let elapsed = 0;
  let score = 0;
  let speed = 0.34;
  let spawnTimer = 0.6;
  let running = false;

  const spawnObstacle = ({ x = 1.12, lane = random() > 0.5 ? 1 : 0 } = {}) => {
    obstacles.push({ x, y: laneY(lane), width: 0.08, height: 0.16, lane });
  };

  return {
    reset({ obstacleX, obstacleLane } = {}) {
      obstacles.length = 0;
      player.lane = 0;
      player.targetLane = 0;
      player.y = laneY(0);
      elapsed = 0;
      score = 0;
      speed = 0.34;
      spawnTimer = 0.6;
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
      speed = 0.34 + Math.min(0.46, elapsed * 0.012);
      spawnTimer -= safeDt;
      if (spawnTimer <= 0) {
        spawnObstacle();
        spawnTimer = Math.max(0.48, 1.08 - elapsed * 0.006);
      }
      for (const obstacle of obstacles) obstacle.x -= speed * safeDt;
      while (obstacles.length && obstacles[0].x < -0.2) obstacles.shift();
    },
    snapshot() {
      return { elapsed, score, speed, player: { ...player }, obstacles: obstacles.map(obstacle => ({ ...obstacle })) };
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

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
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

  return {
    resize() {
      const cssWidth = Math.max(320, canvas.clientWidth || 640);
      Object.assign(size, selectLogicalSize(cssWidth));
      const dpr = Math.min(2, globalThis.devicePixelRatio || 1);
      canvas.width = Math.round(size.width * dpr);
      canvas.height = Math.round(size.height * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    },
    render(snapshot) {
      gl.useProgram(program);
      gl.uniform2f(resolutionLocation, size.width, size.height);
      gl.clearColor(0.025, 0.035, 0.09, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      const scaleX = size.width;
      const scaleY = size.height;
      drawRect(0, scaleY * 0.49, scaleX, scaleY * 0.02, [0.18, 0.24, 0.48, 1]);
      drawRect(0, scaleY * 0.35, scaleX, scaleY * 0.008, [0.12, 0.78, 0.96, 0.7]);
      drawRect(0, scaleY * 0.63, scaleX, scaleY * 0.008, [0.12, 0.78, 0.96, 0.7]);
      const player = snapshot.player;
      drawRect((player.x - player.width / 2) * scaleX, (player.y - player.height / 2) * scaleY, player.width * scaleX, player.height * scaleY, [0.98, 0.88, 0.28, 1]);
      for (const obstacle of snapshot.obstacles) {
        drawRect((obstacle.x - obstacle.width / 2) * scaleX, (obstacle.y - obstacle.height / 2) * scaleY, obstacle.width * scaleX, obstacle.height * scaleY, [0.98, 0.25, 0.42, 1]);
      }
    },
    destroy() { gl.deleteBuffer(buffer); gl.deleteProgram(program); }
  };
}

function createCanvasRenderer(canvas, ctx) {
  const size = { ...LOGICAL_SIZES[2] };
  return {
    resize() {
      Object.assign(size, selectLogicalSize(Math.max(320, canvas.clientWidth || 640)));
      const dpr = Math.min(2, globalThis.devicePixelRatio || 1);
      canvas.width = Math.round(size.width * dpr);
      canvas.height = Math.round(size.height * dpr);
      ctx.setTransform(canvas.width / size.width, 0, 0, canvas.height / size.height, 0, 0);
    },
    render(snapshot) {
      ctx.fillStyle = '#080b22';
      ctx.fillRect(0, 0, size.width, size.height);
      ctx.fillStyle = '#24306b';
      ctx.fillRect(0, size.height * 0.49, size.width, size.height * 0.02);
      ctx.fillStyle = '#20c7f5';
      ctx.fillRect(0, size.height * 0.35, size.width, size.height * 0.008);
      ctx.fillRect(0, size.height * 0.63, size.width, size.height * 0.008);
      const player = snapshot.player;
      ctx.fillStyle = '#fbe047';
      ctx.fillRect((player.x - player.width / 2) * size.width, (player.y - player.height / 2) * size.height, player.width * size.width, player.height * size.height);
      ctx.fillStyle = '#fa416b';
      for (const obstacle of snapshot.obstacles) ctx.fillRect((obstacle.x - obstacle.width / 2) * size.width, (obstacle.y - obstacle.height / 2) * size.height, obstacle.width * size.width, obstacle.height * size.height);
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
  const notifyStorage = key => {
    const notice = documentRef.querySelector('#storage-notice');
    if (notice && key === 'sessionNotPersisted') {
      notice.textContent = text.storageNotice || LOCAL_STRINGS.en.storageNotice;
      setVisible(notice, true);
    }
  };
  const storage = createStorageAdapter(getStorage(windowRef), notifyStorage);
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
    pauseButton: documentRef.querySelector('#pause-button'),
    restartButton: documentRef.querySelector('#restart-button')
  };

  documentRef.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.dataset.i18n;
    if (text[key]) element.textContent = text[key];
  });
  if (elements.title) elements.title.textContent = text.title || LOCAL_STRINGS.en.title;
  if (elements.start) elements.start.textContent = text.start || LOCAL_STRINGS.en.start;
  if (elements.pauseButton) {
    elements.pauseButton.textContent = 'Ⅱ';
    elements.pauseButton.setAttribute('aria-label', text.pause || LOCAL_STRINGS.en.pause);
  }
  if (elements.restartButton) elements.restartButton.textContent = text.restart || LOCAL_STRINGS.en.restart;
  if (elements.best) elements.best.textContent = String(bestScore);

  await machine.finishLoading();
  setVisible(elements.ready, true);
  setVisible(elements.pause, false);
  setVisible(elements.menu, false);
  setVisible(elements.gameOver, false);
  await onReady();

  const syncUi = () => {
    const state = machine.getState();
    setVisible(elements.ready, state === GAME_STATES.READY);
    setVisible(elements.pause, state === GAME_STATES.PAUSED);
    setVisible(elements.menu, state === GAME_STATES.MENU);
    setVisible(elements.gameOver, state === GAME_STATES.GAME_OVER);
    if (elements.shell) elements.shell.dataset.state = state;
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
    syncUi();
  };
  const restart = async () => {
    await machine.restartAfterGameOver();
    world.reset();
    syncUi();
  };
  const handlePointer = event => {
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
    const state = machine.getState();
    if (state === GAME_STATES.PLAYING) switchLane();
    else if (state === GAME_STATES.GAME_OVER) restart();
    else startFromInput();
  };
  documentRef.addEventListener('pointerdown', handlePointer, { passive: true });
  windowRef?.addEventListener('keydown', event => {
    if (event.repeat) return;
    if (['Space', 'ArrowUp', 'ArrowDown', 'Escape', 'KeyP'].includes(event.code)) event.preventDefault();
    const state = machine.getState();
    if (event.code === 'Escape' || event.code === 'KeyP') {
      if (state === GAME_STATES.PLAYING) machine.pause().then(syncUi);
      else if (state === GAME_STATES.PAUSED || state === GAME_STATES.MENU) startFromInput();
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

  let lastTime = 0;
  const frame = timestamp => {
    const dt = lastTime ? (timestamp - lastTime) / 1000 : 0;
    lastTime = timestamp;
    if (machine.getState() === GAME_STATES.PLAYING) {
      world.update(dt);
      const snapshot = world.snapshot();
      refreshHud(snapshot);
      if (world.isCollision()) {
        audio.collision();
        world.stop();
        storage.writeBestScore(Math.max(bestScore, snapshot.score));
        if (elements.best) elements.best.textContent = String(Math.max(bestScore, snapshot.score));
        machine.die().then(syncUi);
      }
    }
    renderer.render(world.snapshot());
    windowRef?.requestAnimationFrame?.(frame);
  };
  windowRef?.requestAnimationFrame?.(frame);
  return { controller, machine, world, renderer, storage };
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  window.PokiSDK = createPokiMock({ commercialBreakDuration: 420 });
  window.addEventListener('DOMContentLoaded', () => {
    bootstrap({ sdk: window.PokiSDK }).catch(() => undefined);
  }, { once: true });
}
