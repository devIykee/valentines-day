// Sample data, pricing model and the deterministic match engine.
// Everything on screen is a function of T (seconds since the session's match clock started).

export const SPORTS = [
  { id: 'soccer', name: 'Soccer' }, { id: 'tennis', name: 'Tennis' }, { id: 'basketball', name: 'Basketball' },
  { id: 'baseball', name: 'Baseball' }, { id: 'amfootball', name: 'American Football' }, { id: 'esports', name: 'Esports' },
];
export const COMPS = {
  pl: { name: 'Premier League', country: 'England', code: 'PL' },
  ucl: { name: 'Champions League', country: 'Europe', code: 'CL' },
  laliga: { name: 'LaLiga', country: 'Spain', code: 'LL' },
  seriea: { name: 'Serie A', country: 'Italy', code: 'SA' },
  bundesliga: { name: 'Bundesliga', country: 'Germany', code: 'BL' },
};
export const COMP_ORDER = ['pl', 'ucl', 'laliga', 'seriea', 'bundesliga'];

// [name, short, code, colour A, colour B, crest pattern]
const T = (name, short, code, a, b, pat) => ({ name, short, code, a, b, pat });
export const TEAMS = {
  ars: T('Arsenal', 'Arsenal', 'ARS', '#e0263a', '#ffffff', 'chev'), bha: T('Brighton & Hove Albion', 'Brighton', 'BHA', '#1565c8', '#ffffff', 'stripe'),
  avl: T('Aston Villa', 'Aston Villa', 'AVL', '#7b1e3c', '#8fc7ea', 'half'), ful: T('Fulham', 'Fulham', 'FUL', '#f2f2f2', '#16181d', 'hoop'),
  new: T('Newcastle United', 'Newcastle', 'NEW', '#16181d', '#f2f2f2', 'stripe'), eve: T('Everton', 'Everton', 'EVE', '#1f4fb5', '#f2f2f2', 'plain'),
  liv: T('Liverpool', 'Liverpool', 'LIV', '#c8102e', '#1aa58a', 'plain'), mun: T('Manchester United', 'Man Utd', 'MUN', '#d81f2a', '#f6c53a', 'chev'),
  mci: T('Manchester City', 'Man City', 'MCI', '#74b8e8', '#12305c', 'half'), tot: T('Tottenham Hotspur', 'Spurs', 'TOT', '#f2f2f2', '#14254d', 'plain'),
  che: T('Chelsea', 'Chelsea', 'CHE', '#1b3fa0', '#f2f2f2', 'hoop'), whu: T('West Ham United', 'West Ham', 'WHU', '#7c2c3b', '#9ccbe8', 'chev'),
  atm: T('Atlético Madrid', 'Atlético', 'ATM', '#d2232a', '#f2f2f2', 'stripe'), sev: T('Sevilla', 'Sevilla', 'SEV', '#f2f2f2', '#d2232a', 'half'),
  rma: T('Real Madrid', 'Real Madrid', 'RMA', '#f4f4f4', '#c9a227', 'plain'), bar: T('Barcelona', 'Barcelona', 'BAR', '#17408b', '#a4123f', 'stripe'),
  vil: T('Villarreal', 'Villarreal', 'VIL', '#f5d130', '#1b3f8b', 'plain'), bet: T('Real Betis', 'Betis', 'BET', '#17964d', '#f2f2f2', 'stripe'),
  juv: T('Juventus', 'Juventus', 'JUV', '#f2f2f2', '#16181d', 'stripe'), rom: T('Roma', 'Roma', 'ROM', '#9a1f2e', '#f2b23a', 'half'),
  int: T('Inter', 'Inter', 'INT', '#1b3fa0', '#16181d', 'stripe'), mil: T('Milan', 'Milan', 'MIL', '#d2232a', '#16181d', 'stripe'),
  nap: T('Napoli', 'Napoli', 'NAP', '#2d9bdc', '#f2f2f2', 'plain'), laz: T('Lazio', 'Lazio', 'LAZ', '#9fd3f0', '#f2f2f2', 'hoop'),
  bay: T('Bayern Munich', 'Bayern', 'BAY', '#d2232a', '#f2f2f2', 'hoop'), bvb: T('Borussia Dortmund', 'Dortmund', 'BVB', '#f6d32d', '#16181d', 'chev'),
  b04: T('Bayer Leverkusen', 'Leverkusen', 'B04', '#d2232a', '#16181d', 'half'), rbl: T('RB Leipzig', 'Leipzig', 'RBL', '#f2f2f2', '#d2232a', 'chev'),
  psg: T('Paris Saint-Germain', 'Paris SG', 'PSG', '#14254d', '#d2232a', 'stripe'), sge: T('Eintracht Frankfurt', 'Frankfurt', 'SGE', '#16181d', '#d2232a', 'half'),
};

// Invented players. No real people.
const SQUAD = {
  ars: [['T. Marlowe', .26], ['D. Okonjo', .2], ['R. Vance', .15], ['L. Ferreira', .12], ['J. Sandoval', .09], ['K. Adeyemi', .07]],
  bha: [['M. Hartley', .25], ['S. Brandt', .19], ['E. Quaye', .15], ['P. Lindqvist', .12], ['A. Moreau', .1], ['C. Whitlock', .07]],
};
const squad = id => SQUAD[id] || ['Forward A', 'Forward B', 'Winger A', 'Midfielder A', 'Midfielder B', 'Defender A'].map((n, i) => [`${TEAMS[id].code} ${n}`, [.25, .2, .15, .12, .1, .07][i]]);

const G = 'goal';
// f(id, comp, home, away, target 1X2, live?, extra)
const live = (id, comp, home, away, target, min, score, extra = {}) => ({ id, sport: 'soccer', comp, home, away, target, live: { sec: min * 60, score, h1: extra.h1 || score }, n: extra.n || 60, ...extra });
const soon = (id, comp, home, away, target, ko, n = 60) => ({ id, sport: 'soccer', comp, home, away, target, ko, n });

export const FIXTURES = [
  live('ars-bha', 'pl', 'ars', 'bha', [1.30, 4.60, 11.00], 52, [1, 0], {
    featured: 1,
    script: [
      { t: 8, mult: [1.07, 1] }, { t: 14, mult: [.97, .93] },
      { t: 22, sus: 'VAR check: possible penalty', scope: G }, { t: 30, open: 'No penalty', mult: [1, 1.12] },
      { t: 45, mult: [1.03, 1.1] },
      { t: 75, sus: 'Goal check', scope: G }, { t: 79, goal: 1, scorer: 'M. Hartley' }, { t: 84, open: 'Goal: Brighton', mult: [1.05, 1] },
    ],
  }),
  live('avl-ful', 'pl', 'avl', 'ful', [2.25, 2.90, 3.60], 45, [0, 0], { ht: 1, n: 58 }),
  live('new-eve', 'pl', 'new', 'eve', [1.45, 4.20, 7.50], 58, [2, 1], { n: 57, script: [{ t: 0, sus: 'Goal check', scope: G }, { t: 38, open: 'No goal' }] }),
  live('atm-sev', 'laliga', 'atm', 'sev', [1.40, 4.20, 9.00], 37, [1, 0], { n: 59, script: [{ t: 0, sus: 'Penalty', scope: G }, { t: 58, goal: 0, scorer: 'ATM Forward A' }, { t: 64, open: 'Goal: Atlético' }] }),
  live('juv-rom', 'seriea', 'juv', 'rom', [2.40, 3.10, 3.20], 49, [1, 1], { n: 57 }),
  live('b04-bvb', 'bundesliga', 'b04', 'bvb', [2.30, 3.30, 3.10], 63, [2, 2], { n: 56 }),
  soon('liv-mun', 'pl', 'liv', 'mun', [1.65, 4.00, 4.33], 18, 61), soon('mci-tot', 'pl', 'mci', 'tot', [1.50, 4.50, 5.25], 47, 61),
  soon('che-whu', 'pl', 'che', 'whu', [1.70, 3.80, 4.75], 138), soon('ars-int', 'ucl', 'ars', 'int', [1.95, 3.50, 4.00], 260, 59),
  soon('rma-bay', 'ucl', 'rma', 'bay', [2.20, 3.70, 2.90], 260, 60), soon('bar-psg', 'ucl', 'bar', 'psg', [2.05, 3.70, 3.30], 260, 60),
  soon('bvb-juv', 'ucl', 'bvb', 'juv', [2.35, 3.40, 2.95], 1700), soon('rma-vil', 'laliga', 'rma', 'vil', [1.40, 4.80, 7.00], 195),
  soon('bar-bet', 'laliga', 'bar', 'bet', [1.36, 5.00, 7.50], 1560), soon('sev-vil', 'laliga', 'sev', 'vil', [2.55, 3.25, 2.80], 3000),
  soon('nap-mil', 'seriea', 'nap', 'mil', [2.10, 3.30, 3.50], 52), soon('int-laz', 'seriea', 'int', 'laz', [1.55, 4.00, 6.00], 1620),
  soon('rom-nap', 'seriea', 'rom', 'nap', [2.70, 3.20, 2.65], 3060), soon('bay-rbl', 'bundesliga', 'bay', 'rbl', [1.50, 4.60, 5.50], 110),
  soon('sge-b04', 'bundesliga', 'sge', 'b04', [3.10, 3.60, 2.20], 1590), soon('rbl-bvb', 'bundesliga', 'rbl', 'bvb', [2.25, 3.50, 3.00], 3030),
];
// Other sports: two-way markets, invented competitors.
const o = (id, sport, comp, a, b, target, status, score) => ({ id, sport, compName: comp, a, b, target, status, score });
export const OTHERS = [
  o('t1', 'tennis', 'Harbour Open', 'M. Okafor', 'L. Varga', [1.55, 2.40], 'Set 2', '6-4 3-2'),
  o('t2', 'tennis', 'Harbour Open', 'S. Idris', 'P. Keller', [2.10, 1.70], 'Set 1', '4-5'),
  o('t3', 'tennis', 'Coastal Classic', 'A. Novak-Reyes', 'J. Tamm', [1.30, 3.40], 'Set 3', '6-3 4-6 2-1'),
  o('b1', 'basketball', 'Metro League', 'Harbor City', 'Northgate', [1.80, 2.00], 'Q3 04:12', '71-68'),
  o('bb1', 'baseball', 'Summer Series', 'Bay Sox', 'River Kings', [1.65, 2.20], 'Top 6th', '3-2'),
  o('af1', 'amfootball', 'Gridiron Cup', 'Lakeside', 'Ironworks', [1.45, 2.70], 'Q2 08:40', '14-10'),
  o('e1', 'esports', 'Arena Masters', 'Team Vanta', 'Kite Esports', [1.90, 1.90], 'Map 2', '1-0'),
];

/* ---------- maths ---------- */
const hash = s => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return ((h >>> 0) % 100000) / 100000; };
const pois = (l, n = 10) => { const a = []; let p = Math.exp(-l); for (let k = 0; k <= n; k++) { a.push(p); p = p * l / (k + 1); } return a; };
export const ladder = x => { x = Math.max(1.01, Math.min(101, x)); const s = x < 2 ? .01 : x < 5 ? .05 : x < 10 ? .1 : x < 20 ? .5 : 1; return Math.round(x / s) * s; };
export const fmt = x => x.toFixed(2);
const price = (p, over = 1.06) => p <= .002 ? null : ladder(1 / (p * over));

function grid(lh, la) { const H = pois(lh), A = pois(la); return (fn) => { let s = 0; for (let i = 0; i < H.length; i++) for (let j = 0; j < A.length; j++) if (fn(i, j)) s += H[i] * A[j]; return s; }; }
function p1x2(lh, la, sc) { const P = grid(lh, la); return [P((i, j) => i + sc[0] > j + sc[1]), P((i, j) => i + sc[0] === j + sc[1]), P((i, j) => i + sc[0] < j + sc[1])]; }
function fit(target, sc) {
  const over = target.reduce((s, x) => s + 1 / x, 0); let best = [1, 1, 1e9];
  for (let lh = .05; lh < 2.6; lh += .025) for (let la = .05; la < 2.6; la += .025) {
    const p = p1x2(lh, la, sc); let e = 0; for (let k = 0; k < 3; k++) e += (Math.log(1 / (p[k] * over)) - Math.log(target[k])) ** 2;
    if (e < best[2]) best = [lh, la, e];
  }
  return { lh: best[0], la: best[1], over };
}
for (const f of FIXTURES) { const sc = f.live ? f.live.score : [0, 0]; Object.assign(f, fit(f.target, sc)); f.rem0 = f.live ? Math.max(60, 93 * 60 - f.live.sec) : 93 * 60; }
export const fx = id => FIXTURES.find(f => f.id === id) || OTHERS.find(f => f.id === id);

/* ---------- clock ---------- */
const SK = 'hb-clock';
let clock = { base: 0, at: Date.now(), speed: 1, paused: false };
try { const s = JSON.parse(sessionStorage.getItem(SK)); if (s) clock = s; } catch { }
const saveClock = () => { try { sessionStorage.setItem(SK, JSON.stringify(clock)); } catch { } };
saveClock();
export const flags = { freeze: null, nothingLive: false };
export const now = () => flags.freeze != null ? flags.freeze : clock.base + (clock.paused ? 0 : (Date.now() - clock.at) / 1000 * clock.speed);
const rebase = () => { clock.base = now(); clock.at = Date.now(); };
export const control = {
  restart() { clock = { base: 0, at: Date.now(), speed: clock.speed, paused: false }; saveClock(); },
  seek(t) { clock.base = t; clock.at = Date.now(); saveClock(); },
  pause(v) { rebase(); clock.paused = v; saveClock(); },
  speed(v) { rebase(); clock.speed = v; saveClock(); },
  get state() { return clock; },
};
export const sessionStart = (() => { try { let s = +sessionStorage.getItem('hb-start'); if (!s) { s = Date.now(); sessionStorage.setItem('hb-start', s); } return s; } catch { return Date.now(); } })();

/* ---------- match state at time t ---------- */
export function stateOf(f, t = now()) {
  if (f.sport !== 'soccer') return otherState(f, t);
  const isLive = !!f.live && !flags.nothingLive;
  if (!isLive) return { live: false, score: [0, 0], sus: null, note: null, lh: f.lh, la: f.la, rem: 1, koAt: sessionStart + (f.live ? 25 : f.ko) * 60000 };
  let score = [...f.live.score], sus = null, note = null, mh = 1, ma = 1, lastGoal = null;
  for (const e of f.script || []) {
    if (e.t > t) break;
    if (e.mult) { mh *= e.mult[0]; ma *= e.mult[1]; }
    if (e.sus) { sus = { reason: e.sus, scope: e.scope, since: e.t }; note = { text: e.sus, kind: 'warn', t: e.t }; }
    if (e.goal != null) { score[e.goal]++; lastGoal = { side: e.goal, scorer: e.scorer, t: e.t }; }
    if (e.open) { sus = null; note = { text: e.open, kind: 'ok', t: e.t }; }
  }
  if (note && note.kind === 'ok' && t - note.t > 12) note = null;
  const sec = f.ht ? f.live.sec : Math.min(90 * 60, f.live.sec + t);
  const rem = f.ht ? 1 : Math.max(.03, (93 * 60 - sec) / f.rem0);
  const b = Math.floor(t / 13), nz = k => 1 + (hash(f.id + k + b) - .5) * .05;
  return { live: true, ht: !!f.ht, sec, score, sus, note, lastGoal, rem, lh: f.lh * rem * mh * nz('h'), la: f.la * rem * ma * nz('a'), h2: [score[0] - f.live.h1[0], score[1] - f.live.h1[1]] };
}
function otherState(f, t) {
  const b = Math.floor(t / 9), d = (hash(f.id + b) - .5) * .08, over = 1 / f.target[0] + 1 / f.target[1];
  const pa = Math.min(.95, Math.max(.05, 1 / f.target[0] / over + d));
  return { live: !flags.nothingLive, score: f.score, status: f.status, sus: null, probs: [pa, 1 - pa], over };
}
export const clockText = st => !st.live ? '' : st.ht ? 'HT' : st.sec >= 5400 ? "90+'" : Math.floor(st.sec / 60) + "'";
export const clockFull = st => st.ht ? 'HT' : st.sec >= 5400 ? '90:00+' : String(Math.floor(st.sec / 60)).padStart(2, '0') + ':' + String(Math.floor(st.sec % 60)).padStart(2, '0');

/* ---------- markets ---------- */
const TABS = [['popular', 'Popular'], ['goals', 'Goals'], ['halves', 'Halves'], ['handicaps', 'Handicaps'], ['scorers', 'Goalscorers'], ['corners', 'Corners & cards']];
export { TABS };
const cache = new Map();
export function markets(f, t = now()) {
  const key = f.id + '|' + Math.floor(t) + '|' + flags.nothingLive; if (cache.has(key)) return cache.get(key);
  if (cache.size > 80) cache.clear();
  const st = stateOf(f, t), out = [];
  if (f.sport !== 'soccer') {
    out.push({ id: 'win', tab: 'popular', name: 'Winner', cols: 2, sels: [{ k: '1', label: f.a, p: price(st.probs[0], st.over) }, { k: '2', label: f.b, p: price(st.probs[1], st.over) }] });
  } else {
    const h = TEAMS[f.home], a = TEAMS[f.away], [sh, sa] = st.score, P = grid(st.lh, st.la), tot = sh + sa, lt = st.lh + st.la;
    const m = (id, tab, name, sels, opt = {}) => out.push({ id, tab, name, cols: opt.cols || sels.length, dep: opt.dep ?? G, tbl: opt.tbl, sels: sels.filter(s => s.p) });
    const r = [P((i, j) => i + sh > j + sa), P((i, j) => i + sh === j + sa), P((i, j) => i + sh < j + sa)];
    m('1x2', 'popular', 'Match result', [{ k: '1', label: h.name, short: h.short, p: price(r[0], f.over) }, { k: 'x', label: 'Draw', p: price(r[1], f.over) }, { k: '2', label: a.name, short: a.short, p: price(r[2], f.over) }]);
    m('dc', 'popular', 'Double chance', [{ k: '1x', label: `${h.short} or draw`, short: `${h.code} or draw`, p: price(r[0] + r[1], 1.04) }, { k: '12', label: `${h.short} or ${a.short}`, short: `${h.code} or ${a.code}`, p: price(r[0] + r[2], 1.04) }, { k: 'x2', label: `Draw or ${a.short}`, short: `Draw or ${a.code}`, p: price(r[1] + r[2], 1.04) }]);
    const ou = (line) => { const pO = P((i, j) => i + j + tot > line); return [pO, 1 - pO]; };
    const lines = [1.5, 2.5, 3.5, 4.5].filter(l => l > tot - .5);
    const main = lines.find(l => { const p = ou(l)[0]; return p < .78; }) || lines[lines.length - 1];
    const [mo, mu] = ou(main);
    m('ou' + main, 'popular', 'Total goals', [{ k: 'o', label: `Over ${main}`, p: price(mo) }, { k: 'u', label: `Under ${main}`, p: price(mu) }]);
    const btts = P((i, j) => i + sh > 0 && j + sa > 0);
    if (btts < .995) m('btts', 'popular', 'Both teams to score', [{ k: 'y', label: 'Yes', p: price(btts) }, { k: 'n', label: 'No', p: price(1 - btts) }]);
    const p00 = Math.exp(-lt), ng = tot + 1;
    m('ng' + ng, 'popular', `Next goal (goal ${ng})`, [{ k: '1', label: h.short, p: price(st.lh / lt * (1 - p00), 1.07) }, { k: 'n', label: 'No goal', p: price(p00, 1.07) }, { k: '2', label: a.short, p: price(st.la / lt * (1 - p00), 1.07) }]);
    m('dnb', 'popular', 'Draw no bet', [{ k: '1', label: h.short, p: price(r[0] / (r[0] + r[2]), 1.05) }, { k: '2', label: a.short, p: price(r[2] / (r[0] + r[2]), 1.05) }]);
    // Goals
    const tb = (id, tab, name, rows, opt) => out.push({ id, tab, name, tbl: 1, dep: opt?.dep ?? G, head: opt?.head || ['Over', 'Under'], sels: rows.flatMap(([ln, pa, pb, ov]) => { const A = price(pa, ov), B = price(pb, ov); return A && B ? [{ k: 'o' + ln, label: `${opt?.head?.[0] || 'Over'} ${ln}`, line: ln, p: A }, { k: 'u' + ln, label: `${opt?.head?.[1] || 'Under'} ${ln}`, line: ln, p: B }] : []; }) });
    tb('ou', 'goals', 'Total goals: all lines', lines.map(l => [l, ...ou(l)]));
    const tt = (side, sc, lam, nm) => { const Q = pois(lam); const rows = [.5, 1.5, 2.5].filter(l => l > sc - .5).map(l => { let o = 0; Q.forEach((q, k) => { if (k + sc > l) o += q; }); return [l, o, 1 - o]; }); tb('tt' + side, 'goals', `${nm} total goals`, rows); };
    tt('h', sh, st.lh, h.short); tt('a', sa, st.la, a.short);
    const ex = []; for (let n = tot; n <= tot + 3; n++) ex.push({ k: 'e' + n, label: n === tot + 3 ? `${n}+ goals` : `${n} goal${n === 1 ? '' : 's'}`, p: price(n === tot + 3 ? P((i, j) => i + j + tot >= n) : P((i, j) => i + j + tot === n), 1.1) });
    m('exact', 'goals', 'Exact total goals', ex, { cols: 2 });
    const odd = P((i, j) => (i + j + tot) % 2 === 1); m('oe', 'goals', 'Odd or even goals', [{ k: 'o', label: 'Odd', p: price(odd) }, { k: 'e', label: 'Even', p: price(1 - odd) }]);
    // Halves (second half is in play for live fixtures)
    if (st.live && !st.ht && st.sec >= 2700 || st.ht) {
      const [h2h, h2a] = st.h2 || [0, 0], q = [P((i, j) => i + h2h > j + h2a), P((i, j) => i + h2h === j + h2a), P((i, j) => i + h2h < j + h2a)];
      m('2h', 'halves', '2nd half result', [{ k: '1', label: h.short, p: price(q[0]) }, { k: 'x', label: 'Draw', p: price(q[1]) }, { k: '2', label: a.short, p: price(q[2]) }]);
      const t2 = h2h + h2a; tb('2hou', 'halves', '2nd half total goals', [.5, 1.5, 2.5].filter(l => l > t2 - .5).map(l => { const o = P((i, j) => i + j + t2 > l); return [l, o, 1 - o]; }));
      const b2 = P((i, j) => i + h2h > 0 && j + h2a > 0); m('2hbtts', 'halves', '2nd half both teams to score', [{ k: 'y', label: 'Yes', p: price(b2) }, { k: 'n', label: 'No', p: price(1 - b2) }]);
      const g1 = f.live.h1[0] + f.live.h1[1], hm = [P((i, j) => g1 > i + j + t2), P((i, j) => g1 === i + j + t2), P((i, j) => g1 < i + j + t2)];
      m('hmg', 'halves', 'Half with most goals', [{ k: '1', label: '1st half', p: price(hm[0], 1.07) }, { k: 'x', label: 'Tie', p: price(hm[1], 1.07) }, { k: '2', label: '2nd half', p: price(hm[2], 1.07) }]);
    } else {
      const P1 = grid(st.lh * .45, st.la * .45), q = [P1((i, j) => i > j), P1((i, j) => i === j), P1((i, j) => i < j)];
      m('1h', 'halves', '1st half result', [{ k: '1', label: h.short, p: price(q[0]) }, { k: 'x', label: 'Draw', p: price(q[1]) }, { k: '2', label: a.short, p: price(q[2]) }]);
      tb('1hou', 'halves', '1st half total goals', [.5, 1.5].map(l => { const o = P1((i, j) => i + j > l); return [l, o, 1 - o]; }));
    }
    // Handicaps: full-time score, home perspective
    const ah = [-2.5, -1.5, -.5, .5, 1.5].map(l => { const ph = P((i, j) => i + sh + l > j + sa); return [l, ph, 1 - ph]; }).filter(([, p]) => p > .12 && p < .88).slice(0, 3);
    out.push({ id: 'ah', tab: 'handicaps', name: 'Asian handicap', tbl: 1, dep: G, head: [h.short, a.short], sels: ah.flatMap(([l, pa, pb]) => [{ k: 'h' + l, label: `${h.short} ${l > 0 ? '+' : ''}${l}`, line: (l > 0 ? '+' : '') + l, p: price(pa, 1.05) }, { k: 'a' + l, label: `${a.short} ${-l > 0 ? '+' : ''}${-l}`, line: (l > 0 ? '+' : '') + l, p: price(pb, 1.05) }]) });
    for (const l of [-1, 1]) { const q = [P((i, j) => i + sh + l > j + sa), P((i, j) => i + sh + l === j + sa), P((i, j) => i + sh + l < j + sa)]; m('eh' + l, 'handicaps', `3-way handicap (${h.short} ${l > 0 ? '+' : ''}${l})`, [{ k: '1', label: `${h.short} ${l > 0 ? '+' : ''}${l}`, p: price(q[0], 1.07) }, { k: 'x', label: 'Handicap draw', p: price(q[1], 1.07) }, { k: '2', label: `${a.short} ${-l > 0 ? '+' : ''}${-l}`, p: price(q[2], 1.07) }]); }
    // Goalscorers (invented players)
    const ns = [], any = [];
    for (const [tid, lam] of [[f.home, st.lh], [f.away, st.la]]) for (const [nm, share] of squad(tid)) {
      ns.push({ k: nm, label: nm, sub: TEAMS[tid].code, p: price(share * lam / lt * (1 - p00), 1.18) });
      if (!(st.lastGoal && st.lastGoal.scorer === nm)) any.push({ k: nm, label: nm, sub: TEAMS[tid].code, p: price(1 - Math.exp(-share * lam), 1.14) });
    }
    ns.push({ k: 'none', label: 'No goalscorer', p: price(p00, 1.18) });
    m('ngs' + ng, 'scorers', `Next goalscorer (goal ${ng})`, ns, { cols: 3 }); m('ags', 'scorers', 'Anytime goalscorer (from now)', any, { cols: 3 });
    // Corners & cards: independent of the goal markets, so they stay open during goal checks
    const cr = (st.live ? 4.6 * st.rem * (f.rem0 / 5580) : 10.2), base = st.live ? Math.round((93 * 60 - f.rem0) / 5580 * 10) : 0, C = pois(cr, 16);
    const cl = [base + Math.floor(cr) - .5, base + Math.floor(cr) + .5, base + Math.floor(cr) + 1.5];
    tb('crn', 'corners', 'Total corners', cl.map(l => { let ov = 0; C.forEach((q, k) => { if (k + base > l) ov += q; }); return [l, ov, 1 - ov]; }), { dep: 'corner' });
    const hc = .55; m('ncr', 'corners', 'Next corner', [{ k: '1', label: h.short, p: price(hc, 1.07) }, { k: '2', label: a.short, p: price(1 - hc, 1.07) }], { dep: 'corner' });
    m('mcr', 'corners', 'Most corners', [{ k: '1', label: h.short, p: price(.58, 1.07) }, { k: 'x', label: 'Tie', p: price(.12, 1.07) }, { k: '2', label: a.short, p: price(.30, 1.07) }], { dep: 'corner' });
    const kr = st.live ? 2.1 * st.rem * (f.rem0 / 5580) : 4.2, kb = st.live ? 2 : 0, K = pois(kr, 12);
    tb('crd', 'corners', 'Total cards', [kb + Math.floor(kr) + .5, kb + Math.floor(kr) + 1.5].map(l => { let ov = 0; K.forEach((q, k) => { if (k + kb > l) ov += q; }); return [l, ov, 1 - ov]; }), { dep: 'card' });
    m('ncd', 'corners', 'Next card', [{ k: '1', label: h.short, p: price(.44 * (1 - Math.exp(-kr)), 1.08) }, { k: 'n', label: 'No card', p: price(Math.exp(-kr), 1.08) }, { k: '2', label: a.short, p: price(.56 * (1 - Math.exp(-kr)), 1.08) }], { dep: 'card' });
  }
  for (const g of out) {
    g.sus = st.sus && (st.sus.scope !== G || g.dep === G) ? st.sus.reason : null;
    for (const s of g.sels) { s.id = `${f.id}|${g.id}|${s.k}`; }
  }
  const res = { st, groups: out.filter(g => g.sels.length) }; cache.set(key, res); return res;
}
export function selInfo(id, t = now()) {
  const [fid, mid, k] = id.split('|'), f = fx(fid); if (!f) return null;
  const { st, groups } = markets(f, t), g = groups.find(g => g.id === mid), s = g && g.sels.find(s => s.k === k);
  return { f, st, group: g, sel: s, closed: !s, price: s ? s.p : null, sus: g ? g.sus : null };
}
export const main = (f, t) => { const { st, groups } = markets(f, t); return { st, g: groups[0] }; };
export const fxName = f => f.sport === 'soccer' ? `${TEAMS[f.home].name} v ${TEAMS[f.away].name}` : `${f.a} v ${f.b}`;
export const fxShort = f => f.sport === 'soccer' ? `${TEAMS[f.home].short} v ${TEAMS[f.away].short}` : `${f.a} v ${f.b}`;
export const isLive = f => stateOf(f).live;
export const allFixtures = () => [...FIXTURES, ...OTHERS];
export const compName = f => f.sport === 'soccer' ? COMPS[f.comp].name : f.compName;
