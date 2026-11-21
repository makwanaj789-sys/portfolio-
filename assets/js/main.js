import * as THREE from 'three';
import { RoundedBoxGeometry } from './vendor/RoundedBoxGeometry.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const finePointer = matchMedia('(hover:hover) and (pointer:fine)').matches;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------------------------------------------------------
   Timecode helper (HH:MM:SS:FF at 30 fps)
--------------------------------------------------------- */
function timecode(ms) {
  const totalFrames = Math.floor(ms / (1000 / 30));
  const ff = totalFrames % 30, s = Math.floor(totalFrames / 30);
  const p = n => String(n).padStart(2, '0');
  return `${p(Math.floor(s / 3600))}:${p(Math.floor(s / 60) % 60)}:${p(s % 60)}:${p(ff)}`;
}

/* ---------------------------------------------------------
   Loader: a fake render queue that finishes when the page is ready
--------------------------------------------------------- */
function initLoader() {
  const loader = $('#loader'), bar = $('#loader-bar'), pct = $('#loader-pct'), tc = $('#loader-tc');
  let progress = 0, target = 0.6, finished = false;
  const start = performance.now();
  const minTime = reduceMotion ? 300 : 1500;

  const ready = Promise.race([
    Promise.all([
      document.fonts ? document.fonts.ready : Promise.resolve(),
      new Promise(r => document.readyState === 'complete' ? r() : addEventListener('load', r, { once: true })),
    ]),
    new Promise(r => setTimeout(r, 3500)),
  ]);
  ready.then(() => { target = 1; });

  function step() {
    const elapsed = performance.now() - start;
    // time-based so slow devices finish on time too
    progress = Math.max(progress, Math.min(target, elapsed / minTime * 0.9));
    if (target === 1 && elapsed > minTime) progress = Math.min(1, progress + 0.04);
    bar.style.width = (progress * 100).toFixed(1) + '%';
    pct.textContent = Math.round(progress * 100) + '%';
    tc.textContent = timecode(progress * 3000);
    if (progress < 1) return requestAnimationFrame(step);
    if (finished) return;
    finished = true;
    loader.classList.add('done');
    document.body.classList.remove('is-loading');
    setTimeout(() => {
      document.body.classList.add('ready');
      dispatchEvent(new Event('app:ready'));
    }, 250);
    setTimeout(() => loader.remove(), 1400);
  }
  requestAnimationFrame(step);
}

/* ---------------------------------------------------------
   Hero WebGL scene: a 3D phone playing my reel, with timeline
   "clips" orbiting it, neon rings, floating shapes and stars.
--------------------------------------------------------- */
function initScene() {
  const canvas = $('#scene');
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch (e) {
    document.documentElement.classList.add('no-webgl');
    canvas.remove();
    return;
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x07090f, 0.035);
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0, 12);

  // lights
  scene.add(new THREE.AmbientLight(0xffffff, 0.4));
  const key = new THREE.DirectionalLight(0xffffff, 1.4); key.position.set(4, 6, 8); scene.add(key);
  const amber = new THREE.PointLight(0xffb23e, 60, 30); amber.position.set(-4, 2, 4); scene.add(amber);
  const violet = new THREE.PointLight(0x8b7bff, 70, 30); violet.position.set(5, -3, 3); scene.add(violet);
  const pink = new THREE.PointLight(0xff4d8d, 50, 30); pink.position.set(1, 4, -4); scene.add(pink);

  const rig = new THREE.Group(); scene.add(rig);
  const phone = new THREE.Group(); rig.add(phone);

  // phone body
  const W = 2, H = 4.15, D = 0.26;
  const metal = new THREE.MeshStandardMaterial({ color: 0x1a1d28, metalness: 0.9, roughness: 0.25 });
  phone.add(new THREE.Mesh(new RoundedBoxGeometry(W, H, D, 8, 0.28), metal));

  // rounded screen with remapped UVs so the video covers it
  const sw = W - 0.14, sh = H - 0.14;
  const shape = new THREE.Shape();
  { const r = 0.22, x = -sw / 2, y = -sh / 2;
    shape.moveTo(x + r, y); shape.lineTo(x + sw - r, y); shape.quadraticCurveTo(x + sw, y, x + sw, y + r);
    shape.lineTo(x + sw, y + sh - r); shape.quadraticCurveTo(x + sw, y + sh, x + sw - r, y + sh);
    shape.lineTo(x + r, y + sh); shape.quadraticCurveTo(x, y + sh, x, y + sh - r);
    shape.lineTo(x, y + r); shape.quadraticCurveTo(x, y, x + r, y); }
  const screenGeo = new THREE.ShapeGeometry(shape, 10);
  { const pos = screenGeo.attributes.position, uv = screenGeo.attributes.uv;
    for (let i = 0; i < pos.count; i++) uv.setXY(i, (pos.getX(i) + sw / 2) / sw, (pos.getY(i) + sh / 2) / sh); }
  const screenMat = new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false });
  const screen = new THREE.Mesh(screenGeo, screenMat);
  screen.position.z = D / 2 + 0.003;
  phone.add(screen);

  const cover = t => { // crop 9:16 media to the screen aspect
    const va = 9 / 16, sa = sw / sh;
    t.repeat.set(sa / va, 1); t.offset.set((1 - sa / va) / 2, 0); t.colorSpace = THREE.SRGBColorSpace;
  };
  new THREE.TextureLoader().load('assets/img/reel-transition.jpg', t => { cover(t); if (!screenMat.map) { screenMat.map = t; screenMat.needsUpdate = true; } });

  const video = document.createElement('video');
  Object.assign(video, { src: 'assets/video/reel-transition.mp4', muted: true, loop: true, playsInline: true, preload: 'auto' });
  video.setAttribute('playsinline', ''); video.setAttribute('muted', '');
  const vtex = new THREE.VideoTexture(video); cover(vtex);
  video.addEventListener('playing', () => { screenMat.map = vtex; screenMat.needsUpdate = true; }, { once: true });
  const playVideo = () => video.play().catch(() => {});
  playVideo();
  addEventListener('pointerdown', playVideo, { once: true });

  // glass sheen
  const sheen = new THREE.Mesh(screenGeo, new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.05, depthWrite: false }));
  sheen.position.z = D / 2 + 0.006; sheen.scale.set(1, 1, 1); phone.add(sheen);

  // dynamic island, camera bump, lenses, buttons
  const black = new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.4 });
  const island = new THREE.Mesh(new RoundedBoxGeometry(0.56, 0.15, 0.02, 4, 0.07), black);
  island.position.set(0, sh / 2 - 0.2, D / 2 + 0.01); phone.add(island);
  const bump = new THREE.Mesh(new RoundedBoxGeometry(0.9, 0.9, 0.08, 4, 0.18), metal);
  bump.position.set(-0.42, 1.48, -D / 2 - 0.035); phone.add(bump);
  const lensGeo = new THREE.CylinderGeometry(0.17, 0.17, 0.08, 32);
  const lensMat = new THREE.MeshStandardMaterial({ color: 0x090b12, metalness: 1, roughness: 0.05 });
  [[-0.6, 1.66], [-0.24, 1.3], [-0.6, 1.3]].forEach(([x, y]) => {
    const l = new THREE.Mesh(lensGeo, lensMat); l.rotation.x = Math.PI / 2; l.position.set(x, y, -D / 2 - 0.09); phone.add(l);
  });
  const btnGeo = new RoundedBoxGeometry(0.05, 0.5, 0.08, 2, 0.02);
  [[W / 2 + 0.01, 0.9], [-W / 2 - 0.01, 1.1], [-W / 2 - 0.01, 0.5]].forEach(([x, y]) => {
    const b = new THREE.Mesh(btnGeo, metal); b.position.set(x, y, 0); phone.add(b);
  });

  // neon rings
  const ringA = new THREE.Mesh(new THREE.TorusGeometry(3.1, 0.014, 8, 180), new THREE.MeshBasicMaterial({ color: 0xffb23e }));
  ringA.rotation.set(1.25, 0.2, 0); rig.add(ringA);
  const ringB = new THREE.Mesh(new THREE.TorusGeometry(3.6, 0.01, 8, 180), new THREE.MeshBasicMaterial({ color: 0x3fe0d0, transparent: true, opacity: 0.6 }));
  ringB.rotation.set(1.35, -0.35, 0.3); rig.add(ringB);

  // timeline clips orbiting the phone
  const clips = new THREE.Group(); clips.rotation.set(0.3, 0, -0.18); rig.add(clips);
  const palette = [0xffb23e, 0x3fe0d0, 0x8b7bff, 0xff4d8d];
  const clipMeshes = [];
  for (let i = 0; i < 16; i++) {
    const len = 0.5 + Math.random() * 0.8;
    const m = new THREE.Mesh(new RoundedBoxGeometry(len, 0.2, 0.08, 2, 0.05),
      new THREE.MeshStandardMaterial({ color: palette[i % 4], emissive: palette[i % 4], emissiveIntensity: 0.35, roughness: 0.35, metalness: 0.2 }));
    const a = (i / 16) * Math.PI * 2, r = 3.3 + (i % 3) * 0.35;
    m.position.set(Math.cos(a) * r, (Math.random() - 0.5) * 0.5, Math.sin(a) * r);
    m.rotation.y = -a + Math.PI / 2;
    m.userData.seed = Math.random() * 10;
    clips.add(m); clipMeshes.push(m);
  }

  // floating shapes
  const shapes = [];
  const addShape = (geo, mat, pos, s = 1) => { const m = new THREE.Mesh(geo, mat); m.position.set(...pos); m.scale.setScalar(s); m.userData.base = pos[1]; m.userData.seed = Math.random() * 6; scene.add(m); shapes.push(m); };
  addShape(new THREE.IcosahedronGeometry(0.9, 0), new THREE.MeshBasicMaterial({ color: 0x8b7bff, wireframe: true }), [-5.6, 2.4, -3]);
  addShape(new THREE.TorusKnotGeometry(0.45, 0.15, 120, 16), new THREE.MeshStandardMaterial({ color: 0xff4d8d, metalness: 0.6, roughness: 0.2 }), [5.4, 2.9, -2.5]);
  addShape(new THREE.OctahedronGeometry(0.5), new THREE.MeshStandardMaterial({ color: 0xffb23e, metalness: 0.5, roughness: 0.25, flatShading: true }), [-4.4, -2.8, -1]);
  addShape(new THREE.TorusGeometry(0.5, 0.18, 16, 48), new THREE.MeshStandardMaterial({ color: 0x3fe0d0, metalness: 0.7, roughness: 0.2 }), [6.2, -2.4, -4]);
  addShape(new THREE.IcosahedronGeometry(0.35, 0), new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 1, roughness: 0.1, flatShading: true }), [-1.8, 3.4, -5]);

  // star field
  const N = 1600, starPos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) { starPos[i * 3] = (Math.random() - 0.5) * 40; starPos[i * 3 + 1] = (Math.random() - 0.5) * 26; starPos[i * 3 + 2] = (Math.random() - 0.5) * 30 - 6; }
  const starGeo = new THREE.BufferGeometry(); starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.035, transparent: true, opacity: 0.75, depthWrite: false }));
  scene.add(stars);

  // layout per screen size
  const base = { x: 0, y: 0, s: 1 };
  function layout() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
    const vh = 2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const vw = vh * camera.aspect;
    if (w < 860) { base.x = 0; base.y = -vh * 0.3; base.s = clamp(vh * 0.075, 0.5, 0.72); }
    else { base.x = vw * 0.27; base.y = -0.1; base.s = clamp(vh * 0.13, 0.8, 1); }
  }
  layout();
  addEventListener('resize', layout);

  // input
  const mouse = { x: 0, y: 0 }, sm = { x: 0, y: 0 };
  addEventListener('pointermove', e => { mouse.x = e.clientX / innerWidth * 2 - 1; mouse.y = e.clientY / innerHeight * 2 - 1; }, { passive: true });

  let visible = true;
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    visible ? playVideo() : video.pause();
  }).observe($('#home'));

  let intro = 0, startedAt = 0;
  addEventListener('app:ready', () => { startedAt = performance.now(); });
  const speed = reduceMotion ? 0.3 : 1;

  function tick(t) {
    requestAnimationFrame(tick);
    if (!visible) return;
    if (startedAt) intro = Math.min(1, (performance.now() - startedAt) / 1600);
    const e = 1 - Math.pow(1 - intro, 4); // easeOutQuart

    sm.x = lerp(sm.x, mouse.x, 0.05); sm.y = lerp(sm.y, mouse.y, 0.05);
    const p = clamp(scrollY / innerHeight, 0, 1.5);
    const time = t * 0.001 * speed;

    rig.position.set(base.x, base.y + p * 2.2 + (1 - e) * -2, -p * 2);
    rig.scale.setScalar(base.s * (0.6 + 0.4 * e));
    phone.rotation.y = -0.35 + Math.sin(time * 0.5) * 0.3 + sm.x * 0.45 + p * 3.2 + (1 - e) * Math.PI * 2;
    phone.rotation.x = sm.y * 0.2 + Math.sin(time * 0.7) * 0.05 - p * 0.3;
    phone.rotation.z = Math.sin(time * 0.4) * 0.04;
    phone.position.y = Math.sin(time) * 0.12;

    clips.rotation.y = time * 0.25;
    clipMeshes.forEach(m => { m.position.y = Math.sin(time * 1.4 + m.userData.seed) * 0.25; });
    ringA.rotation.z = time * 0.2; ringB.rotation.z = -time * 0.15;
    shapes.forEach(m => {
      m.rotation.x = time * 0.4 + m.userData.seed; m.rotation.y = time * 0.3;
      m.position.y = m.userData.base + Math.sin(time * 0.8 + m.userData.seed) * 0.3;
    });
    stars.rotation.y = time * 0.01; stars.rotation.x = sm.y * 0.03;

    camera.position.x = lerp(camera.position.x, sm.x * 0.7, 0.05);
    camera.position.y = lerp(camera.position.y, -sm.y * 0.4, 0.05);
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  }
  requestAnimationFrame(tick);
}

/* ---------------------------------------------------------
   Custom cursor
--------------------------------------------------------- */
function initCursor() {
  if (!finePointer) return;
  const dot = $('.cursor-dot'), ring = $('.cursor-ring'), label = $('.cursor-label');
  let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y;
  addEventListener('pointermove', e => { x = e.clientX; y = e.clientY; dot.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%)`; }, { passive: true });
  (function loop() { rx = lerp(rx, x, 0.18); ry = lerp(ry, y, 0.18); ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`; requestAnimationFrame(loop); })();
  document.addEventListener('pointerover', e => {
    const lab = e.target.closest('[data-cursor], .reel');
    const hov = e.target.closest('a, button, .soc, .card');
    ring.classList.toggle('label', !!lab);
    ring.classList.toggle('hover', !!hov && !lab);
    label.textContent = lab ? (lab.dataset.cursor || 'Play') : '';
  });
}

/* ---------------------------------------------------------
   Nav: hide on scroll down, active link, mobile menu, progress bar
--------------------------------------------------------- */
function initNav() {
  const nav = $('#nav'), burger = $('#burger'), menu = $('#menu'), prog = $('#progress'), hud = $('#hud-tc');
  let lastY = scrollY;
  const t0 = performance.now();
  const onScroll = () => {
    const y = scrollY;
    if (!menu.classList.contains('open')) nav.classList.toggle('hide', y > lastY && y > 300);
    lastY = y;
    const max = document.documentElement.scrollHeight - innerHeight;
    prog.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    const tl = $('#timeline');
    if (tl) {
      const r = tl.getBoundingClientRect();
      $('#tl-fill').style.transform = `scaleY(${clamp((innerHeight * 0.65 - r.top) / r.height, 0, 1)})`;
    }
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  setInterval(() => { hud.textContent = timecode(performance.now() - t0); }, 1000 / 30);

  const toggle = open => {
    menu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
    menu.setAttribute('aria-hidden', !open);
    document.body.style.overflow = open ? 'hidden' : '';
  };
  burger.addEventListener('click', () => toggle(!menu.classList.contains('open')));
  $$('a', menu).forEach(a => a.addEventListener('click', () => toggle(false)));

  const links = $$('.nav-links a');
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  ['reels', 'work', 'skills', 'experience', 'contact'].forEach(id => io.observe(document.getElementById(id)));
}

/* ---------------------------------------------------------
   Scroll reveals and number counters
--------------------------------------------------------- */
function initReveal() {
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const siblings = [...el.parentElement.children].filter(c => c.hasAttribute('data-reveal'));
    el.style.transitionDelay = (siblings.indexOf(el) * 0.08) + 's';
    el.classList.add('in');
    setTimeout(() => { el.style.transitionDelay = ''; }, 1400);
    $$('[data-count]', el).forEach(countUp);
    io.unobserve(el);
  }), { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  $$('[data-reveal]').forEach(el => io.observe(el));
}
function countUp(el) {
  const target = +el.dataset.count, suffix = el.dataset.suffix || '', dur = 1800, t0 = performance.now();
  const decimals = (el.dataset.count.split('.')[1] || '').length;
  (function f(now) {
    const k = clamp((now - t0) / dur, 0, 1), e = 1 - Math.pow(1 - k, 3);
    el.textContent = (target * e).toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
    if (k < 1) requestAnimationFrame(f);
  })(t0);
}

/* ---------------------------------------------------------
   Reels: 3D tilt, hover preview, lightbox with sound
--------------------------------------------------------- */
function initReels() {
  const reels = $$('.reel');
  const lb = $('#lightbox'), lbv = $('#lb-video'), lbt = $('#lb-title');

  reels.forEach(reel => {
    const frame = $('.reel-frame', reel), v = $('video', reel);
    const play = () => { v.play().then(() => reel.classList.add('playing')).catch(() => {}); };
    const stop = () => { v.pause(); reel.classList.remove('playing'); };
    if (finePointer) {
      reel.addEventListener('pointerenter', play);
      reel.addEventListener('pointerleave', () => { stop(); frame.style.transform = ''; });
      reel.addEventListener('pointermove', e => {
        const r = frame.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        frame.style.transform = `rotateY(${(px - 0.5) * 18}deg) rotateX(${(0.5 - py) * 18}deg) scale(1.03)`;
        frame.style.setProperty('--gx', px * 100 + '%'); frame.style.setProperty('--gy', py * 100 + '%');
      });
    } else {
      new IntersectionObserver(([e]) => e.intersectionRatio > 0.6 ? play() : stop(), { threshold: [0, 0.6] }).observe(reel);
    }
    const open = () => {
      reels.forEach(r => $('video', r).pause());
      lbv.src = reel.dataset.video; lbv.muted = false; lbt.textContent = reel.dataset.title;
      lb.hidden = false; document.body.style.overflow = 'hidden';
      lbv.play().catch(() => {});
      $('#lb-close').focus();
    };
    reel.addEventListener('click', open);
    reel.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  });

  const close = () => { lbv.pause(); lbv.removeAttribute('src'); lbv.load(); lb.hidden = true; document.body.style.overflow = ''; };
  $('#lb-close').addEventListener('click', close);
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && !lb.hidden) close(); });
}

/* ---------------------------------------------------------
   Store mockups: scale the live store into the laptop & phone
--------------------------------------------------------- */
function initDevices() {
  const fit = (box, w) => { const f = $('iframe', box); if (f) f.style.transform = `scale(${box.clientWidth / w})`; };
  const lap = $('.laptop-screen'), ph = $('.mini-phone-screen');
  const ro = new ResizeObserver(() => { fit(lap, 1280); fit(ph, 390); });
  ro.observe(lap); ro.observe(ph);
}

/* ---------------------------------------------------------
   Cards: pointer glow + soft 3D tilt; magnetic buttons
--------------------------------------------------------- */
function initCards() {
  if (!finePointer) return;
  $$('.card').forEach(c => {
    c.addEventListener('pointermove', e => {
      const r = c.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      c.style.setProperty('--mx', px * 100 + '%'); c.style.setProperty('--my', py * 100 + '%');
      c.style.transform = `perspective(900px) rotateY(${(px - 0.5) * 6}deg) rotateX(${(0.5 - py) * 6}deg)`;
    });
    c.addEventListener('pointerleave', () => { c.style.transform = ''; });
  });
  $$('.magnetic').forEach(b => {
    b.addEventListener('pointermove', e => {
      const r = b.getBoundingClientRect();
      b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px,${(e.clientY - r.top - r.height / 2) * 0.35}px)`;
    });
    b.addEventListener('pointerleave', () => { b.style.transform = ''; });
  });
}

/* ---------------------------------------------------------
   Skills: CSS 3D tag sphere
--------------------------------------------------------- */
function initSphere() {
  const box = $('#sphere');
  const words = [
    ['After Effects', 'hot'], ['Motion Graphics', 'hot'], ['Reels', 'hot'], ['Premiere Pro'], ['Canva'], ['Thumbnails', 'hot'],
    ['Photoshop'], ['CorelDRAW'], ['Instagram', 'hot'], ['YouTube', 'hot'], ['SEO'], ['Meta Ads'], ['Analytics'],
    ['Python', 'cool'], ['Pyrogram', 'cool'], ['MongoDB', 'cool'], ['Linux VPS', 'cool'], ['Groq AI', 'cool'],
    ['HTML', 'cool'], ['CSS', 'cool'], ['JavaScript', 'cool'], ['WordPress'], ['Shopify'], ['Excel'], ['Color grading', 'hot'], ['Sound design'],
  ];
  const n = words.length, golden = Math.PI * (3 - Math.sqrt(5));
  const pts = words.map(([w, cls], i) => {
    const el = document.createElement('span'); el.textContent = w; if (cls) el.className = cls;
    box.appendChild(el);
    const y = 1 - (i / (n - 1)) * 2, r = Math.sqrt(1 - y * y), phi = i * golden;
    return { el, x: Math.cos(phi) * r, y, z: Math.sin(phi) * r };
  });
  let vx = 0.004, vy = 0.006, dragging = false, lx = 0, ly = 0, visible = false;
  box.addEventListener('pointermove', e => {
    const r = box.getBoundingClientRect();
    if (dragging) { vy = (e.clientX - lx) * 0.002; vx = (e.clientY - ly) * 0.002; lx = e.clientX; ly = e.clientY; return; }
    if (finePointer) { vy = ((e.clientX - r.left) / r.width - 0.5) * 0.03; vx = -((e.clientY - r.top) / r.height - 0.5) * 0.03; }
  });
  box.addEventListener('pointerdown', e => { dragging = true; lx = e.clientX; ly = e.clientY; });
  addEventListener('pointerup', () => { dragging = false; });
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(box);

  function frame() {
    requestAnimationFrame(frame);
    if (!visible) return;
    if (!dragging) { vx = lerp(vx, 0.003, 0.01); vy = lerp(vy, 0.005, 0.01); }
    const R = box.clientWidth * 0.4;
    const cx = Math.cos(vx), sx = Math.sin(vx), cy = Math.cos(vy), sy = Math.sin(vy);
    pts.forEach(p => {
      let x = p.x * cy + p.z * sy, z = -p.x * sy + p.z * cy;   // rotate around Y
      let y = p.y * cx - z * sx; z = p.y * sx + z * cx;         // rotate around X
      p.x = x; p.y = y; p.z = z;
      const s = 0.6 + (z + 1) * 0.3;
      p.el.style.transform = `translate(-50%,-50%) translate3d(${x * R}px,${y * R}px,0) scale(${s})`;
      p.el.style.opacity = (0.2 + (z + 1) * 0.4).toFixed(2);
      p.el.style.zIndex = Math.round((z + 1) * 50);
    });
  }
  requestAnimationFrame(frame);
}

/* ---------------------------------------------------------
   Copy email
--------------------------------------------------------- */
function initCopy() {
  const btn = $('#copy-btn'), addr = $('#addr');
  btn.addEventListener('click', () => {
    const sel = () => { const r = document.createRange(); r.selectNodeContents(addr); const s = getSelection(); s.removeAllRanges(); s.addRange(r); btn.textContent = 'Selected — press Ctrl+C'; };
    try {
      navigator.clipboard.writeText(addr.textContent).then(() => { btn.textContent = 'Copied ✓'; setTimeout(() => { btn.textContent = 'Copy email'; }, 1800); }, sel);
    } catch (e) { sel(); }
  });
}

initLoader();
initScene();
initCursor();
initNav();
initReveal();
initReels();
initDevices();
initCards();
initSphere();
initCopy();
