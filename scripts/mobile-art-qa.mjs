import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const out = resolve(process.argv[2] || 'artifacts/mobile-art');
const base = process.env.QA_URL || 'http://127.0.0.1:8443';
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ headless: true, channel: process.env.QA_BROWSER || 'chrome' });
const routes = ['quan-ly-thu-chi', 'thong-ke-tai-chinh', 'lap-ngan-sach', 'tinh-nang'];
const report = [];
const sizes = [[360,800], [375,812], [390,844], [430,932], [440,956], [1366,900], [1440,900]];
for (const [width, height] of sizes) {
  const context = await browser.newContext({ viewport: { width, height } });
  await Promise.all(routes.map(async (route) => {
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`${base}/${route}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(500);
    if (width >= 768) await page.addStyleTag({ content: '*,*::before,*::after { animation: none !important; transition: none !important; }' });
    await page.screenshot({ path: join(out, `${route}-${width}-hero.png`) });
    const stage = page.locator('#mo-phong > section');
    if (width < 768) {
      await stage.evaluate(el => window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 76));
      await page.waitForTimeout(400);
      await page.screenshot({ path: join(out, `${route}-${width}-stage.png`) });
      const tabs = stage.getByRole('tab');
      const count = await tabs.count();
      for (let index = 0; index < count; index++) {
        await tabs.nth(index).click();
        await page.waitForTimeout(520);
        if (await tabs.nth(index).getAttribute('aria-selected') !== 'true') throw new Error(`${route}: tab ${index} did not select`);
        const boundaries = await stage.evaluate(el => {
          const rail = el.lastElementChild.lastElementChild;
          return [...rail.children].filter(node => node.tagName === 'BUTTON').map(node => {
            const r = node.getBoundingClientRect();
            return { left: r.left, right: r.right, width: r.width, height: r.height };
          });
        });
        if (boundaries.some(rect => rect.left < 0 || rect.right > width + 1 || rect.height < 43)) throw new Error(`${route} ${width}: control clipped or too small`);
        await page.screenshot({ path: join(out, `${route}-${width}-state-${index}.png`) });
      }
      await tabs.nth(0).click();
      const composition = stage.locator('.art-composition');
      await composition.focus();
      await page.keyboard.press('ArrowRight');
      if (await tabs.nth(1).getAttribute('aria-selected') !== 'true') throw new Error(`${route}: keyboard did not advance`);
      const rect = await composition.boundingBox();
      await page.mouse.move(rect.x + rect.width * .7, rect.y + 20);
      await page.mouse.down();
      await page.mouse.move(rect.x + rect.width * .3, rect.y + 20, { steps: 5 });
      await page.mouse.up();
      if (await tabs.nth(2).getAttribute('aria-selected') !== 'true') throw new Error(`${route}: swipe did not advance`);
      const sticky = page.locator('.mobile-sticky-cta');
      if (await sticky.getAttribute('aria-hidden') !== 'true') throw new Error(`${route}: sticky CTA visible over stage`);
      await stage.getByRole('button', { name: /Tiếp theo|Xem lại/ }).click();
      await stage.getByRole('button', { name: /trước$/ }).click();
      await tabs.nth(0).click();
      await page.locator('.secondary-article > section').first().evaluate(el => window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 76));
      await page.screenshot({ path: join(out, `${route}-${width}-editorial.png`) });
      await page.locator('.product-editorial-figure').evaluate(el => window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 150));
      await page.screenshot({ path: join(out, `${route}-${width}-editorial-figure.png`) });
      await page.locator('.product-hero-mobile-cta').click();
      const dialog = page.getByRole('dialog');
      await dialog.waitFor({ state: 'visible' });
      await page.keyboard.press('Escape');
      await dialog.waitFor({ state: 'hidden' });
      const anchor = page.locator('.secondary-article #muc-2');
      await anchor.evaluate(el => el.scrollIntoView({ block: 'start' }));
      await page.waitForTimeout(500);
      const anchorTop = await anchor.evaluate(el => el.getBoundingClientRect().top);
      const headerBottom = await page.locator('.site-header').evaluate(el => el.getBoundingClientRect().bottom);
      if (anchorTop < headerBottom - 1) throw new Error(`${route}: anchor obscured by header`);
    }
    const related = page.locator('main .related-links:visible');
    if (await related.count()) {
    await related.evaluate(el => window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 90));
    await page.waitForTimeout(250);
    await page.screenshot({ path: join(out, `${route}-${width}-related.png`) });
    const firstRelated = related.locator('a').first();
    await firstRelated.focus();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Shift+Tab');
    if (await firstRelated.evaluate(el => getComputedStyle(el).outlineStyle) === 'none') throw new Error(`${route}: related link lacks focus indicator`);
    const destination = await firstRelated.getAttribute('href');
    await firstRelated.click();
    await page.waitForURL(url => url.pathname === destination);
    }
    await page.goto(`${base}/${route}`, { waitUntil: 'networkidle' });
    if (width >= 768) await page.addStyleTag({ content: '*,*::before,*::after { animation: none !important; transition: none !important; }' });
    const footer = page.locator('footer');
    const headerMask = await page.addStyleTag({ content: '.site-header { visibility: hidden; }' });
    await footer.screenshot({ path: join(out, `${route}-${width}-footer.png`), animations: 'disabled' });
    const baselineFooterHeight = await footer.evaluate(el => {
      el.__qaClasses = [el, ...el.querySelectorAll('[class]')].map(node => [node, node.className]);
      el.__qaClasses.forEach(([node]) => [...node.classList].forEach(name => {
        if (name === 'site-footer' || name.startsWith('footer-') && name !== 'footer-mobile-unsubscribe') node.classList.remove(name);
      }));
      return Math.round(el.getBoundingClientRect().height);
    });
    await footer.screenshot({ path: join(out, `${route}-${width}-footer-before.png`), animations: 'disabled' });
    await footer.evaluate(el => { el.__qaClasses.forEach(([node, names]) => { node.className = names; }); delete el.__qaClasses; });
    await headerMask.evaluate(el => el.remove());
    const metrics = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - innerWidth,
      headings: [...document.querySelectorAll('main h2')].map(el => el.textContent),
      paragraphs: [...document.querySelectorAll('.secondary-article p')].map(el => el.textContent),
      footerHeight: Math.round(document.querySelector('footer').getBoundingClientRect().height),
      footerLinks: [...document.querySelectorAll('footer a')].map(el => ({ href: el.getAttribute('href'), text: el.textContent, visible: el.getBoundingClientRect().width > 0 })),
    }));
    if (metrics.footerLinks.some(link => !metrics.footerLinks.some(visible => visible.href === link.href && visible.visible))) throw new Error(`${route}: footer destination hidden`);
    if (width >= 768 && metrics.footerHeight !== baselineFooterHeight) throw new Error(`${route}: desktop footer height changed`);
    report.push({ route, width, errors, baselineFooterHeight, ...metrics });
    await page.close();
  }));
  await context.close();
}
const reduced = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
for (const route of routes) {
  const page = await reduced.newPage();
  await page.goto(`${base}/${route}`, { waitUntil: 'networkidle' });
  const stage = page.locator('#mo-phong > section');
  await stage.evaluate(el => window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 76));
  await stage.getByRole('tab').last().click();
  await page.screenshot({ path: join(out, `${route}-390-reduced.png`) });
  if (!(await stage.innerText()).trim()) throw new Error(`${route}: reduced-motion content absent`);
  await page.close();
}
await reduced.close();
writeFileSync(join(out, 'report.json'), JSON.stringify(report, null, 2));
await browser.close();
console.log(JSON.stringify(report.map(({ route, width, overflow, errors }) => ({ route, width, overflow, errors })), null, 2));
if (report.some(row => row.overflow > 1 || row.errors.length)) process.exitCode = 1;
