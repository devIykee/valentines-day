// HTML for every page. Pure string templates; app.js wires events and patches live cells.
import * as M from './model.js';
import * as S from './store.js';
const { TEAMS, COMPS, COMP_ORDER, SPORTS, FIXTURES, OTHERS, fmt } = M;

export const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const I = {
  side: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/>', panel: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M15 4v16"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>', crown: '<path d="M3 8l4 4 5-7 5 7 4-4-2 11H5L3 8z"/>',
  home: '<path d="M4 11l8-7 8 7v9h-5v-6h-6v6H4z"/>', live: '<rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3"/>',
  cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  soccer: '<circle cx="12" cy="12" r="9"/><path d="m12 7 4 3-1.5 5h-5L8 10z"/><path d="M12 3v4M3.5 10 8 10M20.5 10 16 10M6.5 19l3-4M17.5 19l-3-4"/>',
  tennis: '<circle cx="12" cy="12" r="9"/><path d="M5.5 5.5c3 3 3 10 0 13M18.5 5.5c-3 3-3 10 0 13"/>',
  basketball: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3v18M5.6 5.6c3 3 3 9.800 0 12.8M18.4 5.6c-3 3-3 9.800 0 12.8"/>',
  baseball: '<circle cx="12" cy="12" r="9"/><path d="M6 6c2 3.500 2 8.500 0 12M18 6c-2 3.500-2 8.500 0 12"/>',
  amfootball: '<path d="M4 20c-1-7 5-16 16-16 1 7-5 16-16 16z"/><path d="m9 15 6-6M11 11l2 2"/>',
  esports: '<rect x="2" y="7" width="20" height="11" rx="4"/><path d="M7 11v3M5.500 12.500h3M16 12h.01M18 14h.01"/>',
  casino: '<rect x="4" y="3" width="13" height="17" rx="2"/><path d="M8 21h10a2 2 0 0 0 2-2V8"/><path d="M10.500 9.500l2 2.500-2 2.500-2-2.500z"/>',
  chat: '<path d="M4 5h16v11H9l-5 4z"/>', support: '<circle cx="12" cy="12" r="9"/><path d="M9.500 9.500a2.500 2.500 0 1 1 3.500 2.300c-.7.4-1 .9-1 1.700M12 17h.01"/>',
  star: '<path d="m12 3 2.700 5.700 6.300.800-4.600 4.300 1.200 6.200L12 17l-5.600 3 1.200-6.200L3 9.500l6.300-.8z"/>',
  down: '<path d="m6 9 6 6 6-6"/>', up: '<path d="m6 15 6-6 6 6"/>', right: '<path d="m9 6 6 6-6 6"/>', left: '<path d="m15 6-6 6 6 6"/>', x: '<path d="M6 6l12 12M18 6 6 18"/>',
  lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>', gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.900 4.900 7 7M17 17l2.100 2.100M4.900 19.100 7 17M17 7l2.100-2.100"/>',
  flask: '<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.800 3h10.400a2 2 0 0 0 1.800-3l-5-9V3"/><path d="M7.500 15h9"/>', check: '<path d="m5 12 5 5 9-10"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>', slip: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6"/>', menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  trophy: '<path d="M7 4h10v5a5 5 0 0 1-10 0zM7 6H4c0 3 1 5 3 5M17 6h3c0 3-1 5-3 5M12 14v4M8 20h8"/>', mega: '<path d="M4 10v4l10 4V6zM14 9a3 3 0 0 1 0 6M6 14l1 5h3"/>',
  wallet: '<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M16 12.500h2"/>', plus: '<path d="M12 5v14M5 12h14"/>',
};
export const ic = (n, s = 20, extra = '') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="${n === 'star-f' ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.800" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${I[n === 'star-f' ? 'star' : n]}</svg>`;
const lock = `<svg class="lock" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.200" stroke-linecap="round" aria-hidden="true">${I.lock}</svg>`;
export const tchip = '<i class="tchip" aria-label="USDT">₮</i>';

/* Original shield crests: shape + two colours + one pattern. No club marks. */
let cid = 0;
export function crest(id, cls = '') {
  const t = TEAMS[id]; if (!t) return ''; const c = 'c' + (++cid);
  const pat = { stripe: `<path d="M9 0h4v32H9zM19 0h4v32h-4z" fill="${t.b}"/>`, half: `<path d="M16 0h16v32H16z" fill="${t.b}"/>`, hoop: `<path d="M0 12h32v7H0z" fill="${t.b}"/>`, chev: `<path d="M4 9l12 9 12-9v6l-12 9-12-9z" fill="${t.b}"/>`, plain: `<circle cx="16" cy="14" r="5" fill="${t.b}"/>` }[t.pat];
  return `<svg class="crest ${cls}" viewBox="0 0 32 32" aria-hidden="true"><defs><clipPath id="${c}"><path d="M4 3h24v13c0 7-5 11-12 14C9 27 4 23 4 16z"/></clipPath></defs><g clip-path="url(#${c})"><rect width="32" height="32" fill="${t.a}"/>${pat}</g><path d="M4 3h24v13c0 7-5 11-12 14C9 27 4 23 4 16z" fill="none" stroke="#ffffff38" stroke-width="1.200"/></svg>`;
}
const names = id => `<span class="only-d">${esc(TEAMS[id].name)}</span><span class="only-m">${esc(TEAMS[id].short)}</span>`;

/* ---------- odds cell ---------- */
export function odd(sel, g, f, { inline = false, label } = {}) {
  const on = S.inSlip(sel.id), sus = !!g.sus, lab = label ?? sel.short ?? sel.label;
  const aria = `${sel.label}${sel.short && sel.short !== sel.label ? ' ' + sel.short : ''} ${sus ? 'suspended' : fmt(sel.p)}, ${g.name}`;
  return `<button class="odd${inline ? ' in' : ''}${on ? ' on' : ''}${sus ? ' sus' : ''}" data-sel="${esc(sel.id)}" data-p="${sel.p}" aria-pressed="${on}" aria-label="${esc(aria)}"${sus ? ' aria-disabled="true" tabindex="-1"' : ''}><span class="l">${inline && sel.short && sel.short !== sel.label ? `<span class="only-d">${esc(sel.label)}</span><span class="only-m">${esc(sel.short)}</span>` : esc(lab)}${sel.sub ? ` <small class="mut">${sel.sub}</small>` : ''}</span><span class="p">${sus ? lock : `<i class="ar"></i><span class="pv">${fmt(sel.p)}</span>`}</span></button>`;
}
export function rowOdds(f, mk = '1x2') {
  const { groups } = M.markets(f); let g = groups[0];
  if (mk === 'tg') g = groups.find(x => x.tab === 'popular' && x.id.startsWith('ou')) || g;
  if (g.sus) return `<div class="sus-row" title="${esc(g.sus)}">${lock} Suspended <span class="only-d">· ${esc(g.sus)}</span></div>`;
  return g.sels.map(s => odd(s, g, f)).join('');
}
const liveTag = st => st.live ? `<span class="lv"><i></i>LIVE</span>` : '';
function when(f, st) {
  if (st.live) return `<div class="when">${liveTag(st)}<span class="min" data-clock="${f.id}">${f.sport === 'soccer' ? M.clockText(st) : esc(st.status)}</span></div>`;
  const d = new Date(st.koAt || Date.now() + 36e5), mins = Math.round((d - Date.now()) / 60000);
  const day = mins < 60 ? `<small class="cd">in ${Math.max(1, mins)} min</small>` : `<small>${dayLabel(d)}</small>`;
  return `<div class="when"><b>${hhmm(d)}</b>${day}</div>`;
}
const hhmm = d => String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
const dayLabel = d => { const n = new Date(), k = Math.round((new Date(d.getFullYear(), d.getMonth(), d.getDate()) - new Date(n.getFullYear(), n.getMonth(), n.getDate())) / 864e5); return k === 0 ? 'Today' : k === 1 ? 'Tomorrow' : d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }); };

export function row(f, { mk = '1x2', mine = false } = {}) {
  const st = M.stateOf(f);
  if (f.sport !== 'soccer') {
    return `<div class="row" data-fx="${f.id}"><div class="info">${when(f, st)}<div class="tm"><span>${esc(f.a)}</span></div><span class="sc num" style="grid-row:span 2">${st.live ? esc(st.score) : ''}</span><span></span><div class="tm"><span>${esc(f.b)}</span></div></div><div class="odds c2" data-oddsfor="${f.id}" data-mk="1x2">${rowOdds(f)}</div><span class="only-d"></span></div>`;
  }
  const sc = i => st.live ? `<span class="sc${st.score[i] ? '' : ' z'}" data-score="${f.id}-${i}">${st.score[i]}</span>` : '<span></span>';
  const bets = mine ? S.hasOpenBetOn(f.id) : [];
  const nm = M.markets(f).groups.length - 1, more = `+${nm}`;
  return `<div class="row" data-fx="${f.id}"><a class="info" href="#/match/${f.id}">${when(f, st)}<div class="tm">${crest(f.home)}<span>${names(f.home)}</span></div>${sc(0)}<span class="mk only-m">${more}${ic('right', 14)}</span><div class="tm">${crest(f.away)}<span>${names(f.away)}</span></div>${sc(1)}${bets.map(b => `<div class="mybet">${ic('slip', 14)} Your bet: ${esc(b.label)} @ ${fmt(b.odds)} · ${fmt(b.stake)} USDT</div>`).join('')}</a><div class="odds${mk === 'tg' ? ' c2' : ''}" data-oddsfor="${f.id}" data-mk="${mk}">${rowOdds(f, mk)}</div><a class="mk only-d" href="#/match/${f.id}" aria-label="${nm} more markets">${more}${ic('right', 14)}</a></div>`;
}
const star = (kind, id, label) => { const on = S.follows(kind, id); return `<button class="star${on ? ' on' : ''}" data-act="follow" data-kind="${kind}" data-id="${id}" aria-pressed="${on}" aria-label="${on ? 'Unfollow' : 'Follow'} ${esc(label)}">${ic(on ? 'star-f' : 'star', 18)}</button>`; };
function group(compId, list, opts = {}) {
  const c = COMPS[compId], lv = list.filter(M.isLive).length, cols = opts.mk === 'tg' ? 'Total goals' : 'Match result';
  return `<section class="card" style="margin-top:12px"><div class="grp-h has-cols"><div class="l"><span class="cbadge" style="width:26px;height:26px;font-size:10px">${c.code}</span><b>${c.name}</b><span class="mut">${list.length} match${list.length === 1 ? '' : 'es'}${lv ? ` · ${lv} live` : ''}</span>${star('comps', compId, c.name)}</div><div class="cols">${cols}</div><a class="va" href="#/football?comp=${compId}&view=all">View all ${ic('right', 14)}</a></div>${opts.teams ? teamChips(list) : ''}${list.map(f => row(f, opts)).join('')}</section>`;
}
function teamChips(list) {
  const ids = [...new Set(list.flatMap(f => [f.home, f.away]))];
  return `<div class="chips scroll" style="padding:10px 14px;border-bottom:1px solid var(--line)"><span class="mut" style="font-size:13px;align-self:center">Follow a team</span>${ids.map(id => { const on = S.follows('teams', id); return `<button class="chip" data-act="follow" data-kind="teams" data-id="${id}" aria-pressed="${on}" style="${on ? 'border-color:#daa52088;color:var(--gold)' : ''}">${crest(id)}${esc(TEAMS[id].short)} ${ic(on ? 'star-f' : 'star', 14)}</button>`; }).join('')}</div>`;
}

/* ---------- shared bits ---------- */
export const searchBox = (ph = 'Search teams, players, competitions or markets') => `<div class="search" role="search">${ic('search', 18)}<input id="q" type="search" autocomplete="off" placeholder="${ph}" aria-label="${ph}" aria-controls="sres"><kbd>/</kbd><div id="sres" class="sres" hidden role="listbox"></div></div>`;
const liveSoccer = () => FIXTURES.filter(M.isLive);
const liveAll = () => [...liveSoccer(), ...OTHERS.filter(f => M.stateOf(f).live)];
export const liveCount = () => liveAll().length;
const upcoming = () => FIXTURES.filter(f => !M.isLive(f)).sort((a, b) => M.stateOf(a).koAt - M.stateOf(b).koAt);
const foot = `<div class="foot"><span>Prototype. Sample fixtures, sample prices, demo USDT. No real money.</span><span>18+. Play responsibly.</span><a href="#/states" style="text-decoration:underline">All states</a></div>`;
const sportTabs = (active) => `<nav class="tabs sports" aria-label="Sports"><a class="tab${active === 'home' ? ' on' : ''}" href="#/">${ic('home', 18)}Home</a><a class="tab live${active === 'live' ? ' on' : ''}" href="#/live">${ic('live', 18)}Live <span class="n">${liveCount()}</span></a><a class="tab${active === 'soccer' ? ' on' : ''}" href="#/football">${ic('soccer', 18)}Soccer</a>${SPORTS.slice(1).map(s => `<a class="tab" href="#/live?sport=${s.id}">${ic(s.id, 18)}${s.name}</a>`).join('')}</nav>`;
function fcard(f) {
  const st = M.stateOf(f), sc = i => st.live ? `<span class="sc${st.score[i] ? '' : ' z'}" data-score="${f.id}-${i}">${st.score[i]}</span>` : '';
  return `<article class="card fcard" data-fx="${f.id}"><a href="#/match/${f.id}" style="display:flex;flex-direction:column;gap:10px" aria-label="${esc(M.fxName(f))}"><div class="hd"><span>${COMPS[f.comp].name}</span><span class="sp"></span>${st.live ? `${liveTag(st)}<span class="min" data-clock="${f.id}">${M.clockText(st)}</span>` : `<span>${hhmm(new Date(st.koAt))}</span>`}</div><div class="tm">${crest(f.home, 'md')}<span>${esc(TEAMS[f.home].name)}</span>${sc(0)}</div><div class="tm">${crest(f.away, 'md')}<span>${esc(TEAMS[f.away].name)}</span>${sc(1)}</div></a><div class="odds" data-oddsfor="${f.id}" data-mk="1x2">${rowOdds(f)}</div></article>`;
}
const soonList = (n = 5) => `<section class="card soon">${upcoming().slice(0, n).map(f => row(f)).join('')}</section>`;

/* ---------- 1. Sports home ---------- */
export function home() {
  const st = S.state(), fl = st.follows;
  const mine = FIXTURES.filter(f => fl.teams.includes(f.home) || fl.teams.includes(f.away) || fl.fx.includes(f.id)).sort((a, b) => M.isLive(b) - M.isLive(a)).slice(0, 4);
  const favs = [...fl.comps.map(id => ({ kind: 'comps', id, name: COMPS[id].name, art: `<span style="color:var(--gold)">${ic('star-f', 16)}</span>`, href: `#/football?comp=${id}` })), ...fl.teams.map(id => ({ kind: 'teams', id, name: TEAMS[id].name, art: crest(id), href: `#/football?team=${id}` }))];
  const lv = liveSoccer(), nLive = liveCount();
  return `${searchBox()}${sportTabs('home')}
  <div class="sec-h"><h2>Favourites</h2></div>
  <div class="chips">${favs.length ? favs.map(x => `<span class="chip"><a href="${x.href}" style="display:inline-flex;gap:8px;align-items:center">${x.art}${esc(x.name)}</a><button class="x" data-act="follow" data-kind="${x.kind}" data-id="${x.id}" aria-label="Remove ${esc(x.name)}">${ic('x', 14)}</button></span>`).join('') : '<span class="mut">Follow a team or competition and it shows up here.</span>'}<a class="chip" href="#/football" style="color:var(--tx2)">${ic('plus', 14)} Add</a></div>
  ${mine.length ? `<div class="sec-h"><h2>Your matches</h2><span class="mut">${mine.length} match${mine.length === 1 ? '' : 'es'}</span></div><section class="card">${mine.map(f => row(f)).join('')}</section>` : ''}
  <div class="sec-h"><h2>Live now</h2><span class="mut">${nLive} in play</span><a class="more" href="#/live">All live ${ic('right', 14)}</a></div>
  ${nLive ? `<div class="rail-x" tabindex="0" aria-label="Live matches">${lv.map(fcard).join('')}</div>` : `<div class="card empty"><b>Nothing live right now</b><span>The next kick-offs are just below.</span></div>`}
  <div class="sec-h"><h2>Starting soon</h2><a class="more" href="#/football">All football ${ic('right', 14)}</a></div>${soonList(4)}
  <div class="sec-h"><h2>Top competitions</h2></div>
  <div class="comps">${COMP_ORDER.map(id => { const l = FIXTURES.filter(f => f.comp === id); return `<a class="card comp" href="#/football?comp=${id}"><span class="cbadge">${COMPS[id].code}</span><span><b>${COMPS[id].name}</b><small>${l.length} matches${l.some(M.isLive) ? ` · ${l.filter(M.isLive).length} live` : ''}</small></span></a>`; }).join('')}</div>
  <div class="sec-h"><h2>Upcoming events</h2></div><section class="card">${upcoming().slice(4, 10).map(f => row(f)).join('')}</section>${foot}`;
}

/* ---------- 2. Live ---------- */
export function live(q) {
  const sport = q.sport || 'all', comp = q.comp || 'all', mine = q.mine === '1';
  const all = liveAll(), cnt = id => all.filter(f => f.sport === id).length;
  let list = all.filter(f => (sport === 'all' || f.sport === sport) && (comp === 'all' || (f.comp || f.compName) === comp));
  if (mine) list = list.filter(f => S.hasOpenBetOn(f.id).length);
  const link = (o) => { const p = new URLSearchParams({ ...(sport !== 'all' && { sport }), ...(comp !== 'all' && { comp }), ...(mine && { mine: '1' }), ...o }); for (const [k, v] of [...p]) if (v === 'all' || v === '0') p.delete(k); const s = p.toString(); return '#/live' + (s ? '?' + s : ''); };
  const compsHere = [...new Set(all.filter(f => sport === 'all' || f.sport === sport).map(f => f.comp || f.compName))];
  const head = `<div class="crumbs"><a class="back" href="#/" aria-label="Back to Sports home">${ic('left')}</a><div class="path"><span style="padding:0 16px;font-weight:700">Live now</span></div><span class="mut" style="margin-left:6px">${all.length} in play</span></div>
  <div style="margin-top:12px">${searchBox()}</div>
  <nav class="tabs" aria-label="Filter by sport"><a class="tab${sport === 'all' ? ' on' : ''}" href="${link({ sport: 'all', comp: 'all' })}">All <span class="n">${all.length}</span></a>${SPORTS.map(s => `<a class="tab${sport === s.id ? ' on' : ''}" href="${link({ sport: s.id, comp: 'all' })}">${ic(s.id, 18)}${s.name} <span class="n">${cnt(s.id)}</span></a>`).join('')}</nav>
  <div class="bfilters" style="margin-top:12px"><select class="dd" data-act="nav-select" aria-label="Filter by competition"><option value="${link({ comp: 'all' })}">All competitions</option>${compsHere.map(c => `<option value="${link({ comp: c })}"${comp === c ? ' selected' : ''}>${COMPS[c]?.name || c}</option>`).join('')}</select><a class="chip" href="${link({ mine: mine ? '0' : '1' })}" ${mine ? 'aria-current="true" ' : ''}style="${mine ? 'background:var(--s3);border-color:var(--cy)' : ''}">${ic('slip', 14)} My bets</a></div>`;
  if (!list.length) {
    const what = mine ? 'No live matches with your open bets' : sport !== 'all' && all.length ? `No live ${SPORTS.find(s => s.id === sport).name.toLowerCase()} right now` : 'Nothing live right now';
    return `${head}<div class="card empty" style="margin-top:12px"><b>${what}</b><span>${mine ? 'Bets you place on live matches will show here.' : 'Here is what kicks off next.'}</span></div><div class="sec-h"><h2>Starting soon</h2></div>${soonList(6)}${foot}`;
  }
  const by = new Map(); for (const f of list) { const k = f.comp || f.compName; (by.get(k) || by.set(k, []).get(k)).push(f); }
  let out = '';
  for (const [k, l] of by) out += COMPS[k] ? group(k, l, { mine: true }) : `<section class="card" style="margin-top:12px"><div class="grp-h">${ic(l[0].sport, 18)}<b>${esc(k)}</b><span class="mut">${l.length} match${l.length === 1 ? '' : 'es'}</span></div>${l.map(f => row(f)).join('')}</section>`;
  return head + out + foot;
}

/* ---------- 3. Football ---------- */
export function football(q) {
  const view = q.view || 'soon', comp = q.comp || 'all', mk = q.mk || '1x2', team = q.team;
  const link = (o) => { const p = new URLSearchParams({ view, comp, mk, ...(team && { team }), ...o }); if (p.get('view') === 'soon') p.delete('view'); if (p.get('comp') === 'all') p.delete('comp'); if (p.get('mk') === '1x2') p.delete('mk'); if (!p.get('team')) p.delete('team'); const s = p.toString(); return '#/football' + (s ? '?' + s : ''); };
  const lv = liveSoccer().length; let out = '';
  for (const id of COMP_ORDER) {
    if (comp !== 'all' && comp !== id) continue;
    let l = FIXTURES.filter(f => f.comp === id && (!team || f.home === team || f.away === team));
    l.sort((a, b) => (M.isLive(b) - M.isLive(a)) || (M.stateOf(a).koAt - M.stateOf(b).koAt));
    if (view === 'soon' && comp === 'all') l = l.slice(0, 4);
    if (l.length) out += group(id, l, { mk, teams: true });
  }
  return `<div class="crumbs"><a class="back" href="#/" aria-label="Back to Sports home">${ic('left')}</a><div class="path"><span style="padding:0 16px;font-weight:700">Soccer</span></div><span class="mut" style="margin-left:6px;white-space:nowrap">5 competitions · ${lv} live</span></div>
  <div style="margin-top:12px">${searchBox()}</div>
  <div class="bfilters" style="margin-top:12px"><div class="seg" role="tablist"><button role="tab" aria-selected="${view === 'soon'}" class="${view === 'soon' ? 'on' : ''}" data-href="${link({ view: 'soon' })}">Live &amp; upcoming</button><button role="tab" aria-selected="${view === 'all'}" class="${view === 'all' ? 'on' : ''}" data-href="${link({ view: 'all' })}">All soccer</button></div>
  <select class="dd" data-act="nav-select" aria-label="Competition"><option value="${link({ comp: 'all' })}">All competitions</option>${COMP_ORDER.map(c => `<option value="${link({ comp: c })}"${comp === c ? ' selected' : ''}>${COMPS[c].name}</option>`).join('')}</select>
  <select class="dd" data-act="nav-select" aria-label="Market shown on each row"><option value="${link({ mk: '1x2' })}">Match result</option><option value="${link({ mk: 'tg' })}"${mk === 'tg' ? ' selected' : ''}>Total goals</option></select>
  ${team ? `<span class="chip">${crest(team)}${esc(TEAMS[team].name)}<a class="x" href="${link({ team: '' })}" aria-label="Clear team filter">${ic('x', 14)}</a></span>` : ''}</div>
  ${out || '<div class="card empty" style="margin-top:12px"><b>No matches here</b><span>Try another competition.</span></div>'}${foot}`;
}

/* ---------- 4. Match ---------- */
export const matchUI = { tab: 'popular', q: '', shut: new Set() };
export function match(id) {
  const f = M.fx(id); if (!f || f.sport !== 'soccer') return `<div class="card empty"><b>Match not found</b><a class="btn sec sm" href="#/">Back to Sports home</a></div>`;
  const { st } = M.markets(f), h = TEAMS[f.home], a = TEAMS[f.away], c = COMPS[f.comp];
  const fchip = (tid) => { const on = S.follows('teams', tid); return `<button class="fchip${on ? ' on' : ''}" data-act="follow" data-kind="teams" data-id="${tid}" aria-pressed="${on}">${ic(on ? 'star-f' : 'star', 14)}${on ? 'Following' : 'Follow'}</button>`; };
  const others = FIXTURES.filter(x => x.id !== id && M.isLive(x));
  const centre = st.live ? `<div class="score" aria-label="Score ${st.score[0]} to ${st.score[1]}"><b class="${st.score[0] ? '' : 'z'}" data-score="${id}-0">${st.score[0]}</b><i>–</i><b class="${st.score[1] ? '' : 'z'}" data-score="${id}-1">${st.score[1]}</b></div><div class="st">${liveTag(st).replace('class="lv"', 'class="lv soft"')}<span class="min" data-clockfull="${id}">${M.clockFull(st)}</span></div>` : `<div class="score"><b style="width:auto;padding:0 14px;font-size:20px">${hhmm(new Date(st.koAt))}</b></div><div class="st mut">${dayLabel(new Date(st.koAt))}</div>`;
  return `<div class="crumbs"><a class="back" href="${st.live ? '#/live' : '#/football'}" aria-label="Back">${ic('left')}</a><div class="path"><select class="c-d" data-act="nav-select" aria-label="Sport"><option value="#/football">Soccer</option></select><select class="c-d" data-act="nav-select" aria-label="Country"><option value="#/football?comp=${f.comp}">${c.country}</option></select><select class="c-d" data-act="nav-select" aria-label="Competition">${COMP_ORDER.map(k => `<option value="#/football?comp=${k}"${k === f.comp ? ' selected' : ''}>${COMPS[k].name}</option>`).join('')}</select><select data-act="nav-select" aria-label="Switch match"><option value="#/match/${id}">${h.code} - ${a.code}</option>${others.map(x => `<option value="#/match/${x.id}">${TEAMS[x.home].code} - ${TEAMS[x.away].code} · live</option>`).join('')}</select></div></div>
  <section class="card board" id="board"><div class="lg">${c.name}</div><div class="mstar">${star('fx', id, 'this match')}</div>
    <div class="bx"><div class="side">${crest(f.home, 'lg')}<div class="col"><span class="nm">${esc(h.name)}</span>${fchip(f.home)}</div></div><div class="ctr">${centre}<span class="evt" id="evt" role="status" aria-live="polite"></span></div><div class="side aw">${crest(f.away, 'lg')}<div class="col"><span class="nm">${esc(a.name)}</span>${fchip(f.away)}</div></div></div>
  </section>
  <div class="mini" id="mini" aria-hidden="true"><div class="in">${crest(f.home)}<span>${h.code}</span><span class="ms"><span data-score="${id}-0">${st.score[0]}</span> – <span data-score="${id}-1">${st.score[1]}</span></span><span>${a.code}</span>${crest(f.away)}${st.live ? `<span class="min" data-clockfull="${id}">${M.clockFull(st)}</span><span class="lv soft"><i></i>LIVE</span>` : ''}<span class="evt" id="evt2"></span><span class="sp"></span><div class="mo odds" data-oddsfor="${id}" data-mk="1x2" data-inline="1"></div></div><div class="mtabs" id="mtabs2"></div></div>
  <div style="margin-top:12px" class="search">${ic('search', 18)}<input id="mq" type="search" autocomplete="off" placeholder="Search markets or players" aria-label="Search markets or players" value="${esc(matchUI.q)}"></div>
  <nav class="tabs" id="mtabs" aria-label="Market groups"></nav><div id="mkts"></div>${foot}`;
}
export function matchTabs(id) {
  const f = M.fx(id), { groups } = M.markets(f);
  const n = t => groups.filter(g => t === 'all' || g.tab === t).length;
  return [...M.TABS, ['all', 'All markets']].map(([k, nm]) => `<button class="tab${matchUI.tab === k && !matchUI.q ? ' on' : ''}" data-act="mtab" data-tab="${k}">${nm} <span class="n">${n(k)}</span></button>`).join('');
}
export function matchMarkets(id) {
  const f = M.fx(id), { groups } = M.markets(f), q = matchUI.q.trim().toLowerCase();
  let list = q ? groups.filter(g => g.name.toLowerCase().includes(q) || g.sels.some(s => s.label.toLowerCase().includes(q))) : groups.filter(g => matchUI.tab === 'all' || g.tab === matchUI.tab);
  if (!list.length) return `<div class="card empty" style="margin-top:12px"><b>${q ? `No markets match “${esc(matchUI.q)}”` : 'No markets in this group right now'}</b><span>${q ? 'Try a team, a player or a market name such as corners.' : 'Markets return when the match situation allows.'}</span>${q ? `<button class="btn sec sm" data-act="mclear">Clear search</button>` : ''}</div>`;
  const head = q ? `<p class="mut" style="margin:12px 2px 0">${list.length} market${list.length === 1 ? '' : 's'} match “${esc(matchUI.q)}”</p>` : '';
  return head + list.map(g => {
    const shut = matchUI.shut.has(g.id) && !q; let body;
    if (g.tbl) { const lines = [...new Set(g.sels.map(s => s.line))]; body = `<div class="gb tbl"><span></span><span class="mut" style="font-size:12px;text-align:center">${esc(g.head[0])}</span><span class="mut" style="font-size:12px;text-align:center">${esc(g.head[1])}</span>${lines.map(ln => { const pair = g.sels.filter(s => s.line === ln); return `<span class="ln">${ln}</span>${pair.map(s => odd(s, g, f, { inline: true, label: s.label })).join('')}`; }).join('')}</div>`; }
    else body = `<div class="gb" style="--cols:${g.cols}">${g.sels.map(s => odd(s, g, f, { inline: true, label: s.label })).join('')}</div>`;
    return `<section class="card mgroup${shut ? ' shut' : ''}${g.sus ? ' sus' : ''}" data-g="${g.id}"><button class="gh" data-act="gtoggle" data-g="${g.id}" aria-expanded="${!shut}"><span>${esc(g.name)}</span><span class="reason">${lock}<span class="rt">${esc(g.sus || '')}</span></span><span class="sp"></span><span class="ch">${ic('up', 18)}</span></button>${body}</section>`;
  }).join('');
}

/* ---------- 5. Bet slip + My bets ---------- */
const money = x => fmt(Math.round(x * 100) / 100);
function slipCard(v, ui) {
  const it = v.it;
  if (v.status === 'closed') return `<div class="scard closed" data-item="${esc(it.id)}"><div class="t"><b>Selection no longer available</b><button class="rm" data-act="rm" data-id="${esc(it.id)}" aria-label="Remove">${ic('x', 16)}</button></div><div class="m">${v.f ? esc(M.fxName(v.f)) : ''}</div><div class="note">${lock}<span>This market has closed. Remove it to continue.</span><button class="act" data-act="rm" data-id="${esc(it.id)}">Remove</button></div></div>`;
  const st = v.st, lv = st.live ? `<span class="min">${Array.isArray(st.score) ? st.score.join('–') : esc(st.score)} · ${st.sec != null ? M.clockText(st) : esc(st.status)}</span>` : '';
  const s = S.num(it.stake), fail = ui.fail && ui.fail.id === it.id ? ui.fail.code : null;
  const pr = v.status === 'changed' ? `<s>${fmt(it.price)}</s><span style="color:${v.dir === 'up' ? 'var(--up)' : 'var(--down)'}">${v.dir === 'up' ? '▲' : '▼'}</span>${fmt(v.cur)}` : fmt(it.price);
  return `<div class="scard ${v.status}" data-item="${esc(it.id)}">
    <div class="t"><b>${esc(v.label)}</b><span class="pr" aria-label="Price ${fmt(v.status === 'changed' ? v.cur : it.price)}">${pr}</span><button class="rm" data-act="rm" data-id="${esc(it.id)}" aria-label="Remove ${esc(v.label)}">${ic('x', 16)}</button></div>
    <div class="m"><span>${esc(v.market)}</span>·<span>${esc(M.fxShort(v.f))}</span>${lv}</div>
    ${v.status === 'paused' ? `<div class="note" role="status">${lock}<span><b>Paused:</b> ${esc(v.reason)}. Your stake is kept. This will come back when the market reopens.</span></div>` : ''}
    ${v.status === 'changed' ? `<div class="note" role="status"><span><b>Price changed</b> from ${fmt(it.price)} to ${fmt(v.cur)}. Nothing is placed until you accept.</span></div>` : ''}
    ${it.auto && v.status === 'ok' ? `<div class="note ok"><span>Updated to ${fmt(it.auto.to)} under your price-change setting.</span></div>` : ''}
    <div class="stake"><label class="inp">${tchip}<span class="sr">Stake in USDT for ${esc(v.label)}</span><input inputmode="decimal" placeholder="0.00" value="${esc(it.stake)}" data-stake="${esc(it.id)}" ${ui.placing ? 'disabled' : ''}></label><div class="ret">Returns<b data-ret="${esc(it.id)}">${s ? money(s * (v.status === 'changed' ? v.cur : it.price)) : '—'}</b></div></div>
    <div class="quick" role="group" aria-label="Quick stakes">${[5, 10, 25, 50].map(q => `<button data-act="quick" data-id="${esc(it.id)}" data-v="${q}">${q}</button>`).join('')}<button data-act="max" data-id="${esc(it.id)}">Max</button></div>
    ${fail === 'min' ? `<div class="note err">Minimum stake is ${money(S.LIMITS.MIN)} USDT.</div>` : ''}${fail === 'max' ? `<div class="note err"><span>Maximum for this market is ${money(S.LIMITS.MAX)} USDT.</span><button class="act" data-act="quick" data-id="${esc(it.id)}" data-v="${S.LIMITS.MAX}">Set to max</button></div>` : ''}
  </div>`;
}
function failNote(f, st) {
  if (!f) return '';
  const base = '<b>Not placed.</b> Your stake was not taken. ';
  return ({
    balance: `<div class="note err" role="alert"><span>${base}You have ${money(st.wallet)} USDT.</span><button class="act" data-act="deposit">Deposit and return</button></div>`,
    connection: `<div class="note err" role="alert"><span>${base}Check your connection.</span><button class="act" data-act="place">Try again</button></div>`,
    changed: `<div class="note err" role="alert"><span>${base}The price moved while we were confirming.</span></div>`,
    suspended: `<div class="note err" role="alert"><span>${base}The market paused while we were confirming.</span></div>`,
    signedout: `<div class="note err" role="alert"><span>Log in to place this bet. Your slip stays as it is.</span><button class="act" data-act="login">Log in</button></div>`,
  })[f.code] || '';
}
function receipt(r) {
  const t = r.bets.reduce((a, b) => ({ s: a.s + b.stake, r: a.r + b.stake * b.odds }), { s: 0, r: 0 });
  return `<div class="rcpt" role="status"><div class="ok"><i>${ic('check', 16)}</i>Bet${r.bets.length > 1 ? 's' : ''} placed</div>
  ${r.bets.map(b => { const f = M.fx(b.fxId); return `<dl><dt>${esc(b.label)}</dt><dd style="color:var(--price)">${fmt(b.odds)}</dd><dt>${esc(b.market)} · ${esc(M.fxShort(f))}</dt><dd>${b.id}</dd><dt>Stake</dt><dd>${money(b.stake)} USDT</dd><dt>Potential return</dt><dd>${money(b.stake * b.odds)} USDT</dd></dl>${b.auto ? `<div class="note ok">Placed at ${fmt(b.odds)}. You chose to accept ${S.state().settings.pc === 'any' ? 'any price' : 'higher prices'}.</div>` : ''}`; }).join('<hr style="border:0;border-top:1px solid var(--line);width:100%">')}
  <div class="hub"><span>Placed ${hhmm(new Date(r.bets[0].placedAt))}. Singles settle on their own.</span></div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px"><button class="btn pri sm" data-act="viewbets">View in My bets</button><button class="btn sec sm" data-act="keep">Keep selection</button></div></div>`;
}
const PC = [['ask', 'Always ask me'], ['higher', 'Accept higher prices automatically'], ['any', 'Accept any price automatically']];
export function slipBody() {
  const st = S.state(), ui = st.ui;
  if (ui.receipt) return { body: receipt(ui.receipt), foot: '' };
  const set = ui.settings ? `<div class="setp" role="radiogroup" aria-label="If the price changes"><b style="font-size:14px">If the price changes</b>${PC.map(([k, l]) => `<label><input type="radio" name="pc" value="${k}" data-act="pc"${st.settings.pc === k ? ' checked' : ''}>${l}</label>`).join('')}</div>` : '';
  if (!st.slip.length) return { body: `${set}<div class="empty"><b>Your slip is empty</b><span>Tap any price to add it here. Singles only.</span><a class="btn sec sm" href="#/live" data-act="closesheet">See what's live</a></div>`, foot: '' };
  const views = st.slip.map(S.itemView), b = S.slipButton(), t = S.totals();
  const head = `<div class="shd"><b>Singles</b><span class="mut">· ${st.slip.length} selection${st.slip.length === 1 ? '' : 's'}</span><span class="sp"></span><button data-act="clear">Clear all</button></div>`;
  let btn;
  if (b.kind === 'placing') btn = `<button class="btn pri place" disabled style="flex-direction:row;gap:10px;background:var(--cta);color:var(--ink)"><i class="ring"></i>Confirming…</button>`;
  else if (b.kind === 'accept') btn = `<button class="btn place warn" data-act="accept">Accept ${b.n > 1 ? `${b.n} new prices` : `new price ${fmt(b.v.cur)}`}<small>Then review and place</small></button>`;
  else if (b.kind === 'blocked') btn = `<button class="btn place" disabled>${b.text}</button>`;
  else btn = `<button class="btn pri place" data-act="place">Place ${b.n > 1 ? `${b.n} singles · ` : ''}${money(b.stake)} USDT<small>Returns ${money(b.ret)} USDT</small></button>`;
  return {
    body: set + head + views.map(v => slipCard(v, ui)).join(''),
    foot: `${failNote(ui.fail, st)}<div class="tot"><span>Total stake</span><b><span data-tot="stake">${money(t.stake)}</span>${tchip}</b></div><div class="tot"><span>Potential return</span><b><span data-tot="ret">${t.stake ? money(t.ret) : '—'}</span>${tchip}</b></div>${btn}`,
  };
}
const RES = { open: ['Open', ''], won: ['Won', 'won'], lost: ['Lost', 'lost'], void: ['Void', 'void'], cashed: ['Cashed out', 'co'] };
const placed = t => { const d = new Date(t); return `${d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} ${hhmm(d)}`; };
function cashOut(v) {
  const c = v.co, id = v.b.id;
  if (c.kind === 'available') return `<button class="co-btn" data-act="co" data-id="${id}">Cash out <b data-co="${id}">${money(c.value)} USDT</b></button>`;
  if (c.kind === 'confirm') return `<button class="co-btn cf" data-act="co" data-id="${id}">Confirm cash out <b>${money(c.value)} USDT</b></button><div class="co-txt">Tap to confirm. This goes back to normal in ${c.left}s.</div>`;
  if (c.kind === 'changed') return `<div class="note"><span><b>Cash out value changed.</b> Check the new amount.</span></div><button class="co-btn" data-act="co" data-id="${id}">Cash out <s>${money(c.old)}</s> <b>${money(c.value)} USDT</b></button>`;
  if (c.kind === 'suspended') return `<div class="co-txt sus">${lock} Cash out paused: ${esc(c.reason)}</div>`;
  if (c.kind === 'unavailable') return `<div class="co-txt">Cash out isn't offered on this market.</div>`;
  if (c.kind === 'done') return `<div class="co-txt done">${ic('check', 16)} Cashed out ${money(v.b.returned)} USDT</div>`;
  return '';
}
function betCard(v) {
  const b = v.b, [rl, rc] = RES[b.status];
  const ret = b.status === 'open' ? ['Potential return', money(v.ret)] : ['Returned', money(b.returned)];
  return `<article class="bcard${S.state().ui.swept === b.id ? ' sweep' : ''}" data-bet="${b.id}"><div class="scard" style="border:0;padding:0;background:none"><div class="t"><b>${esc(b.label)}</b><span class="pr">${fmt(b.odds)}</span></div><div class="m"><span>${esc(b.market)}</span>·<span>${esc(v.fxLabel)}</span>${v.live ? `<span class="lv soft"><i></i>LIVE</span><span class="min" data-betlive="${b.id}">${v.live.score} · ${v.live.min}</span>` : ''}</div></div>
  <div class="kv"><span>Stake<b>${money(b.stake)}</b></span><span>${ret[0]}<b>${ret[1]}</b></span><span>Result<b><span class="res ${rc}">${rl}</span></b></span></div>
  <div data-cowrap="${b.id}">${cashOut(v)}</div><div class="m mut" style="font-size:12px;color:var(--tx3)">${b.id} · Placed ${placed(b.placedAt)}</div></article>`;
}
const RANGES = [['all', 'All time', Infinity], ['today', 'Today', 24], ['7', 'Last 7 days', 168], ['30', 'Last 30 days', 720]];
function betFilter() {
  const ui = S.state().ui, open = ui.betsTab === 'open', hrs = RANGES.find(r => r[0] === ui.range)[2];
  return (open ? S.openBets() : S.settledBets()).filter(b => (Date.now() - b.placedAt) / 36e5 <= hrs).map(S.betView).filter(v => ui.sport === 'all' || v.sport === ui.sport);
}
export function betsBody(full) {
  const ui = S.state().ui, list = betFilter(), o = S.openBets().length, s = S.settledBets().length;
  const filters = `<div class="seg" role="tablist" style="display:flex"><button role="tab" style="flex:1" class="${ui.betsTab === 'open' ? 'on' : ''}" data-act="btab" data-v="open">Open (${o})</button><button role="tab" style="flex:1" class="${ui.betsTab === 'settled' ? 'on' : ''}" data-act="btab" data-v="settled">Settled (${s})</button></div>
  <div class="bfilters"><div class="dchips">${RANGES.map(([k, l]) => `<button class="${ui.range === k ? 'on' : ''}" data-act="range" data-v="${k}">${l}</button>`).join('')}</div><span style="flex:1"></span><select class="dd" data-act="bsport" aria-label="Sport" style="height:40px"><option value="all">All sports</option>${SPORTS.map(x => `<option value="${x.id}"${ui.sport === x.id ? ' selected' : ''}>${x.name}</option>`).join('')}</select></div>`;
  const empty = `<div class="empty"><b>${ui.betsTab === 'open' ? 'No open bets' : 'No settled bets in this range'}</b><span>${ui.betsTab === 'open' ? 'Bets you place show here straight away.' : 'Try a wider date range.'}</span></div>`;
  const cards = `<div class="bcards" style="display:${full ? '' : 'flex'};flex-direction:column;gap:10px">${list.length ? list.map(betCard).join('') : empty}</div>`;
  if (!full) return filters + cards;
  const table = `<div class="btable card"><div class="bh"><span>Placed</span><span>Bet</span><span>Odds</span><span>Stake</span><span>Returns</span><span>Result</span><span></span></div>${list.length ? list.map(v => { const b = v.b, [rl, rc] = RES[b.status], ex = ui.expanded === b.id; return `<button class="br" data-act="expand" data-id="${b.id}" aria-expanded="${ex}"><span class="mut" style="font-size:12px">${new Date(b.placedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}<br>${hhmm(new Date(b.placedAt))}</span><span><b>${esc(b.label)}</b><small>${esc(b.market)} · ${esc(v.fxLabel)}${v.live ? ` <span class="min" data-betlive="${b.id}">${v.live.score} · ${v.live.min}</span>` : ''}</small></span><span class="num" style="color:var(--price)">${fmt(b.odds)}</span><span class="num">${money(b.stake)}</span><span class="num">${money(b.status === 'open' ? v.ret : b.returned)}</span><span><span class="res ${rc}">${rl}</span></span><span class="mut">${ic(ex ? 'up' : 'down', 16)}</span></button>${ex ? `<div class="bx">${betCard(v)}</div>` : ''}`; }).join('') : empty}</div>`;
  return `<div style="display:flex;flex-direction:column;gap:12px">${filters}${table}${cards}</div>`;
}
export function panelInner() {
  const st = S.state(), ui = st.ui, o = S.openBets().length;
  const tabs = `<div class="ptabs"><div role="tablist" style="display:contents"><button role="tab" aria-selected="${ui.tab === 'slip'}" class="ptab${ui.tab === 'slip' ? ' on' : ''}" data-act="ptab" data-v="slip">Bet slip${st.slip.length ? ` <span class="badge">${st.slip.length}</span>` : ''}</button><button role="tab" aria-selected="${ui.tab === 'bets'}" class="ptab${ui.tab === 'bets' ? ' on' : ''}" data-act="ptab" data-v="bets">My bets${o ? ` <span class="badge">${o}</span>` : ''}</button><button role="tab" aria-selected="${ui.tab === 'chat'}" class="ptab${ui.tab === 'chat' ? ' on' : ''}" data-act="ptab" data-v="chat">Chat</button></div><span class="sp"></span>${ui.tab === 'slip' ? `<button class="ibtn" style="width:40px;height:40px;background:none" data-act="settings" aria-expanded="${ui.settings}" aria-label="Price change settings">${ic('gear', 18)}</button>` : ''}<button class="ibtn" style="width:40px;height:40px;background:none" data-act="closepanel" aria-label="Close panel">${ic('x', 18)}</button></div>`;
  if (ui.tab === 'chat') return `${tabs}<div class="pbody"><div class="chatph">${ic('chat', 28)}<p>Chat lives in the main Housebets shell.<br>It isn't part of this prototype.</p></div></div>`;
  if (ui.tab === 'bets') return `${tabs}<div class="pbody">${betsBody(false)}<a class="btn sec sm" href="#/slip?tab=mybets" data-act="closesheet">Open full My bets</a></div>`;
  const s = slipBody(); return `${tabs}<div class="pbody">${s.body}</div>${s.foot ? `<div class="pfoot">${s.foot}</div>` : ''}`;
}
export function slipPage() {
  const st = S.state(), s = slipBody(), o = S.openBets().length, n = S.settledBets().length;
  return `<div class="crumbs"><a class="back" href="#/" aria-label="Back">${ic('left')}</a><div class="path"><span style="padding:0 16px;font-weight:700">Bet slip &amp; My bets</span></div><span class="mut" style="margin-left:6px;white-space:nowrap">${o} open · ${n} settled</span></div>
  <div class="only-m card" style="margin-top:12px;display:flex;flex-direction:column" id="slipM">${panelInner().replace(/<button class="ibtn"[^>]*data-act="closepanel".*?<\/button>/, '')}</div>
  <div class="only-d slip-page" style="margin-top:16px"><section class="card" style="display:flex;flex-direction:column"><div class="ptabs"><span class="ptab on">Bet slip${st.slip.length ? ` <span class="badge">${st.slip.length}</span>` : ''}</span><span class="sp"></span><button class="ibtn" style="width:40px;height:40px;background:none" data-act="settings" aria-expanded="${st.ui.settings}" aria-label="Price change settings">${ic('gear', 18)}</button></div><div class="pbody" style="overflow:visible">${s.body}</div>${s.foot ? `<div class="pfoot" style="border-radius:0 0 12px 12px">${s.foot}</div>` : ''}</section><section><h2 style="margin-bottom:12px">My bets</h2>${betsBody(true)}</section></div>${foot}`;
}

/* ---------- states index + control panel ---------- */
export const STATES = [
  ['Match page', [['#/match/ars-bha?state=odds-up', 'Price rises', 'Flash and up arrow on the cell'], ['#/match/ars-bha?state=odds-down', 'Price falls', 'Flash and down arrow'], ['#/match/ars-bha?state=suspended', 'Markets suspended', 'VAR check locks goal markets. Corners stay open'], ['#/match/ars-bha?state=reopened', 'Reopened, repriced', 'Markets return with new prices'], ['#/match/ars-bha?state=goal', 'Goal', 'Score 1–1, everything repriced']]],
  ['Bet slip', [['#/slip?state=empty', 'Empty slip', ''], ['#/slip?state=ready', 'Stake and return', 'Place button carries stake and return'], ['#/slip?state=changed', 'Odds changed', 'Player must accept'], ['#/slip?state=suspended', 'Selection suspended', 'Paused, stake kept'], ['#/slip?state=closed', 'Selection closed', 'Market no longer exists'], ['#/slip?state=placing', 'Placing', 'Confirming, slip locked'], ['#/slip?state=placed', 'Bet placed', 'Receipt with bet ID']]],
  ['Bet failed', [['#/slip?state=failed-balance', 'Not enough balance', 'Deposit and return'], ['#/slip?state=failed-limit', 'Over the limit', 'Set to max'], ['#/slip?state=failed-min', 'Under the minimum', ''], ['#/slip?state=failed-connection', 'Connection lost', 'Try again'], ['#/slip?state=failed-changed', 'Price moved while confirming', ''], ['#/slip?state=failed-suspended', 'Paused while confirming', ''], ['#/slip?state=signed-out', 'Signed out', 'Slip survives log in']]],
  ['My bets', [['#/slip?tab=mybets&state=open', 'Open', 'Live score on the ticket'], ['#/slip?tab=mybets&state=settled', 'Settled', 'Won, lost, void, cashed out'], ['#/slip?tab=mybets&state=cashout-available', 'Cash out: available', 'Amount on the button'], ['#/slip?tab=mybets&state=cashout-confirm', 'Cash out: confirm', ''], ['#/slip?tab=mybets&state=cashout-changed', 'Cash out: value changed', 'Old amount struck through'], ['#/slip?tab=mybets&state=cashout-suspended', 'Cash out: paused', 'Suspends with the market'], ['#/slip?tab=mybets&state=cashout-unavailable', 'Cash out: not offered', ''], ['#/slip?tab=mybets&state=cashout-done', 'Cash out: done', '']]],
  ['Lists and shell', [['#/live?state=nothing-live', 'Nothing live', 'Shows Starting soon'], ['#/?state=signed-out', 'Signed out', 'Log In and Register in the top bar']]],
];
export function statesPage() {
  return `<div class="states"><h1 style="font-size:24px">Every state, one link each</h1><p class="mut">Each link opens the real page in that state. They also happen on their own: open <a href="#/match/ars-bha?t=0" style="color:var(--cy)">Arsenal v Brighton</a> and watch for 90 seconds.</p>${STATES.map(([h, l]) => `<h2>${h}</h2><ul>${l.map(([href, t, d]) => `<li><a class="card" href="${href}"><b>${t}</b><small>${d || '&nbsp;'}</small></a></li>`).join('')}</ul>`).join('')}</div>${foot}`;
}
export function controlPanel(clock) {
  return `<h3>Demo controls <button data-act="ctl" aria-label="Close">${ic('x', 18)}</button></h3>
  <h4>Match clock</h4><div class="g"><button data-act="restart">Restart match</button><button data-act="pause" class="${clock.paused ? 'on' : ''}">${clock.paused ? 'Resume' : 'Pause'} updates</button><button data-act="speed" data-v="1" class="${clock.speed === 1 ? 'on' : ''}">×1</button><button data-act="speed" data-v="4" class="${clock.speed === 4 ? 'on' : ''}">×4</button><button data-act="tour">Play 40s tour</button></div>
  <h4>Make the next bet fail</h4><div class="g">${[['connection', 'Connection lost'], ['changed', 'Price moves'], ['suspended', 'Market pauses']].map(([k, l]) => `<button data-act="force" data-v="${k}" class="${S.state().ui.forceFail === k ? 'on' : ''}">${l}</button>`).join('')}</div>
  <h4>Session</h4><div class="g"><button data-act="signtoggle">${S.state().signedIn ? 'Sign out' : 'Sign in'}</button><button data-act="lowbal">Set balance to 4.20</button><button data-act="resetall">Reset demo</button><a href="#/states" data-act="ctl">All states</a></div>
  ${STATES.map(([h, l]) => `<h4>${h}</h4><div class="g">${l.map(([href, t]) => `<a href="${href}" data-act="ctl">${t}</a>`).join('')}</div>`).join('')}`;
}

/* ---------- search ---------- */
export function searchResults(q) {
  q = q.trim().toLowerCase(); const hi = s => { const i = s.toLowerCase().indexOf(q); return i < 0 || !q ? esc(s) : esc(s.slice(0, i)) + '<mark>' + esc(s.slice(i, i + q.length)) + '</mark>' + esc(s.slice(i + q.length)); };
  if (!q) { const fl = S.state().follows; return `<h4>Following</h4>${fl.teams.map(id => `<a href="#/football?team=${id}">${crest(id)}${esc(TEAMS[id].name)}<small>Team</small></a>`).join('')}${fl.comps.map(id => `<a href="#/football?comp=${id}"><span class="cbadge" style="width:24px;height:24px;font-size:9px">${COMPS[id].code}</span>${COMPS[id].name}<small>Competition</small></a>`).join('')}<h4>Try</h4><a href="#/match/ars-bha?m=crn">Total corners<small>Arsenal v Brighton</small></a>`; }
  const teams = Object.entries(TEAMS).filter(([, t]) => t.name.toLowerCase().includes(q) || t.code.toLowerCase() === q).slice(0, 5);
  const comps = Object.entries(COMPS).filter(([, c]) => c.name.toLowerCase().includes(q));
  const f = M.fx('ars-bha'), { groups } = M.markets(f);
  const players = groups.find(g => g.id === 'ags').sels.filter(s => s.label.toLowerCase().includes(q)).slice(0, 5);
  const mk = groups.filter(g => g.name.toLowerCase().includes(q)).slice(0, 6);
  const sec = (h, a) => a.length ? `<h4>${h} · ${a.length}</h4>${a.join('')}` : '';
  const out = sec('Teams', teams.map(([id, t]) => { const fxs = FIXTURES.filter(x => x.home === id || x.away === id), lv = fxs.find(M.isLive); return `<a href="${lv ? '#/match/' + lv.id : '#/football?team=' + id}">${crest(id)}${hi(t.name)}<small>${lv ? 'Live now' : fxs.length + ' matches'}</small></a>`; }))
    + sec('Players', players.map(s => `<a href="#/match/ars-bha?m=ags&q=${encodeURIComponent(s.label)}">${ic('user', 18)}${hi(s.label)}<small>${s.sub} · Goalscorer markets</small></a>`))
    + sec('Competitions', comps.map(([id, c]) => `<a href="#/football?comp=${id}"><span class="cbadge" style="width:24px;height:24px;font-size:9px">${c.code}</span>${hi(c.name)}<small>${FIXTURES.filter(x => x.comp === id).length} matches</small></a>`))
    + sec('Markets', mk.map(g => `<a href="#/match/ars-bha?m=${g.id}">${ic('slip', 18)}${hi(g.name)}<small>Arsenal v Brighton</small></a>`));
  return out || `<div class="none">No results for “${esc(q)}”. Live now:</div>${liveSoccer().slice(0, 3).map(x => `<a href="#/match/${x.id}">${crest(x.home)}${esc(M.fxShort(x))}<small>Live</small></a>`).join('')}`;
}
