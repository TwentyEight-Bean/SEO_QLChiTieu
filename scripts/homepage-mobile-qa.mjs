import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const out = resolve(process.argv[2] || 'scratch/homepage-qa');
const baseline = process.argv.includes('--baseline');
const base = process.env.QA_URL || 'http://127.0.0.1:8443';
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const report = [];
try {
  const sizes = JSON.parse(process.env.QA_SIZES || '[[360,800],[375,812],[390,844],[430,932],[440,956],[768,900],[1366,900],[1440,900]]');
  for (const [width, height] of sizes) {
    const context = await browser.newContext({ viewport: { width, height }, hasTouch: width < 768, isMobile: width < 768 });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(600);
    if (width >= 768) await page.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important}.hero-phone .phone-dim{opacity:0!important}' });
    await page.screenshot({ path: join(out, `${width}-hero.png`) });
    if(width < 768 && !baseline) {
      const bounds = await page.evaluate(() => {
        const phone=document.querySelector('#top .hero-phone').getBoundingClientRect();
        const cta=document.querySelector('#top h1 + p + div a').getBoundingClientRect();
        return {left:phone.left,right:phone.right,top:phone.top,bottom:phone.bottom,ctaBottom:cta.bottom};
      });
      if(bounds.left<0||bounds.right>width||bounds.bottom>height||bounds.top<bounds.ctaBottom+8) throw Error(`${width}: hero phone collision/clipping`);
    }
    const geometry = await page.evaluate(() => Object.fromEntries(['#top','#top h1','#top .hero-phone','#trai-nghiem','#tinh-nang','#du-lieu','#du-lieu h2','#tai-ung-dung','#tai-ung-dung .stage','footer'].map(selector => {
      const el = document.querySelector(selector); const r = el.getBoundingClientRect(); const s = getComputedStyle(el);
      return [selector, { x:r.x, y:r.y + scrollY, width:r.width, height:r.height, font:s.fontSize, display:s.display }];
    })));
    if (width < 768) {
      const stage = page.locator('#mobile-home-product');
      if(!baseline) {
        await page.getByRole('button',{name:'Mở menu',exact:true}).tap();
        await page.locator('.mobile-menu-inner').getByRole('link',{name:/Trải nghiệm/}).tap();
        await page.waitForTimeout(600);
        if(!page.url().endsWith('#mobile-home-product')) throw Error(`${width}: experience menu target`);
      }
      await stage.evaluate(el => window.scrollTo(0, el.getBoundingClientRect().top + scrollY - 76));
      await page.waitForTimeout(450);
      await page.screenshot({ path: join(out, `${width}-demo.png`) });
      if (!baseline) {
        const tabs = stage.getByRole('tab');
        const stateHeights = [];
        for (let i = 0; i < 3; i++) {
          await tabs.nth(i).tap(); await page.waitForTimeout(600);
          if (await tabs.nth(i).getAttribute('aria-selected') !== 'true') throw Error(`${width}: tab ${i}`);
          const bounds=await stage.evaluate(el=>{
            const phone=el.querySelector('.home-demo-device .phone').getBoundingClientRect();
            const copy=el.querySelector('.home-demo-copy').getBoundingClientRect();
            const controls=[...el.querySelectorAll('.home-demo-controls button')].map(node=>{const r=node.getBoundingClientRect();return {left:r.left,right:r.right,width:r.width,height:r.height};});
            return {height:el.getBoundingClientRect().height,phoneBottom:phone.bottom,phoneLeft:phone.left,phoneRight:phone.right,copyTop:copy.top,controls};
          });
          stateHeights.push(bounds.height);
          if(bounds.phoneBottom>bounds.copyTop||bounds.phoneLeft<0||bounds.phoneRight>width||bounds.controls.some(r=>r.left<0||r.right>width||r.width<43||r.height<43)) throw Error(`${width}: demo bounds ${JSON.stringify(bounds)}`);
          await page.screenshot({ path: join(out, `${width}-demo-${i}.png`) });
        }
        if(Math.max(...stateHeights)-Math.min(...stateHeights)>1) throw Error(`${width}: feature change shifts layout`);
        await tabs.first().tap();
        const area = stage.locator('.home-demo-canvas'); const r = await area.boundingBox();
        const cdp = await context.newCDPSession(page);
        const point = x => ({ x, y:r.y + 140, id:1, radiusX:2, radiusY:2, force:1 });
        await cdp.send('Input.dispatchTouchEvent', { type:'touchStart', touchPoints:[point(r.x + r.width*.75)] });
        for(let i=1;i<=5;i++) { await cdp.send('Input.dispatchTouchEvent', {type:'touchMove',touchPoints:[point(r.x+r.width*(.75-.1*i))]}); await page.waitForTimeout(30); }
        await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]}); await page.waitForTimeout(500);
        if(await tabs.nth(1).getAttribute('aria-selected')!=='true') throw Error(`${width}: touch swipe`);
        await stage.getByRole('button',{name:'Tính năng tiếp theo'}).tap();
        if(await tabs.nth(2).getAttribute('aria-selected')!=='true') throw Error(`${width}: next`);
        await stage.getByRole('button',{name:'Tính năng trước'}).tap();
        await area.focus(); await page.keyboard.press('ArrowLeft');
        if(await tabs.first().getAttribute('aria-selected')!=='true') throw Error(`${width}: keyboard`);
        if(await page.locator('.mobile-sticky-cta').getAttribute('aria-hidden')!=='true') throw Error(`${width}: sticky over demo`);
      }
    }
    const data = page.locator('#du-lieu');
    await data.evaluate(el => window.scrollTo(0, el.getBoundingClientRect().top + scrollY - 76));
    await page.waitForTimeout(1200);
    await page.screenshot({ path: join(out, `${width}-data.png`) });
    if(width < 768 && !baseline) {
      await page.locator('.home-data-category button').nth(2).tap();
      if(await page.locator('.home-data-category button').nth(2).getAttribute('aria-pressed')!=='true') throw Error(`${width}: category selection`);
      const legends=await page.locator('.home-data-category button').evaluateAll(nodes=>nodes.map(el=>{const r=el.getBoundingClientRect();return {left:r.left,right:r.right,opacity:getComputedStyle(el).opacity};}));
      if(legends.some(r=>r.left<0||r.right>width||Number(r.opacity)<.99)) throw Error(`${width}: clipped/faded legend`);
      if(await page.locator('.mobile-sticky-cta').getAttribute('aria-hidden')!=='true') throw Error(`${width}: sticky over category controls`);
      await page.locator('.home-data-trend').evaluate(el => window.scrollTo(0, el.getBoundingClientRect().top + scrollY - 100));
      await page.waitForTimeout(500); await page.screenshot({path:join(out,`${width}-trend.png`)});
    }
    const final = page.locator('#tai-ung-dung');
    await final.evaluate(el => window.scrollTo(0, el.getBoundingClientRect().top + scrollY + (innerWidth >= 768 ? (el.clientHeight-innerHeight)*.85 : -76)));
    await page.waitForTimeout(700);
    await page.screenshot({path:join(out,`${width}-waitlist.png`)});
    if(width < 768 && !baseline) {
      const overlap=await final.evaluate(el=>{const a=el.querySelector('.s6-c .phone').getBoundingClientRect();const b=el.querySelector('h2').getBoundingClientRect();return a.left<0||a.right>b.left||a.right>innerWidth;});
      if(overlap) throw Error(`${width}: waitlist text/device overlap`);
      if(await final.evaluate(el=>el.getBoundingClientRect().height)>height*.8) throw Error(`${width}: oversized waitlist`);
      if(await page.locator('.mobile-sticky-cta').getAttribute('aria-hidden')!=='true') throw Error(`${width}: sticky over final`);
      await final.getByRole('button',{name:'Nhận thông báo khi ra mắt'}).tap();
      await page.getByRole('dialog').waitFor({state:'visible'});
      await page.keyboard.press('Escape'); await page.getByRole('dialog').waitFor({state:'hidden'});
    }
    const semantic = await page.evaluate(() => ({ h1:document.querySelector('h1').textContent, headings:[...document.querySelectorAll('main h2')].map(el=>el.textContent), paragraphs:[...document.querySelectorAll('main p')].map(el=>el.textContent), links:[...document.querySelectorAll('main a')].map(el=>el.getAttribute('href')), overflow:document.documentElement.scrollWidth-innerWidth }));
    report.push({width,height,errors,geometry,...semantic});
    await context.close();
  }
  if(!baseline) {
    const context = await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
    const page = await context.newPage(); await page.goto(base,{waitUntil:'networkidle'});
    await page.screenshot({path:join(out,'reduced-hero.png')});
    await page.locator('#mobile-home-product').evaluate(el=>el.scrollIntoView({block:'start'}));
    await page.getByRole('tab',{name:'Ngân sách',exact:true}).click();
    await page.screenshot({path:join(out,'reduced-demo.png')}); await context.close();
  }
  writeFileSync(join(out,'report.json'),JSON.stringify(report,null,2));
  console.log(JSON.stringify(report.map(({width,height,errors,overflow,geometry})=>({width,height,errors,overflow,heroHeight:geometry['#top'].height,finalHeight:geometry['#tai-ung-dung'].height})),null,2));
  if(report.some(row=>row.errors.length||row.overflow>1)) process.exitCode=1;
} finally { await browser.close(); }
