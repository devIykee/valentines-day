#!/usr/bin/env python3
"""Generates index.html for the 30-second Housebets ad ("Thirty seconds").

Run: python3 build.py   (then: npx hyperframes check && npx hyperframes render)
The shot list lives in SHOTS below. Every claw shot reads the same progress
function, so the claw is always where a single 21-second move would put it.
"""
FPS, DUR, PRESS = 30, 30.0, 21.0
TRAVEL, TIP0 = 520, 660          # px the claw tip travels, and where it starts
ARM = 1500                       # claw artwork width; the tip is its right edge

def claw_x(t):                   # translateX of the claw group at time t
    return TIP0 - ARM + TRAVEL * min(t, PRESS) / PRESS

CLAW = '''<svg class="claw" viewBox="0 0 1500 360" width="1500" height="360" aria-hidden="true">
  <ellipse cx="1180" cy="330" rx="330" ry="22" fill="#000" opacity=".45"/>
  <path d="M0 70h930v220H0z" fill="#0d1c33"/><path d="M0 70h930v26H0z" fill="#16294a"/><path d="M0 262h930v28H0z" fill="#081326"/>
  <path d="M905 56h118a10 10 0 0 1 10 10v228a10 10 0 0 1-10 10H905z" fill="#f4f1ea"/><path d="M905 262h128v32a10 10 0 0 1-10 10H905z" fill="#d9d4c8"/>
  <circle cx="972" cy="250" r="17" fill="#daa520"/><circle cx="967" cy="245" r="6" fill="#f3d27a"/>
  <path d="M1030 92c70-26 170-24 236 8 40 20 62 52 62 84s-22 62-62 80c-66 30-166 30-236 6z" fill="#8a5a36"/>
  <path d="M1030 92c70-26 170-24 236 8 22 11 38 26 49 42-60-30-190-34-285-6z" fill="#a8744a"/>
  <path d="M1030 236c80 20 180 18 250-12-8 16-24 30-44 40-66 30-136 30-206 6z" fill="#6c4226"/>
  <g fill="#efe3c8" stroke="#3a2414" stroke-width="5" stroke-linejoin="round">
    <path d="M1296 120c70-22 150-10 204 34-66-6-126 2-190 30z"/>
    <path d="M1316 172c64-12 130 2 176 40-58 0-112 8-168 30z"/>
    <path d="M1290 224c56-4 112 12 150 46-50 2-98 10-146 28z"/>
  </g>
</svg>'''

LOCK = '<svg class="lk" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>'

def clip(i, cls, start, end, inner, z=1):
    return f'<section id="s{i}" class="clip shot {cls}" data-start="{start:g}" data-duration="{end - start:g}" data-track-index="{z}" data-track-kind="graphics">{inner}</section>'

def claw_shot(i, s, e, pressed=False):
    return clip(i, 'cu', s, e, f'''
  <div class="glass"></div>
  <div class="slipcard" id="s{i}-card"><div class="sc-t"><b>Harbor City</b><span class="pr">1.80</span></div><div class="sc-m">Winner · Harbor City v Northgate</div></div>
  <div class="place" id="s{i}-btn">Place bet</div>
  <div class="clawwrap" id="s{i}-claw">{CLAW}</div>
  <div class="tc" id="s{i}-tc"></div>''')

def hubie_shot(i, s, e, sky, extra=''):
    return clip(i, 'wide', s, e, f'''
  <div class="window sky-{sky}" id="s{i}-win"><i class="sun"></i><i class="moon"></i><i class="snow"></i><i class="leaf"></i><b></b></div>
  <div class="hub" id="s{i}-hub"><img src="assets/hubie.webp" alt=""><i class="lid l1" id="s{i}-l1"></i><i class="lid l2" id="s{i}-l2"></i></div>{extra}''')

def row(a, b, sa, sb, m, p):
    return f'<div class="mrow"><span class="lv"><i></i>LIVE</span><span class="mn">{m}</span><span class="tm">{a}<br>{b}</span><span class="scx">{sa}<br>{sb}</span>' + ''.join(f'<span class="cell"><small>{l}</small><b>{v}</b></span>' for l, v in p) + '</div>'

ROWS = [('Harbor City', 'Northgate', 1, 0, "52'", [('Harbor', '1.80'), ('Draw', '3.40'), ('North', '4.60')]),
        ('Bay Rovers', 'Ironworks', 2, 1, "58'", [('Bay', '1.45'), ('Draw', '4.20'), ('Iron', '7.50')]),
        ('Lakeside', 'Old Mill', 0, 0, "37'", [('Lake', '2.25'), ('Draw', '2.90'), ('Mill', '3.60')]),
        ('Kite United', 'Vanta', 1, 1, "49'", [('Kite', '2.40'), ('Draw', '3.10'), ('Vanta', '3.20')])]

shots = []
# S1 claw
shots.append(claw_shot(1, 0, 2.5))
# S2 Hubie, blink begins
shots.append(hubie_shot(2, 2.5, 4, 'day'))
# S3 fast: a live row, clock running
shots.append(clip(3, 'fast', 4, 6, f'<div class="big" id="s3-big">{row(*ROWS[0])}</div>'))
shots.append(claw_shot(4, 6, 7.5))
# S5 fast: market pauses and returns
shots.append(clip(5, 'fast', 7.5, 9.5, f'''<div class="mk" id="s5-mk"><div class="mk-h">Match result <span class="why" id="s5-why">{LOCK} Goal check</span></div>
  <div class="mk-b" id="s5-open"><span class="cell"><small>Harbor City</small><b>1.80</b></span><span class="cell"><small>Draw</small><b>3.40</b></span><span class="cell"><small>Northgate</small><b>4.60</b></span></div>
  <div class="mk-b sus" id="s5-sus"><span class="cell"><small>Harbor City</small>{LOCK}</span><span class="cell"><small>Draw</small>{LOCK}</span><span class="cell"><small>Northgate</small>{LOCK}</span></div>
  <div class="mk-b" id="s5-new"><span class="cell fl"><small>Harbor City</small><b>1.72</b></span><span class="cell fl"><small>Draw</small><b>3.55</b></span><span class="cell fl"><small>Northgate</small><b>5.00</b></span></div>
  <i class="tide" id="s5-tide"></i></div>'''))
shots.append(hubie_shot(6, 9.5, 10.5, 'late'))
# S7 chat
shots.append(clip(7, 'fast', 10.5, 12, '''<div class="chat" id="s7-chat"><div class="chat-h">Chat</div>
  <p id="s7-m1"><b>quietmango</b> hubie u there??</p><p id="s7-m2"><b>dave_from_accounts</b> bro HURRY</p><p id="s7-m3" class="hot"><b>snackgoblin</b> it's been 12 seconds</p></div>'''))
shots.append(claw_shot(8, 12, 12.5))
# S9 montage, each shot shorter and bigger in scale
shots.append(clip(9, 'fast', 12.5, 13.5, '<div class="digits" id="s9-d">52:00</div>'))
shots.append(hubie_shot(10, 13.5, 14.5, 'dusk'))
shots.append(clip(11, 'fast', 14.5, 15, '<div class="wall" id="s11-w">' + ''.join(row(*ROWS[i % 4]) for i in range(12)) + '</div>'))
shots.append(hubie_shot(12, 15, 15.5, 'night'))
shots.append(hubie_shot(13, 15.5, 15.75, 'snow'))
shots.append(hubie_shot(14, 15.75, 16, 'spring'))
# S10 everything at once
cells = ''.join(f'<div class="gc g{k}">{c}</div>' for k, c in enumerate([
    row(*ROWS[0]), '<div class="digits sm">67:41</div>', '<div class="sky sky-dusk"></div>', row(*ROWS[1]),
    '<div class="sky sky-night"><i class="moon"></i></div>', row(*ROWS[2]), '<div class="hubcell"><img src="assets/hubie.webp" alt=""><svg viewBox="0 0 200 120"><g stroke="#cfe9ee" stroke-width="1" fill="none" opacity=".8"><path d="M200 0L96 62M200 0l-60 104M200 0L60 20M178 12c-8 10-22 16-36 14M158 26c-10 12-26 20-44 18M190 30c-6 12-16 22-30 28M176 52c-6 10-14 18-26 22"/></g></svg></div>', '<div class="digits sm">88:02</div>',
    row(*ROWS[3]), '<div class="sky sky-snow"><i class="snow"></i></div>', '<div class="chatmini">bro HURRY</div>', '<div class="sky sky-spring"></div>']))
shots.append(clip(15, 'fast', 16, 17, f'<div class="grid" id="s15-g">{cells}</div>'))
# S11 silence
shots.append(claw_shot(16, 17, 18.5))
shots.append(hubie_shot(17, 18.5, 20, 'spring', '<svg class="web" viewBox="0 0 300 200"><g stroke="#cfe9ee" stroke-width="1.4" fill="none" opacity=".75"><path d="M300 0L40 150M300 0L170 200M300 0L0 40M262 22c-14 16-36 26-60 24M226 44c-18 20-46 32-76 30M286 52c-10 20-28 36-50 46M258 92c-10 18-26 32-46 40"/></g></svg>'))
shots.append(claw_shot(18, 20, 21))
# S12 the press
shots.append(claw_shot(19, 21, 21.5, True))
shots.append(hubie_shot(20, 21.5, 23, 'spring', '<div class="say" id="s20-say" data-var-text="line">haha, nice.</div>'))
# S13-15 type and end card
shots.append(clip(21, 'card', 23, 25, '<h1 id="s21-t" data-var-text="card1">Everything else is in a hurry.</h1>'))
shots.append(clip(22, 'card', 25, 26.5, '<h1 id="s22-t" data-var-text="card2">Slow it down.</h1>'))
shots.append(clip(23, 'end', 26.5, 30, f'''<div class="endc" id="s23-c"><img src="assets/housebets-logo.svg" alt="Housebets"><p class="url" data-var-text="url">housebets.com</p></div>
  <p class="legal" id="s23-l" data-var-text="legal">18+. Play responsibly.</p><div class="clawwrap endclaw" id="s23-claw">{CLAW}</div>'''))

CSS = '''
@font-face{font-family:Figtree;src:url("assets/fonts/figtree.woff2") format("woff2");font-weight:300 900}
@font-face{font-family:Oxanium;src:url("assets/fonts/oxanium-700.woff2") format("woff2");font-weight:700}
@font-face{font-family:"Red Hat Display";src:url("assets/fonts/redhat-700.woff2") format("woff2");font-weight:700}
:root{--ground:#041015;--ink:#f9f9fb;--s1:#0b1920;--s2:#0e202a;--cell:#152935;--line:#113a4c;--cy:#2fd4f5;--cta:#c4f4f1;--live:#f41f50;--warn:#e9963a;--gold:#daa520;--mut:#8f96a8}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1920px;height:1080px;overflow:hidden;background:var(--ground);font-family:Figtree,sans-serif;color:var(--ink)}
#root{position:relative;width:1920px;height:1080px;background:var(--ground);overflow:hidden}
.shot{position:absolute;inset:0;overflow:hidden;background:var(--ground)}
.shot::after{content:"";position:absolute;inset:0;background:radial-gradient(ellipse at 22% 12%,rgba(255,226,170,.10),transparent 55%),radial-gradient(ellipse at 50% 50%,transparent 55%,rgba(0,0,0,.42));pointer-events:none}
/* close-up: phone glass, slip card, button, claw */
.cu{background:#07161d}
.glass{position:absolute;left:880px;top:140px;width:960px;height:800px;border-radius:44px;background:linear-gradient(160deg,#0e222c,#0a1a22);border:2px solid #17485c;box-shadow:0 30px 80px rgba(0,0,0,.6)}
.slipcard{position:absolute;left:960px;top:250px;width:800px;padding:36px 40px;border-radius:24px;background:var(--s2);border:2px solid var(--line)}
.sc-t{display:flex;justify-content:space-between;align-items:baseline;font:700 54px Figtree}.sc-t .pr{font:700 58px Oxanium;color:var(--cy)}
.sc-m{margin-top:10px;font:500 32px Figtree;color:var(--mut)}
.place{position:absolute;left:960px;top:560px;width:800px;height:170px;border-radius:24px;background:var(--cta);color:#041015;font:700 64px Figtree;display:flex;align-items:center;justify-content:center;box-shadow:0 10px 0 #7fc9c6}
.clawwrap{position:absolute;left:0;top:468px;width:1500px;height:360px;z-index:3}
.tc{position:absolute;left:96px;bottom:84px;font:700 40px Oxanium;color:var(--mut);letter-spacing:.04em}
/* wide: Hubie and his window */
.wide{background:linear-gradient(180deg,#0a1c25,#041015 70%)}
.window{position:absolute;left:1150px;top:110px;width:560px;height:470px;border-radius:14px;border:16px solid #1b3442;overflow:hidden;box-shadow:inset 0 0 0 3px #0b1920}
.window b{position:absolute;left:50%;top:0;bottom:0;width:14px;margin-left:-7px;background:#1b3442}.window b::after{content:"";position:absolute;left:-273px;top:50%;width:560px;height:14px;background:#1b3442}
.window i{position:absolute;display:none}
.sky-day{background:linear-gradient(#7fc4e8,#cfeaf5)}.sky-day .sun{display:block;left:70px;top:60px;width:90px;height:90px;border-radius:50%;background:#fff3c4}
.sky-late{background:linear-gradient(#6aa9d8,#f3d9a8)}.sky-late .sun{display:block;left:330px;top:210px;width:90px;height:90px;border-radius:50%;background:#ffe39a}
.sky-dusk{background:linear-gradient(#3b2a5c,#e8743b 70%,#f6c15a)}.sky-dusk .sun{display:block;left:380px;top:330px;width:110px;height:110px;border-radius:50%;background:#ffd27a}
.sky-night{background:linear-gradient(#050b1e,#132447)}.sky-night .moon,.sky .moon{display:block;left:120px;top:70px;width:84px;height:84px;border-radius:50%;background:#f1f0e4;box-shadow:inset -18px -6px 0 #c9c8bb}
.sky-snow{background:linear-gradient(#aab8c6,#e8eef3)}.sky-snow .snow{display:block;inset:0;background-image:radial-gradient(#fff 3px,transparent 4px),radial-gradient(#fff 2px,transparent 3px);background-size:70px 70px,44px 44px;background-position:0 0,22px 30px}
.sky-spring{background:linear-gradient(#8fd0f0,#d9f2c7)}.sky-spring .leaf{display:block;left:-20px;top:-30px;width:300px;height:190px;border-radius:0 0 80% 40%;background:#3f9a56;box-shadow:60px 30px 0 -30px #57b56c}
.hub{position:absolute;left:470px;top:300px;width:800px;height:800px}.hub img{width:800px;height:800px;display:block}
.lid{position:absolute;background:#573829;border-radius:50%}
.l1{left:262px;top:372px;width:92px;height:40px;transform:rotate(-22deg)}.l2{left:440px;top:300px;width:96px;height:40px;transform:rotate(-16deg)}
.web{position:absolute;left:990px;top:330px;width:300px;height:200px}
.say{position:absolute;left:160px;bottom:150px;font:600 64px Figtree;color:var(--ink);padding:22px 38px;border-radius:28px 28px 28px 6px;background:var(--s2);border:2px solid var(--line)}
/* fast world */
.fast{background:var(--ground);display:flex;align-items:center;justify-content:center}
.mrow{display:grid;grid-template-columns:auto auto 1fr auto repeat(3,150px);gap:18px;align-items:center;padding:20px 26px;background:var(--s1);border:2px solid #0d2531;border-radius:16px;font:600 26px Figtree;white-space:nowrap}
.lv{display:inline-flex;align-items:center;gap:8px;height:32px;padding:0 12px;border-radius:8px;background:var(--live);font:700 18px Figtree;letter-spacing:.05em}.lv i{width:8px;height:8px;border-radius:50%;background:#fff}
.mn{font:700 24px Oxanium;color:#ff6b8b;min-width:56px}.tm{line-height:1.35}.scx{font:700 26px Oxanium;line-height:1.35;text-align:center}
.cell{background:var(--cell);border-radius:10px;padding:10px 14px;display:flex;flex-direction:column;gap:2px;min-height:72px;justify-content:center}.cell small{font:500 18px Figtree;color:var(--ink)}.cell b{font:700 26px Oxanium;color:var(--cy)}
.big{width:1500px;transform-origin:50% 50%}.big .mrow{font-size:40px;padding:36px 40px;gap:28px;grid-template-columns:auto auto 1fr auto repeat(3,230px);border-radius:24px}
.big .lv{height:48px;font-size:26px;padding:0 18px}.big .mn{font-size:40px;min-width:96px}.big .scx{font-size:42px}.big .cell{min-height:118px;padding:16px 22px;border-radius:16px}.big .cell small{font-size:28px}.big .cell b{font-size:44px}
.kick{position:absolute;left:210px;top:250px;font:700 30px Figtree;letter-spacing:.3em;color:var(--mut)}
.mk{position:relative;width:1500px;border-radius:24px;background:var(--s1);border:2px solid #0d2531;overflow:hidden}
.mk-h{display:flex;align-items:center;gap:24px;padding:34px 40px;font:700 46px "Red Hat Display";border-bottom:2px solid #0d2531}
.why{display:inline-flex;align-items:center;gap:12px;font:600 32px Figtree;color:var(--warn)}.lk{width:30px;height:30px}
.mk-b{position:absolute;left:0;right:0;top:128px;display:grid;grid-template-columns:repeat(3,1fr);gap:20px;padding:36px 40px}.mk{height:330px}
.mk-b .cell{min-height:130px;flex-direction:row;justify-content:space-between;align-items:center;padding:0 30px;border-radius:16px}.mk-b .cell small{font-size:32px;font-weight:600}.mk-b .cell b{font-size:44px}
.mk-b.sus .cell{background:#0f1f28;color:#7d919c}.mk-b.sus small{color:#7d919c}
.mk-b .fl{box-shadow:inset 0 0 0 3px #47d496}
.tide{position:absolute;inset:0;background:linear-gradient(100deg,transparent,rgba(47,212,245,.18) 45%,rgba(196,244,241,.34) 50%,rgba(47,212,245,.18) 55%,transparent)}
.chat{width:1100px;border-radius:24px;background:var(--s1);border:2px solid #0d2531;padding:0 0 30px;min-height:520px}
.chat-h{padding:28px 40px;font:700 40px "Red Hat Display";border-bottom:2px solid #0d2531;margin-bottom:26px}
.chat p{margin:18px 40px;padding:22px 30px;border-radius:20px;background:var(--s2);font:500 40px Figtree;width:max-content;max-width:940px}.chat p b{color:var(--cy);font-weight:700;margin-right:14px;font-size:30px}
.chat p.hot{font-size:60px;font-weight:700;background:var(--cell)}
.digits{font:700 420px Oxanium;letter-spacing:-.02em;color:var(--ink)}.digits.sm{font-size:92px}
.wall{display:grid;grid-template-columns:repeat(2,900px);gap:16px}.wall .mrow{grid-template-columns:auto auto 1fr auto repeat(3,118px);font-size:22px;gap:12px;padding:14px 18px}
.grid{display:grid;grid-template-columns:repeat(4,460px);grid-template-rows:repeat(3,330px);gap:14px;transform-origin:50% 50%}
.gc{border-radius:14px;overflow:hidden;background:var(--s1);border:2px solid #0d2531;display:flex;align-items:center;justify-content:center;position:relative}
.gc .mrow{transform:scale(.5);border:0;grid-template-columns:auto auto 1fr auto repeat(3,118px);font-size:22px}
.gc .sky{position:absolute;inset:0}.gc .sky i{position:absolute}.chatmini{font:700 56px Figtree}
.hubcell{position:absolute;inset:0;background:#0a1c25}.hubcell img{position:absolute;left:90px;top:40px;width:330px}.hubcell svg{position:absolute;right:0;top:0;width:240px}
/* type cards and end card */
.card{background:var(--ground)}.card h1{position:absolute;left:160px;top:520px;font:700 132px "Red Hat Display";letter-spacing:-.015em;color:var(--ink);white-space:nowrap}
.end{background:var(--ground)}.endc{position:absolute;left:0;right:0;top:400px;display:flex;flex-direction:column;align-items:center;gap:44px}
.endc img{width:520px;height:auto}.url{font:500 44px Figtree;color:var(--ink)}
.legal{position:absolute;left:0;right:0;bottom:120px;text-align:center;font:500 30px Figtree;color:var(--mut)}
.endclaw{top:700px;transform-origin:0 50%}
'''

def js():
    L = ['const tl = gsap.timeline({ paused: true });', 'const set = (id, v) => { const e = document.getElementById(id); if (e && e.textContent !== v) e.textContent = v; };',
         'const mmss = s => String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(Math.floor(s % 60)).padStart(2, "0");']
    # claw: one straight line across every close-up
    for i, s, e in [(1, 0, 2.5), (4, 6, 7.5), (8, 12, 12.5), (16, 17, 18.5), (18, 20, 21), (19, 21, 21.5)]:
        L.append(f'tl.fromTo("#s{i}-claw", {{ x: {claw_x(s):.2f} }}, {{ x: {claw_x(e):.2f}, duration: {e - s:g}, ease: "none" }}, {s:g});')
        L.append(f'{{ const o = {{ t: {s:g} }}; tl.fromTo(o, {{ t: {s:g} }}, {{ t: {e:g}, duration: {e - s:g}, ease: "none", onUpdate: () => set("s{i}-tc", "00:" + String(Math.floor(o.t)).padStart(2, "0")) }}, {s:g}); }}')
    L.append('tl.fromTo("#s19-btn", { y: 0, boxShadow: "0 10px 0 #7fc9c6", backgroundColor: "#c4f4f1" }, { y: 8, boxShadow: "0 2px 0 #7fc9c6", backgroundColor: "#82e0e0", duration: 0.1, ease: "power2.out" }, 21.02);')
    L.append('tl.fromTo("#s19-claw", { y: 0 }, { y: 6, duration: 0.1, ease: "power2.out" }, 21.02);')
    # Hubie: slow blink that starts in S2 and is still finishing in S6
    L += ['tl.fromTo(["#s2-l1", "#s2-l2"], { scaleY: 0 }, { scaleY: 1, duration: 0.5, ease: "power2.inOut", stagger: 0.04 }, 3.3);',
          'tl.fromTo(["#s6-l1", "#s6-l2"], { scaleY: 1 }, { scaleY: 0, duration: 0.55, ease: "power2.inOut", stagger: 0.04 }, 9.8);']
    for i in (10, 12, 13, 14, 17, 20): L.append(f'tl.set(["#s{i}-l1", "#s{i}-l2"], {{ scaleY: 0 }}, 0);')
    L += ['tl.fromTo("#s2-hub", { scale: 1 }, { scale: 1.015, duration: 1.5, ease: "sine.inOut" }, 2.5);',
          'tl.fromTo("#s6-hub", { scale: 1.015 }, { scale: 1, duration: 1, ease: "sine.inOut" }, 9.5);',
          # the take: he looks up at us
          'tl.fromTo("#s17-hub", { scale: 1, rotation: 0, y: 0 }, { scale: 1.09, rotation: -3, y: 14, duration: 0.5, ease: "back.out(1.4)" }, 18.9);',
          'tl.fromTo(["#s17-l1", "#s17-l2"], { scaleY: 0 }, { scaleY: 1, duration: 0.14, ease: "power2.in", stagger: 0.03 }, 19.45);',
          'tl.to(["#s17-l1", "#s17-l2"], { scaleY: 0, duration: 0.2, ease: "power2.out", stagger: 0.03 }, 19.62);',
          'tl.fromTo("#s20-hub", { scale: 1.09, rotation: -3, y: 14 }, { scale: 1.12, rotation: -4, y: 14, duration: 1.5, ease: "sine.out" }, 21.5);',
          'tl.fromTo("#s20-say", { opacity: 0, y: 26, scale: 0.94 }, { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: "back.out(1.4)" }, 21.75);']
    # S3: clock runs, prices tick
    L += ['tl.fromTo("#s3-big", { scale: 1.05, opacity: 0 }, { scale: 1.18, opacity: 1, duration: 0.3, ease: "expo.out" }, 4);',
          'tl.to("#s3-big", { scale: 1.24, duration: 1.7, ease: "none" }, 4.3);',
          '{ const o = { s: 3120 }, m = document.querySelector("#s3-big .mn"), b = document.querySelectorAll("#s3-big .cell b"); tl.fromTo(o, { s: 3120 }, { s: 3480, duration: 2, ease: "power1.in", onUpdate: () => { m.textContent = Math.floor(o.s / 60) + "\'"; const k = Math.floor((o.s - 3120) / 36); b[0].textContent = (1.80 - k * 0.01).toFixed(2); b[1].textContent = (3.40 + k * 0.05).toFixed(2); b[2].textContent = (4.60 + k * 0.1).toFixed(2); } }, 4); }']
    # S5: pause, tide, return repriced
    L += ['tl.fromTo("#s5-mk", { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: "expo.out" }, 7.5);',
          'tl.set(["#s5-sus", "#s5-new", "#s5-why"], { opacity: 0 }, 0);', 'tl.set("#s5-tide", { xPercent: -110 }, 0);',
          'tl.to("#s5-tide", { xPercent: 110, duration: 0.4, ease: "power2.out" }, 8);', 'tl.set("#s5-open", { opacity: 0 }, 8.15);', 'tl.set(["#s5-sus", "#s5-why"], { opacity: 1 }, 8.15);',
          'tl.fromTo("#s5-tide", { xPercent: 110 }, { xPercent: -110, duration: 0.4, ease: "power2.out", immediateRender: false }, 8.85);', 'tl.set(["#s5-sus", "#s5-why"], { opacity: 0 }, 9);', 'tl.set("#s5-new", { opacity: 1 }, 9);']
    # S7 chat
    for k, t in enumerate([10.5, 11, 11.34]):
        L.append(f'tl.fromTo("#s7-m{k + 1}", {{ opacity: 0, y: 40 }}, {{ opacity: 1, y: 0, duration: 0.28, ease: "expo.out" }}, {t});')
    L.append('tl.fromTo("#s7-chat", { scale: 1 }, { scale: 1.05, duration: 1.5, ease: "none" }, 10.5);')
    # S9 digits spin; S11 wall drifts; S15 grid pushes in
    L += ['{ const o = { s: 3120 }; tl.fromTo(o, { s: 3120 }, { s: 5290, duration: 1, ease: "power2.in", onUpdate: () => set("s9-d", mmss(o.s)) }, 12.5); }',
          'tl.fromTo("#s9-d", { scale: 0.92 }, { scale: 1.08, duration: 1, ease: "none" }, 12.5);',
          'tl.fromTo("#s11-w", { y: 40 }, { y: -40, duration: 0.5, ease: "none" }, 14.5);',
          'tl.fromTo("#s15-g", { scale: 0.86 }, { scale: 1.5, duration: 1, ease: "power3.in" }, 16);']
    for i in (10, 12, 13, 14): L.append(f'tl.fromTo("#s{i}-win", {{ scale: 1.04 }}, {{ scale: 1, duration: 0.25, ease: "expo.out" }}, {dict(((10, 13.5), (12, 15), (13, 15.5), (14, 15.75)))[i]});')
    # type cards and end card
    L += ['tl.fromTo("#s21-t", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.34, ease: "power4.out" }, 23.1);', 'tl.to("#s21-t", { opacity: 0, y: -18, duration: 0.2, ease: "power3.in" }, 24.78);',
          'tl.fromTo("#s22-t", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.34, ease: "power4.out" }, 25.04);',
          'tl.fromTo("#s23-c", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: "power4.out" }, 26.6);', 'tl.fromTo("#s23-l", { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power2.out" }, 26.8);',
          'tl.fromTo("#s23-claw", { x: -1080, scale: 0.7 }, { x: -900, scale: 0.7, duration: 3, ease: "none" }, 27);',
          'window.__timelines["main"] = tl;', 'tl.seek(0);']
    return '\n      '.join(L)

VARS = '[{"id":"card1","type":"string","label":"Card 1","default":"Everything else is in a hurry."},{"id":"card2","type":"string","label":"Card 2","default":"Slow it down."},{"id":"line","type":"string","label":"Hubie line","default":"haha, nice."},{"id":"url","type":"string","label":"URL","default":"housebets.com"},{"id":"legal","type":"string","label":"Legal line","default":"18+. Play responsibly."}]'

html = f'''<!doctype html>
<html lang="en" data-composition-variables='{VARS}'>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1920, height=1080" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
    <style>{CSS}</style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="{DUR:g}" data-width="1920" data-height="1080" data-fps="{FPS}">
      {chr(10).join(shots)}
    </div>
    <script>
      {js()}
    </script>
  </body>
</html>
'''
open('index.html', 'w').write(html)
print('wrote index.html,', len(shots), 'shots')
