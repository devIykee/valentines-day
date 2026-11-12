const { chromium } = require('playwright'); const B='http://localhost:4173/';
const ok=(c,m)=>console.log((c?'PASS ':'FAIL ')+m);
(async()=>{ const b=await chromium.launch();
 // 1. placing teardown: navigate away / hide tab / close sheet mid-confirmation
 for (const mode of ['navigate','hide','closesheet']) {
  const ph = mode==='closesheet'; const ctx=await b.newContext({viewport: ph?{width:390,height:844}:{width:1440,height:900}}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto(B+'#/match/b04-bvb'); await p.waitForTimeout(500);
  await p.locator('#mkts .odd').first().click(); await p.waitForTimeout(200);
  if (ph) { await p.locator('#sbar').click(); await p.waitForTimeout(400); }
  const sc = ph?'#sheet':'#panel';
  await p.locator(`${sc} [data-act=quick][data-v="10"]`).click(); await p.waitForTimeout(150);
  await p.locator(`${sc} .place`).click(); await p.waitForTimeout(200);
  if (mode==='navigate') await p.goto(B+'#/live');
  if (mode==='hide') { await p.evaluate(()=>{Object.defineProperty(document,'hidden',{value:true,configurable:true}); document.dispatchEvent(new Event('visibilitychange'));}); }
  if (mode==='closesheet') { await p.locator('#sheetbg').click({position:{x:10,y:10}}); }
  await p.waitForTimeout(3200);
  if (mode==='hide') await p.evaluate(()=>{Object.defineProperty(document,'hidden',{value:false,configurable:true}); document.dispatchEvent(new Event('visibilitychange'));});
  await p.waitForTimeout(600);
  const st = await p.evaluate(()=>JSON.parse(localStorage.getItem('hb-proto-v1')));
  const open = st.bets.filter(x=>x.status==='open').length;
  ok(open===2 && Math.abs(st.wallet-240)<1e-6 && st.slip.length===0 && !st.ui.placing, `${mode}: exactly one bet placed (open=${open}, wallet=${st.wallet}, slip=${st.slip.length})`);
  ok(errs.length===0, mode+': no errors '+errs.join(';').slice(0,100)); await ctx.close(); }
 // 2. forced failures leave money untouched
 for (const f of ['connection','changed','suspended']) { const ctx=await b.newContext({viewport:{width:1440,height:900}}); const p=await ctx.newPage();
  await p.goto(B+'#/match/juv-rom'); await p.waitForTimeout(400); await p.locator('#mkts .odd').first().click(); await p.locator('#panel [data-act=quick][data-v="25"]').click();
  await p.locator('#rail [data-act=ctl]').click(); await p.locator(`#ctl [data-act=force][data-v=${f}]`).click(); await p.keyboard.press('Escape');
  await p.locator('#panel .place').click(); await p.waitForTimeout(2700);
  const txt=(await p.locator('#panel').innerText()).replace(/\n/g,' '); const bal=await p.locator('#wal').textContent();
  ok(bal==='250.00' && /Not placed|Paused|Price changed/.test(txt), `forced ${f}: stake not taken (bal ${bal}) :: ${(txt.match(/Not placed[^.]*\.[^.]*\./)||[''])[0]}`); await ctx.close(); }
 // 3. tour runs end to end
 { const ctx=await b.newContext({viewport:{width:1440,height:900}}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto(B+'#/'); await p.waitForTimeout(400); await p.locator('#rail [data-act=ctl]').click(); await p.locator('#ctl [data-act=tour]').click();
  await p.waitForTimeout(5000); const c1=await p.locator('.cap').textContent().catch(()=>null);
  await p.waitForTimeout(37500); const rc=await p.locator('#panel .rcpt').count(); const c2=await p.locator('.cap').textContent().catch(()=>null);
  ok(!!c1 && rc===1, `tour: caption shown ("${(c1||'').slice(0,40)}") and ends on a receipt (${rc}) :: "${(c2||'').slice(0,50)}"`); ok(errs.length===0,'tour: no errors '+errs.join(';').slice(0,120)); await ctx.close(); }
 // 4. keyboard: tab to a price, Enter adds; search with "/" and arrows
 { const ctx=await b.newContext({viewport:{width:1440,height:900}}); const p=await ctx.newPage(); await p.goto(B+'#/match/ars-bha?state=reopened'); await p.waitForTimeout(400);
  await p.locator('#mkts .odd').first().focus(); await p.keyboard.press('Enter'); await p.waitForTimeout(200);
  ok(await p.locator('#panel .scard').count()===1,'keyboard: Enter on a focused price adds it');
  const vis = await p.evaluate(()=>{const e=document.activeElement; const o=getComputedStyle(e).outlineStyle; return e.matches(':focus-visible')&&o!=='none';}); ok(vis,'keyboard: focus ring visible');
  await p.goto(B+'#/'); await p.waitForTimeout(400); await p.keyboard.press('/'); await p.keyboard.type('corn'); await p.waitForTimeout(200); await p.keyboard.press('Enter'); await p.waitForTimeout(500);
  ok(p.url().includes('match/ars-bha') && await p.locator('.mgroup[data-g="crn"]').count()===1, 'search: "/" then "corn" then Enter lands on the corners market: '+p.url().split('#')[1]); await ctx.close(); }
 await b.close(); })();
