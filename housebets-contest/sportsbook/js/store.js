// Slip, wallet, bets, follows and settings. Demo data only: no real money, no backend.
import { selInfo, fxName, fx, compName, TEAMS, now, clockText, ladder } from './model.js';

const KEY = 'hb-proto-v1';
const MIN = 0.1, MAX = 500;
const ago = h => Date.now() - h * 3600e3;
const seedBets = () => [
  { id: 'HB-48213', selId: 'ars-bha|1x2|1', label: 'Arsenal', market: 'Match result', fxId: 'ars-bha', odds: 1.80, stake: 20, placedAt: ago(1.1), status: 'open' },
  { id: 'HB-48107', label: 'Over 2.5', market: 'Total goals', fxLabel: 'Liverpool v Chelsea', sport: 'soccer', odds: 1.85, stake: 15, placedAt: ago(26), status: 'won', returned: 27.75 },
  { id: 'HB-47990', label: 'Draw', market: 'Match result', fxLabel: 'Roma v Lazio', sport: 'soccer', odds: 3.30, stake: 10, placedAt: ago(50), status: 'lost', returned: 0 },
  { id: 'HB-47812', label: 'Bayern', market: 'Match result', fxLabel: 'Bayern Munich v Eintracht Frankfurt', sport: 'soccer', odds: 1.40, stake: 30, placedAt: ago(74), status: 'cashed', returned: 36.20 },
  { id: 'HB-47655', label: 'M. Okafor', market: 'Winner', fxLabel: 'M. Okafor v J. Tamm', sport: 'tennis', odds: 1.72, stake: 12, placedAt: ago(98), status: 'won', returned: 20.64 },
  { id: 'HB-47501', label: 'Yes', market: 'Both teams to score', fxLabel: 'Sevilla v Real Betis', sport: 'soccer', odds: 1.75, stake: 10, placedAt: ago(170), status: 'void', returned: 10 },
  { id: 'HB-47388', label: 'Harbor City', market: 'Winner', fxLabel: 'Harbor City v Northgate', sport: 'basketball', odds: 2.05, stake: 8, placedAt: ago(290), status: 'lost', returned: 0 },
  { id: 'HB-47120', label: 'Inter', market: 'Draw no bet', fxLabel: 'Inter v Napoli', sport: 'soccer', odds: 1.55, stake: 25, placedAt: ago(520), status: 'won', returned: 38.75 },
];
const fresh = () => ({
  wallet: 250, signedIn: true, slip: [], settings: { pc: 'ask' }, bets: seedBets(),
  follows: { teams: ['ars'], comps: ['pl'], fx: ['liv-mun'] }, recent: [],
  ui: { tab: 'slip', panelOpen: false, sheet: false, betsTab: 'open', range: 'all', sport: 'all', receipt: null, placing: 0, fail: null, settings: false, forceFail: null, expanded: null, co: null, swept: null },
});

let S = fresh(), persist = true, seq = 300 + Math.floor(Math.random() * 600);
try { const raw = JSON.parse(localStorage.getItem(KEY)); if (raw && raw.bets) { S = { ...fresh(), ...raw, ui: { ...fresh().ui, ...(raw.ui || {}), placing: 0, fail: null, receipt: null, co: null, settings: false, forceFail: null, sheet: false, swept: null } }; } } catch { }
const subs = new Set();
export const state = () => S;
export const on = fn => subs.add(fn);
export function emit() { if (persist) try { localStorage.setItem(KEY, JSON.stringify(S)); } catch { } subs.forEach(f => f()); }
export function reset(hard) { S = fresh(); if (hard) try { localStorage.removeItem(KEY); } catch { } emit(); }
/** Scenario mode: an in-memory copy of the seed that never touches saved data. */
export function scenario(fn) { persist = false; S = fresh(); fn && fn(S); emit(); }
export function leaveScenario() { if (persist) return; persist = true; S = fresh(); try { const raw = JSON.parse(localStorage.getItem(KEY)); if (raw && raw.bets) S = { ...fresh(), ...raw, ui: { ...fresh().ui, ...(raw.ui || {}) } }; } catch { } emit(); }
export const inScenario = () => !persist;

/* ---------- follows ---------- */
export const follows = (kind, id) => S.follows[kind].includes(id);
export function toggleFollow(kind, id) { const a = S.follows[kind], i = a.indexOf(id); i < 0 ? a.push(id) : a.splice(i, 1); emit(); }

/* ---------- slip ---------- */
export const inSlip = id => S.slip.some(x => x.id === id);
export function toggleSel(id) {
  const i = S.slip.findIndex(x => x.id === id);
  if (i >= 0) S.slip.splice(i, 1);
  else { const inf = selInfo(id); if (!inf || inf.closed || inf.sus) return; S.slip.push({ id, price: inf.price, stake: '' }); S.ui.tab = 'slip'; S.ui.receipt = null; S.ui.panelOpen = true; }
  S.ui.fail = null; emit();
}
export function removeSel(id) { S.slip = S.slip.filter(x => x.id !== id); S.ui.fail = null; emit(); }
export function clearSlip() { S.slip = []; S.ui.fail = null; emit(); }
export function setStake(id, v, quiet) { const it = S.slip.find(x => x.id === id); if (!it) return; it.stake = v; S.ui.fail = null; if (!quiet) emit(); else if (persist) try { localStorage.setItem(KEY, JSON.stringify(S)); } catch { } }
export const num = v => { const n = parseFloat(v); return isFinite(n) && n > 0 ? Math.round(n * 100) / 100 : 0; };

/** Live status of one slip item: ok | changed | paused | closed. */
export function itemView(it) {
  const inf = selInfo(it.id);
  if (!inf || inf.closed) { const [fid] = it.id.split('|'); return { status: 'closed', it, f: fx(fid) }; }
  const sus = it.forceSus || inf.sus, cur = inf.price;
  const status = sus ? 'paused' : Math.abs(cur - it.price) > 1e-9 ? 'changed' : 'ok';
  return { status, it, inf, f: inf.f, cur, reason: sus, label: inf.sel.label, market: inf.group.name, st: inf.st, dir: cur > it.price ? 'up' : 'dn' };
}
/** Apply the player's price-change rule. Returns true if anything was auto-accepted. */
export function reconcile() {
  let changed = false;
  for (const it of S.slip) {
    const v = itemView(it); if (v.status !== 'changed') continue;
    const rule = S.settings.pc;
    if (rule === 'any' || (rule === 'higher' && v.cur > it.price)) { it.auto = { from: it.price, to: v.cur }; it.price = v.cur; changed = true; }
  }
  return changed;
}
export function acceptAll() { for (const it of S.slip) { const v = itemView(it); if (v.status === 'changed') it.price = v.cur; delete it.forceSus; } S.ui.fail = null; emit(); }
export function totals() { let stake = 0, ret = 0; for (const it of S.slip) { const s = num(it.stake); stake += s; ret += s * it.price; } return { stake, ret }; }

export function slipButton() {
  const views = S.slip.map(itemView), t = totals();
  if (S.ui.placing) return { kind: 'placing' };
  if (views.some(v => v.status === 'closed')) return { kind: 'blocked', text: 'Remove unavailable selection' };
  if (views.some(v => v.status === 'paused')) return { kind: 'blocked', text: 'Paused. Waiting for market' };
  if (views.some(v => v.status === 'changed')) return { kind: 'accept', n: views.filter(v => v.status === 'changed').length, v: views.find(v => v.status === 'changed') };
  if (S.slip.some(it => !num(it.stake))) return { kind: 'blocked', text: 'Enter a stake' };
  return { kind: 'place', ...t, n: S.slip.length };
}
const PLACE_MS = 2000;
export function place() {
  if (S.ui.placing || !S.slip.length) return;
  const t = totals(), b = slipButton();
  S.ui.fail = null;
  if (b.kind === 'accept') return acceptAll();
  if (b.kind !== 'place') return;
  if (!S.signedIn) { S.ui.fail = { code: 'signedout' }; return emit(); }
  const low = S.slip.find(it => num(it.stake) < MIN), high = S.slip.find(it => num(it.stake) > MAX);
  if (low) { S.ui.fail = { code: 'min', id: low.id }; return emit(); }
  if (high) { S.ui.fail = { code: 'max', id: high.id }; return emit(); }
  if (t.stake > S.wallet + 1e-9) { S.ui.fail = { code: 'balance' }; return emit(); }
  S.ui.placing = Date.now() + PLACE_MS; emit();
}
/** Called from the app tick. Resolves a pending placement exactly once, even if the tab was hidden. */
export function resolvePlacing() {
  if (!S.ui.placing || Date.now() < S.ui.placing) return false;
  S.ui.placing = 0;
  const force = S.ui.forceFail; S.ui.forceFail = null;
  if (force === 'connection') { S.ui.fail = { code: 'connection' }; emit(); return true; }
  if (force === 'changed' && S.slip[0]) { const it = S.slip[0], cur = itemView(it).cur || it.price; it.price = ladder(cur * (cur < 2 ? .97 : .93)); if (it.price === cur) it.price = cur - .01; }
  if (force === 'suspended' && S.slip[0]) S.slip[0].forceSus = 'Goal check';
  const views = S.slip.map(itemView);
  if (views.some(v => v.status === 'closed' || v.status === 'paused')) { S.ui.fail = { code: 'suspended' }; emit(); return true; }
  if (views.some(v => v.status === 'changed')) { S.ui.fail = { code: 'changed' }; emit(); return true; }
  const t = totals(); if (t.stake > S.wallet + 1e-9) { S.ui.fail = { code: 'balance' }; emit(); return true; }
  const made = views.map(v => ({ id: 'HB-' + (48000 + ++seq), selId: v.it.id, label: v.label, market: v.market, fxId: v.f.id, odds: v.it.price, stake: num(v.it.stake), placedAt: Date.now(), status: 'open', auto: v.it.auto || null }));
  S.wallet = Math.round((S.wallet - t.stake) * 100) / 100;
  S.bets.unshift(...made); S.ui.receipt = { bets: made, kept: S.slip.map(x => ({ ...x, auto: undefined })) }; S.slip = [];
  emit(); return true;
}
export function keepSelection() { if (S.ui.receipt) { S.slip = S.ui.receipt.kept.map(x => { const inf = selInfo(x.id); return { id: x.id, price: inf && inf.price || x.price, stake: x.stake }; }); S.ui.receipt = null; emit(); } }
export function deposit(v = 100) { S.wallet = Math.round((S.wallet + v) * 100) / 100; S.ui.fail = null; emit(); }
export function setMax(id) { setStake(id, String(Math.min(MAX, Math.floor(S.wallet * 100) / 100))); }
export const LIMITS = { MIN, MAX };

/* ---------- bets ---------- */
export function betView(b) {
  const f = b.fxId && fx(b.fxId), base = { b, fxLabel: f ? fxName(f) : b.fxLabel, sport: f ? f.sport : b.sport, ret: b.stake * b.odds };
  if (b.status !== 'open') return { ...base, co: { kind: b.status === 'cashed' ? 'done' : 'none' } };
  const inf = selInfo(b.selId), st = inf && inf.st;
  const live = st && st.live ? { score: Array.isArray(st.score) ? st.score.join('–') : st.score, min: st.sec != null ? clockText(st) : st.status } : null;
  let co;
  if (b.noCashout) co = { kind: 'unavailable' };
  else if (!inf || inf.closed) co = { kind: 'unavailable' };
  else if (b.forceSus || inf.sus) co = { kind: 'suspended', reason: b.forceSus || inf.sus };
  else {
    const value = Math.round(Math.min(b.stake * b.odds * .97, b.stake * b.odds / inf.price * .95) * 100) / 100, c = S.ui.co;
    if (c && c.id === b.id) co = Math.abs(c.value - value) > .004 ? { kind: 'changed', value, old: c.value } : { kind: 'confirm', value, left: Math.max(0, Math.ceil((c.until - Date.now()) / 1000)) };
    else co = { kind: 'available', value };
  }
  return { ...base, live, co };
}
export function cashOutTap(id) {
  const b = S.bets.find(x => x.id === id); if (!b) return;
  const v = betView(b), c = S.ui.co;
  if (v.co.kind === 'available' || v.co.kind === 'changed') { S.ui.co = { id, value: v.co.value, until: Date.now() + 5000 }; return emit(); }
  if (v.co.kind === 'confirm' && c) {
    b.status = 'cashed'; b.returned = v.co.value; b.settledAt = Date.now(); S.wallet = Math.round((S.wallet + v.co.value) * 100) / 100;
    S.ui.co = null; S.ui.swept = id; emit();
  }
}
export function expireConfirm() { const c = S.ui.co; if (c && !c.hold && Date.now() > c.until) { S.ui.co = null; return true; } return false; }
export const openBets = () => S.bets.filter(b => b.status === 'open');
export const settledBets = () => S.bets.filter(b => b.status !== 'open');
export const hasOpenBetOn = fid => S.bets.filter(b => b.status === 'open' && b.fxId === fid);
export { compName, TEAMS, now };
