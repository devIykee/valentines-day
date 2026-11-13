// HTML for every page. Pure string templates; app.js wires events and patches live cells.
import * as M from './model.js';
import * as S from './store.js';
import { HB } from './brand-icons.js';
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
export const ic = (n, s = 20, extra = '') => HB[n] ? `<svg width="${s}" height="${s}" viewBox="${HB[n].vb}" aria-hidden="true" ${extra}>${HB[n].body}</svg>` : _ic(n, s, extra);
const _ic = (n, s = 20, extra = '') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="${n === 'star-f' ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.800" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${I[n === 'star-f' ? 'star' : n]}</svg>`;
const lock = `<svg class="lock" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.200" stroke-linecap="round" aria-hidden="true">${I.lock}</svg>`;
export const tchip = `<span class="tchip" role="img" aria-label="USDT"><svg width="16" height="16" viewBox="${HB.usdt.vb}" aria-hidden="true">${HB.usdt.body}</svg></span>`;

/* Original shield crests: shape + two colours + one pattern. No club marks. */
let cid = 0;
export function crest(id, cls = '') {
  const t = TEAMS[id]; if (!t) return ''; const c = 'c' + (++cid);
  const pat = { stripe: `<path d="M9 0h4v32H9zM19 0h4v32h-4z" fill="${t.b}"/>`, half: `<path d="M16 0h16v32H16z" fill="${t.b}"/>`, hoop: `<path d="M0 12h32v7H0z" fill="${t.b}"/>`, chev: `<path d="M4 9l12 9 12-9v6l-12 9-12-9z" fill="${t.b}"/>`, plain: `<circle cx="16" cy="14" r="5" fill="${t.b}"/>` }[t.pat];
  return `<svg class="crest ${cls}" viewBox="0 0 32 32" aria-hidden="true"><defs><clipPath id="${c}"><path d="M4 3h24v13c0 7-5 11-12 14C9 27 4 23 4 16z"/></clipPath></defs><g clip-path="url(#${c})"><rect width="32" height="32" fill="${t.a}"/>${pat}</g><path d="M4 3h24v13c0 7-5 11-12 14C9 27 4 23 4 16z" fill="none" stroke="#ffffff38" stroke-width="1.200"/></svg>`;
}
const names = id => `<span class="only-d">${esc(TEAMS[id].name)}</span><span class="only-m">${esc(TEAMS[id].short)}</span>`;

/* ---------- prices ---------- */
// Match page cell: label + price.
export function odd(sel, g, f, { inline = false, label } = {}) {
  const on = S.inSlip(sel.id), sus = !!g.sus, lab = label ?? sel.short ?? sel.label;
  const aria = `${sel.label}${sel.short && sel.short !== sel.label ? ' ' + sel.short : ''} ${sus ? 'suspended' : fmt(sel.p)}, ${g.name}`;
  return `<button class="odd${inline ? ' in' : ''}${on ? ' on' : ''}${sus ? ' sus' : ''}" data-sel="${esc(sel.id)}" data-p="${sel.p}" aria-pressed="${on}" aria-label="${esc(aria)}"${sus ? ' aria-disabled="true" tabindex="-1"' : ''}><span class="l">${inline && sel.short && sel.short !== sel.label ? `<span class="only-d">${esc(sel.label)}</span><span class="only-m">${esc(sel.short)}</span>` : esc(lab)}${sel.sub ? ` <small class="mut">${sel.sub}</small>` : ''}</span><span class="p">${sus ? lock : `<i class="ar"></i><span class="pv">${fmt(sel.p)}</span>`}</span></button>`;
}
// List price box: the number only, under a 1 / X / 2 column label.
function pbox(sel, g) {
  const on = S.inSlip(sel.id);
  return `<button class="odd pb${on ? ' on' : ''}" data-sel="${esc(sel.id)}" data-p="${sel.p}" aria-pressed="${on}" aria-label="${esc(`${sel.label} ${fmt(sel.p)}, ${g.name}`)}"><i class="ar"></i><span class="pv">${fmt(sel.p)}</span></button>`;
}
export function rowOdds(f) {
  const g = M.markets(f).groups[0];
  if (g.sus) return `<div class="pb-sus" title="${esc(g.sus)}">${lock}<span>Suspended</span></div>`;
  return g.sels.map(s => pbox(s, g)).join('');
}

/* ---------- rows ---------- */
const hhmm = d => String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
const dayLabel = d => { const n = new Date(), k = Math.round((new Date(d.getFullYear(), d.getMonth(), d.getDate()) - new Date(n.getFullYear(), n.getMonth(), n.getDate())) / 864e5); return k === 0 ? 'Today' : k === 1 ? 'Tomorrow' : d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }); };
const followed = f => f.sport === 'soccer' && (S.follows('teams', f.home) || S.follows('teams', f.away) || S.follows('fx', f.id));
function meta(f, st, showComp) {
  const comp = showComp ? `<span class="cn">${esc(M.compName(f))}</span>` : '';
  const star = followed(f) ? `<span class="fstar" title="Following">${ic('star-f', 12)}</span>` : '';
  if (st.live) return `<span class="lv"><i></i>LIVE</span><span class="min" data-clock="${f.id}">${f.sport === 'soccer' ? M.clockText(st) : esc(st.status)}</span>${f.sport !== 'soccer' ? `<span class="osc">${esc(st.score)}</span>` : ''}${comp}${star}`;
  const d = new Date(st.koAt || Date.now() + 36e5), mins = Math.round((d - Date.now()) / 60000);
  return `<span class="kt">${hhmm(d)}</span><span class="kd${mins < 60 ? ' soon' : ''}">${mins < 60 ? `in ${Math.max(1, mins)} min` : dayLabel(d)}</span>${comp}${star}`;
}
export function row(f, { showComp = false, mine = false } = {}) {
  const st = M.stateOf(f);
  const nm = f.sport === 'soccer' ? M.markets(f).groups.length - 1 : 0;
  const team = (i) => {
    if (f.sport !== 'soccer') return `<span class="tm"><span class="tn">${esc(i ? f.b : f.a)}</span></span>`;
    const id = i ? f.away : f.home, t = TEAMS[id];
    return `<span class="tm">${crest(id)}<span class="tn"><span class="only-d">${esc(t.name)}</span><span class="only-m">${esc(t.short)}</span></span>${st.live ? `<b class="sc${st.score[i] ? '' : ' z'}" data-score="${f.id}-${i}">${st.score[i]}</b>` : ''}</span>`;
  };
  const bets = mine ? S.hasOpenBetOn(f.id) : [];
  const href = f.sport === 'soccer' ? `#/match/${f.id}` : null;
  const ev = `<span class="meta">${meta(f, st, showComp)}</span>${team(0)}${team(1)}${showComp ? `<span class="cn2">${esc(M.compName(f))}</span>` : ''}${nm ? `<span class="mk-m">+${nm} markets</span>` : ''}${bets.map(b => `<span class="mybet">${ic('slip', 12)} ${esc(b.label)} @ ${fmt(b.odds)} · ${fmt(b.stake)} USDT</span>`).join('')}`;
  return `<div class="row${f.sport !== 'soccer' ? ' two' : ''}" data-fx="${f.id}">${href ? `<a class="ev" href="${href}">${ev}</a>` : `<div class="ev">${ev}</div>`}<div class="px" data-oddsfor="${f.id}">${rowOdds(f)}</div>${href ? `<a class="more" href="${href}" aria-label="${nm} more markets">+${nm}${ic('right', 14)}</a>` : '<span class="more"></span>'}</div>`;
}
// A list card: title on the left, 1 X 2 labels above the price column.
function listCard(title, rows, { sub = '', action = '', two = false } = {}) {
  return `<section class="lcard"><header class="lh"><div class="lt">${title}${sub ? `<span class="ls">${sub}</span>` : ''}${action}</div><div class="cols${two ? ' two' : ''}">${two ? '<i>1</i><i>2</i>' : '<i>1</i><i>X</i><i>2</i>'}</div><span class="cspace"></span></header>${rows}</section>`;
}
const followBtn = (kind, id, name) => { const on = S.follows(kind, id); return `<button class="fbtn${on ? ' on' : ''}" data-act="follow" data-kind="${kind}" data-id="${id}" aria-pressed="${on}" aria-label="${on ? 'Following' : 'Follow'} ${esc(name)}">${ic(on ? 'star-f' : 'star', 14)}<span>${on ? 'Following' : 'Follow'}</span></button>`; };

/* ---------- shared bits ---------- */
export const searchBox = () => `<div class="search" role="search">${ic('search', 18)}<input id="q" type="search" autocomplete="off" placeholder="Search teams, players, competitions or markets" aria-label="Search teams, players, competitions or markets" aria-controls="sres"><kbd>/</kbd><div id="sres" class="sres" hidden role="listbox"></div></div>`;
const liveSoccer = () => FIXTURES.filter(M.isLive);
const liveAll = () => [...liveSoccer(), ...OTHERS.filter(f => M.stateOf(f).live)];
export const liveCount = () => liveAll().length;
export const sportCount = id => id === 'soccer' ? FIXTURES.length : OTHERS.filter(f => f.sport === id && M.stateOf(f).live).length;
const byFollowThenTime = (a, b) => (followed(b) - followed(a)) || (M.isLive(b) - M.isLive(a)) || ((M.stateOf(a).koAt || 0) - (M.stateOf(b).koAt || 0));
const upcoming = () => FIXTURES.filter(f => !M.isLive(f)).sort((a, b) => M.stateOf(a).koAt - M.stateOf(b).koAt);
const pageHead = (title, sub = '', right = '') => `<div class="ph"><h1>${title}</h1>${sub ? `<span class="ps">${sub}</span>` : ''}<span class="sp"></span>${right}</div>`;
const foot = `<footer class="foot"><span>Prototype. Sample fixtures, sample prices, demo USDT. No real money.</span><span>18+. Play responsibly.</span><a href="#/states">All states</a></footer>`;
const sportStrip = (active, hrefFor, counts) => `<nav class="strip" aria-label="Sports">${[['all', 'All', null], ...SPORTS.map(s => [s.id, s.id === 'soccer' ? 'Football' : s.name, s.id])].filter(([k]) => counts[k] !== undefined).map(([k, l, icn]) => `<a class="chip2${active === k ? ' on' : ''}" href="${hrefFor(k)}"${active === k ? ' aria-current="true"' : ''}>${icn ? ic(icn, 16) : ''}${l}<span class="n">${counts[k]}</span></a>`).join('')}</nav>`;

/* ---------- 1. Sports home ---------- */
export function home() {
  const lv = liveSoccer().sort(byFollowThenTime), n = liveCount();
  const counts = { soccer: FIXTURES.length }; for (const s of SPORTS.slice(1)) counts[s.id] = sportCount(s.id);
  const strip = `<nav class="strip only-m" aria-label="Sports"><a class="chip2 live" href="#/live"><span class="dot"></span>Live<span class="n">${n}</span></a>${SPORTS.map(s => `<a class="chip2" href="${s.id === 'soccer' ? '#/football' : '#/live?sport=' + s.id}">${ic(s.id, 16)}${s.id === 'soccer' ? 'Football' : s.name}<span class="n">${counts[s.id]}</span></a>`).join('')}</nav>`;
  const live = n ? listCard(`<span class="lv"><i></i>LIVE</span> Live now`, lv.slice(0, 5).map(f => row(f, { showComp: true })).join('') + `<a class="all" href="#/live">All live <b>${n}</b>${ic('right', 14)}</a>`)
    : `<section class="lcard"><div class="empty"><img class="eart" src="assets/sports-ball.png" alt="" width="72" height="72"><b>Nothing live right now</b><span>The next kick-offs are below.</span></div></section>`;
  const soon = listCard('Starting soon', upcoming().slice(0, 6).map(f => row(f, { showComp: true })).join('') + `<a class="all" href="#/football">All football${ic('right', 14)}</a>`);
  const comps = `<section class="lcard only-m"><header class="lh"><div class="lt">Top competitions</div></header>${COMP_ORDER.map(id => { const l = FIXTURES.filter(f => f.comp === id), k = l.filter(M.isLive).length; return `<a class="crow" href="#/football?comp=${id}"><span class="cbadge">${COMPS[id].code}</span><span class="cname">${COMPS[id].name}</span><span class="ls">${l.length}${k ? ` · ${k} live` : ''}</span>${ic('right', 16)}</a>`; }).join('')}</section>`;
  return `${searchBox()}${strip}${live}${soon}${comps}${foot}`;
}

/* ---------- 2. Live ---------- */
export function live(q) {
  const sport = q.sport || 'all', comp = q.comp || 'all', all = liveAll();
  const counts = { all: all.length }; for (const s of SPORTS) counts[s.id] = all.filter(f => f.sport === s.id).length;
  const link = o => { const p = new URLSearchParams({ ...(sport !== 'all' && { sport }), ...(comp !== 'all' && { comp }), ...o }); for (const [k, v] of [...p]) if (v === 'all') p.delete(k); const s = p.toString(); return '#/live' + (s ? '?' + s : ''); };
  const inSport = all.filter(f => sport === 'all' || f.sport === sport);
  const compsHere = [...new Set(inSport.map(f => f.comp || f.compName))];
  const list = inSport.filter(f => comp === 'all' || (f.comp || f.compName) === comp);
  const filter = compsHere.length > 1 ? `<label class="sel"><span class="sr">Competition</span><select class="dd" data-act="nav-select"><option value="${link({ comp: 'all' })}">All competitions</option>${compsHere.map(c => `<option value="${link({ comp: c })}"${comp === c ? ' selected' : ''}>${COMPS[c]?.name || esc(c)}</option>`).join('')}</select></label>` : '';
  const head = pageHead('Live', `${all.length} in play`, filter) + sportStrip(sport, k => link({ sport: k, comp: 'all' }), counts);
  if (!list.length) {
    const what = sport !== 'all' && all.length ? `No live ${SPORTS.find(s => s.id === sport).name.toLowerCase()} right now` : 'Nothing live right now';
    return `${head}<section class="lcard"><div class="empty"><img class="eart" src="assets/sports-ball.png" alt="" width="72" height="72"><b>${what}</b><span>Here is what kicks off next.</span></div></section>${listCard('Starting soon', upcoming().slice(0, 6).map(f => row(f, { showComp: true })).join(''))}${foot}`;
  }
  const by = new Map(); for (const f of list.sort(byFollowThenTime)) { const k = f.comp || f.compName; (by.get(k) || by.set(k, []).get(k)).push(f); }
  let out = '';
  for (const [k, l] of by) out += listCard(COMPS[k] ? COMPS[k].name : esc(k), l.map(f => row(f, { mine: true })).join(''), { sub: COMPS[k] ? COMPS[k].country : SPORTS.find(s => s.id === l[0].sport).name, two: l[0].sport !== 'soccer' });
  return head + out + foot;
}

/* ---------- 3. Football ---------- */
export function football(q) {
  const comp = q.comp || 'all', team = q.team;
  const lv = liveSoccer().length;
  const tabs = `<nav class="strip" aria-label="Competitions"><a class="chip2${comp === 'all' ? ' on' : ''}" href="#/football"${comp === 'all' ? ' aria-current="true"' : ''}>All<span class="n">${FIXTURES.length}</span></a>${COMP_ORDER.map(id => `<a class="chip2${comp === id ? ' on' : ''}" href="#/football?comp=${id}"${comp === id ? ' aria-current="true"' : ''}>${COMPS[id].name}<span class="n">${FIXTURES.filter(f => f.comp === id).length}</span></a>`).join('')}</nav>`;
  const tf = team ? `<div class="tfilter">${crest(team)}<span>Matches for <b>${esc(TEAMS[team].name)}</b></span>${followBtn('teams', team, TEAMS[team].name)}<a href="#/football${comp !== 'all' ? '?comp=' + comp : ''}" class="clr" aria-label="Clear team filter">${ic('x', 16)}</a></div>` : '';
  let out = '';
  for (const id of COMP_ORDER) {
    if (comp !== 'all' && comp !== id) continue;
    const l = FIXTURES.filter(f => f.comp === id && (!team || f.home === team || f.away === team)).sort((a, b) => (M.isLive(b) - M.isLive(a)) || (M.stateOf(a).koAt - M.stateOf(b).koAt));
    if (!l.length) continue;
    const k = l.filter(M.isLive).length;
    out += listCard(COMPS[id].name, l.map(f => row(f)).join(''), { sub: `${COMPS[id].country}${k ? ` · ${k} live` : ''}`, action: followBtn('comps', id, COMPS[id].name) });
  }
  return `${pageHead('Football', `5 competitions · ${lv} live`)}${tabs}${tf}${out || '<section class="lcard"><div class="empty"><b>No matches here</b></div></section>'}${foot}`;
}

/* ---------- 4. Match ---------- */
export const matchUI = { tab: 'popular', q: '', shut: new Set() };
export function match(id) {
  const f = M.fx(id); if (!f || f.sport !== 'soccer') return `<section class="lcard"><div class="empty"><b>Match not found</b><a class="btn sec sm" href="#/">Back to Sports home</a></div></section>`;
  const { st } = M.markets(f), h = TEAMS[f.home], a = TEAMS[f.away], c = COMPS[f.comp];
  const side = (tid, t, aw) => `<div class="side${aw ? ' aw' : ''}">${crest(tid, 'lg')}<div class="col"><span class="nm">${esc(t.name)}</span>${followBtn('teams', tid, t.name)}</div></div>`;
  const centre = st.live ? `<div class="score" aria-label="Score ${st.score[0]} to ${st.score[1]}"><b class="${st.score[0] ? '' : 'z'}" data-score="${id}-0">${st.score[0]}</b><i>–</i><b class="${st.score[1] ? '' : 'z'}" data-score="${id}-1">${st.score[1]}</b></div><div class="st"><span class="lv soft"><i></i>LIVE</span><span class="min" data-clockfull="${id}">${M.clockFull(st)}</span></div>` : `<div class="score"><b style="width:auto;padding:0 14px;font-size:20px">${hhmm(new Date(st.koAt))}</b></div><div class="st mut">${dayLabel(new Date(st.koAt))}</div>`;
  return `<a class="backl" href="#/football?comp=${f.comp}">${ic('left', 18)}${c.name}</a>
  <section class="board" id="board"><div class="lg">${c.name}</div><div class="bx">${side(f.home, h)}<div class="ctr">${centre}<span class="evt" id="evt" role="status" aria-live="polite"></span></div>${side(f.away, a, 1)}</div></section>
  <div class="mini" id="mini" aria-hidden="true"><div class="in">${crest(f.home)}<span>${h.code}</span><span class="ms"><span data-score="${id}-0">${st.score[0]}</span> – <span data-score="${id}-1">${st.score[1]}</span></span><span>${a.code}</span>${crest(f.away)}${st.live ? `<span class="min" data-clockfull="${id}">${M.clockFull(st)}</span>` : ''}<span class="evt" id="evt2"></span><span class="sp"></span><div class="mo odds" data-oddsfor="${id}" data-inline="1"></div></div><div class="mtabs" id="mtabs2"></div></div>
  <nav class="mtabs-main" id="mtabs" aria-label="Market groups"></nav><div id="mkts"></div>${foot}`;
}
export function matchTabs(id) {
  const f = M.fx(id), { groups } = M.markets(f);
  return M.TABS.map(([k, nm]) => `<button class="tab${matchUI.tab === k && !matchUI.q ? ' on' : ''}" data-act="mtab" data-tab="${k}" aria-pressed="${matchUI.tab === k && !matchUI.q}">${nm} <span class="n">${groups.filter(g => g.tab === k).length}</span></button>`).join('');
}
export function matchMarkets(id) {
  const f = M.fx(id), { groups } = M.markets(f), q = matchUI.q.trim().toLowerCase();
  const list = q ? groups.filter(g => g.name.toLowerCase().includes(q) || g.sels.some(s => s.label.toLowerCase().includes(q))) : groups.filter(g => g.tab === matchUI.tab);
  if (!list.length) return `<section class="lcard"><div class="empty"><b>${q ? `No markets match “${esc(matchUI.q)}”` : 'No markets in this group right now'}</b>${q ? `<button class="btn sec sm" data-act="mclear">Show all markets</button>` : ''}</div></section>`;
  const head = q ? `<div class="qnote">${list.length} market${list.length === 1 ? '' : 's'} for “${esc(matchUI.q)}” <button data-act="mclear">Show all</button></div>` : '';
  return head + list.map(g => {
    const shut = matchUI.shut.has(g.id) && !q; let body;
    if (g.tbl) { const lines = [...new Set(g.sels.map(s => s.line))]; body = `<div class="gb tbl"><span></span><span class="th">${esc(g.head[0])}</span><span class="th">${esc(g.head[1])}</span>${lines.map(ln => `<span class="ln">${ln}</span>${g.sels.filter(s => s.line === ln).map(s => odd(s, g, f, { inline: true, label: s.label })).join('')}`).join('')}</div>`; }
    else body = `<div class="gb" style="--cols:${g.cols}">${g.sels.map(s => odd(s, g, f, { inline: true, label: s.label })).join('')}</div>`;
    return `<section class="mgroup${shut ? ' shut' : ''}${g.sus ? ' sus' : ''}" data-g="${g.id}"><button class="gh" data-act="gtoggle" data-g="${g.id}" aria-expanded="${!shut}"><span>${esc(g.name)}</span><span class="reason">${lock}<span class="rt">${esc(g.sus || '')}</span></span><span class="sp"></span><span class="ch">${ic('up', 18)}</span></button>${body}</section>`;
  }).join('');
}

/* ---------- 5. Bet slip + My bets ---------- */
const money = x => fmt(Math.round(x * 100) / 100);
function slipCard(v, ui) {
  const it = v.it;
  if (v.status === 'closed') return `<div class="scard closed" data-item="${esc(it.id)}"><div class="t"><b>Selection no longer available</b></div><div class="m">${v.f ? esc(M.fxName(v.f)) : ''}</div><div class="note">${lock}<span>This market has closed.</span><button class="act" data-act="rm" data-id="${esc(it.id)}">Remove</button></div></div>`;
  const st = v.st, lv = st.live ? `<span class="min">${Array.isArray(st.score) ? st.score.join('–') : esc(st.score)} · ${st.sec != null ? M.clockText(st) : esc(st.status)}</span>` : '';
  const s = S.num(it.stake), fail = ui.fail && ui.fail.id === it.id ? ui.fail.code : null;
  const pr = v.status === 'changed' ? `<s>${fmt(it.price)}</s><span style="color:${v.dir === 'up' ? 'var(--up)' : 'var(--down)'}">${v.dir === 'up' ? '▲' : '▼'}</span>${fmt(v.cur)}` : fmt(it.price);
  return `<div class="scard ${v.status}" data-item="${esc(it.id)}">
    <div class="t"><b>${esc(v.label)}</b><span class="pr" aria-label="Price ${fmt(v.status === 'changed' ? v.cur : it.price)}">${pr}</span><button class="rm" data-act="rm" data-id="${esc(it.id)}" aria-label="Remove ${esc(v.label)}">${ic('x', 16)}</button></div>
    <div class="m"><span>${esc(v.market)}</span>·<span>${esc(M.fxShort(v.f))}</span>${lv}</div>
    ${v.status === 'paused' ? `<div class="note" role="status">${lock}<span><b>Paused:</b> ${esc(v.reason)}. Your stake is kept.</span></div>` : ''}
    ${v.status === 'changed' ? `<div class="note" role="status"><span><b>Price changed</b> from ${fmt(it.price)} to ${fmt(v.cur)}. Nothing is placed until you accept.</span></div>` : ''}
    ${it.auto && v.status === 'ok' ? `<div class="note ok"><span>Updated to ${fmt(it.auto.to)}: you accept higher prices automatically.</span></div>` : ''}
    <div class="stake"><label class="inp">${tchip}<span class="sr">Stake in USDT for ${esc(v.label)}</span><input inputmode="decimal" placeholder="Stake" value="${esc(it.stake)}" data-stake="${esc(it.id)}" ${ui.placing ? 'disabled' : ''}></label><div class="ret">Returns<b data-ret="${esc(it.id)}">${s ? money(s * (v.status === 'changed' ? v.cur : it.price)) : '—'}</b></div></div>
    <div class="quick" role="group" aria-label="Quick stakes">${[5, 10, 25, 50].map(q => `<button data-act="quick" data-id="${esc(it.id)}" data-v="${q}">${q}</button>`).join('')}</div>
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
  return `<div class="rcpt" role="status"><div class="ok"><i>${ic('check', 16)}</i>Bet${r.bets.length > 1 ? 's' : ''} placed</div>
  ${r.bets.map(b => { const f = M.fx(b.fxId); return `<dl><dt>${esc(b.label)}</dt><dd style="color:var(--price)">${fmt(b.odds)}</dd><dt>${esc(b.market)} · ${esc(M.fxShort(f))}</dt><dd>${b.id}</dd><dt>Stake</dt><dd>${money(b.stake)} USDT</dd><dt>Potential return</dt><dd>${money(b.stake * b.odds)} USDT</dd></dl>${b.auto ? `<div class="note ok">Placed at ${fmt(b.odds)}: you accept higher prices automatically.</div>` : ''}`; }).join('<hr>')}
  <div class="rbtns"><button class="btn pri sm" data-act="viewbets">View in My bets</button><button class="btn sec sm" data-act="keep">Bet again</button></div></div>`;
}
export function slipBody() {
  const st = S.state(), ui = st.ui;
  if (ui.receipt) return { body: receipt(ui.receipt), foot: '' };
  if (!st.slip.length) return { body: `<div class="empty"><img class="eart" src="assets/sports-ball.png" alt="" width="72" height="72"><b>Your bet slip is empty</b><span>Tap a price to add a bet.</span></div>`, foot: '' };
  const views = st.slip.map(S.itemView), b = S.slipButton();
  const head = `<div class="shd"><b>Singles</b><span class="mut">· ${st.slip.length}</span><span class="sp"></span><button data-act="clear">Clear all</button></div>`;
  let btn;
  if (b.kind === 'placing') btn = `<button class="btn pri place" disabled style="flex-direction:row;gap:10px;background:var(--cta);color:var(--ink)"><i class="ring"></i>Confirming…</button>`;
  else if (b.kind === 'accept') btn = `<button class="btn place warn" data-act="accept">Accept ${b.n > 1 ? `${b.n} new prices` : `new price ${fmt(b.v.cur)}`}</button>`;
  else if (b.kind === 'blocked') btn = `<button class="btn place" disabled>${b.text}</button>`;
  else btn = `<button class="btn pri place" data-act="place">Place ${b.n > 1 ? `${b.n} bets · ` : 'bet · '}${money(b.stake)} USDT<small>Potential return ${money(b.ret)} USDT</small></button>`;
  const auto = `<label class="auto"><input type="checkbox" data-act="pc"${st.settings.pc !== 'ask' ? ' checked' : ''}><span>Accept higher prices automatically</span></label>`;
  return { body: head + views.map(v => slipCard(v, ui)).join(''), foot: `${failNote(ui.fail, st)}${btn}${auto}` };
}
const RES = { open: ['Open', ''], won: ['Won', 'won'], lost: ['Lost', 'lost'], void: ['Void', 'void'], cashed: ['Cashed out', 'co'] };
const placed = t => { const d = new Date(t); return `${d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} ${hhmm(d)}`; };
function cashOut(v) {
  const c = v.co, id = v.b.id;
  if (c.kind === 'available') return `<button class="co-btn" data-act="co" data-id="${id}">Cash out <b data-co="${id}">${money(c.value)} USDT</b></button>`;
  if (c.kind === 'confirm') return `<button class="co-btn cf" data-act="co" data-id="${id}">Confirm cash out <b>${money(c.value)} USDT</b></button><div class="co-txt">Tap again to confirm. Resets in ${c.left}s.</div>`;
  if (c.kind === 'changed') return `<div class="note"><span><b>Cash out value changed.</b> Check the new amount.</span></div><button class="co-btn" data-act="co" data-id="${id}">Cash out <s>${money(c.old)}</s> <b>${money(c.value)} USDT</b></button>`;
  if (c.kind === 'suspended') return `<div class="co-txt sus">${lock} Cash out paused: ${esc(c.reason)}</div>`;
  if (c.kind === 'unavailable') return `<div class="co-txt">Cash out isn't offered on this market.</div>`;
  if (c.kind === 'done') return `<div class="co-txt done">${ic('check', 16)} Cashed out ${money(v.b.returned)} USDT</div>`;
  return '';
}
function betCard(v) {
  const b = v.b, [rl, rc] = RES[b.status];
  const ret = b.status === 'open' ? ['Potential return', money(v.ret)] : ['Returned', money(b.returned)];
  return `<article class="bcard${S.state().ui.swept === b.id ? ' sweep' : ''}" data-bet="${b.id}"><div class="t"><b>${esc(b.label)}</b><span class="res ${rc}">${rl}</span><span class="pr">${fmt(b.odds)}</span></div><div class="m"><span>${esc(b.market)}</span>·<span>${esc(v.fxLabel)}</span>${v.live ? `<span class="lv soft"><i></i>LIVE</span><span class="min" data-betlive="${b.id}">${v.live.score} · ${v.live.min}</span>` : ''}</div>
  <div class="kv"><span>Stake<b>${money(b.stake)}</b></span><span>${ret[0]}<b>${ret[1]}</b></span></div>
  <div data-cowrap="${b.id}">${cashOut(v)}</div><div class="bid">${b.id} · ${placed(b.placedAt)}</div></article>`;
}
export function betsBody() {
  const ui = S.state().ui, o = S.openBets(), s = S.settledBets(), list = (ui.betsTab === 'open' ? o : s).map(S.betView);
  const seg = `<div class="seg" role="tablist"><button role="tab" aria-selected="${ui.betsTab === 'open'}" class="${ui.betsTab === 'open' ? 'on' : ''}" data-act="btab" data-v="open">Open <span class="n">${o.length}</span></button><button role="tab" aria-selected="${ui.betsTab === 'settled'}" class="${ui.betsTab === 'settled' ? 'on' : ''}" data-act="btab" data-v="settled">Settled <span class="n">${s.length}</span></button></div>`;
  const empty = `<div class="empty"><b>${ui.betsTab === 'open' ? 'No open bets' : 'No settled bets yet'}</b><span>${ui.betsTab === 'open' ? 'Bets you place show here straight away.' : ''}</span></div>`;
  return `${seg}<div class="bcards">${list.length ? list.map(betCard).join('') : empty}</div>`;
}
const slipTabs = (close) => { const st = S.state(), ui = st.ui, o = S.openBets().length; return `<div class="ptabs"><div role="tablist" class="tl"><button role="tab" aria-selected="${ui.tab !== 'bets'}" class="ptab${ui.tab !== 'bets' ? ' on' : ''}" data-act="ptab" data-v="slip">Bet slip${st.slip.length ? ` <span class="badge">${st.slip.length}</span>` : ''}</button><button role="tab" aria-selected="${ui.tab === 'bets'}" class="ptab${ui.tab === 'bets' ? ' on' : ''}" data-act="ptab" data-v="bets">My bets${o ? ` <span class="badge">${o}</span>` : ''}</button></div>${close ? `<button class="xbtn" data-act="closesheet" aria-label="Close bet slip">${ic('x', 18)}</button>` : ''}</div>`; };
export function panelInner(close = false) {
  const ui = S.state().ui;
  if (ui.tab === 'bets') return `${slipTabs(close)}<div class="pbody">${betsBody()}</div>`;
  const s = slipBody(); return `${slipTabs(close)}<div class="pbody">${s.body}</div>${s.foot ? `<div class="pfoot">${s.foot}</div>` : ''}`;
}
export function slipPage() {
  const o = S.openBets().length, n = S.settledBets().length;
  return `${pageHead('Bet slip &amp; My bets', `${o} open · ${n} settled`)}<div class="slip-page"><section class="spanel">${panelInner()}</section></div>${foot}`;
}

/* ---------- states index + demo controls (kept off the main screens) ---------- */
export const STATES = [
  ['Match page', [['#/match/ars-bha?state=odds-up', 'Price rises', 'Flash and up arrow on the cell'], ['#/match/ars-bha?state=odds-down', 'Price falls', 'Flash and down arrow'], ['#/match/ars-bha?state=suspended', 'Markets suspended', 'VAR check locks goal markets. Corners stay open'], ['#/match/ars-bha?state=reopened', 'Reopened, repriced', 'Markets return with new prices'], ['#/match/ars-bha?state=goal', 'Goal', 'Score 1–1, everything repriced']]],
  ['Bet slip', [['#/slip?state=empty', 'Empty slip', ''], ['#/slip?state=ready', 'Stake and return', 'Place button carries stake and return'], ['#/slip?state=changed', 'Odds changed', 'Player must accept'], ['#/slip?state=suspended', 'Selection suspended', 'Paused, stake kept'], ['#/slip?state=closed', 'Selection closed', 'Market no longer exists'], ['#/slip?state=placing', 'Placing', 'Confirming, slip locked'], ['#/slip?state=placed', 'Bet placed', 'Receipt with bet ID']]],
  ['Bet failed', [['#/slip?state=failed-balance', 'Not enough balance', 'Deposit and return'], ['#/slip?state=failed-limit', 'Over the limit', 'Set to max'], ['#/slip?state=failed-min', 'Under the minimum', ''], ['#/slip?state=failed-connection', 'Connection lost', 'Try again'], ['#/slip?state=failed-changed', 'Price moved while confirming', ''], ['#/slip?state=failed-suspended', 'Paused while confirming', ''], ['#/slip?state=signed-out', 'Signed out', 'Slip survives log in']]],
  ['My bets', [['#/slip?tab=mybets&state=open', 'Open', 'Live score on the ticket'], ['#/slip?tab=mybets&state=settled', 'Settled', 'Won, lost, void, cashed out'], ['#/slip?tab=mybets&state=cashout-available', 'Cash out: available', 'Amount on the button'], ['#/slip?tab=mybets&state=cashout-confirm', 'Cash out: confirm', ''], ['#/slip?tab=mybets&state=cashout-changed', 'Cash out: value changed', 'Old amount struck through'], ['#/slip?tab=mybets&state=cashout-suspended', 'Cash out: paused', 'Suspends with the market'], ['#/slip?tab=mybets&state=cashout-unavailable', 'Cash out: not offered', ''], ['#/slip?tab=mybets&state=cashout-done', 'Cash out: done', '']]],
  ['Lists and shell', [['#/live?state=nothing-live', 'Nothing live', 'Shows Starting soon'], ['#/?state=signed-out', 'Signed out', 'Log In and Register in the top bar']]],
];
export function controlPanel(clock) {
  return `<div class="g"><button data-act="tour">Play the 40-second tour</button><button data-act="restart">Restart match at 52:00</button><button data-act="pause" class="${clock.paused ? 'on' : ''}">${clock.paused ? 'Resume' : 'Pause'} updates</button><button data-act="speed" data-v="${clock.speed === 4 ? 1 : 4}" class="${clock.speed === 4 ? 'on' : ''}">Speed ×4</button></div>
  <h4>Make the next bet fail</h4><div class="g">${[['connection', 'Connection lost'], ['changed', 'Price moves'], ['suspended', 'Market pauses']].map(([k, l]) => `<button data-act="force" data-v="${k}" class="${S.state().ui.forceFail === k ? 'on' : ''}">${l}</button>`).join('')}</div>
  <h4>Session</h4><div class="g"><button data-act="signtoggle">${S.state().signedIn ? 'Sign out' : 'Sign in'}</button><button data-act="lowbal">Set balance to 4.20</button><button data-act="resetall">Reset demo</button></div>`;
}
export function statesPage() {
  return `${pageHead('Every state')}<p class="intro">For reviewers. Each link opens the real page in that state. They also happen on their own: open <a href="#/match/ars-bha?t=0">Arsenal v Brighton</a> and watch for 90 seconds.</p><section class="ctlbox" id="ctlin">${controlPanel(M.control.state)}</section><div class="states">${STATES.map(([h, l]) => `<h2>${h}</h2><ul>${l.map(([href, t, d]) => `<li><a href="${href}"><b>${t}</b><small>${d || '&nbsp;'}</small></a></li>`).join('')}</ul>`).join('')}</div>${foot}`;
}

/* ---------- search ---------- */
export function searchResults(q) {
  q = q.trim().toLowerCase(); const hi = s => { const i = s.toLowerCase().indexOf(q); return i < 0 || !q ? esc(s) : esc(s.slice(0, i)) + '<mark>' + esc(s.slice(i, i + q.length)) + '</mark>' + esc(s.slice(i + q.length)); };
  if (!q) { const fl = S.state().follows; return `${fl.teams.length || fl.comps.length ? '<h4>Following</h4>' : ''}${fl.teams.map(id => `<a href="#/football?team=${id}">${crest(id)}${esc(TEAMS[id].name)}<small>Team</small></a>`).join('')}${fl.comps.map(id => `<a href="#/football?comp=${id}"><span class="cbadge" style="width:24px;height:24px;font-size:9px">${COMPS[id].code}</span>${COMPS[id].name}<small>Competition</small></a>`).join('')}<h4>Try</h4><a href="#/match/ars-bha?m=crn">Total corners<small>Arsenal v Brighton</small></a>`; }
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
