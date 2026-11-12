// End-to-end checks against the local server.
const { chromium } = require('playwright');
const out = process.argv[2]; const B='http://localhost:4173/';
const ok=(c,m)=>console.log((c?'PASS ':'FAIL ')+m);
(async () => {
  const b = await chromium.launch();
  for (const [tag,w,h] of [['d',1440,900],['p',390,844]]) {
    const ctx = await b.newContext({ viewport:{width:w,height:h}, hasTouch: tag==='p' });
    const p = await ctx.newPage(); const errs=[];
    p.on('console', m => m.type()==='error' && errs.push(m.text())); p.on('pageerror', e => errs.push(e.message));
    await p.goto(B+'#/match/ars-bha?t=0'); await p.waitForTimeout(600);
    const price = async()=> (await p.locator('#mkts .odd').first().locator('.pv').textContent().catch(()=>null));
    ok(await price()==='1.30', tag+' starts at 1.30');
    await p.locator('#mkts .odd').first().click(); await p.waitForTimeout(300);
    if (tag==='p') { ok(await p.locator('#sbar').isVisible(), 'p slip bar visible after add'); await p.screenshot({path:`${out}/f-bar-p.png`}); await p.locator('#sbar').click(); await p.waitForTimeout(400); }
    const scope = tag==='p' ? '#sheet' : '#panel';
    await p.locator(`${scope} [data-act=quick][data-v="10"]`).click(); await p.waitForTimeout(200);
    ok((await p.locator(`${scope} .place`).innerText()).includes('Place 10.00 USDT'), tag+' place button carries stake: '+(await p.locator(`${scope} .place`).innerText()).replace(/\n/g,' | '));
    await p.locator(`${scope} input[data-stake]`).fill('12.5'); await p.waitForTimeout(150);
    ok((await p.locator(`${scope} [data-ret]`).textContent())==='16.25', tag+' return updates as you type');
    if (tag==='p') await p.locator('#sheetbg').click({position:{x:10,y:10}}); 
    await p.waitForTimeout(9000 - 1900); // ~t=9
    await p.screenshot({path:`${out}/f-t9-${tag}.png`});
    ok(await p.locator('#mkts .odd.dn').count()>0, tag+' down arrow after price fall');
    if (tag==='p') { ok((await p.locator('#sbar').innerText()).includes('Price changed'), 'p bar says price changed'); }
    await p.waitForTimeout(15000); // ~t=24
    await p.screenshot({path:`${out}/f-t24-${tag}.png`});
    ok(await p.locator('.mgroup.sus').count()>=5, tag+' goal markets suspended: '+await p.locator('.mgroup.sus').count());
    ok((await p.locator('#evt').textContent()).includes('VAR'), tag+' reason on scoreboard');
    await p.locator('#mtabs [data-tab=corners]').click(); await p.waitForTimeout(200);
    ok(await p.locator('.mgroup.sus').count()===0 && await p.locator('#mkts .odd:not(.sus)').count()>5, tag+' corners stay open during VAR');
    await p.locator('#mtabs [data-tab=popular]').click();
    if (tag==='p') { await p.locator('#sbar').click(); await p.waitForTimeout(400); }
    ok((await p.locator(`${scope} .scard`).first().innerText()).includes('Paused'), tag+' slip card paused');
    await p.screenshot({path:`${out}/f-paused-${tag}.png`});
    await p.waitForTimeout(8000); // ~t=33 reopened
    ok(await p.locator('.mgroup.sus').count()===0, tag+' reopened');
    const btn = p.locator(`${scope} .place`);
    ok((await btn.innerText()).includes('Accept'), tag+' must accept changed price: '+(await btn.innerText()).replace(/\n/g,' | '));
    await p.screenshot({path:`${out}/f-accept-${tag}.png`});
    await btn.click(); await p.waitForTimeout(200); await p.locator(`${scope} .place`).click(); await p.waitForTimeout(300);
    ok((await p.locator(`${scope} .place`).innerText()).includes('Confirming'), tag+' placing state');
    await p.locator(`${scope} .place`).click({force:true}).catch(()=>{});
    await p.waitForTimeout(2600);
    ok(await p.locator(`${scope} .rcpt`).count()===1, tag+' receipt shown');
    await p.screenshot({path:`${out}/f-receipt-${tag}.png`});
    const bal = await p.locator('#wal').textContent(); ok(bal==='237.50', tag+' balance debited once: '+bal);
    await p.locator(`${scope} [data-act=viewbets]`).click(); await p.waitForTimeout(300);
    ok(await p.locator(`${scope} .bcard`).count()===2, tag+' new bet in My bets (2 open)');
    await p.locator(`${scope} [data-act=co]`).last().click(); await p.waitForTimeout(300);
    ok((await p.locator(`${scope} .co-btn.cf`).count())===1, tag+' cash out asks to confirm');
    await p.screenshot({path:`${out}/f-co-${tag}.png`});
    await p.locator(`${scope} .co-btn.cf`).click(); await p.waitForTimeout(400);
    const bal2 = +(await p.locator('#wal').textContent()); ok(bal2>237.5, tag+' cash out credited: '+bal2);
    ok(errs.length===0, tag+' no console errors '+errs.slice(0,2).join(' ; '));
    await ctx.close();
  }
  await b.close();
})();
