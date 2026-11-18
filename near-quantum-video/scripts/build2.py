#!/usr/bin/env python3
"""Builds nearpq2/index.html: Three.js world (assets/world.js) + GSAP overlay, captions, mixed audio."""
import json, os, sys, shutil
P = sys.argv[1]
END = 83.0
words = json.load(open(os.path.join(P, "assets/transcript.json")))
words = words["words"] if isinstance(words, dict) else words
FIX = {"NIR": "NEAR", "NIR,": "NEAR,", "NIR.": "NEAR.", "Alice.NIR.": "alice.near.", "MLDSA.": "ML-DSA.", "latticemath": "lattice math", "address?": "address."}
for w in words: w["text"] = FIX.get(w["text"], w["text"])
for i in range(len(words) - 1):
    if words[i]["text"] == "quantum" and words[i + 1]["text"] == "safe":
        words[i]["text"] = "quantum-safe"; words[i + 1]["text"] = ""

# ---- captions: groups of <=3 words, karaoke highlight ----
groups, cur = [], []
for i, w in enumerate(words):
    if not w["text"]:
        if cur: cur[-1]["end"] = w["end"]
        continue
    cur.append(dict(w))
    nxt = words[i + 1] if i + 1 < len(words) else None
    gap = (nxt["start"] - w["end"]) if nxt else 9
    if len(cur) >= 3 or w["text"][-1] in ".,?!:" or gap > 0.18:
        groups.append(cur); cur = []
if cur: groups.append(cur)
cap_html, cap_js = [], []
for gi, g in enumerate(groups):
    s = max(0.1, g[0]["start"] - 0.05); e = g[-1]["end"] + 0.12
    if gi + 1 < len(groups): e = min(e, groups[gi + 1][0]["start"] - 0.02)
    spans = []
    for wi, w in enumerate(g):
        txt = w["text"].upper().rstrip(",.?") if w["text"] not in ("alice.near.",) else "alice.near"
        spans.append(f'<span class="w" id="c{gi}w{wi}">{txt}</span>')
        hot = "#ff5a4e" if w["start"] < 29.5 else "#00ec97"
        we = g[wi + 1]["start"] if wi + 1 < len(g) else e
        cap_js.append(f'word("#c{gi}w{wi}",{w["start"]:.2f},{we:.2f},"{hot}");')
    cap_html.append(f'<div class="cap" id="cap{gi}">{" ".join(spans)}</div>')
    cap_js.append(f'cap("#cap{gi}",{s:.2f},{e:.2f});')

# date scramble variants for "when is Q-Day?"
import random
random.seed(7)
scr = []
for i in range(14):
    d = f"{random.randint(10,31):02d}.{random.randint(1,12):02d}.20{random.randint(28,45)}"
    if i == 13: d = "??.??.????"
    scr.append(f'<span class="scr" id="scr{i}">{d}</span>')
scr_js = "".join(f'tl.set("#scr{i}",{{opacity:1}},{19.8+i*0.22:.2f});tl.set("#scr{i}",{{opacity:0}},{19.8+(i+1)*0.22:.2f});' for i in range(13))
scr_js += 'tl.set("#scr13",{opacity:1},22.66);'

html = f'''<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=1080, height=1920" />
<script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
<script type="importmap">{{"imports":{{"three":"./assets/lib/three.module.min.js"}}}}</script>
<script>
  window.__hf = window.__hf || {{}}; window.__hf.buildReady = window.__hf.buildReady || {{}};
  window.__hf.buildReady.world = new Promise(r => (window.__threeReady = r));
</script>
<style>
:root {{ --ink:#05060a; --near:#00ec97; --q:#a37bff; --red:#ff3b2f; --paper:#f3efe6; }}
* {{ margin:0; padding:0; box-sizing:border-box; }}
html,body {{ width:1080px; height:1920px; overflow:hidden; background:#05060a; }}
#root {{ position:relative; width:1080px; height:1920px; overflow:hidden; font-family:Montserrat, sans-serif; color:#fff; }}
#gl {{ position:absolute; left:0; top:0; width:1080px; height:1920px; }}
.ov {{ position:absolute; left:0; right:0; text-align:center; opacity:0; }}
.mega {{ font-family:"Archivo Black"; font-size:230px; line-height:.9; letter-spacing:-.01em; }}
.mega .l {{ position:absolute; left:0; right:0; top:0; mix-blend-mode:screen; }}
.big {{ font-family:"Archivo Black"; font-size:92px; line-height:1.0; letter-spacing:-.01em; text-shadow:0 6px 40px rgba(0,0,0,.6); }}
.sub {{ font-family:Montserrat; font-weight:600; font-size:42px; letter-spacing:.02em; color:rgba(255,255,255,.85); text-shadow:0 4px 24px rgba(0,0,0,.8); }}
.tag {{ display:inline-block; font-family:"Space Mono"; font-weight:700; font-size:34px; letter-spacing:.12em; padding:10px 22px; border:3px solid currentColor; background:rgba(5,6,10,.55); }}
.cap {{ position:absolute; left:0; right:0; top:1150px; text-align:center; opacity:0; font-family:Montserrat; font-weight:800; font-size:64px; letter-spacing:.01em; line-height:1.15; padding:0 70px; text-shadow:0 4px 0 rgba(0,0,0,.55), 0 0 30px rgba(0,0,0,.7); }}
.cap .w {{ display:inline-block; color:#fff; margin:0 .13em; }}
.slot {{ position:absolute; left:0; right:0; top:420px; height:130px; overflow:hidden; opacity:0; }}
.slot .strip {{ font-family:"Archivo Black"; font-size:110px; line-height:130px; text-align:center; color:#fff; }}
.scr {{ position:absolute; left:0; right:0; top:0; text-align:center; opacity:0; font-family:"Space Mono"; font-weight:700; font-size:96px; color:#ff6b5e; }}
#term {{ position:absolute; left:80px; top:330px; width:920px; height:440px; border-radius:26px; background:rgba(10,14,13,.82); border:2px solid rgba(0,236,151,.45); box-shadow:0 30px 80px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.08); padding:34px 38px; font-family:"Space Mono"; font-size:36px; line-height:1.65; color:#e6efe9; opacity:0; }}
#term .dots span {{ display:inline-block; width:20px; height:20px; border-radius:50%; margin-right:10px; }}
.tl {{ opacity:0; white-space:nowrap; overflow:hidden; }}
#wallet {{ position:absolute; left:200px; top:820px; width:680px; padding:30px; border-radius:24px; text-align:center; background:linear-gradient(180deg, rgba(255,255,255,.10), rgba(255,255,255,.03)); border:2px solid rgba(255,255,255,.25); font-family:"Space Mono"; font-size:36px; opacity:0; }}
#check {{ position:absolute; left:150px; top:300px; font-family:"Archivo Black"; font-size:70px; line-height:1.3; text-align:left; }}
#check div {{ opacity:0; }}
#check b {{ color:var(--near); }}
#endmark {{ position:absolute; left:0; right:0; top:560px; text-align:center; opacity:0; font-family:"Archivo Black"; font-size:260px; letter-spacing:.02em; color:#fff; }}
.rn {{ position:absolute; left:0; opacity:0; }} .rn i {{ position:absolute; left:14px; top:6px; width:54px; height:54px; border-radius:50%; border:6px solid #05060a; }} .rn small {{ display:block; margin-left:110px; font-family:"Space Mono"; font-weight:700; font-size:32px; letter-spacing:.1em; }} .rn b {{ display:block; margin-left:110px; font-family:"Archivo Black"; font-size:52px; line-height:1.08; text-shadow:0 6px 30px rgba(0,0,0,.7); }}
#vig {{ position:absolute; inset:0; pointer-events:none; background:radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,.35) 100%); }}
#flash {{ position:absolute; inset:0; background:#fff; opacity:0; pointer-events:none; }}
</style>
</head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-duration="{END}" data-width="1080" data-height="1920">

<canvas id="gl" class="clip" data-start="0" data-duration="{END}" data-track-index="0" width="720" height="1280"></canvas>
<div id="vig" class="clip" data-start="0" data-duration="{END}" data-track-index="1" data-layout-ignore></div>

<div id="ov" class="clip" data-start="0" data-duration="{END}" data-track-index="2" data-track-kind="graphics" data-layout-allow-overlap style="position:absolute;inset:0">
  <div class="ov big" id="hook1" style="top:260px">MOST CRYPTO WALLETS<br/><span style="color:var(--red)">COULD BE UNLOCKED.</span></div>

  <div class="ov mega" id="qday" style="top:330px"><div class="l" id="qdR" style="color:#ff2a2a">Q-DAY</div><div class="l" id="qdC" style="color:#2af0ff">Q-DAY</div><div style="position:relative">Q-DAY</div></div>
  <div class="ov sub" id="qdaySub" style="top:560px">the day quantum computers break<br/>today's crypto locks</div>

  <div class="ov" id="lockTag" style="top:250px"><span class="tag" style="color:var(--near)">THE LOCK = MATH</span></div>
  <div class="slot" id="slot"><div class="strip" id="strip">1,000 YRS<br/>1,000,000 YRS<br/>1,000,000,000 YRS<br/><span style="color:var(--near)">BILLIONS OF YEARS</span></div></div>
  <div class="ov sub" id="slotSub" style="top:565px">for a normal computer to pick it</div>

  <div class="ov" id="qTag" style="top:250px"><span class="tag" style="color:var(--q)">QUANTUM COMPUTER</span></div>
  <div class="ov mega" id="short" style="top:330px;font-size:150px"><div class="l" id="shR" style="color:#ff2a2a">SHORTCUT.</div><div class="l" id="shC" style="color:#2af0ff">SHORTCUT.</div><div style="position:relative">SHORTCUT.</div></div>

  <div class="ov" id="whenTag" style="top:250px"><span class="tag" style="color:#ff6b5e">Q-DAY ARRIVES ON</span></div>
  <div class="ov" id="scrBox" style="top:340px;height:120px">{"".join(scr)}</div>
  <div class="ov" id="chainTag" style="top:520px"><span class="tag" style="color:#fff">MOST BLOCKCHAINS</span></div>

  <div class="ov big" id="addrEq" style="top:260px">ADDRESS <span style="color:var(--red)">=</span> LOCK</div>
  <div class="ov big" id="newLock" style="top:380px;font-size:76px">NEW LOCK?</div>
  <div class="ov big" id="newAddr" style="top:470px;font-size:76px;color:#ff6b5e">= NEW ADDRESS.</div>
  <div class="ov big" id="moveAll" style="top:300px;font-size:110px;color:var(--red)">MOVE<br/>EVERYTHING.</div>

  <div class="ov mega" id="nearMark" style="top:250px;color:var(--near)">NEAR</div>
  <div class="ov sub" id="nearSub" style="top:470px;font-size:48px">was built differently.</div>
  <div class="ov" id="acctTag" style="top:250px"><span class="tag" style="color:var(--near)">ACCOUNT = A NAME</span></div>
  <div class="ov" id="keysTag" style="top:330px"><span class="tag" style="color:#fff">KEYS = SEPARATE</span></div>
  <div class="ov big" id="chg" style="top:250px;color:var(--near)">CHANGE<br/>THE LOCKS.</div>

  <div class="ov" id="upTag" style="top:250px"><span class="tag" style="color:var(--near)">MAINNET UPGRADE 2.13</span></div>
  <div class="ov mega" id="mldsa" style="top:340px;font-size:200px"><div class="l" id="mlR" style="color:#00ffa8">ML-DSA</div><div class="l" id="mlC" style="color:#7a5cff">ML-DSA</div><div style="position:relative">ML-DSA</div></div>
  <div class="ov sub" id="mlSub" style="top:540px">a post-quantum signature</div>
  <div class="ov" id="nist" style="top:620px"><span class="tag" style="color:#f3c66b">NIST STANDARD · FIPS 204</span></div>
  <div class="ov" id="latTag" style="top:250px"><span class="tag" style="color:var(--near)">BUILT ON LATTICE MATH</span></div>
  <div class="ov big" id="noShort" style="top:330px;font-size:80px">NO KNOWN<br/><span style="color:var(--q)">QUANTUM</span> SHORTCUT</div>

  <div class="ov" id="movesTag" style="top:200px"><span class="tag" style="color:var(--near)">THE UPGRADE · 2 MOVES</span></div>
  <div class="ov big" id="step1" style="top:280px;font-size:68px"><span style="color:var(--near)">①</span> ADD A<br/>QUANTUM-SAFE KEY</div>
  <div class="ov big" id="step2" style="top:440px;font-size:68px"><span style="color:var(--red)">②</span> REMOVE<br/>THE OLD ONE</div>
  <div class="ov" id="checkBox" style="top:0;height:900px"><div id="check"><div id="ck1"><b>✓</b> SAME NAME</div><div id="ck2"><b>✓</b> SAME TOKENS</div><div id="ck3"><b>✓</b> NEW LOCK</div></div></div>

  <div id="term">
    <div class="dots"><span style="background:#ff5f57"></span><span style="background:#febc2e"></span><span style="background:#28c840"></span></div>
    <div class="tl" id="tl1" style="margin-top:18px">$ near … add-key alice.near</div>
    <div class="tl" id="tl2" style="color:#8aa39a">  key scheme → <span style="color:var(--near)">ml-dsa-65</span></div>
    <div class="tl" id="tl3" style="color:var(--near)">✓ quantum-safe key added</div>
    <div class="tl" id="tl4" style="color:#8aa39a">  NEAR CLI · live today</div>
  </div>
  <div id="wallet">WALLETS · incl. LEDGER<br/><span style="font-size:30px;color:#b8c4bf">support in progress</span></div>

  <div class="ov big" id="stepOne" style="top:260px;font-size:110px">STEP<br/><span style="color:var(--near)">ONE.</span></div>
  <div class="ov" id="roadTag" style="top:250px"><span class="tag" style="color:var(--q)">POST-QUANTUM ROADMAP</span></div>
  <div id="road" style="position:absolute;left:110px;top:380px;width:860px;height:640px;">
    <div id="rline" style="position:absolute;left:38px;top:40px;width:6px;height:520px;background:linear-gradient(#00ec97,#a37bff);transform-origin:top"></div>
    <div class="rn" id="rn1" style="top:0"><i style="background:#00ec97;box-shadow:0 0 14px rgba(0,236,151,.5)"></i><small style="color:#00ec97">✓ LIVE · UPGRADE 2.13</small><b>Your account &amp;<br/>every signature</b></div>
    <div class="rn" id="rn2" style="top:240px"><i style="background:#a37bff;box-shadow:0 0 14px rgba(163,123,255,.5)"></i><small style="color:#c4a8ff">NEXT</small><b>Validators</b></div>
    <div class="rn" id="rn3" style="top:410px"><i style="background:#a37bff;box-shadow:0 0 14px rgba(163,123,255,.5)"></i><small style="color:#c4a8ff">NEXT</small><b>Consensus:<br/>the network itself</b></div>
  </div>

  <div class="ov big" id="coming" style="top:280px;font-size:100px">Q-DAY IS<br/><span style="color:var(--red)">COMING.</span></div>
  <div class="ov big" id="ready" style="top:280px;font-size:84px">BE READY<br/><span style="color:var(--near)">BEFORE IT DOES.</span></div>
  <div id="endmark">NEAR</div>
  <div class="ov big" id="end1" style="top:860px;font-size:72px">CHANGE THE LOCKS.</div>
  <div class="ov big" id="end2" style="top:950px;font-size:72px;color:var(--near)">KEEP THE HOUSE.</div>
</div>

<div id="captions" class="clip" data-start="0" data-duration="{END}" data-track-index="3" data-track-kind="captions" style="position:absolute;inset:0">
{chr(10).join(cap_html)}
</div>
<div id="flash" class="clip" data-start="0" data-duration="{END}" data-track-index="4" data-layout-ignore></div>

<audio id="mix" class="clip" src="assets/mix.wav" data-start="0" data-duration="{END}" data-track-index="5" data-volume="1"></audio>
</div>

<script>
const tl = gsap.timeline({{ paused: true }});
const OUT = "expo.out";
function cap(sel, s, e) {{
  tl.fromTo(sel, {{opacity:0, y:18, filter:"blur(6px)"}}, {{opacity:1, y:0, filter:"blur(0px)", duration:.14, ease:OUT}}, s);
  tl.to(sel, {{opacity:0, duration:.08, ease:"power2.in"}}, e - .08);
  tl.set(sel, {{opacity:0, visibility:"hidden"}}, e);
}}
function word(sel, s, e, hot) {{
  tl.set(sel, {{color:hot}}, s);
  tl.fromTo(sel, {{scale:1.12}}, {{scale:1, duration:.25, ease:OUT}}, s);
  tl.set(sel, {{color:"#ffffff"}}, e);
}}
// entrances (varied on purpose)
function blurIn(sel, s, d) {{ tl.fromTo(sel, {{opacity:0, filter:"blur(14px)", scale:1.04}}, {{opacity:1, filter:"blur(0px)", scale:1, duration:d||.32, ease:OUT}}, s); }}
function punch(sel, s) {{ tl.fromTo(sel, {{opacity:0, scale:1.9}}, {{opacity:1, scale:1, duration:.22, ease:"power4.in"}}, s - .2); }}
function rise(sel, s) {{ tl.fromTo(sel, {{opacity:0, y:50}}, {{opacity:1, y:0, duration:.5, ease:OUT}}, s); }}
function tagIn(sel, s) {{ tl.fromTo(sel, {{opacity:0, scaleX:.2}}, {{opacity:1, scaleX:1, duration:.3, ease:OUT}}, s); }}
function out(sel, s, d) {{ tl.to(sel, {{opacity:0, filter:"blur(10px)", duration:d||.2, ease:"power2.in"}}, s); }}
function rgb(r, c, s) {{ tl.fromTo(r, {{x:-26, opacity:.9}}, {{x:0, opacity:0, duration:.45, ease:OUT}}, s); tl.fromTo(c, {{x:26, opacity:.9}}, {{x:0, opacity:0, duration:.45, ease:OUT}}, s); }}
function shake(sel, s, amp) {{ for (let i=0;i<7;i++) tl.to(sel, {{x:(i%2?-1:1)*amp*(1-i/7), y:(i%3-1)*amp*.6*(1-i/7), duration:.035, ease:"none"}}, s+i*.035); tl.to(sel, {{x:0,y:0,duration:.05}}, s+.25); }}

// flashes on impacts (white frames) — 3D grade pass also flashes; this one hits the type too
[[6.96,.55],[17.31,.45],[29.58,.5],[44.88,.35],[80.36,.5]].forEach(([t,k]) => {{ tl.fromTo("#flash",{{opacity:k}},{{opacity:0,duration:.28,ease:"power2.out",immediateRender:false}},t); }});
[6.96,17.31,29.58,44.88,74.49,80.36].forEach(t => shake("#ov", t, 16));

// 1 hook — on screen at frame 0
tl.fromTo("#hook1", {{opacity:1, scale:1.03}}, {{opacity:1, scale:1, duration:1.2, ease:OUT}}, 0);
out("#hook1", 6.6);
// 2 Q-DAY
punch("#qday", 6.96); rgb("#qdR","#qdC",6.96); blurIn("#qdaySub", 7.3); out("#qday", 8.6); out("#qdaySub", 8.6);
// 3 lock = math, billions of years (slot roll)
tagIn("#lockTag", 9.7); out("#lockTag", 12.9);
tl.set("#slot", {{opacity:1}}, 13.0); tl.fromTo("#strip", {{y:0}}, {{y:-390, duration:.9, ease:"power3.inOut"}}, 13.05);
blurIn("#slotSub", 13.4); out("#slot", 14.6); out("#slotSub", 14.6);
// 4 quantum
tagIn("#qTag", 15.84); out("#qTag", 17.1);
punch("#short", 17.31); rgb("#shR","#shC",17.31); out("#short", 18.15);
// 5 when? (date scramble)
tagIn("#whenTag", 19.7); tl.set("#scrBox", {{opacity:1}}, 19.75); {scr_js}
tl.fromTo("#scr13", {{color:"#ff6b5e"}}, {{color:"#ffffff", duration:.3}}, 22.66);
tagIn("#chainTag", 21.38); out("#whenTag", 23.1); out("#scrBox", 23.1); out("#chainTag", 23.1);
// 6 address = lock
blurIn("#addrEq", 23.56); rise("#newLock", 25.36); rise("#newAddr", 26.17);
out("#addrEq", 27.8); out("#newLock", 27.8); out("#newAddr", 27.8);
punch("#moveAll", 27.97); tl.to("#moveAll", {{x:900, filter:"blur(20px)", opacity:0, duration:.6, ease:"power3.in"}}, 28.7);
// 7 NEAR
punch("#nearMark", 29.58); blurIn("#nearSub", 30.0); out("#nearMark", 31.05); out("#nearSub", 31.05);
tagIn("#acctTag", 32.2); tagIn("#keysTag", 35.06); out("#acctTag", 37.3); out("#keysTag", 37.3);

// 8 ML-DSA / lattice
tagIn("#upTag", 41.25); out("#upTag", 44.6);
punch("#mldsa", 44.88); rgb("#mlR","#mlC",44.88); blurIn("#mlSub", 46.63); tagIn("#nist", 48.32);
out("#mldsa", 50.0); out("#mlSub", 50.0); out("#nist", 50.0);
tagIn("#latTag", 50.17); out("#latTag", 51.0); blurIn("#noShort", 51.16); out("#noShort", 52.85);
// 9 two moves
tagIn("#movesTag", 53.6); rise("#step1", 54.74); rise("#step2", 56.24);
out("#movesTag", 57.5); out("#step1", 57.5); out("#step2", 57.5);
tl.set("#checkBox", {{opacity:1}}, 57.6);
[["#ck1",57.68],["#ck2",58.52],["#ck3",59.35]].forEach(([s,t]) => tl.fromTo(s, {{opacity:0, x:-60}}, {{opacity:1, x:0, duration:.35, ease:OUT}}, t));
out("#checkBox", 60.1);
// 10 today: terminal + wallets
tl.fromTo("#term", {{opacity:0, y:60, scale:.96}}, {{opacity:1, y:0, scale:1, duration:.5, ease:OUT}}, 60.3);
tl.fromTo("#tl1", {{opacity:1, clipPath:"inset(0 100% 0 0)"}}, {{clipPath:"inset(0 0% 0 0)", duration:1.0, ease:"steps(28)"}}, 60.6);
tl.fromTo("#tl2", {{opacity:0}}, {{opacity:1, duration:.15}}, 61.8);
tl.fromTo("#tl3", {{opacity:0, x:-20}}, {{opacity:1, x:0, duration:.25, ease:OUT}}, 62.15);
tl.fromTo("#tl4", {{opacity:0}}, {{opacity:1, duration:.2}}, 62.6);
tl.fromTo("#wallet", {{opacity:0, y:80, rotationX:30}}, {{opacity:1, y:0, rotationX:0, duration:.55, ease:OUT}}, 63.58);
out("#term", 65.8); out("#wallet", 65.8);
// 11 roadmap
punch("#stepOne", 66.92); out("#stepOne", 67.7); tagIn("#roadTag", 67.8);
tl.fromTo("#rline", {{scaleY:0}}, {{scaleY:1, duration:1.6, ease:"power2.inOut"}}, 67.9);
[["#rn1",67.84],["#rn2",71.07],["#rn3",72.1]].forEach(([s,t]) => tl.fromTo(s, {{opacity:0, x:-50, filter:"blur(8px)"}}, {{opacity:1, x:0, filter:"blur(0px)", duration:.4, ease:OUT}}, t));
out("#road", 74.25); out("#roadTag", 74.25);
// 12 finale
punch("#coming", 74.49); out("#coming", 75.75);
blurIn("#ready", 76.09); out("#ready", 78.6);
tl.fromTo("#endmark", {{opacity:0, scale:1.3, filter:"blur(20px)"}}, {{opacity:1, scale:1, filter:"blur(0px)", duration:.6, ease:OUT}}, 78.85);
rise("#end1", 78.88); rise("#end2", 79.92);

{chr(10).join(cap_js)}
tl.set("#captions", {{opacity:0}}, 81.2);
window.__timelines["main"] = tl;
</script>
<script type="module" src="assets/world.js"></script>
</body>
</html>
'''
open(os.path.join(P, "index.html"), "w").write(html)
shutil.copy(os.path.join(os.path.dirname(os.path.abspath(__file__)), "world.js"), os.path.join(P, "assets/world.js"))
print("caption groups", len(groups))
