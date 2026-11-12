const { chromium } = require('playwright'); const out=process.argv[2]; const B='http://localhost:4173/';
(async()=>{ const b=await chromium.launch(); let bad=0;
  const pg=await (await b.newContext()).newPage(); await pg.goto(B+'#/states'); await pg.waitForTimeout(400);
  const links=await pg.$$eval('.states a', as=>as.map(a=>a.getAttribute('href')));
  const all=['#/','#/live','#/football','#/match/ars-bha','#/slip','#/states','#/live?sport=tennis','#/football?mk=tg','#/match/liv-mun','#/match/ars-bha?m=crn',...links];
  console.log('urls',all.length);
  for (const [tag,w,h] of [['d',1440,900],['p',390,844]]) { const ctx=await b.newContext({viewport:{width:w,height:h}}); 
    for (const u of all){ const p=await ctx.newPage(); const errs=[]; p.on('console',m=>m.type()==='error'&&errs.push(m.text())); p.on('pageerror',e=>errs.push(e.message));
      await p.goto(B+u); await p.waitForTimeout(450);
      const r=await p.evaluate(()=>{ const ov=document.documentElement.scrollWidth-innerWidth; let small=0,tiny=[]; for(const el of document.querySelectorAll('.odd .pv')){ if(el.offsetParent && parseFloat(getComputedStyle(el).fontSize)<15) small++; }
        for(const el of document.querySelectorAll('button,a,input,select')){ if(!el.offsetParent) continue; const r=el.getBoundingClientRect(); if(r.width&&r.height&&Math.min(r.width,r.height)<32 && innerWidth<500) tiny.push((el.className||el.tagName)+' '+Math.round(r.width)+'x'+Math.round(r.height)); }
        return {ov,small,tiny:[...new Set(tiny)].slice(0,4), txt:document.querySelector('#view').innerText.length}; });
      if (errs.length||r.ov>0||r.small||r.txt<40||(r.tiny.length)) { bad++; console.log(tag,u,JSON.stringify(r),errs.slice(0,1).join('').slice(0,120)); }
      const n=u.replace(/[^a-z0-9]+/gi,'_'); await p.screenshot({path:`${out}/st${n}-${tag}.png`}); await p.close(); }
    await ctx.close(); }
  console.log('flagged',bad); await b.close(); })();
