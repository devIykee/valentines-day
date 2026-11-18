// NEAR post-quantum film — 3D world. Every frame is a pure function of t.
import * as THREE from 'three';
import { RoomEnvironment } from './lib/addons/environments/RoomEnvironment.js';
import { EffectComposer } from './lib/addons/postprocessing/EffectComposer.js';
import { RenderPass } from './lib/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from './lib/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from './lib/addons/postprocessing/ShaderPass.js';
import { OutputPass } from './lib/addons/postprocessing/OutputPass.js';

try { await Promise.all(['700 30px "Space Mono"', '700 110px "Archivo Black"', '800 60px "Montserrat"'].map(f => document.fonts.load(f))); } catch (e) {}

const W = 720, H = 1280;
const canvas = document.getElementById('gl');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(1);
renderer.setSize(W, H, false);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x05060a);
scene.fog = new THREE.FogExp2(0x05060a, 0.035);
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.55;

const camera = new THREE.PerspectiveCamera(38, W / H, 0.05, 400);

// ---------- helpers ----------
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, k) => a + (b - a) * k;
const rng = (a, b, t) => clamp((t - a) / (b - a));
const sstep = (a, b, t) => { const x = rng(a, b, t); return x * x * (3 - 2 * x); };
const eOutExpo = x => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x));
const eInOut = x => (x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const eOutBack = x => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
function hash(i) { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
function noise1(t, seed) { // smooth value noise
  const i = Math.floor(t), f = t - i, u = f * f * (3 - 2 * f);
  return lerp(hash(i + seed * 97.3), hash(i + 1 + seed * 97.3), u) * 2 - 1;
}
const V = (x, y, z) => new THREE.Vector3(x, y, z);
const C = h => new THREE.Color(h);

function canvasTex(w, h, draw) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const g = c.getContext('2d'); draw(g, w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}
function glowSprite(color, size, opacity = 1) {
  const tex = canvasTex(256, 256, (g) => {
    const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
    gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.25, 'rgba(255,255,255,.45)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
  });
  const m = new THREE.SpriteMaterial({ map: tex, color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false });
  const s = new THREE.Sprite(m); s.scale.set(size, size, 1); return s;
}
function label(text, { font = '700 72px "Space Mono"', color = '#ffffff', w = 1024, h = 160, bg = null, border = null } = {}) {
  const tex = canvasTex(w, h, (g) => {
    if (bg) { g.fillStyle = bg; g.fillRect(0, 0, w, h); }
    if (border) { g.strokeStyle = border; g.lineWidth = 8; g.strokeRect(4, 4, w - 8, h - 8); }
    g.font = font; g.fillStyle = color; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, w / 2, h / 2 + 4);
  });
  const m = new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, toneMapped: false });
  return new THREE.Mesh(new THREE.PlaneGeometry(w / h, 1), m);
}

// ---------- lights ----------
const key = new THREE.DirectionalLight(0xffc28a, 2.2); key.position.set(4, 6, 6); scene.add(key);
const rim = new THREE.DirectionalLight(0x6ea8ff, 2.6); rim.position.set(-6, 3, -5); scene.add(rim);
const fill = new THREE.AmbientLight(0x223044, 0.6); scene.add(fill);
const accent = new THREE.PointLight(0xff3b30, 0, 14, 1.6); scene.add(accent);

// ---------- stars / dust ----------
const stars = (() => {
  const n = 2600, p = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const r = 25 + hash(i) * 60, th = hash(i + 7) * Math.PI * 2, ph = Math.acos(2 * hash(i + 13) - 1);
    p[i * 3] = r * Math.sin(ph) * Math.cos(th); p[i * 3 + 1] = r * Math.cos(ph); p[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
  }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(p, 3));
  return new THREE.Points(g, new THREE.PointsMaterial({ color: 0x9fb4ff, size: 0.09, sizeAttenuation: true, transparent: true, opacity: .8, fog: false }));
})();
scene.add(stars);
const dust = (() => {
  const n = 500, p = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { p[i * 3] = (hash(i + 3) - .5) * 14; p[i * 3 + 1] = (hash(i + 5) - .5) * 20; p[i * 3 + 2] = (hash(i + 9) - .5) * 14; }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(p, 3));
  return new THREE.Points(g, new THREE.PointsMaterial({ color: 0xffe2b8, size: 0.025, transparent: true, opacity: .55, blending: THREE.AdditiveBlending, depthWrite: false }));
})();
scene.add(dust);

// ---------- SET: globe of locks ----------
const globe = new THREE.Group(); scene.add(globe);
const NL = 1600, GR = 3;
const glowU = { value: 0.35 };
function glowMat(params) {
  const m = new THREE.MeshStandardMaterial(params);
  m.onBeforeCompile = (sh) => {
    sh.uniforms.uGlow = glowU;
    sh.fragmentShader = 'uniform float uGlow;\n' + sh.fragmentShader.replace('#include <emissivemap_fragment>',
      '#include <emissivemap_fragment>\n#ifdef USE_INSTANCING_COLOR\n totalEmissiveRadiance += vColor.rgb * uGlow;\n#endif');
  };
  return m;
}
const lockBodyGeo = new THREE.BoxGeometry(0.12, 0.1, 0.05);
const lockShGeo = new THREE.TorusGeometry(0.036, 0.011, 6, 14, Math.PI);
const bodies = new THREE.InstancedMesh(lockBodyGeo, glowMat({ metalness: .75, roughness: .35, color: 0xffffff }), NL);
const shackles = new THREE.InstancedMesh(lockShGeo, glowMat({ metalness: .9, roughness: .3, color: 0xffffff }), NL);
const lockPos = [], lockQ = [];
{
  const golden = Math.PI * (3 - Math.sqrt(5)); const m = new THREE.Matrix4(); const o = new THREE.Object3D();
  for (let i = 0; i < NL; i++) {
    const y = 1 - (i / (NL - 1)) * 2, r = Math.sqrt(1 - y * y), th = golden * i;
    const p = V(Math.cos(th) * r, y, Math.sin(th) * r).multiplyScalar(GR);
    o.position.copy(p); o.lookAt(p.clone().multiplyScalar(2)); o.rotateZ(hash(i) * 0.6 - 0.3);
    lockPos.push(p); lockQ.push(o.quaternion.clone());
  }
}
globe.add(bodies, shackles);
const core = new THREE.Mesh(new THREE.SphereGeometry(GR * 0.965, 64, 48), new THREE.MeshStandardMaterial({ color: 0x0a1020, metalness: .2, roughness: .8 }));
globe.add(core);
const atmo = glowSprite(0x3a6bff, GR * 2.7, .12); globe.add(atmo);
const cSteel = C(0x8d96a8), cRed = C(0xff2d1f), cGreen = C(0x00ec97);
const _o = new THREE.Object3D(), _c = new THREE.Color();
function updateGlobe(t, redOrigin, redWave, greenOrigin, greenWave, rot) {
  globe.rotation.y = rot; globe.rotation.x = 0.25;
  for (let i = 0; i < NL; i++) {
    const p = lockPos[i];
    const dr = redOrigin ? p.distanceTo(redOrigin) : 99, dg = greenOrigin ? p.distanceTo(greenOrigin) : 99;
    const red = clamp((redWave - dr) / 0.8), green = clamp((greenWave - dg) / 0.8);
    const open = red * (1 - green);
    _c.copy(cSteel).lerp(cRed, red).lerp(cGreen, green);
    bodies.setColorAt(i, _c); shackles.setColorAt(i, _c);
    _o.position.copy(p); _o.quaternion.copy(lockQ[i]); _o.scale.setScalar(1 + 0.25 * green); _o.updateMatrix();
    bodies.setMatrixAt(i, _o.matrix);
    _o.translateY(0.05 + 0.04 * open); _o.rotateY(open * 0.9); _o.updateMatrix();
    shackles.setMatrixAt(i, _o.matrix);
  }
  bodies.instanceMatrix.needsUpdate = shackles.instanceMatrix.needsUpdate = true;
  bodies.instanceColor.needsUpdate = shackles.instanceColor.needsUpdate = true;
}

// ---------- SET: hero padlock ----------
const hero = new THREE.Group(); scene.add(hero);
const steel = new THREE.MeshStandardMaterial({ color: 0x9aa3b2, metalness: .95, roughness: .28 });
const darkSteel = new THREE.MeshStandardMaterial({ color: 0x2a2f38, metalness: .9, roughness: .35 });
function roundedRect(w, h, r) {
  const s = new THREE.Shape(); const x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h); s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y); return s;
}
const heroBody = new THREE.Mesh(new THREE.ExtrudeGeometry(roundedRect(2, 1.7, .22), { depth: .7, bevelEnabled: true, bevelSize: .08, bevelThickness: .08, bevelSegments: 4, curveSegments: 10 }), darkSteel);
heroBody.position.z = -.35; hero.add(heroBody);
const shackle = new THREE.Group(); hero.add(shackle);
{
  const arc = new THREE.Mesh(new THREE.TorusGeometry(.62, .15, 20, 48, Math.PI), steel); arc.position.y = 1.35;
  const l1 = new THREE.Mesh(new THREE.CylinderGeometry(.15, .15, .7, 20), steel); l1.position.set(-.62, 1.0, 0);
  const l2 = l1.clone(); l2.position.x = .62; shackle.add(arc, l1, l2);
}
const keyholeMat = new THREE.MeshBasicMaterial({ color: 0x00ec97, toneMapped: false });
const keyhole = new THREE.Group(); hero.add(keyhole);
{ const a = new THREE.Mesh(new THREE.CircleGeometry(.14, 32), keyholeMat); a.position.set(0, .05, .44);
  const b = new THREE.Mesh(new THREE.PlaneGeometry(.12, .36), keyholeMat); b.position.set(0, -.17, .44); keyhole.add(a, b); }
// flowing math glyphs on the body
const glyphTex = canvasTex(1024, 1024, (g, w, h) => {
  g.fillStyle = 'rgba(0,0,0,0)'; g.clearRect(0, 0, w, h); g.font = '700 30px "Space Mono"';
  const chars = '0123456789abcdef∑∂πλ⊕×≡';
  for (let r = 0; r < 34; r++) for (let c = 0; c < 40; c++) {
    const k = r * 40 + c; const ch = chars[Math.floor(hash(k) * chars.length)];
    g.fillStyle = `rgba(255,255,255,${0.25 + hash(k + 99) * 0.75})`; g.fillText(ch, c * 25.6, r * 30.2 + 26);
  }
});
glyphTex.wrapS = glyphTex.wrapT = THREE.RepeatWrapping;
const glyphMat = new THREE.MeshBasicMaterial({ map: glyphTex, color: 0x00ec97, transparent: true, opacity: .0, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false });
const glyphs = new THREE.Mesh(new THREE.PlaneGeometry(1.95, 1.65), glyphMat); glyphs.position.z = .445; hero.add(glyphs);
// address plate
const addrA = label('0x7a3f…c91e', { font: '700 84px "Space Mono"', color: '#e9edf5', w: 1024, h: 150 });
const addrB = label('0x19be…04d2', { font: '700 84px "Space Mono"', color: '#e9edf5', w: 1024, h: 150 });
for (const a of [addrA, addrB]) { a.scale.setScalar(.27); a.position.set(0, -.6, .46); hero.add(a); }
const heroGlow = glowSprite(0x00ec97, 3.0, 0); heroGlow.position.z = -.6; hero.add(heroGlow);
// sparks for the break
const sparks = (() => {
  const n = 220, p = new Float32Array(n * 3);
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(p, 3));
  const pts = new THREE.Points(g, new THREE.PointsMaterial({ color: 0xff6a3a, size: .05, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }));
  hero.add(pts); return pts;
})();
function updateSparks(age) {
  const a = sparks.geometry.attributes.position.array; const n = a.length / 3;
  sparks.visible = age > 0 && age < 2.2; if (!sparks.visible) return;
  for (let i = 0; i < n; i++) {
    const th = hash(i) * Math.PI * 2, sp = 1.5 + hash(i + 5) * 3.5, up = 1 + hash(i + 9) * 3;
    a[i * 3] = Math.cos(th) * sp * age; a[i * 3 + 1] = 1.1 + up * age - 4.9 * age * age; a[i * 3 + 2] = .5 + Math.sin(th) * sp * age * .6;
  }
  sparks.geometry.attributes.position.needsUpdate = true; sparks.material.opacity = 1 - age / 2.2;
}

// assets chained to the address (coins + crates)
const assets = new THREE.Group(); scene.add(assets);
const coinMat = new THREE.MeshStandardMaterial({ color: 0xf2b84b, metalness: 1, roughness: .25, emissive: 0x3a2400 });
const NC = 90, coins = new THREE.InstancedMesh(new THREE.CylinderGeometry(.28, .28, .06, 32), coinMat, NC); assets.add(coins);
const coinBase = [];
for (let i = 0; i < NC; i++) coinBase.push({ x: (hash(i) - .5) * 4.2, y: -1.4 + hash(i + 1) * 3.2, z: -1.6 - hash(i + 2) * 2.5, rx: hash(i + 3) * 3, rz: hash(i + 4) * 3, d: hash(i + 6) });
const crateMat = new THREE.MeshStandardMaterial({ color: 0x6b4a2b, roughness: .8, metalness: .1 });
const crates = [];
for (let i = 0; i < 4; i++) { const s = .7 + hash(i + 40) * .5; const c = new THREE.Mesh(new THREE.BoxGeometry(s, s, s), crateMat); c.userData = { x: -1.8 + i * 1.2, y: -1.3, z: -1.2 - hash(i + 41) * 1.5, s }; assets.add(c); crates.push(c); }
const chainMat = new THREE.MeshStandardMaterial({ color: 0x9aa3b2, metalness: 1, roughness: .3 });
const chain = new THREE.Group(); assets.add(chain);
for (let i = 0; i < 14; i++) { const l = new THREE.Mesh(new THREE.TorusGeometry(.09, .025, 8, 16), chainMat); l.position.set(-1.2 + i * .0, -.2 - i * 0.0, -.4 - i * .18); l.rotation.y = (i % 2) * Math.PI / 2; chain.add(l); }

// ---------- SET: quantum computer ----------
const qc = new THREE.Group(); scene.add(qc);
const gold = new THREE.MeshStandardMaterial({ color: 0xd9a54c, metalness: 1, roughness: .26, emissive: 0x1a0d00 });
{
  const tiers = [[1.6, 0], [1.25, -1.0], [.95, -1.9], [.65, -2.7], [.4, -3.35]];
  const top = new THREE.Mesh(new THREE.CylinderGeometry(.08, .08, 3, 16), gold); top.position.y = 1.5; qc.add(top);
  tiers.forEach(([r, y], k) => {
    const d = new THREE.Mesh(new THREE.CylinderGeometry(r, r, .1, 64), gold); d.position.y = y; qc.add(d);
    if (k < tiers.length - 1) {
      const [r2, y2] = tiers[k + 1];
      for (let j = 0; j < 9; j++) {
        const a0 = j / 9 * Math.PI * 2 + k, a1 = a0 + .8 * (hash(j + k * 9) - .5);
        const pts = [V(Math.cos(a0) * r * .85, y, Math.sin(a0) * r * .85), V(Math.cos(a0 + .4) * r * .6, (y + y2) / 2 + .1, Math.sin(a0 + .4) * r * .6), V(Math.cos(a1) * r2 * .8, y2, Math.sin(a1) * r2 * .8)];
        const tube = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 24, .022, 8), gold); qc.add(tube);
      }
    }
  });
  const chip = new THREE.Mesh(new THREE.BoxGeometry(.5, .25, .5), new THREE.MeshStandardMaterial({ color: 0x8b5cf6, emissive: 0x8b5cf6, emissiveIntensity: 1.2 }));
  chip.position.y = -3.6; qc.add(chip);
}
const qGlow = glowSprite(0x8b5cf6, 6, .45); qGlow.position.y = -1.6; qc.add(qGlow);
const qLight = new THREE.PointLight(0x9b6bff, 0, 12, 1.4); qLight.position.y = -2.5; qc.add(qLight);
const qubits = (() => {
  const n = 160, p = new Float32Array(n * 3); const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(p, 3));
  const pts = new THREE.Points(g, new THREE.PointsMaterial({ color: 0xc4a8ff, size: .07, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }));
  qc.add(pts); return pts;
})();
function updateQubits(t) {
  const a = qubits.geometry.attributes.position.array, n = a.length / 3;
  for (let i = 0; i < n; i++) {
    const r = .6 + hash(i) * 2.2, sp = .4 + hash(i + 2) * 1.2, ph = hash(i + 4) * 6.28, y = -3.6 + hash(i + 6) * 4;
    a[i * 3] = Math.cos(ph + t * sp) * r; a[i * 3 + 1] = y + Math.sin(t * sp * 1.7 + ph) * .15; a[i * 3 + 2] = Math.sin(ph + t * sp) * r;
  }
  qubits.geometry.attributes.position.needsUpdate = true;
}

// ---------- SET: NEAR nameplate + keyring ----------
const near = new THREE.Group(); scene.add(near);
const glassMat = new THREE.MeshStandardMaterial({ color: 0x0c1512, metalness: .6, roughness: .2 });
const plate = new THREE.Mesh(new THREE.ExtrudeGeometry(roundedRect(3.4, 1.0, .2), { depth: .18, bevelEnabled: true, bevelSize: .04, bevelThickness: .04, bevelSegments: 3 }), glassMat);
plate.position.y = 1.6; near.add(plate);
const plateEdge = new THREE.Mesh(new THREE.TorusGeometry(1, .01, 4, 4), new THREE.MeshBasicMaterial({ color: 0x00ec97 }));
const plateText = label('alice.near', { font: '700 120px "Space Mono"', color: '#ffffff', w: 1024, h: 200 });
plateText.scale.setScalar(.55); plateText.position.set(0, 1.6, .25); near.add(plateText);
const plateLine = new THREE.Mesh(new THREE.PlaneGeometry(3.2, .03), new THREE.MeshBasicMaterial({ color: 0x00ec97, toneMapped: false }));
plateLine.position.set(0, 1.16, .24); near.add(plateLine);
const ring = new THREE.Mesh(new THREE.TorusGeometry(.42, .045, 16, 64), steel); near.add(ring);
const ringPivot = new THREE.Group(); ringPivot.position.y = 1.05; near.add(ringPivot);
const hook = new THREE.Mesh(new THREE.CylinderGeometry(.03, .03, .55, 12), steel); hook.position.y = -.27; ringPivot.add(hook);
ring.position.y = -.95; ring.parent.remove(ring); ringPivot.add(ring);
function keyShape() {
  const s = new THREE.Shape(); s.absarc(0, 0, .32, 0, Math.PI * 2, false);
  const hole = new THREE.Path(); hole.absarc(0, 0, .13, 0, Math.PI * 2, true); s.holes.push(hole);
  const b = new THREE.Shape(); b.moveTo(.25, -.07); b.lineTo(1.45, -.07); b.lineTo(1.45, -.3); b.lineTo(1.33, -.3); b.lineTo(1.33, -.18); b.lineTo(1.2, -.18); b.lineTo(1.2, -.27);
  b.lineTo(1.05, -.27); b.lineTo(1.05, -.18); b.lineTo(.9, -.18); b.lineTo(.9, -.24); b.lineTo(.8, -.24); b.lineTo(.8, -.07); b.lineTo(.8, .07); b.lineTo(.25, .07); b.lineTo(.25, -.07);
  return [s, b];
}
const keyGeo = new THREE.ExtrudeGeometry(keyShape(), { depth: .06, bevelEnabled: true, bevelSize: .015, bevelThickness: .015, bevelSegments: 2 });
keyGeo.translate(-0.0, 0, -.03);
const oldKeyMat = new THREE.MeshStandardMaterial({ color: 0x9aa3b2, metalness: 1, roughness: .32 });
const newKeyMat = new THREE.MeshStandardMaterial({ color: 0x00ec97, metalness: .4, roughness: .15, emissive: 0x00ec97, emissiveIntensity: .18 });
const oldKey = new THREE.Group(), newKey = new THREE.Group();
{ const m = new THREE.Mesh(keyGeo, oldKeyMat); m.rotation.z = -Math.PI / 2 - .25; m.position.set(-.08, 0, 0); oldKey.add(m); }
{ const m = new THREE.Mesh(keyGeo, newKeyMat); m.rotation.z = -Math.PI / 2 + .25; m.position.set(.08, 0, 0); newKey.add(m); }
oldKey.position.y = -1.3; newKey.position.y = -1.3; ringPivot.add(oldKey, newKey);
const newKeyGlow = glowSprite(0x00ec97, 2.6, 0); newKeyGlow.position.set(.15, -2.0, .2); ringPivot.add(newKeyGlow);
const nearGlow = glowSprite(0x00ec97, 9, 0); nearGlow.position.set(0, .4, -2.5); near.add(nearGlow);
const keyCrystal = (() => { // crystalline lattice motes around the new key
  const n = 90, p = new Float32Array(n * 3); const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(p, 3));
  const pts = new THREE.Points(g, new THREE.PointsMaterial({ color: 0x9dffd8, size: .05, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }));
  ringPivot.add(pts); return pts;
})();

// ---------- SET: lattice ----------
const lattice = new THREE.Group(); scene.add(lattice);
const LN = 7, b1 = V(1, .18, 0), b2 = V(.32, 1, .1), b3 = V(.1, .25, 1); // skewed basis: a real lattice
const lp = [], li = [];
for (let i = -LN; i <= LN; i++) for (let j = -LN; j <= LN; j++) for (let k = -LN; k <= LN * 2; k++) {
  const p = b1.clone().multiplyScalar(i).add(b2.clone().multiplyScalar(j)).add(b3.clone().multiplyScalar(k)).multiplyScalar(.9);
  if (Math.abs(p.x) > 6 || Math.abs(p.y) > 9) continue; lp.push(p);
}
{
  const pos = new Float32Array(lp.length * 3); lp.forEach((p, i) => p.toArray(pos, i * 3));
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  lattice.add(new THREE.Points(g, new THREE.PointsMaterial({ color: 0x9dffd8, size: .07, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false })));
  const seg = []; const step = [b1, b2, b3].map(b => b.clone().multiplyScalar(.9));
  const key = p => p.toArray().map(v => v.toFixed(2)).join(',');
  const set = new Set(lp.map(key));
  for (const p of lp) for (const s of step) { const q = p.clone().add(s); if (set.has(key(q))) seg.push(...p.toArray(), ...q.toArray()); }
  const lg = new THREE.BufferGeometry(); lg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(seg), 3));
  lattice.add(new THREE.LineSegments(lg, new THREE.LineBasicMaterial({ color: 0x00ec97, transparent: true, opacity: .16, blending: THREE.AdditiveBlending, depthWrite: false })));
}
const beam = new THREE.Mesh(new THREE.CylinderGeometry(.05, .05, 1, 12, 1, true), new THREE.MeshBasicMaterial({ color: 0xb48bff, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }));
beam.rotation.x = Math.PI / 2; lattice.add(beam);
const beamHead = glowSprite(0xb48bff, 1.6, 1); lattice.add(beamHead);
const scatter = (() => {
  const n = 160, p = new Float32Array(n * 3); const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(p, 3));
  const pts = new THREE.Points(g, new THREE.PointsMaterial({ color: 0xc9b0ff, size: .06, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }));
  lattice.add(pts); return pts;
})();

// ---------- SET: roadmap gates ----------
const road = new THREE.Group(); scene.add(road);
const gateDefs = [{ x: -1.3, z: 0, c: 0x00ec97, txt: 'YOUR ACCOUNT', sub: '✓ LIVE · 2.13' }, { x: 1.4, z: -8, c: 0x8b5cf6, txt: 'VALIDATORS', sub: 'NEXT' }, { x: -1.0, z: -16, c: 0x8b5cf6, txt: 'CONSENSUS', sub: 'NEXT' }];
const gates = gateDefs.map((d, i) => {
  const g = new THREE.Group(); g.position.set(d.x, 0, d.z);
  const mat = new THREE.MeshStandardMaterial({ color: 0x111111, emissive: d.c, emissiveIntensity: .15, metalness: .5, roughness: .4 });
  const frame = new THREE.Mesh(new THREE.TorusGeometry(1.5, .08, 16, 6), mat); frame.rotation.z = Math.PI / 6; g.add(frame);
  const l = label(d.txt, { font: '700 110px "Archivo Black"', color: '#ffffff', w: 1400, h: 180 }); l.scale.setScalar(.6); l.position.y = 2.75; g.add(l);
  const s = label(d.sub, { font: '700 90px "Space Mono"', color: i === 0 ? '#00ec97' : '#b48bff', w: 1024, h: 150 }); s.scale.setScalar(.4); s.position.y = 2.05; g.add(s);
  const glow = glowSprite(d.c, 6, 0); g.add(glow);
  g.userData = { mat, glow, l, s, frame }; road.add(g); return g;
});
const floor = new THREE.GridHelper(80, 80, 0x1f6b52, 0x0e2a22); floor.position.y = -2.4; road.add(floor);

// ---------- post: bloom + grade ----------
const composer = new EffectComposer(renderer);
composer.setPixelRatio(1); composer.setSize(W, H);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(W / 2, H / 2), 0.32, 0.35, 0.86); composer.addPass(bloom);
const grade = new ShaderPass({
  uniforms: {
    tDiffuse: { value: null }, uTime: { value: 0 }, uGrain: { value: .07 }, uVig: { value: .55 }, uAb: { value: .0015 },
    uTint: { value: new THREE.Color(1, 1, 1) }, uTintAmt: { value: 0 }, uFlash: { value: 0 }, uSat: { value: 1 }, uContrast: { value: 1.08 }, uLift: { value: new THREE.Color(0.0, 0.01, 0.02) }
  },
  vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
  fragmentShader: `
    uniform sampler2D tDiffuse; uniform float uTime,uGrain,uVig,uAb,uTintAmt,uFlash,uSat,uContrast; uniform vec3 uTint,uLift; varying vec2 vUv;
    float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233)))*43758.5453); }
    void main(){
      vec2 d = vUv-.5; float r = dot(d,d);
      vec3 col; col.r = texture2D(tDiffuse, vUv + d*uAb*(1.+r*4.)).r; col.g = texture2D(tDiffuse, vUv).g; col.b = texture2D(tDiffuse, vUv - d*uAb*(1.+r*4.)).b;
      float l = dot(col, vec3(.299,.587,.114));
      col = mix(vec3(l), col, uSat);
      col = (col-.5)*uContrast+.5;
      col = mix(col, col*uTint*1.4, uTintAmt);
      col += uLift*(1.-l);
      col *= 1. - uVig*smoothstep(.08,.55,r*1.6);
      float g = h(vUv*vec2(720.,1280.) + fract(uTime*7.13)*100.) - .5; col += g*uGrain;
      col = mix(col, vec3(1.), uFlash);
      gl_FragColor = vec4(col,1.);
    }`
});
composer.addPass(grade);
composer.addPass(new OutputPass());

// ---------- timeline data ----------
const IMPACTS = [[6.96, 1], [17.31, 1], [29.58, 1], [44.88, .8], [54.74, .45], [56.24, .3], [74.49, .7], [80.36, 1]];
const CUTS = [6.96, 8.8, 14.75, 18.3, 23.25, 29.5, 41.0, 53.0, 60.2, 66.0, 74.45, 78.8];
function impact(t) { let f = 0, ab = 0, sh = 0; for (const [ti, k] of IMPACTS) { const a = t - ti; if (a >= 0 && a < 1.2) { f = Math.max(f, k * .85 * Math.exp(-a * 14)); ab = Math.max(ab, k * .02 * Math.exp(-a * 5)); sh = Math.max(sh, k * Math.exp(-a * 6)); } } for (const c of CUTS) { const a = t - c; if (a >= 0 && a < .3) ab = Math.max(ab, .008 * Math.exp(-a * 12)); } return { f, ab, sh }; }

function shotOf(t) {
  if (t < 6.96) return 'hook'; if (t < 8.8) return 'qday'; if (t < 14.75) return 'lock'; if (t < 18.3) return 'quantum';
  if (t < 23.25) return 'clock'; if (t < 29.5) return 'address'; if (t < 41.0) return 'near'; if (t < 53.0) return 'lattice';
  if (t < 60.2) return 'swap'; if (t < 66.0) return 'term'; if (t < 74.45) return 'road'; return 'finale';
}
function show(...gs) { for (const g of [globe, hero, assets, qc, near, lattice, road]) g.visible = gs.includes(g); }

function lookFrom(pos, target, roll = 0) { camera.position.copy(pos); camera.up.set(Math.sin(roll), Math.cos(roll), 0); camera.lookAt(target); }

function renderAt(t) {
  const shot = shotOf(t); const imp = impact(t);
  const shake = V(noise1(t * 18, 1), noise1(t * 18, 2), 0).multiplyScalar(imp.sh * .12 + .004);
  let tint = C(0xffffff), tintAmt = 0, sat = 1, contrast = 1.1, exposure = 1.0;
  accent.intensity = 0; qLight.intensity = 0; scene.fog.density = .03; stars.visible = true; dust.visible = true;
  glowU.value = .35; scene.environmentIntensity = .55;

  if (shot === 'hook' || shot === 'qday' || shot === 'clock' || shot === 'finale') {
    show(globe);
    const origin = lockPos[420];
    let redWave = 0, greenWave = 0, rot = .3 + t * .045;
    let camP, camT = V(0, 0, 0);
    if (shot === 'hook') {
      redWave = eOutExpo(rng(2.4, 6.9, t)) * 6.5;
      const k = eInOut(rng(0, 6.9, t));
      camP = V(lerp(1.2, 0, k), lerp(.4, .2, k), lerp(4.3, 10.5, k)); camT = V(lerp(.6, 0, k), lerp(.2, 0, k), 0);
      glowU.value = .25 + .45 * rng(2.4, 6, t);
      tint = C(0xff6040); tintAmt = .25 * rng(3, 6.9, t);
    } else if (shot === 'qday') {
      redWave = 9; const k = rng(6.96, 8.8, t); camP = V(0, 0, lerp(8.2, 7.4, k)); glowU.value = .8; tint = C(0xff3020); tintAmt = .45; contrast = 1.25;
      accent.intensity = 0; scene.fog.density = .02;
    } else if (shot === 'clock') {
      redWave = 9; rot = 1.2 + t * .02; const k = rng(18.3, 23.25, t);
      camP = V(lerp(-3, 3, k), lerp(4.5, 2.5, k), lerp(6.5, 6, k)); camT = V(0, -.4, 0); glowU.value = .55; tint = C(0xff4a30); tintAmt = .3; sat = .85;
    } else { // finale: everything turns green
      redWave = 9; greenWave = eInOut(rng(74.6, 78.6, t)) * 7;
      const k = eInOut(rng(74.45, 83, t)); camP = V(lerp(1.5, 0, k), lerp(.8, .6, k), lerp(6, 14, k));
      glowU.value = lerp(.55, .85, rng(74.6, 78.6, t)); tint = C(0x30ffb0); tintAmt = .22 * rng(75, 79, t);
      if (t > 78.8) { const f = rng(78.8, 79.6, t); exposure = lerp(1, .35, f); }
    }
    updateGlobe(t, origin, redWave, shot === 'finale' ? lockPos[420] : null, greenWave, rot);
    lookFrom(camP.add(shake), camT);
    atmo.material.opacity = .12 * sstep(7, 11, camera.position.length());
  }

  if (shot === 'lock' || shot === 'quantum' || shot === 'address') {
    show(hero, ...(shot === 'quantum' ? [qc] : []), ...(shot === 'address' ? [assets] : []));
    hero.position.set(0, 0, 0); hero.rotation.set(0, 0, 0); shackle.position.set(0, 0, 0); shackle.rotation.set(0, 0, 0);
    glyphTex.offset.set(0, -t * .06); addrA.visible = addrB.visible = false; heroGlow.material.opacity = 0; sparks.visible = false;
    keyholeMat.color.set(0x00ec97); glyphMat.color.set(0x00ec97);
    if (shot === 'lock') {
      glyphMat.opacity = .25 + .55 * sstep(8.9, 10.4, t);
      const k = eInOut(rng(8.8, 14.75, t));
      const ang = lerp(-.7, .35, k);
      lookFrom(V(Math.sin(ang) * lerp(2.4, 6.2, k), lerp(.2, 1.0, k), Math.cos(ang) * lerp(2.4, 6.2, k)).add(shake), V(0, lerp(.1, .4, k), 0));
      heroGlow.material.opacity = .1; tint = C(0x50a0ff); tintAmt = .12;
    } else if (shot === 'quantum') {
      qc.position.set(0, lerp(10.5, 6.4, eOutExpo(rng(14.75, 16.2, t))), -.8); qc.rotation.y = t * .25; updateQubits(t);
      qLight.intensity = 22 * rng(14.8, 15.6, t); qGlow.material.opacity = .45;
      const k = eInOut(rng(14.75, 18.3, t));
      lookFrom(V(lerp(3.5, 1.5, k), lerp(.8, 1.6, k), lerp(8, 9.6, k)).add(shake), V(0, lerp(1.8, 2.2, k), 0));
      tint = C(0x9b6bff); tintAmt = .28;
      const brk = t - 17.31;
      glyphMat.opacity = .7;
      if (brk >= 0) {
        const o = eOutBack(clamp(brk / .35));
        shackle.position.y = .55 * o; shackle.rotation.y = -.55 * o; shackle.position.x = .62 * (1 - Math.cos(-.55 * o));
        keyholeMat.color.set(0xff2d1f); glyphMat.color.set(0xff3a2a); accent.intensity = 8 * Math.exp(-brk * 1.5) + 2; accent.position.set(0, 1, 2);
        updateSparks(brk); tint = C(0xff3a2a); tintAmt = .35;
      } else {
        // a beam of qubits finds the path — glyphs flicker violet
        glyphMat.color.lerp(C(0xb48bff), rng(16.3, 17.3, t));
      }
    } else { // address
      addrA.visible = t < 26.17; addrB.visible = t >= 26.17; glyphMat.opacity = .12;
      // "New lock?" — lock swaps (spin) at 25.36
      const sw = rng(25.36, 25.9, t); hero.rotation.y = eInOut(sw) * Math.PI * 2;
      // move everything at 27.97
      const mv = rng(27.97, 29.3, t);
      for (let i = 0; i < NC; i++) {
        const b = coinBase[i]; const m = Math.max(0, mv - b.d * .25) * 1.4;
        _o.position.set(b.x + m * m * 14, b.y + m * 1.5, b.z); _o.rotation.set(b.rx + t * (1 + b.d) + m * 8, 0, b.rz); _o.scale.setScalar(1); _o.updateMatrix(); coins.setMatrixAt(i, _o.matrix);
      }
      coins.instanceMatrix.needsUpdate = true;
      crates.forEach((c, i) => { const u = c.userData; const m = Math.max(0, mv - i * .08) * 1.4; c.position.set(u.x + m * m * 12, u.y + m * .6, u.z); c.rotation.set(m * 3, .4 + i + m * 2, m); });
      chain.visible = mv < .05;
      hero.position.x = Math.pow(Math.max(0, mv - .3), 2) * 14;
      const k = eInOut(rng(23.25, 29.5, t));
      lookFrom(V(lerp(-2.4, 1.2, k), lerp(1.2, .5, k), lerp(8.6, 9.6, k)).add(shake), V(lerp(-.4, .6, k), -.6, -1));
      tint = C(0xff7a40); tintAmt = .15; sat = .9;
      if (t > 29.0) exposure = lerp(1, .05, rng(29.0, 29.5, t));
    }
  }

  if (shot === 'near' || shot === 'swap') {
    show(near); stars.visible = true;
    plate.visible = plateText.visible = plateLine.visible = true;
    nearGlow.material.opacity = .32; scene.fog.color.set(0x03100b);
    tint = C(0x30ffb0); tintAmt = .18; contrast = 1.12;
    const swing = Math.sin(t * 2.3) * .05 * Math.exp(-((t - 34.94) > 0 ? (t - 34.94) : 0) * .3);
    ringPivot.rotation.z = swing; ringPivot.rotation.y = 0;
    oldKey.visible = true; newKey.visible = false; newKeyGlow.material.opacity = 0; keyCrystal.material.opacity = 0; oldKey.position.set(0, -1.3, 0); oldKey.rotation.set(0, 0, 0);
    if (shot === 'near') {
      const inP = eOutExpo(rng(29.58, 30.6, t)); plate.position.y = plateText.position.y = 1.6; near.position.y = lerp(-1.5, 0, inP); near.rotation.y = lerp(.6, 0, inP);
      plateText.position.y = 1.6; plateLine.scale.x = sstep(31.2, 32.4, t);
      const ringIn = eOutBack(rng(34.94, 35.8, t)); ringPivot.scale.setScalar(Math.max(.001, ringIn));
      // "change the locks": key turns
      const turn = sstep(39.6, 40.4, t); oldKey.rotation.y = turn * Math.PI;
      const k = eInOut(rng(29.5, 41, t));
      lookFrom(V(lerp(2.0, -1.0, k), lerp(.2, .1, k), lerp(10.5, 8.6, k)).add(shake), V(0, lerp(.4, -.2, k), 0));
      if (t < 30.2) { tintAmt = .18 + .3 * (1 - rng(29.58, 30.2, t)); }
    } else {
      plate.visible = plateText.visible = plateLine.visible = false;
      near.position.y = 0; near.rotation.y = 0; ringPivot.scale.setScalar(1); plateLine.scale.x = 1;
      // add new key 54.74
      const add = eOutBack(rng(54.74, 55.5, t)); newKey.visible = t >= 54.74; newKey.scale.setScalar(Math.max(.001, add)); newKey.position.set(0, -1.3, lerp(1.5, 0, add));
      newKeyGlow.material.opacity = .12 * rng(54.74, 55.2, t);
      keyCrystal.material.opacity = .6 * rng(54.74, 55.4, t) * (1 - rng(58, 60, t) * .5);
      { const a = keyCrystal.geometry.attributes.position.array; for (let i = 0; i < a.length / 3; i++) { const r = .3 + hash(i) * .9, th = hash(i + 3) * 6.28 + t * (.5 + hash(i + 5)); a[i * 3] = .1 + Math.cos(th) * r * .5; a[i * 3 + 1] = -1.9 + Math.sin(th * 1.3) * r; a[i * 3 + 2] = Math.sin(th) * r * .5; } keyCrystal.geometry.attributes.position.needsUpdate = true; }
      // remove old key 56.24: unhook & fall
      const rm = Math.max(0, t - 56.24); if (rm > 0) { oldKey.position.set(-rm * .8, -1.3 - 9 * rm * rm, rm * .5); oldKey.rotation.set(rm * 3, 0, rm * 4); }
      oldKey.visible = rm < 1.6;
      ringPivot.rotation.z = Math.sin(t * 3) * .06 * Math.exp(-Math.max(0, t - 54.74) * .7) + (rm > 0 ? Math.sin(rm * 9) * .08 * Math.exp(-rm * 2) : 0);
      const k = eInOut(rng(53, 60.2, t));
      lookFrom(V(lerp(1.0, -.6, k), lerp(-.4, -.1, k), lerp(6.6, 5.8, k)).add(shake), V(0, lerp(-.1, .05, k), 0));
      tintAmt = .22;
    }
  }

  if (shot === 'lattice' || shot === 'term') {
    show(lattice); stars.visible = false; scene.fog.color.set(0x020806); scene.fog.density = .06;
    const tt = shot === 'lattice' ? t : 53 + (t - 60.2) * .3;
    const k = rng(41, 53, tt);
    lattice.rotation.set(.15, .25 + tt * .03, 0);
    lookFrom(V(lerp(1.5, .3, k), lerp(.6, -.2, k), lerp(16, 3, eInOut(k))).add(shake), V(0, 0, lerp(0, -10, k)), noise1(tt * .2, 5) * .05);
    // quantum beam tries and scatters at ~51.6
    const bt = rng(50.6, 51.6, tt); const hit = tt - 51.6;
    beam.visible = beamHead.visible = tt > 50.6 && tt < 51.62;
    const bz = lerp(14, 2.5, bt); beam.position.set(.4, .2, (bz + 14) / 2 + 0); beam.scale.y = Math.max(.01, 14 - bz); beamHead.position.set(.4, .2, bz);
    scatter.visible = hit > 0 && hit < 1.6;
    if (scatter.visible) { const a = scatter.geometry.attributes.position.array; for (let i = 0; i < a.length / 3; i++) { const th = hash(i) * 6.28, ph = hash(i + 2) * 3.14, sp = 1 + hash(i + 4) * 3; a[i * 3] = .4 + Math.sin(ph) * Math.cos(th) * sp * hit; a[i * 3 + 1] = .2 + Math.cos(ph) * sp * hit; a[i * 3 + 2] = 2.5 + Math.sin(ph) * Math.sin(th) * sp * hit; } scatter.geometry.attributes.position.needsUpdate = true; scatter.material.opacity = 1 - hit / 1.6; }
    tint = C(0x30ffc0); tintAmt = .2; contrast = 1.15;
    if (shot === 'term') { exposure = .55; sat = .7; }
  }

  if (shot === 'road') {
    show(road); scene.fog.color.set(0x04060a); scene.fog.density = .03;
    const k = rng(66, 74.45, t);
    const e = eInOut(k);
    lookFrom(V(lerp(1.5, -1.0, e), lerp(7, 5.5, e), lerp(26, 20, e)).add(shake), V(0, -1.5, -8));
    const lit = [rng(67.84, 68.4, t), rng(71.07, 71.6, t), rng(72.1, 72.6, t)];
    gates.forEach((g, i) => { g.userData.mat.emissiveIntensity = .12 + 1.1 * lit[i]; g.userData.glow.material.opacity = .15 * lit[i]; g.userData.frame.rotation.z = Math.PI / 6 + t * .15 * (i % 2 ? -1 : 1); g.userData.l.visible = g.userData.s.visible = false; });
    tint = C(0x9b80ff); tintAmt = .14;
  }

  dust.rotation.y = t * .02; dust.position.copy(camera.position).multiplyScalar(.0);
  renderer.toneMappingExposure = exposure;
  const u = grade.uniforms; u.uTime.value = t; u.uFlash.value = imp.f; u.uAb.value = .0012 + imp.ab; u.uTint.value.copy(tint); u.uTintAmt.value = tintAmt; u.uSat.value = sat; u.uContrast.value = contrast;
  bloom.strength = .32 + imp.f * .45;
  composer.render();
}

window.addEventListener('hf-seek', (e) => renderAt(e.detail.time));
(async () => {
  try { await Promise.all(['700 30px "Space Mono"', '700 110px "Archivo Black"'].map(f => document.fonts.load(f))); } catch (e) {}
  glyphTex.needsUpdate = true;
  renderAt(0);
  window.__threeReady && window.__threeReady();
})();
window.__renderAt = renderAt;
