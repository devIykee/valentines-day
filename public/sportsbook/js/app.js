// Shell, routing, live patching, scenarios (state deep links) and input handling.
import * as M from './model.js';
import * as S from './store.js';
import * as V from './views.js';
const { ic, esc } = V, $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const desktop = () => matchMedia('(min-width:900px)').matches;
const reduced = () => matchMedia('(prefers-reduced-motion:reduce)').matches;
const A = 'ars-bha|1x2|1', OPEN = 'HB-48213';
let route = { path: '/', q: {}, parts: [] }, demoLabel = null, tour = null, toastT = 0;

/* ---------- routing ---------- */
function parse() {
  const h = location.hash.replace(/^#/, '') || '/', [p, qs = ''] = h.split('?');
  return { path: p, parts: p.split('/').filter(Boolean), q: Object.fromEntries(new URLSearchParams(qs)) };
}
const page = () => route.parts[0] || 'home';
function go() {
  route = parse();
  applyScenario();
  if (route.q.t != null && !route.q.state) M.control.seek(+route.q.t || 0);
  if (page() === 'match') { V.matchUI.q = route.q.q || ''; if (route.q.m) { const g = M.markets(M.fx(route.parts[1]) || M.fx('ars-bha')).groups.find(g => g.id === route.q.m || g.id.startsWith(route.q.m)); if (g) V.matchUI.tab = g.tab; } else if (!route.q.state) V.matchUI.tab = 'popular'; }
  if (page() === 'slip' && route.q.tab === 'mybets') S.state().ui.tab = 'bets';
  $('#menu').classList.remove('show'); closeSheet(true);
  renderAll(); window.scrollTo(0, 0);
  document.title = ({ home: 'Sports home', live: 'Live', football: 'Football', match: M.fx(route.parts[1]) ? M.fxName(M.fx(route.parts[1])) : 'Match', slip: 'Bet slip & My bets', states: 'All states' }[page()] || 'Sports') + ' · Housebets Sportsbook';
  if (page() === 'match' && route.q.m) setTimeout(() => { const el = $(`.mgroup[data-g^="${CSS.escape(route.q.m)}"]`); if (el) { el.scrollIntoView({ block: 'center', behavior: reduced() ? 'auto' : 'smooth' }); el.classList.add('hl'); setTimeout(() => el.classList.remove('hl'), 1600); } }, 60);
  if (['odds-up', 'odds-down', 'reopened', 'goal'].includes(route.q.state)) setTimeout(() => $$('.odd.up,.odd.dn').forEach(c => c.classList.add(c.classList.contains('up') ? 'fl-up' : 'fl-dn')), 80);
}

/* ---------- scenarios: every state has a URL ---------- */
function applyScenario() {
  const st = route.q.state; M.flags.freeze = null; M.flags.nothingLive = false; demoLabel = null;
  if (!st) { S.leaveScenario(); return; }
  const pA = t => M.selInfo(A, t).price, item = (t, stake = '10') => ({ id: A, price: pA(t), stake });
  const coVal = t => { M.flags.freeze = t; const v = S.betView({ id: OPEN, selId: A, odds: 1.8, stake: 20, status: 'open' }).co.value; return v; };
  const bets = s => { s.ui.tab = 'bets'; s.ui.expanded = OPEN; };
  const map = {
    'odds-up': [16, 'Price rises'], 'odds-down': [9, 'Price falls'], suspended: [25, page() === 'slip' ? 'Selection suspended' : 'Markets suspended'], reopened: [31, 'Reopened, repriced'], goal: [86, 'Goal'],
    empty: [0, 'Empty slip'], ready: [0, 'Stake and return', s => s.slip = [item(0)]], changed: [9, 'Odds changed', s => s.slip = [item(0)]],
    closed: [86, 'Selection closed', s => s.slip = [{ id: 'ars-bha|ng2|1', price: 2.2, stake: '10' }]],
    placing: [0, 'Placing', s => { s.slip = [item(0)]; s.ui.placing = Date.now() + 1e10; }],
    placed: [0, 'Bet placed', s => { const b = { id: 'HB-48377', selId: A, label: 'Arsenal', market: 'Match result', fxId: 'ars-bha', odds: 1.3, stake: 10, placedAt: Date.now(), status: 'open' }; s.bets.unshift(b); s.wallet = 240; s.ui.receipt = { bets: [b], kept: [item(0)] }; }],
    'failed-balance': [0, 'Failed: balance', s => { s.wallet = 4.2; s.slip = [item(0)]; s.ui.fail = { code: 'balance' }; }],
    'failed-limit': [0, 'Failed: over limit', s => { s.wallet = 2000; s.slip = [item(0, '750')]; s.ui.fail = { code: 'max', id: A }; }],
    'failed-min': [0, 'Failed: under minimum', s => { s.slip = [item(0, '0.05')]; s.ui.fail = { code: 'min', id: A }; }],
    'failed-connection': [0, 'Failed: connection', s => { s.slip = [item(0)]; s.ui.fail = { code: 'connection' }; }],
    'failed-changed': [9, 'Failed: price moved', s => { s.slip = [item(0)]; s.ui.fail = { code: 'changed' }; }],
    'failed-suspended': [25, 'Failed: market paused', s => { s.slip = [item(20)]; s.ui.fail = { code: 'suspended' }; }],
    'signed-out': [0, 'Signed out', s => { s.signedIn = false; if (page() === 'slip') { s.slip = [item(0)]; s.ui.fail = { code: 'signedout' }; } }],
    open: [40, 'My bets: open', bets], settled: [40, 'My bets: settled', s => { s.ui.tab = 'bets'; s.ui.betsTab = 'settled'; }],
    'cashout-available': [40, 'Cash out: available', bets],
    'cashout-confirm': [40, 'Cash out: confirm', s => { bets(s); s.ui.co = { id: OPEN, value: coVal(40), until: Date.now() + 5000, hold: true }; }],
    'cashout-changed': [40, 'Cash out: value changed', s => { bets(s); s.ui.co = { id: OPEN, value: coVal(40) + 1.35, until: Date.now() + 1e10, hold: true }; }],
    'cashout-suspended': [25, 'Cash out: paused', bets],
    'cashout-unavailable': [40, 'Cash out: not offered', s => { s.bets.unshift({ id: 'HB-48390', selId: 'ars-bha|ags|T. Marlowe', label: 'T. Marlowe', market: 'Anytime goalscorer', fxId: 'ars-bha', odds: 4.2, stake: 5, placedAt: Date.now() - 6e5, status: 'open', noCashout: true }); s.ui.tab = 'bets'; s.ui.expanded = 'HB-48390'; }],
    'cashout-done': [40, 'Cash out: done', s => { const b = s.bets.find(b => b.id === OPEN); b.status = 'cashed'; b.returned = 26.1; s.wallet = 276.1; s.ui.tab = 'bets'; s.ui.betsTab = 'settled'; s.ui.expanded = OPEN; s.ui.swept = OPEN; }],
    'nothing-live': [0, 'Nothing live'],
  };
  const def = map[st]; if (!def) { S.leaveScenario(); return; }
  if (st === 'suspended' && page() === 'slip') def[2] = s => s.slip = [item(20)];
  M.flags.freeze = def[0]; if (st === 'nothing-live') M.flags.nothingLive = true;
  S.scenario(s => { if (def[2]) def[2](s); if (page() === 'slip' || s.slip.length) s.ui.panelOpen = true; });
  M.flags.freeze = def[0]; demoLabel = def[1];
}

/* ---------- shell ---------- */
const WAVE = `<svg class="wave" viewBox="0 0 62 44" fill="none" aria-hidden="true"><defs><linearGradient id="wv" x1="0" y1="44" x2="62" y2="0"><stop stop-color="#0a6f86"/><stop offset=".55" stop-color="#2fd4f5"/><stop offset="1" stop-color="#c4f4f1"/></linearGradient></defs><path d="M1 41c13-1 21-7 25-17 4-10 11-16 20-14 9 2 12 11 8 17-3 4-10 4-10-1 0-3 3-5 6-3" stroke="url(#wv)" stroke-width="3.200" stroke-linecap="round"/><path d="M9 41c10-3 17-9 21-17 3-7 8-10 14-9" stroke="url(#wv)" stroke-width="1.600" stroke-linecap="round" opacity=".7"/><path d="M19 41c7-4 12-9 15-15" stroke="url(#wv)" stroke-width="1.200" stroke-linecap="round" opacity=".5"/><path d="M0 42.500h60" stroke="#2fd4f5" stroke-width="1.200" opacity=".6"/></svg>`;
function renderTop() {
  const st = S.state(), o = S.openBets().length;
  const acct = st.signedIn
    ? `<a class="wallet" href="#/slip" aria-label="Demo balance ${st.wallet.toFixed(2)} USDT"><b id="wal">${st.wallet.toFixed(2)}</b>${V.tchip}</a><button class="btn pri only-d" data-act="deposit" style="display:${desktop() ? '' : 'none'}">Deposit</button>`
    : `<button class="btn sec" data-act="login">Log In</button><button class="btn pri" data-act="login">Register</button>`;
  $('#top').innerHTML = `<button class="ibtn tgl" data-act="railtoggle" aria-label="Toggle navigation">${ic('side')}</button><a class="brand" href="#/" aria-label="Housebets, Sports home"><img src="assets/housebets-logo.svg" alt="Housebets" width="116" height="18">${WAVE}</a>
  <div class="mid"><div class="prize" aria-label="Weekly prize, 50,000 dollars"><span style="color:var(--gold)">${ic('trophy', 24)}</span><span><small>Weekly Prize</small><b>$50,000<i>.00</i></b></span></div><span class="ibtn" aria-hidden="true">${ic('crown')}</span></div>
  <div class="right"><button class="ibtn srch" data-act="focussearch" aria-label="Search">${ic('search')}</button><button class="ibtn tgl" data-act="paneltoggle" aria-pressed="${st.ui.panelOpen}" aria-label="Toggle bet slip panel">${ic('panel')}</button><button class="ibtn only-m" data-act="opensheet" data-v="bets" aria-label="My bets, ${o} open" style="position:relative">${ic('slip')}${o ? `<span class="badge" style="position:absolute;top:-4px;right:-4px;background:var(--cta);color:var(--ink)">${o}</span>` : ''}</button>${acct}</div>`;
}
function renderRail() {
  const p = page(), a = (href, icon, label, on) => `<a href="${href}" class="${on ? 'on' : ''}" aria-label="${label}" title="${label}"${on ? ' aria-current="page"' : ''}>${ic(icon)}</a>`;
  $('#rail').innerHTML = `<div class="grp"><a href="#/" data-act="inert" data-msg="Casino isn't part of this prototype." aria-label="Casino" title="Casino">${ic('casino')}</a>${a('#/', 'basketball', 'Sports home', p === 'home')}</div>
  <div class="grp">${a('#/live', 'live', 'Live', p === 'live')}${a('#/football?view=all', 'cal', 'Upcoming', false)}${a('#/football', 'soccer', 'Football', p === 'football' || p === 'match')}${M.SPORTS.slice(1).map(s => a('#/live?sport=' + s.id, s.id, s.name, false)).join('')}</div>
  <div class="grp">${a('#/slip', 'slip', 'Bet slip and My bets', p === 'slip')}</div><span class="sp"></span>
  <div class="grp"><button data-act="ctl" aria-label="Demo controls" title="Demo controls">${ic('flask')}</button></div>`;
  $('#bnav').innerHTML = `<button data-act="menu">${ic('menu', 22)}Menu</button><a href="#/" class="${p !== 'slip' ? 'on' : ''}">${ic('basketball', 22)}Sports</a><button data-act="inert" data-msg="Casino isn't part of this prototype.">${ic('casino', 22)}Casino</button><button data-act="opensheet" data-v="chat">${ic('chat', 22)}Chat</button><button data-act="inert" data-msg="Support isn't part of this prototype.">${ic('support', 22)}Support</button>`;
  $('#menu').innerHTML = `<a href="#/">${ic('home')}Sports home</a><a href="#/live">${ic('live')}Live <span class="mut num">${V.liveCount()}</span></a><a href="#/football">${ic('soccer')}Football</a><a href="#/match/ars-bha">${ic('right')}Arsenal v Brighton</a><a href="#/slip">${ic('slip')}Bet slip &amp; My bets</a><hr><button data-act="ctl">${ic('flask')}Demo controls</button><a href="#/states">${ic('check')}All states</a>`;
}
function renderPanel() {
  const st = S.state(), html = V.panelInner(), isSlip = page() === 'slip';
  keepFocus(() => { $('#panel').innerHTML = html; $('#sheetin').innerHTML = html.replace('data-act="closepanel"', 'data-act="closesheet"'); });
  document.body.classList.toggle('p-open', st.ui.panelOpen && !isSlip);
  const bar = $('#sbar'), n = st.slip.length;
  if (!n || isSlip || st.ui.sheet) bar.hidden = true;
  else {
    const views = st.slip.map(S.itemView), bad = views.find(v => v.status !== 'ok'), t = S.totals();
    const tx = bad ? ({ changed: 'Price changed. Review', paused: 'Paused. Waiting for market', closed: 'Selection unavailable' }[bad.status]) : n === 1 ? `${views[0].label} @ ${M.fmt(views[0].it.price)}` : `${n} singles`;
    bar.hidden = false; bar.className = 'sbar' + (bad ? ' warn' : ''); bar.dataset.act = 'opensheet'; bar.dataset.v = 'slip';
    bar.setAttribute('aria-label', `Open bet slip, ${n} selection${n > 1 ? 's' : ''}`);
    bar.innerHTML = `<span class="c">${n}</span><span class="tx">${esc(tx)}</span>${!bad && t.stake ? `<span class="rt">${t.stake.toFixed(2)} → ${t.ret.toFixed(2)}</span>` : ''}${ic('up', 20)}`;
  }
}
function renderPage() {
  const p = page(), v = $('#view');
  keepFocus(() => {
    v.innerHTML = p === 'home' ? V.home() : p === 'live' ? V.live(route.q) : p === 'football' ? V.football(route.q) : p === 'match' ? V.match(route.parts[1]) : p === 'slip' ? V.slipPage() : p === 'states' ? V.statesPage() : V.home();
  });
  if (demoLabel) v.insertAdjacentHTML('afterbegin', `<div class="demo-pill">Demo state: <b>${demoLabel}</b><a href="#${route.path}${route.q.tab ? '?tab=' + route.q.tab : ''}">Exit</a></div>`);
  if (p === 'match' && M.fx(route.parts[1])) { refreshMatch(); observeBoard(); }
  patch(true);
}
function renderFloat() {
  let h = '';
  if (tour && tour.cap) h += `<div class="cap" role="status">${tour.cap}</div>`;
  $('#float').innerHTML = h; document.body.classList.toggle('has-demo', !!demoLabel);
}
function renderAll() { renderTop(); renderRail(); renderPage(); renderPanel(); renderFloat(); if ($('#ctl').classList.contains('show')) $('#ctl').innerHTML = V.controlPanel(M.control.state); }
function keepFocus(fn) {
  const a = document.activeElement, key = a && (a.dataset.stake ? `[data-stake="${CSS.escape(a.dataset.stake)}"]` : a.id ? '#' + a.id : null), host = a && a.closest('#panel,#sheetin,#view'), pos = a && a.selectionStart;
  fn();
  if (key && host) { const el = $(key, host); if (el) { el.focus({ preventScroll: true }); try { if (pos != null) el.setSelectionRange(pos, pos); } catch { } } }
}
function toast(msg) { clearTimeout(toastT); $$('.toast').forEach(t => t.remove()); const d = document.createElement('div'); d.className = 'toast'; d.setAttribute('role', 'status'); d.textContent = msg; document.body.append(d); toastT = setTimeout(() => d.remove(), 2600); }

/* ---------- match page pieces ---------- */
let matchSig = '', io = null;
function refreshMatch(animate) {
  const id = route.parts[1], f = M.fx(id); if (!f || !$('#mkts')) return;
  const { groups } = M.markets(f), sig = groups.map(g => g.id + (g.sus ? '!' : '') + g.sels.length).join(','), before = new Map($$('.mgroup').map(el => [el.dataset.g, el.classList.contains('sus')]));
  $('#mtabs').innerHTML = V.matchTabs(id); $('#mtabs2').innerHTML = V.matchTabs(id); $('#mkts').innerHTML = V.matchMarkets(id); matchSig = sig;
  if (animate) $$('.mgroup').forEach(el => { const was = before.get(el.dataset.g), is = el.classList.contains('sus'); if (was != null && was !== is) el.classList.add(is ? 'tide' : 'ebb'); });
}
function observeBoard() {
  io && io.disconnect(); const b = $('#board'), mini = $('#mini'); if (!b) return;
  io = new IntersectionObserver(([e]) => { mini.classList.toggle('show', !e.isIntersecting); mini.setAttribute('aria-hidden', e.isIntersecting); }, { rootMargin: `-${parseInt(getComputedStyle(document.documentElement).getPropertyValue('--top'))}px 0px 0px 0px` });
  io.observe(b);
}

/* ---------- live patcher: only real changes touch the DOM ---------- */
let betSig = '';
function patch(first) {
  const t = M.now();
  if (page() === 'match') {
    const f = M.fx(route.parts[1]);
    if (f && $('#mkts')) {
      const { st, groups } = M.markets(f), sig = groups.map(g => g.id + (g.sus ? '!' : '') + g.sels.length).join(',');
      if (sig !== matchSig) refreshMatch(!first);
      for (const el of [$('#evt'), $('#evt2')]) if (el) { const tx = st.note ? st.note.text : ''; if (el.textContent !== tx) { el.textContent = tx; el.className = 'evt' + (st.note && st.note.kind === 'ok' ? ' ok' : ''); } }
    }
  }
  for (const box of $$('[data-oddsfor]')) {
    const f = M.fx(box.dataset.oddsfor), g = M.main(f).g, mk = box.dataset.mk, sig = (g.sus ? 'S' : 'O') + mk;
    if (box.dataset.sig !== sig) { box.dataset.sig = sig; box.innerHTML = box.dataset.inline ? (g.sus ? '' : g.sels.map(s => V.odd(s, g, f, { inline: true, label: s.short || s.label })).join('')) : V.rowOdds(f, mk); }
  }
  for (const c of $$('.odd[data-sel]')) {
    const inf = M.selInfo(c.dataset.sel); if (!inf || inf.closed) continue;
    const on = S.inSlip(c.dataset.sel); if (c.classList.contains('on') !== on) { c.classList.toggle('on', on); c.setAttribute('aria-pressed', on); }
    if (inf.sus) continue;
    const pv = $('.pv', c); if (!pv) continue;
    const old = +c.dataset.p, cur = inf.price;
    if (Math.abs(old - cur) > 1e-9) {
      pv.textContent = M.fmt(cur); c.dataset.p = cur; c.setAttribute('aria-label', `${inf.sel.label}${inf.sel.short && inf.sel.short !== inf.sel.label ? ' ' + inf.sel.short : ''} ${M.fmt(cur)}, ${inf.group.name}`);
      if (!first) { c.classList.remove('fl-up', 'fl-dn'); void c.offsetWidth; c.classList.add(cur > old ? 'fl-up' : 'fl-dn'); }
    }
    const prev = M.selInfo(c.dataset.sel, Math.max(0, t - 6)), pp = prev && !prev.closed ? prev.price : cur;
    c.classList.toggle('up', cur > pp + 1e-9); c.classList.toggle('dn', cur < pp - 1e-9);
  }
  for (const el of $$('[data-clock]')) { const st = M.stateOf(M.fx(el.dataset.clock)), tx = st.sec != null ? M.clockText(st) : st.status || ''; if (el.textContent !== tx) el.textContent = tx; }
  for (const el of $$('[data-clockfull]')) { const tx = M.clockFull(M.stateOf(M.fx(el.dataset.clockfull))); if (el.textContent !== tx) el.textContent = tx; }
  for (const el of $$('[data-score]')) { const [, id, i] = el.dataset.score.match(/^(.*)-(\d)$/), st = M.stateOf(M.fx(id)), v = String(st.score[i]); if (el.textContent !== v) { el.textContent = v; el.classList.remove('z'); if (!first) { el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop'); } } }
  // slip + bets: re-render only when their visible state changes
  const st = S.state(), sig = st.slip.map(it => { const v = S.itemView(it); return v.status + (v.cur || '') + (v.reason || ''); }).join('|') + '#' + S.openBets().map(b => { const v = S.betView(b); return v.co.kind + (v.co.value || '') + (v.co.left ?? '') + (v.live ? v.live.score + v.live.min : ''); }).join('|');
  if (sig !== betSig) { betSig = sig; if (!first) { renderPanel(); if (page() === 'slip') renderPage(); } }
  const say = st.ui.receipt ? 'Bet placed.' : st.ui.fail ? 'Bet not placed. Your stake was not taken.' : st.slip.map(it => { const v = S.itemView(it); return v.status === 'changed' ? `Price changed to ${M.fmt(v.cur)}. Accept to continue.` : v.status === 'paused' ? `Selection paused: ${v.reason}.` : ''; }).join(' ');
  const lr = $('#sr-live'); if (lr && lr.textContent !== say) lr.textContent = say;
}
function tick() {
  let dirty = S.resolvePlacing();
  if (S.expireConfirm()) dirty = true;
  if (S.reconcile()) dirty = true;
  if (dirty) S.emit();
  if (tour) runTour();
  patch(false);
}

/* ---------- 40-second tour ---------- */
const TOUR = [
  [0, 'Arsenal v Brighton, live. Same layout as the wireframe.'], [3, 'Tap a price. It goes on the slip as a single.', () => { if (!S.inSlip(A)) S.toggleSel(A); S.setStake(A, '10'); }],
  [8, 'A price falls. One flash, then an arrow that points the way it moved.'], [14, 'Two prices rise.'],
  [22, 'VAR check. Goal markets lock in the same frame. Corners stay open. The slip pauses and keeps your stake.'],
  [30, 'No penalty. Markets reopen repriced. The slip asks before anything is placed.'],
  [35, 'Accept the new price.', () => S.acceptAll()], [37, 'Place it.', () => S.place()], [40, 'Placed. A receipt with a bet ID, and it is already in My bets.'], [46, null],
];
function startTour() { location.hash = '#/match/ars-bha'; setTimeout(() => { S.leaveScenario(); S.clearSlip(); M.control.pause(false); M.control.speed(1); M.control.restart(); tour = { i: 0, cap: '' }; go(); }, 30); }
function runTour() { const t = M.now(); while (tour && tour.i < TOUR.length && TOUR[tour.i][0] <= t) { const [, cap, fn] = TOUR[tour.i++]; if (fn) fn(); if (cap === null) { tour = null; } else tour.cap = cap; renderFloat(); } }

/* ---------- sheet ---------- */
let lastFocus = null;
function openSheet(tab) { const ui = S.state().ui; if (tab) ui.tab = tab; if (desktop()) { ui.panelOpen = true; S.emit(); return; } lastFocus = document.activeElement; ui.sheet = true; S.emit(); $('#sheet').classList.add('show'); $('#sheetbg').classList.add('show'); $('#sheet').style.transform = ''; setTimeout(() => { const f = $('#sheetin button,#sheetin input'); f && f.focus({ preventScroll: true }); }, 60); }
function closeSheet(silent) { const ui = S.state().ui; if (!ui.sheet && !$('#sheet').classList.contains('show')) return; ui.sheet = false; $('#sheet').classList.remove('show'); $('#sheetbg').classList.remove('show'); $('#sheet').style.transform = ''; if (!silent) { S.emit(); lastFocus && lastFocus.focus && lastFocus.focus({ preventScroll: true }); } }
(() => { // drag down to close
  const g = $('#grab'), sh = $('#sheet'); let y0 = null, t0 = 0, dy = 0;
  g.addEventListener('pointerdown', e => { y0 = e.clientY; t0 = Date.now(); dy = 0; g.setPointerCapture(e.pointerId); sh.style.transition = 'none'; });
  g.addEventListener('pointermove', e => { if (y0 == null) return; dy = Math.max(0, e.clientY - y0); sh.style.transform = `translateY(${dy}px)`; });
  const end = () => { if (y0 == null) return; sh.style.transition = ''; const v = dy / Math.max(1, Date.now() - t0); y0 = null; if (dy > 110 || v > .6) closeSheet(); else sh.style.transform = ''; };
  g.addEventListener('pointerup', end); g.addEventListener('pointercancel', end);
})();

/* ---------- events ---------- */
const sanitize = v => { v = v.replace(',', '.').replace(/[^\d.]/g, ''); const i = v.indexOf('.'); if (i >= 0) v = v.slice(0, i + 1) + v.slice(i + 1).replace(/\./g, '').slice(0, 2); return v.slice(0, 9); };
function updateFoot() {
  const s = V.slipBody();
  $$('.pfoot').forEach(el => el.innerHTML = s.foot);
  for (const it of S.state().slip) { const v = S.itemView(it), n = S.num(it.stake); $$(`[data-ret="${CSS.escape(it.id)}"]`).forEach(el => el.textContent = n ? (n * (v.cur || it.price)).toFixed(2) : '—'); }
  renderPanelBar();
}
function renderPanelBar() { const html = $('#sbar'); if (!html.hidden) { const t = S.totals(), rt = $('.rt', html); if (rt) rt.textContent = `${t.stake.toFixed(2)} → ${t.ret.toFixed(2)}`; else if (t.stake) renderPanel(); } }
document.addEventListener('input', e => {
  const el = e.target;
  if (el.dataset.stake) { const v = sanitize(el.value); if (v !== el.value) el.value = v; const hadFail = S.state().ui.fail; S.setStake(el.dataset.stake, v, true); $$(`[data-stake="${CSS.escape(el.dataset.stake)}"]`).forEach(o => { if (o !== el) o.value = v; }); if (hadFail) { S.emit(); } else updateFoot(); }
  else if (el.id === 'q') showSearch(el.value);
  else if (el.id === 'mq') { V.matchUI.q = el.value; refreshMatch(); patch(true); }
});
function showSearch(v) { const r = $('#sres'); if (!r) return; r.innerHTML = V.searchResults(v); r.hidden = false; const first = $('a', r); $$('a', r).forEach(a => a.classList.remove('act')); first && v && first.classList.add('act'); }
document.addEventListener('focusin', e => { if (e.target.id === 'q') showSearch(e.target.value); });
document.addEventListener('change', e => {
  const el = e.target, act = el.dataset.act;
  if (act === 'nav-select') location.hash = el.value;
  else if (act === 'pc') { S.state().settings.pc = el.value; S.emit(); toast('Saved.'); }
  else if (act === 'bsport') { S.state().ui.sport = el.value; S.emit(); if (page() === 'slip') renderPage(); }
});
document.addEventListener('click', e => {
  const r = $('#sres'); if (r && !r.hidden && !e.target.closest('.search')) r.hidden = true;
  const cell = e.target.closest('.odd[data-sel]');
  if (cell) { if (cell.classList.contains('sus')) return; S.toggleSel(cell.dataset.sel); return; }
  const seg = e.target.closest('[data-href]'); if (seg) { location.hash = seg.dataset.href; return; }
  const el = e.target.closest('[data-act]'); if (!el) return;
  const act = el.dataset.act, d = el.dataset, ui = S.state().ui, st = S.state();
  const slipRe = () => { if (page() === 'slip') renderPage(); };
  switch (act) {
    case 'follow': e.preventDefault(); S.toggleFollow(d.kind, d.id); renderPage(); break;
    case 'rm': S.removeSel(d.id); slipRe(); break;
    case 'clear': S.clearSlip(); slipRe(); break;
    case 'quick': S.setStake(d.id, String(d.v)); slipRe(); break;
    case 'max': S.setMax(d.id); slipRe(); break;
    case 'accept': S.acceptAll(); slipRe(); break;
    case 'place': S.place(); slipRe(); break;
    case 'deposit': S.deposit(100); toast('Demo deposit: 100.00 USDT added. Your slip is as you left it.'); renderTop(); slipRe(); break;
    case 'login': st.signedIn = true; ui.fail = null; S.emit(); renderTop(); slipRe(); toast('Signed in to the demo wallet.'); break;
    case 'viewbets': ui.receipt = null; ui.tab = 'bets'; ui.betsTab = 'open'; S.emit(); slipRe(); break;
    case 'keep': S.keepSelection(); slipRe(); break;
    case 'ptab': ui.tab = d.v; ui.settings = false; S.emit(); slipRe(); break;
    case 'settings': ui.settings = !ui.settings; S.emit(); slipRe(); break;
    case 'btab': ui.betsTab = d.v; ui.co = null; S.emit(); slipRe(); break;
    case 'range': ui.range = d.v; S.emit(); slipRe(); break;
    case 'expand': ui.expanded = ui.expanded === d.id ? null : d.id; S.emit(); slipRe(); break;
    case 'co': { const was = st.wallet; S.cashOutTap(d.id); if (st.wallet !== was) { ui.betsTab = 'settled'; ui.expanded = d.id; renderTop(); S.emit(); toast('Cashed out. Balance updated.'); setTimeout(() => { ui.swept = null; }, 900); } slipRe(); break; }
    case 'opensheet': openSheet(d.v); break;
    case 'closesheet': closeSheet(); break;
    case 'closepanel': ui.panelOpen = false; S.emit(); break;
    case 'paneltoggle': ui.panelOpen = !ui.panelOpen; S.emit(); renderTop(); break;
    case 'railtoggle': { const r = $('#rail'); r.style.display = getComputedStyle(r).display === 'none' ? 'flex' : 'none'; document.documentElement.style.setProperty('--rail', r.style.display === 'none' ? '0px' : '72px'); break; }
    case 'focussearch': { const q = $('#q'); if (q) { q.focus(); window.scrollTo({ top: 0 }); } else { location.hash = '#/'; setTimeout(() => $('#q') && $('#q').focus(), 80); } break; }
    case 'menu': $('#menu').classList.toggle('show'); break;
    case 'inert': e.preventDefault(); toast(d.msg); break;
    case 'mtab': V.matchUI.tab = d.tab; V.matchUI.q = ''; if ($('#mq')) $('#mq').value = ''; refreshMatch(); patch(true); if ($('#mini').classList.contains('show')) $('#mtabs').scrollIntoView({ block: 'start' }), window.scrollBy(0, -140); break;
    case 'mclear': V.matchUI.q = ''; $('#mq').value = ''; refreshMatch(); patch(true); break;
    case 'gtoggle': { const s = V.matchUI.shut; s.has(d.g) ? s.delete(d.g) : s.add(d.g); const g = el.closest('.mgroup'); g.classList.toggle('shut'); el.setAttribute('aria-expanded', !g.classList.contains('shut')); break; }
    case 'ctl': { const c = $('#ctl'); $('#menu').classList.remove('show'); const show = el.tagName === 'A' ? false : !c.classList.contains('show'); c.classList.toggle('show', show); if (show) c.innerHTML = V.controlPanel(M.control.state); break; }
    case 'restart': S.leaveScenario(); M.control.restart(); location.hash = '#/match/ars-bha'; go(); toast('Match restarted at 52:00.'); break;
    case 'pause': M.control.pause(!M.control.state.paused); $('#ctl').innerHTML = V.controlPanel(M.control.state); break;
    case 'speed': M.control.speed(+d.v); $('#ctl').innerHTML = V.controlPanel(M.control.state); break;
    case 'force': ui.forceFail = ui.forceFail === d.v ? null : d.v; $('#ctl').innerHTML = V.controlPanel(M.control.state); toast(ui.forceFail ? 'The next bet you place will fail that way.' : 'Cleared.'); break;
    case 'signtoggle': st.signedIn = !st.signedIn; S.emit(); renderTop(); $('#ctl').innerHTML = V.controlPanel(M.control.state); break;
    case 'lowbal': st.wallet = 4.2; S.emit(); renderTop(); toast('Balance set to 4.20 USDT.'); break;
    case 'resetall': S.leaveScenario(); S.reset(true); M.control.restart(); location.hash = '#/'; go(); toast('Demo reset.'); break;
    case 'tour': $('#ctl').classList.remove('show'); startTour(); break;
  }
});
document.addEventListener('keydown', e => {
  const q = $('#q'), r = $('#sres');
  if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) && q) { e.preventDefault(); q.focus(); return; }
  if (document.activeElement === q && r && !r.hidden) {
    const items = $$('a', r), i = items.findIndex(a => a.classList.contains('act'));
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); const n = (i + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length; items.forEach(a => a.classList.remove('act')); items[n] && (items[n].classList.add('act'), items[n].scrollIntoView({ block: 'nearest' })); }
    else if (e.key === 'Enter') { const a = items[Math.max(0, i)]; if (a) { e.preventDefault(); location.hash = a.getAttribute('href'); r.hidden = true; q.blur(); } }
  }
  if (e.key === 'Escape') {
    if (r && !r.hidden) { r.hidden = true; return; }
    if ($('#ctl').classList.contains('show')) { $('#ctl').classList.remove('show'); return; }
    if ($('#menu').classList.contains('show')) { $('#menu').classList.remove('show'); return; }
    if (S.state().ui.sheet) { closeSheet(); return; }
    if (document.activeElement && document.activeElement.id === 'mq' && V.matchUI.q) { V.matchUI.q = ''; document.activeElement.value = ''; refreshMatch(); patch(true); }
  }
  if (e.key === 'Tab' && S.state().ui.sheet) { // focus trap
    const f = $$('#sheet button:not([disabled]),#sheet input:not([disabled]),#sheet a[href],#sheet select').filter(x => x.offsetParent); if (!f.length) return;
    const a = f[0], z = f[f.length - 1];
    if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
  }
});
$('#sheetbg').addEventListener('click', () => closeSheet());
$('#sbar').addEventListener('click', () => openSheet('slip'));

S.on(() => { renderPanel(); renderTopWallet(); patch(true); });
function renderTopWallet() { const w = $('#wal'), st = S.state(); if (!!w !== st.signedIn) return renderTop(); if (w && w.textContent !== st.wallet.toFixed(2)) w.textContent = st.wallet.toFixed(2); const b = $('[data-act="paneltoggle"]'); b && b.setAttribute('aria-pressed', st.ui.panelOpen); }
window.addEventListener('hashchange', go);
let wasDesktop = desktop(); window.addEventListener('resize', () => { if (desktop() !== wasDesktop) { wasDesktop = desktop(); closeSheet(true); renderAll(); } });
document.addEventListener('visibilitychange', () => { if (!document.hidden) { tick(); patch(true); } });
setInterval(tick, 1000);
go();
