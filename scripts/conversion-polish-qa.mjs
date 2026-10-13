import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.QA_URL || 'http://127.0.0.1:4173';
const out = resolve(process.argv[2] || 'artifacts/conversion-polish');
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const results = [];
const check = (value, message) => { if (!value) throw new Error(message); };

try {
  // Full CSS must win over the prerender first-paint fallback.
  for (const width of [768, 1366, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.goto(base, { waitUntil: 'networkidle' });
    check(await page.locator('.prelaunch-form').isVisible(), `${width}: desktop form hidden`);
    check(await page.locator('.site-header a.md\\:block').isVisible(), `${width}: header CTA hidden`);
    check(!await page.locator('.mobile-home-stage').isVisible(), `${width}: mobile demo on desktop`);
    await page.locator('#tai-ung-dung').evaluate(el => scrollTo(0, el.offsetTop + (el.offsetHeight - innerHeight) * .85));
    await page.waitForTimeout(600);
    await page.screenshot({ path: join(out, `${width}-desktop.png`) });
    results.push({ width, desktopForm: true, headerCta: true, mobileDemoHidden: true });
    await page.close();
  }

  for (const [width, height] of [[360, 800], [390, 844], [430, 932]]) {
    const page = await browser.newPage({ viewport: { width, height }, hasTouch: true });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    let scenario = { status: 201, json: { ok: true, message: 'Đăng ký thành công!' } };
    let requests = 0;
    await page.route('**/api/waitlist', async route => {
      requests++;
      if (scenario.stall) return;
      if (scenario.abort) return route.abort('failed');
      if (scenario.delay) await new Promise(r => setTimeout(r, scenario.delay));
      await route.fulfill({ status: scenario.status, contentType: 'application/json', body: scenario.body ?? JSON.stringify(scenario.json) });
    });
    await page.goto(base, { waitUntil: 'networkidle' });
    const footer = page.locator('.site-footer');
    const footerLinks = await footer.locator('a').evaluateAll(nodes => nodes.filter(el => el.getClientRects().length).map(el => el.getAttribute('href')));
    for (const href of ['/tinh-nang', '/quan-ly-thu-chi', '/thong-ke-tai-chinh', '/lap-ngan-sach', '/blog', '/chinh-sach-bao-mat', '/dieu-khoan-su-dung', '/cau-hoi-thuong-gap', '/gioi-thieu', '/huy-dang-ky']) check(footerLinks.includes(href), `${width}: missing footer link ${href}`);
    await footer.screenshot({ path: join(out, `${width}-footer.png`) });
    const footerHeight = await footer.evaluate(el => el.getBoundingClientRect().height);
    await page.locator('#tai-ung-dung button', { hasText: 'Nhận thông báo khi ra mắt' }).click();
    await page.waitForTimeout(600);
    const input = page.locator('#sheet-email-input');
    const close = page.getByRole('button', { name: 'Đóng hộp thoại' });
    check(await input.evaluate(el => document.activeElement === el), `${width}: input focus`);
    check(await input.evaluate(el => parseFloat(getComputedStyle(el).fontSize)) >= 16, `${width}: iOS zoom font`);
    await close.focus(); await page.keyboard.press('Shift+Tab');
    check(await page.getByRole('dialog').getByRole('link').evaluate(el => document.activeElement === el), `${width}: reverse focus trap`);
    await page.keyboard.press('Tab'); check(await close.evaluate(el => document.activeElement === el), `${width}: forward focus trap`);
    await input.fill('not-an-email');
    await page.getByRole('dialog').getByRole('button', { name: 'Nhận thông báo khi ra mắt', exact: true }).click();
    check(requests === 0, `${width}: invalid email submitted`);
    await input.fill('qa@example.com');
    await page.screenshot({ path: join(out, `${width}-sheet.png`) });
    const failures = [
      { status: 400, json: { ok: false, message: 'Email không hợp lệ.' }, invalid: true },
      { status: 429, json: { ok: false } },
      { status: 500, json: { ok: false } },
      { status: 200, json: { ok: false } },
      { status: 200, body: '<html>Unexpected proxy response</html>' },
      { abort: true },
      ...(width === 390 ? [{ stall: true }] : []),
    ];
    for (const failure of failures) {
      scenario = failure;
      await input.fill('qa@example.com');
      await page.getByRole('dialog').getByRole('button', { name: 'Nhận thông báo khi ra mắt', exact: true }).click();
      await page.getByRole('alert').waitFor();
      check(await page.getByRole('dialog').getByRole('heading', { name: 'Sổ Chi sắp ra mắt.' }).isVisible(), `${width}: false success`);
      check((await input.getAttribute('aria-invalid') === 'true') === !!failure.invalid, `${width}: invalid email semantics`);
      check(await page.evaluate(() => !window.dataLayer.some(e => e.event === 'waitlist_success')), `${width}: false success analytics`);
    }
    await page.screenshot({ path: join(out, `${width}-sheet-error.png`) });
    scenario = { status: 201, json: { ok: true, message: 'Đăng ký thành công!' }, delay: 450 };
    await input.fill('qa@example.com');
    const submit = page.getByRole('dialog').locator('button[type="submit"]');
    await submit.click();
    check(await submit.isDisabled(), `${width}: duplicate submission enabled`);
    check(await page.getByRole('dialog').locator('form').getAttribute('aria-busy') === 'true', `${width}: busy feedback`);
    await page.getByRole('heading', { name: 'Đã ghi nhận', exact: true }).waitFor();
    check(await page.getByRole('heading', { name: 'Đã ghi nhận', exact: true }).evaluate(el => document.activeElement === el), `${width}: success focus`);
    await page.screenshot({ path: join(out, `${width}-sheet-success.png`) });
    await page.getByRole('button', { name: 'Hoàn tất', exact: true }).click();
    await page.getByRole('dialog').waitFor({ state: 'hidden' });
    const trigger = page.locator('#tai-ung-dung button', { hasText: 'Nhận thông báo khi ra mắt' });
    check(await trigger.evaluate(el => document.activeElement === el), `${width}: focus not restored`);
    check(await page.evaluate(() => document.body.style.overflow !== 'hidden'), `${width}: body scroll locked`);
    await trigger.click(); await page.waitForTimeout(600);
    scenario = { status: 200, json: { ok: true, duplicate: true, message: 'Email này đã có trong danh sách chờ.' } };
    await input.fill('qa@example.com');
    await page.getByRole('dialog').getByRole('button', { name: 'Nhận thông báo khi ra mắt', exact: true }).click();
    await page.getByRole('heading', { name: 'Đã ghi nhận', exact: true }).waitFor();
    await page.getByRole('button', { name: 'Hoàn tất', exact: true }).click(); await page.getByRole('dialog').waitFor({ state: 'hidden' });
    await trigger.click(); await page.waitForTimeout(600);
    // Simulate a shorter visible viewport; a physical iOS keyboard still needs device QA.
    await page.setViewportSize({ width, height: 460 }); await page.waitForTimeout(250);
    const bounds = await page.locator('.mobile-sheet-panel').boundingBox();
    check(bounds.y >= 15 && bounds.y + bounds.height <= 461, `${width}: short viewport panel clipped`);
    await page.getByRole('dialog').getByRole('button', { name: 'Nhận thông báo khi ra mắt', exact: true }).scrollIntoViewIfNeeded();
    const submitBounds = await page.getByRole('dialog').getByRole('button', { name: 'Nhận thông báo khi ra mắt', exact: true }).boundingBox();
    check(submitBounds.y >= bounds.y && submitBounds.y + submitBounds.height <= 461, `${width}: short viewport submit unreachable`);
    await page.screenshot({ path: join(out, `${width}-short-viewport.png`) });
    await page.keyboard.press('Escape'); await page.getByRole('dialog').waitFor({ state: 'hidden' });
    check(errors.length === 0, `${width}: JS errors ${errors}`);
    results.push({ width, height, footerHeight, footerLinks, invalidEmail: true, failures: failures.length, success: true, duplicate: true, focusTrap: true, focusReturn: true, shortViewport: true, errors });
    await page.close();
  }

  // The first-paint stylesheet still provides a useful hero without full CSS.
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.route('**/assets/*.css', route => route.abort());
  await page.goto(base, { waitUntil: 'networkidle' });
  check(await page.locator('h1').isVisible(), 'Critical CSS: empty first paint');
  await page.screenshot({ path: join(out, 'critical-only.png') });
  await page.close();
  writeFileSync(join(out, 'report.json'), JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
} finally {
  await browser.close();
}
