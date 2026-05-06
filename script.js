/* ── WALLPAPER ───────────────────────────────────── */
// Add your wallpaper filenames here — drop them in images/wallpapers/
const WALLPAPERS = [
  'bg1.jpg',
  //'bg2.jpg',
  //'bg3.jpg',
  'bg4.jpg',
  'bg5.jpg',
  //'bg6.jpg',
  'bg7.jpg',
  'bg8.jpg',
  'bg9.jpg',
  // just keep adding
];
const WALLPAPER_BASE = 'images/wallpapers/';

(function setWallpaper() {
  if (!WALLPAPERS.length) return;
  const pick = WALLPAPERS[Math.floor(Math.random() * WALLPAPERS.length)];
  document.documentElement.style.setProperty(
    '--wallpaper', `url('${WALLPAPER_BASE}${pick}')`
  );
})();


/* ── GALLERY ──────────────────────────────────────── */
// ↓ Set your folder once, then just add filenames below
const GALLERY_BASE = 'images/gallery/';
// Add filenames only — e.g. 'photo1.jpg', 'sunset.jpg'
const GALLERY_FILENAMES = [
  'photo1.jpg',
  'photo2.jpg',
  'photo3.jpg',
  'photo4.jpg',
  'photo5.jpg',
  'photo6.jpg',
  'photo7.jpg',
  'photo8.jpg'
];
const GALLERY_PHOTOS_FULL = GALLERY_FILENAMES.map(f => GALLERY_BASE + f);

// ↓ OR keep using full paths directly (both work):
// const GALLERY_PHOTOS = ['images/gallery/photo1.jpg', ...]
//const GALLERY_PHOTOS = [
//  'images/gallery/photo1.jpg',
//  'images/gallery/photo2.jpg',
//  'images/gallery/photo3.jpg'
//];

const galleryOverlay  = document.getElementById('galleryOverlay');
const galleryGrid     = document.getElementById('galleryGrid');
const galleryClose    = document.getElementById('galleryClose');
const lightboxOverlay = document.getElementById('lightboxOverlay');
const lightboxImg     = document.getElementById('lightboxImg');
const lightboxClose   = document.getElementById('lightboxClose');
const lbPrev          = document.getElementById('lbPrev');
const lbNext          = document.getElementById('lbNext');
let lbIndex = 0;

function buildGallery() {
  const photos = GALLERY_PHOTOS_FULL;
  if (photos.length === 0) return;
  galleryGrid.innerHTML = '';
  photos.forEach((src, i) => {
    const div = document.createElement('div');
    div.className = 'gallery-thumb';
    const img = document.createElement('img');
    img.src = src; img.alt = `Photo ${i+1}`;
    img.loading = 'lazy';
    div.appendChild(img);
    div.addEventListener('click', () => openLightbox(i, photos));
    galleryGrid.appendChild(div);
  });
}

function openLightbox(i, photos) {
  lbIndex = i;
  lightboxImg.src = photos[i];
  lightboxImg._photos = photos;
  openOverlay(lightboxOverlay);
  lbPrev.style.display = photos.length > 1 ? '' : 'none';
  lbNext.style.display = photos.length > 1 ? '' : 'none';
}

lbPrev.addEventListener('click', () => {
  const a = lightboxImg._photos || GALLERY_PHOTOS_FULL;
  lbIndex = (lbIndex - 1 + a.length) % a.length;
  lightboxImg.src = a[lbIndex];
});
lbNext.addEventListener('click', () => {
  const a = lightboxImg._photos || GALLERY_PHOTOS_FULL;
  lbIndex = (lbIndex + 1) % a.length;
  lightboxImg.src = a[lbIndex];
});
lightboxClose.addEventListener('click', () => closeOverlay(lightboxOverlay));
lightboxOverlay.addEventListener('click', e => { if (e.target === lightboxOverlay) closeOverlay(lightboxOverlay); });

// swipe lightbox on mobile
let lbTouchX = 0;
lightboxOverlay.addEventListener('touchstart', e => { lbTouchX = e.touches[0].clientX; }, { passive: true });
lightboxOverlay.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - lbTouchX;
  if (Math.abs(dx) < 40) return;
  if (dx < 0) lbNext.click(); else lbPrev.click();
}, { passive: true });

galleryClose.addEventListener('click', () => closeOverlay(galleryOverlay));
galleryOverlay.addEventListener('click', e => { if (e.target === galleryOverlay) closeOverlay(galleryOverlay); });


/* ── DATE ───────────────────────────────────────── */
(function () {
  const d = new Date();
  document.getElementById('dateMonth').textContent =
    d.toLocaleString('en-US', { month: 'short' });
  document.getElementById('dateDay').textContent = d.getDate();
  document.getElementById('dateWeekday').textContent =
    d.toLocaleDateString('en-US', { weekday: 'short' });
  document.getElementById('dateYear').textContent = d.getFullYear();
})();

/* ── MUSIC PLAYER ───────────────────────────────── */
const tracks = [
  { name: "XXXX — Lull", src: "music/Lull - WithoutDrums.mp3" },
  { name: "YYYY — Loop", src: "music/Loop - SoftCore.mp3" },
  { name: "FFFF — Flaw", src: "music/flaw - lullaby.mp3" }
];

let currentTrack = 0;
let isPlaying = false;

const audio         = document.getElementById('audioPlayer');
const playBtn       = document.getElementById('playPauseBtn');
const switchBtn     = document.getElementById('switchTrackBtn');
const trackName     = document.getElementById('trackName');
const vizBars       = document.querySelector('.visualizer');
const trackListBtn  = document.getElementById('trackListBtn');
const trackDropdown = document.getElementById('trackDropdown');

/* ── DROPDOWN ───────────────────────────────────── */
function buildDropdown() {
  trackDropdown.innerHTML = '';
  tracks.forEach((t, i) => {
    const item = document.createElement('div');
    item.className = 'track-dropdown-item' + (i === currentTrack ? ' active' : '');
    item.innerHTML = `<span class="track-dot"></span>${t.name}`;
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      setTrack(i);
      play();
      closeDropdown();
    });
    trackDropdown.appendChild(item);
  });
}

function openDropdown() {
  buildDropdown();
  trackDropdown.classList.add('open');
  trackListBtn.classList.add('open');
}

function closeDropdown() {
  trackDropdown.classList.remove('open');
  trackListBtn.classList.remove('open');
}

trackListBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  trackDropdown.classList.contains('open') ? closeDropdown() : openDropdown();
});

document.addEventListener('click', (e) => {
  if (!document.getElementById('musicPlayer').contains(e.target)) closeDropdown();
});

/* ── PLAYBACK ────────────────────────────────────── */
function setTrack(index) {
  currentTrack = ((index % tracks.length) + tracks.length) % tracks.length;
  audio.src = tracks[currentTrack].src;
  trackName.textContent = tracks[currentTrack].name;
}

function play() {
  audio.play().catch(() => {});
  playBtn.innerHTML = '<i class="fas fa-pause"></i>';
  vizBars.classList.remove('paused');
  isPlaying = true;
}

function pause() {
  audio.pause();
  playBtn.innerHTML = '<i class="fas fa-play"></i>';
  vizBars.classList.add('paused');
  isPlaying = false;
}

playBtn.addEventListener('click', () => isPlaying ? pause() : play());

switchBtn.addEventListener('click', () => {
  setTrack(currentTrack + 1);
  play();
});

audio.addEventListener('ended', () => {
  setTrack(currentTrack + 1);
  play();
});

/* double-tap on mobile to switch */
let lastTap = 0;
document.querySelector('.music-player-fixed').addEventListener('touchend', (e) => {
  const now = Date.now();
  if (now - lastTap < 280 && now - lastTap > 0) {
    setTrack(currentTrack + 1);
    play();
  }
  lastTap = now;
});

/* ── CARD MOUSE-TRACKING SHIMMER ──────────────── */
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  });
});

/* ── CARD RIPPLE ON CLICK ─────────────────────── */
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', function (e) {
    const rect = this.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const size = Math.max(rect.width, rect.height);
    ripple.style.cssText = `
      width: ${size}px; height: ${size}px;
      left: ${e.clientX - rect.left - size / 2}px;
      top:  ${e.clientY - rect.top  - size / 2}px;
    `;
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 560);
  });
});

/* ── BIO MODAL ────────────────────────────────────── */
const aboutBtn   = document.getElementById('aboutBtn');
const bioOverlay = document.getElementById('bioOverlay');
const bioClose   = document.getElementById('bioClose');

aboutBtn.addEventListener('click', () => bioOverlay.classList.add('open'));
bioClose.addEventListener('click', () => bioOverlay.classList.remove('open'));
bioOverlay.addEventListener('click', (e) => {
  if (e.target === bioOverlay) bioOverlay.classList.remove('open');
});

/* ══════════════════════════════════════════════════
   PLAY CORNER
══════════════════════════════════════════════════ */

function openOverlay(el)  { el.classList.add('open'); }
function closeOverlay(el) { el.classList.remove('open'); }

const playCornerBtn = document.getElementById('playCornerBtn');
const playOverlay   = document.getElementById('playOverlay');
const playClose     = document.getElementById('playClose');

playCornerBtn.addEventListener('click', () => openOverlay(playOverlay));
playClose.addEventListener('click',     () => closeOverlay(playOverlay));
playOverlay.addEventListener('click', e => { if (e.target === playOverlay) closeOverlay(playOverlay); });

/* ── SNAKE ────────────────────────────────────────── */
const snakeOverlay  = document.getElementById('snakeOverlay');
const snakeBack     = document.getElementById('snakeBack');
const snakeClose    = document.getElementById('snakeClose');
const snakeCanvas   = document.getElementById('snakeCanvas');
const snakeMsg      = document.getElementById('snakeMsg');
const snakeMsgTitle = document.getElementById('snakeMsgTitle');
const snakeMsgSub   = document.getElementById('snakeMsgSub');
const snakeScoreEl  = document.getElementById('snakeScore');

document.getElementById('openSnake').addEventListener('click', () => {
  closeOverlay(playOverlay);
  openOverlay(snakeOverlay);
  initSnakeCanvas();
});
snakeBack.addEventListener('click',  () => { stopSnake(); closeOverlay(snakeOverlay); openOverlay(playOverlay); });
snakeClose.addEventListener('click', () => { stopSnake(); closeOverlay(snakeOverlay); });
snakeOverlay.addEventListener('click', e => { if (e.target === snakeOverlay) { stopSnake(); closeOverlay(snakeOverlay); } });

const CELL = 20;
let snakeGrid, snakeBody, snakeDir, snakeNext, snakeFood, snakeScore, snakeLoop, snakeRunning = false;

function initSnakeCanvas() {
  const size = Math.min(snakeCanvas.parentElement.clientWidth, 480);
  snakeCanvas.width  = size;
  snakeCanvas.height = size;
  snakeGrid = Math.floor(size / CELL);
  showSnakeMsg('SNAKE', 'TAP TO START');
}

function showSnakeMsg(title, sub) {
  snakeMsgTitle.textContent = title;
  snakeMsgSub.textContent   = sub;
  snakeMsg.classList.remove('hidden');
}

snakeMsg.addEventListener('click', startSnake);
snakeMsg.addEventListener('touchend', e => { e.preventDefault(); startSnake(); });

function startSnake() {
  snakeMsg.classList.add('hidden');
  const mid = Math.floor(snakeGrid / 2);
  snakeBody = [{x: mid, y: mid}, {x: mid-1, y: mid}, {x: mid-2, y: mid}];
  snakeDir  = {x: 1, y: 0};
  snakeNext = {x: 1, y: 0};
  snakeScore = 0;
  snakeScoreEl.textContent = 0;
  placeFood();
  snakeRunning = true;
  clearInterval(snakeLoop);
  snakeLoop = setInterval(tickSnake, 130);
}

function stopSnake() {
  snakeRunning = false;
  clearInterval(snakeLoop);
}

function placeFood() {
  let pos;
  do {
    pos = { x: Math.floor(Math.random() * snakeGrid), y: Math.floor(Math.random() * snakeGrid) };
  } while (snakeBody.some(s => s.x === pos.x && s.y === pos.y));
  snakeFood = pos;
}

function tickSnake() {
  snakeDir = { ...snakeNext };
  const head = { x: snakeBody[0].x + snakeDir.x, y: snakeBody[0].y + snakeDir.y };

  if (head.x < 0 || head.x >= snakeGrid || head.y < 0 || head.y >= snakeGrid ||
      snakeBody.some(s => s.x === head.x && s.y === head.y)) {
    stopSnake();
    showSnakeMsg('GAME OVER', `SCORE: ${snakeScore} — TAP TO RETRY`);
    return;
  }

  snakeBody.unshift(head);
  if (head.x === snakeFood.x && head.y === snakeFood.y) {
    snakeScore++;
    snakeScoreEl.textContent = snakeScore;
    placeFood();
  } else {
    snakeBody.pop();
  }
  drawSnake();
}

function drawSnake() {
  const ctx = snakeCanvas.getContext('2d');
  const cs  = snakeCanvas.width / snakeGrid;
  ctx.clearRect(0, 0, snakeCanvas.width, snakeCanvas.height);

  ctx.strokeStyle = 'rgba(255,255,255,0.03)';
  ctx.lineWidth = 0.5;
  for (let i = 0; i <= snakeGrid; i++) {
    ctx.beginPath(); ctx.moveTo(i*cs, 0); ctx.lineTo(i*cs, snakeCanvas.height); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, i*cs); ctx.lineTo(snakeCanvas.width, i*cs); ctx.stroke();
  }

  const fx = snakeFood.x * cs + cs/2, fy = snakeFood.y * cs + cs/2, fr = cs * 0.38;
  ctx.fillStyle = '#f0c97a';
  ctx.shadowColor = '#f0c97a'; ctx.shadowBlur = 10;
  ctx.beginPath(); ctx.arc(fx, fy, fr, 0, Math.PI*2); ctx.fill();
  ctx.shadowBlur = 0;

  snakeBody.forEach((seg, i) => {
    const alpha = 1 - (i / snakeBody.length) * 0.55;
    ctx.fillStyle = i === 0 ? `rgba(245,130,74,${alpha})` : `rgba(245,130,74,${alpha * 0.75})`;
    ctx.shadowColor = i === 0 ? 'rgba(245,130,74,0.6)' : 'transparent';
    ctx.shadowBlur  = i === 0 ? 8 : 0;
    const pad = i === 0 ? 1 : 2;
    roundRect(ctx, seg.x*cs+pad, seg.y*cs+pad, cs-pad*2, cs-pad*2, 4);
    ctx.fill();
  });
  ctx.shadowBlur = 0;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x+r, y); ctx.lineTo(x+w-r, y); ctx.quadraticCurveTo(x+w,y,x+w,y+r);
  ctx.lineTo(x+w,y+h-r); ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  ctx.lineTo(x+r,y+h); ctx.quadraticCurveTo(x,y+h,x,y+h-r);
  ctx.lineTo(x,y+r); ctx.quadraticCurveTo(x,y,x+r,y);
  ctx.closePath();
}

document.addEventListener('keydown', e => {
  if (!snakeRunning) return;
  const map = { ArrowUp:{x:0,y:-1}, ArrowDown:{x:0,y:1}, ArrowLeft:{x:-1,y:0}, ArrowRight:{x:1,y:0},
                w:{x:0,y:-1}, s:{x:0,y:1}, a:{x:-1,y:0}, d:{x:1,y:0} };
  const d = map[e.key];
  if (!d) return;
  if (d.x !== -snakeDir.x || d.y !== -snakeDir.y) snakeNext = d;
  if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) e.preventDefault();
});

document.querySelectorAll('.dpad-btn').forEach(btn => {
  const handler = e => {
    e.preventDefault();
    if (!snakeRunning) return;
    const map = { UP:{x:0,y:-1}, DOWN:{x:0,y:1}, LEFT:{x:-1,y:0}, RIGHT:{x:1,y:0} };
    const d = map[btn.dataset.dir];
    if (d && (d.x !== -snakeDir.x || d.y !== -snakeDir.y)) snakeNext = d;
  };
  btn.addEventListener('touchstart', handler, { passive: false });
  btn.addEventListener('mousedown',  handler);
});

let touchStartX = 0, touchStartY = 0;
snakeCanvas.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; touchStartY = e.touches[0].clientY; }, { passive: true });
snakeCanvas.addEventListener('touchend', e => {
  if (!snakeRunning) return;
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;
  if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
  let d;
  if (Math.abs(dx) > Math.abs(dy)) d = dx > 0 ? {x:1,y:0} : {x:-1,y:0};
  else                              d = dy > 0 ? {x:0,y:1} : {x:0,y:-1};
  if (d.x !== -snakeDir.x || d.y !== -snakeDir.y) snakeNext = d;
}, { passive: true });

/* ── DRAW ─────────────────────────────────────────── */
const drawOverlay = document.getElementById('drawOverlay');
const drawBack    = document.getElementById('drawBack');
const drawClose   = document.getElementById('drawClose');
const drawCanvas  = document.getElementById('drawCanvas');
const drawColorEl = document.getElementById('drawColor');
const drawSizeEl  = document.getElementById('drawSize');
const drawEraser  = document.getElementById('drawEraser');
const drawClearEl = document.getElementById('drawClear');

let drawCtx, drawing = false, erasing = false, lastX = 0, lastY = 0;

document.getElementById('openDraw').addEventListener('click', () => {
  closeOverlay(playOverlay);
  openOverlay(drawOverlay);
  initDrawCanvas();
});
drawBack.addEventListener('click',  () => { closeOverlay(drawOverlay); openOverlay(playOverlay); });
drawClose.addEventListener('click', () => closeOverlay(drawOverlay));
drawOverlay.addEventListener('click', e => { if (e.target === drawOverlay) closeOverlay(drawOverlay); });

function initDrawCanvas() {
  const size = Math.min(drawCanvas.parentElement.clientWidth, 480);
  drawCanvas.width  = size;
  drawCanvas.height = size;
  drawCtx = drawCanvas.getContext('2d');
  drawCtx.fillStyle = '#0a0909';
  drawCtx.fillRect(0, 0, size, size);
}

function getPos(e) {
  const rect = drawCanvas.getBoundingClientRect();
  const scaleX = drawCanvas.width  / rect.width;
  const scaleY = drawCanvas.height / rect.height;
  const src = e.touches ? e.touches[0] : e;
  return { x: (src.clientX - rect.left) * scaleX, y: (src.clientY - rect.top) * scaleY };
}

function startDraw(e) {
  e.preventDefault();
  drawing = true;
  const p = getPos(e);
  lastX = p.x; lastY = p.y;
  drawCtx.beginPath();
  drawCtx.arc(p.x, p.y, (drawSizeEl.value/2) * (erasing ? 4 : 1), 0, Math.PI*2);
  drawCtx.fillStyle = erasing ? '#0a0909' : drawColorEl.value;
  drawCtx.fill();
}
function moveDraw(e) {
  if (!drawing) return;
  e.preventDefault();
  const p = getPos(e);
  drawCtx.beginPath();
  drawCtx.moveTo(lastX, lastY);
  drawCtx.lineTo(p.x, p.y);
  drawCtx.strokeStyle = erasing ? '#0a0909' : drawColorEl.value;
  drawCtx.lineWidth   = drawSizeEl.value * (erasing ? 4 : 1);
  drawCtx.lineCap = 'round';
  drawCtx.lineJoin = 'round';
  drawCtx.stroke();
  lastX = p.x; lastY = p.y;
}
function endDraw() { drawing = false; }

drawCanvas.addEventListener('mousedown',  startDraw);
drawCanvas.addEventListener('mousemove',  moveDraw);
drawCanvas.addEventListener('mouseup',    endDraw);
drawCanvas.addEventListener('mouseleave', endDraw);
drawCanvas.addEventListener('touchstart', startDraw, { passive: false });
drawCanvas.addEventListener('touchmove',  moveDraw,  { passive: false });
drawCanvas.addEventListener('touchend',   endDraw);

drawEraser.addEventListener('click', () => {
  erasing = !erasing;
  drawEraser.classList.toggle('active', erasing);
});
drawClearEl.addEventListener('click', () => {
  drawCtx.fillStyle = '#0a0909';
  drawCtx.fillRect(0, 0, drawCanvas.width, drawCanvas.height);
});

/* ── ERROR 404 ────────────────────────────────────── */
const errOverlay = document.getElementById('errOverlay');
const errBack    = document.getElementById('errBack');
const errClose   = document.getElementById('errClose');
const errDismiss = document.getElementById('errDismiss');

document.getElementById('openErr').addEventListener('click', () => {
  closeOverlay(playOverlay);
  openOverlay(errOverlay);
});
errBack.addEventListener('click',    () => { closeOverlay(errOverlay); openOverlay(playOverlay); });
errClose.addEventListener('click',   () => closeOverlay(errOverlay));
errDismiss.addEventListener('click', () => closeOverlay(errOverlay));
errOverlay.addEventListener('click', e => { if (e.target === errOverlay) closeOverlay(errOverlay); });

/* ══════════════════════════════════════════════════
   ESSENTIAL BUTTON
══════════════════════════════════════════════════ */
const essWrapper = document.getElementById('essWrapper');
const essMainBtn = document.getElementById('essMainBtn');
const essGallery = document.getElementById('essGallery');
const essAboutMe = document.getElementById('essAboutMe');
const essLife    = document.getElementById('essLife');

essMainBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  essWrapper.classList.toggle('open');
});
document.addEventListener('click', (e) => {
  if (!essWrapper.contains(e.target)) essWrapper.classList.remove('open');
});

/* ── ABOUT ME (Skills / Hobbies / Favs) ──────────── */
const aboutMeOverlay = document.getElementById('aboutMeOverlay');
const aboutMeClose   = document.getElementById('aboutMeClose');
const skillsOverlay  = document.getElementById('skillsOverlay');
const hobbiesOverlay = document.getElementById('hobbiesOverlay');
const favsOverlay    = document.getElementById('favsOverlay');

essGallery.addEventListener('click', () => {
  essWrapper.classList.remove('open');
  buildGallery();
  openOverlay(galleryOverlay);
});

essAboutMe.addEventListener('click', () => {
  essWrapper.classList.remove('open');
  openOverlay(aboutMeOverlay);
});
aboutMeClose.addEventListener('click',  () => closeOverlay(aboutMeOverlay));
aboutMeOverlay.addEventListener('click', e => { if (e.target === aboutMeOverlay) closeOverlay(aboutMeOverlay); });

document.getElementById('openSkills').addEventListener('click', () => { closeOverlay(aboutMeOverlay); openOverlay(skillsOverlay); });
document.getElementById('skillsBack').addEventListener('click', () => { closeOverlay(skillsOverlay); openOverlay(aboutMeOverlay); });
document.getElementById('skillsClose').addEventListener('click', () => closeOverlay(skillsOverlay));
skillsOverlay.addEventListener('click', e => { if (e.target === skillsOverlay) closeOverlay(skillsOverlay); });

document.getElementById('openHobbies').addEventListener('click', () => { closeOverlay(aboutMeOverlay); openOverlay(hobbiesOverlay); });
document.getElementById('hobbiesBack').addEventListener('click', () => { closeOverlay(hobbiesOverlay); openOverlay(aboutMeOverlay); });
document.getElementById('hobbiesClose').addEventListener('click', () => closeOverlay(hobbiesOverlay));
hobbiesOverlay.addEventListener('click', e => { if (e.target === hobbiesOverlay) closeOverlay(hobbiesOverlay); });

document.getElementById('openFavs').addEventListener('click', () => { closeOverlay(aboutMeOverlay); openOverlay(favsOverlay); });
document.getElementById('favsBack').addEventListener('click', () => { closeOverlay(favsOverlay); openOverlay(aboutMeOverlay); });
document.getElementById('favsClose').addEventListener('click', () => closeOverlay(favsOverlay));
favsOverlay.addEventListener('click', e => { if (e.target === favsOverlay) closeOverlay(favsOverlay); });

/* ── DATE CARD → CLOCK ────────────────────────────── */
const dateCardBtn  = document.getElementById('dateCardBtn');
const clockOverlay = document.getElementById('clockOverlay');
const clockClose   = document.getElementById('clockClose');
const hourHand     = document.getElementById('hourHand');
const minuteHand   = document.getElementById('minuteHand');
const clockTicks   = document.getElementById('clockTicks');

(function buildTicks() {
  for (let i = 0; i < 12; i++) {
    const angle = (i * 30) * Math.PI / 180;
    const isMajor = i % 3 === 0;
    const r1 = isMajor ? 82 : 86, r2 = 92;
    const x1 = 100 + r1 * Math.sin(angle);
    const y1 = 100 - r1 * Math.cos(angle);
    const x2 = 100 + r2 * Math.sin(angle);
    const y2 = 100 - r2 * Math.cos(angle);
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1); line.setAttribute('y1', y1);
    line.setAttribute('x2', x2); line.setAttribute('y2', y2);
    line.setAttribute('stroke', isMajor ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.12)');
    line.setAttribute('stroke-width', isMajor ? '2' : '1');
    line.setAttribute('stroke-linecap', 'round');
    clockTicks.appendChild(line);
  }
})();

function updateClock() {
  const now = new Date();
  const h = now.getHours() % 12, m = now.getMinutes(), s = now.getSeconds();
  const hourDeg   = (h * 30) + (m * 0.5);
  const minuteDeg = (m * 6) + (s * 0.1);
  const hLen = 44, mLen = 58;
  const hRad = hourDeg   * Math.PI / 180;
  const mRad = minuteDeg * Math.PI / 180;
  hourHand.setAttribute('x2',   100 + hLen * Math.sin(hRad));
  hourHand.setAttribute('y2',   100 - hLen * Math.cos(hRad));
  minuteHand.setAttribute('x2', 100 + mLen * Math.sin(mRad));
  minuteHand.setAttribute('y2', 100 - mLen * Math.cos(mRad));
  document.getElementById('clockWeekday').textContent =
    now.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
  document.getElementById('clockDay').textContent = now.getDate();
  document.getElementById('clockMonth').textContent =
    now.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  document.getElementById('clockYear').textContent = now.getFullYear();
}

let clockInterval = null;
dateCardBtn.addEventListener('click', () => {
  openOverlay(clockOverlay);
  updateClock();
  clockInterval = setInterval(updateClock, 1000);
});
clockClose.addEventListener('click', () => {
  closeOverlay(clockOverlay);
  clearInterval(clockInterval);
});
clockOverlay.addEventListener('click', e => {
  if (e.target === clockOverlay) {
    closeOverlay(clockOverlay);
    clearInterval(clockInterval);
  }
});

/* ── LIFE IN WEEKS ────────────────────────────────── */
const lifeOverlay = document.getElementById('lifeOverlay');
const lifeClose   = document.getElementById('lifeClose');
const lifeGrid    = document.getElementById('lifeGrid');
const lifeStat    = document.getElementById('lifeStat');

const DOB = new Date('2004-10-10');

function buildLifeDots() {
  const now = new Date();
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  const weeksLived = Math.floor((now - DOB) / msPerWeek);
  lifeStat.textContent = `${weeksLived + 1} weeks alive`;
  lifeGrid.innerHTML = '';
  for (let i = 0; i <= weeksLived; i++) {
    const dot = document.createElement('div');
    dot.className = i === weeksLived ? 'life-dot current' : 'life-dot lived';
    dot.title = `Week ${i + 1}`;
    lifeGrid.appendChild(dot);
  }
}

essLife.addEventListener('click', () => {
  essWrapper.classList.remove('open');
  buildLifeDots();
  openOverlay(lifeOverlay);
});
lifeClose.addEventListener('click', () => closeOverlay(lifeOverlay));
lifeOverlay.addEventListener('click', e => { if (e.target === lifeOverlay) closeOverlay(lifeOverlay); });

/* ── ESCAPE — close all ───────────────────────────── */
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  [playOverlay, snakeOverlay, drawOverlay, errOverlay,
   galleryOverlay, lightboxOverlay, aboutMeOverlay,
   skillsOverlay, hobbiesOverlay, favsOverlay,
   clockOverlay, lifeOverlay, bioOverlay].forEach(closeOverlay);
  clearInterval(clockInterval);
  essWrapper.classList.remove('open');
});

/* ── LOADING SCREEN ───────────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 1400);
});

/* ── CUSTOM CURSOR ────────────────────────────────── */
if (window.matchMedia('(pointer: fine)').matches) {
  const dot  = document.createElement('div'); dot.className  = 'cursor-dot';
  const ring = document.createElement('div'); ring.className = 'cursor-ring';
  document.body.append(dot, ring);

  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  (function animCursor() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    dot.style.left  = mx + 'px'; dot.style.top  = my + 'px';
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(animCursor);
  })();

  document.addEventListener('mousedown', () => dot.classList.add('click'));
  document.addEventListener('mouseup',   () => dot.classList.remove('click'));

  document.querySelectorAll('a, button, .card, input, label, [role="button"]').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
  });
}

/* ── SCROLL TO TOP ────────────────────────────────── */
const scrollTopBtn = document.getElementById('scrollTop');
window.addEventListener('scroll', () => {
  scrollTopBtn.classList.toggle('visible', window.scrollY > 200);
});
scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ── VISIT COUNTER ────────────────────────────────── */
(async function loadVisitCount() {
  try {
    const res = await fetch('https://counterapi.dev/api/maksacr-corner/hit');
    const data = await res.json();
    document.getElementById('visitCount').textContent = data.count.toLocaleString();
  } catch {
    document.getElementById('visitCounter').style.display = 'none';
  }
})();

/* ── COPY TO CLIPBOARD ON RIGHT-CLICK / LONG PRESS ── */
const copyToast = document.createElement('div');
copyToast.className = 'copy-toast';
copyToast.textContent = 'LINK COPIED';
document.body.appendChild(copyToast);

let toastTimer;
function showToast() {
  copyToast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => copyToast.classList.remove('show'), 1800);
}

document.querySelectorAll('.card[href]').forEach(card => {
  card.addEventListener('contextmenu', e => {
    e.preventDefault();
    navigator.clipboard.writeText(card.href).then(showToast);
  });
  let pressTimer;
  card.addEventListener('touchstart', () => {
    pressTimer = setTimeout(() => {
      navigator.clipboard.writeText(card.href).then(showToast);
    }, 600);
  }, { passive: true });
  card.addEventListener('touchend',  () => clearTimeout(pressTimer));
  card.addEventListener('touchmove', () => clearTimeout(pressTimer), { passive: true });
});

/* ── NOW WATCHING (ANILIST) ───────────────────────── */
// ↓ Your AniList username — set it here
const ANILIST_USER = 'maksacr';

const nowOverlay = document.getElementById('nowOverlay');
const nowClose   = document.getElementById('nowClose');
const nowContent = document.getElementById('nowContent');
const nowCard    = document.getElementById('nowCard');
const nowPreview = document.getElementById('nowCardPreview');

const ANILIST_QUERY = `
query ($name: String) {
  User(name: $name) {
    avatar { medium }
    siteUrl
  }
  watching: MediaListCollection(userName: $name, type: ANIME, status: CURRENT) {
    lists { entries {
      progress
      media { title { english romaji } episodes coverImage { medium } siteUrl }
    }}
  }
  reading: MediaListCollection(userName: $name, type: MANGA, status: CURRENT) {
    lists { entries {
      progress
      media { title { english romaji } chapters coverImage { medium } siteUrl }
    }}
  }
}`;

async function loadAniListWidget() {
  try {
    const res = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: ANILIST_QUERY, variables: { name: ANILIST_USER } })
    });
    const { data } = await res.json();
    if (!data) return;

    // Avatar
    const avatar = document.getElementById('alAvatar');
    if (data.User?.avatar?.medium) {
      avatar.src = data.User.avatar.medium;
      avatar.onclick = () => window.open(data.User.siteUrl, '_blank');
      avatar.style.cursor = 'pointer';
    }

    // Helper — build cover items
    function buildItems(entries, container) {
      container.innerHTML = '';
      const items = entries.slice(0, 3);
      if (!items.length) {
        container.innerHTML = '<div class="al-loading" style="font-size:8px;letter-spacing:1px">—</div>';
        return;
      }
      items.forEach(({ media, progress }) => {
        const total = media.episodes || media.chapters || null;
        const pct   = total ? Math.round((progress / total) * 100) : 0;
        const title = media.title.english || media.title.romaji;
        const wrap  = document.createElement('a');
        wrap.className    = 'al-cover-wrap';
        wrap.href         = media.siteUrl;
        wrap.target       = '_blank';
        wrap.dataset.title = title;
        wrap.innerHTML = `
          <img class="al-cover" src="${media.coverImage.medium}" alt="${title}" loading="lazy">
          ${total ? `<div class="al-progress"><div class="al-progress-bar" style="width:${pct}%"></div></div>` : ''}`;
        container.appendChild(wrap);
      });
    }

    const watchEntries = (data.watching?.lists || []).flatMap(l => l.entries);
    const readEntries  = (data.reading?.lists  || []).flatMap(l => l.entries);
    buildItems(watchEntries, document.getElementById('alWatchItems'));
    buildItems(readEntries,  document.getElementById('alReadItems'));

  } catch(e) {
    document.getElementById('alWatchItems').innerHTML = '';
    document.getElementById('alReadItems').innerHTML  = '';
  }
}

loadAniListWidget();

// Keep now overlay wired (modal still exists in HTML)
if (nowClose) nowClose.addEventListener('click', () => closeOverlay(nowOverlay));
nowOverlay.addEventListener('click', e => { if (e.target === nowOverlay) closeOverlay(nowOverlay); });
