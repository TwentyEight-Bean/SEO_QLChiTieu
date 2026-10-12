import http from 'http';
import fs from 'fs';
import { createUnsubscribeToken } from '../api/waitlist-provider.js';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:8080';

async function fetchRoute(path, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const req = http.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({
        status: res.statusCode,
        headers: res.headers,
        body: data,
      }));
    });
    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

async function runPhase8Audit() {
  console.log('======================================================');
  console.log('PHASE 8 — PRODUCTION LAUNCH INTEGRATION AUDIT SUITE');
  console.log('======================================================\n');

  // --- 1. HTTP STATUS CODE & PRERENDERED ROUTE AUDIT ---
  console.log('--- 1. HTTP STATUS CODE AUDIT (200 VS 404) ---');
  const routesToTest = [
    { path: '/', expected: 200 },
    { path: '/tinh-nang', expected: 200 },
    { path: '/quan-ly-thu-chi', expected: 200 },
    { path: '/thong-ke-tai-chinh', expected: 200 },
    { path: '/lap-ngan-sach', expected: 200 },
    { path: '/ung-dung-quan-ly-chi-tieu', expected: 200 },
    { path: '/cau-hoi-thuong-gap', expected: 200 },
    { path: '/gioi-thieu', expected: 200 },
    { path: '/chinh-sach-bao-mat', expected: 200 },
    { path: '/dieu-khoan-su-dung', expected: 200 },
    { path: '/huy-dang-ky', expected: 200 },
    { path: '/blog', expected: 200 },
    { path: '/blog/ghi-chep-chi-tieu-hang-ngay', expected: 200 },
    { path: '/a-non-existent-route-for-testing', expected: 404 },
    { path: '/invalid/nested/path', expected: 404 },
  ];

  let statusPass = true;
  for (const r of routesToTest) {
    const res = await fetchRoute(r.path);
    const match = res.status === r.expected;
    console.log(`  [${match ? 'PASS' : 'FAIL'}] ${r.path.padEnd(38)} -> HTTP ${res.status} (Expected ${r.expected})`);
    if (!match) statusPass = false;
  }

  // --- 2. RAW STATIC HTML CONTENT AUDIT ---
  console.log('\n--- 2. RAW STATIC HTML AUDIT (BEFORE CLIENT JS) ---');
  const checkPages = [
    '/',
    '/tinh-nang',
    '/thong-ke-tai-chinh',
    '/blog',
    '/blog/ghi-chep-chi-tieu-hang-ngay',
    '/huy-dang-ky',
  ];

  for (const path of checkPages) {
    const res = await fetchRoute(path);
    const html = res.body;

    const hasTitle = /<title>[^<]+<\/title>/.test(html);
    const hasMetaDesc = /<meta\s+name="description"\s+content="[^"]+"/.test(html);
    const hasCanonical = /<link\s+rel="canonical"\s+href="https:\/\/sochi\.app[^"]*"/.test(html);
    const hasH1 = /<h1[^>]*>[\s\S]*?<\/h1>/.test(html);
    const hasJsonLd = html.includes('application/ld+json');

    console.log(`Route: ${path}`);
    console.log(`  - Title tag:           ${hasTitle ? '✓ Present' : '✗ Missing'}`);
    console.log(`  - Meta description:    ${hasMetaDesc ? '✓ Present' : '✗ Missing'}`);
    console.log(`  - Canonical link:      ${hasCanonical ? '✓ Correct (https://sochi.app...)' : '✗ Invalid'}`);
    console.log(`  - H1 heading:          ${hasH1 ? '✓ Server Rendered' : '✗ Missing'}`);
    console.log(`  - JSON-LD Structured:  ${hasJsonLd ? '✓ Present' : '✗ Missing'}`);
  }

  // --- 3. WAITLIST BACKEND & PERSISTENCE API AUDIT ---
  console.log('\n--- 3. WAITLIST PERSISTENCE & VALIDATION AUDIT (/api/waitlist) ---');

  // Test 3.1: Invalid Email (RFC 5322 check)
  const badRes = await fetchRoute('/api/waitlist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'bad-email@no-domain', source: 'test' }),
  });
  console.log(`  Test 3.1 (Invalid Email): HTTP ${badRes.status} (Expected 400) -> ${badRes.body}`);

  // Test 3.2: Disposable Email Block
  const dispRes = await fetchRoute('/api/waitlist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'user@tempmail.com', source: 'test' }),
  });
  console.log(`  Test 3.2 (Disposable Email): HTTP ${dispRes.status} (Expected 400) -> ${dispRes.body}`);

  // Test 3.3: Honeypot Anti-Spam Check
  const hpRes = await fetchRoute('/api/waitlist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'spammer@bot.com', hp_code: 'spam-bot-trap', source: 'bot' }),
  });
  console.log(`  Test 3.3 (Honeypot Trap): HTTP ${hpRes.status} (Expected 200 without saving) -> ${hpRes.body}`);

  // Test 3.4: Valid Registration (New Subscriber -> 201 Created)
  const testEmail = `launch_user_${Date.now()}@gmail.com`;
  const validRes = await fetchRoute('/api/waitlist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail, source: 'launch_audit', consent_version: 'v1_prelaunch' }),
  });
  console.log(`  Test 3.4 (Valid New Registration): HTTP ${validRes.status} (Expected 201) -> ${validRes.body}`);

  // Test 3.5: Duplicate Check (Existing Subscriber -> 200 OK with duplicate: true)
  const dupRes = await fetchRoute('/api/waitlist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail.toUpperCase(), source: 'launch_audit' }),
  });
  console.log(`  Test 3.5 (Duplicate Email Check with casing normalization): HTTP ${dupRes.status} (Expected 200 duplicate) -> ${dupRes.body}`);

  // --- 4. UNSUBSCRIBE FLOW AUDIT ---
  console.log('\n--- 4. UNSUBSCRIBE FLOW AUDIT (/api/unsubscribe & /huy-dang-ky) ---');

  // Test 4.1: Missing token
  const noTokenRes = await fetchRoute('/api/unsubscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  console.log(`  Test 4.1 (Missing Token): HTTP ${noTokenRes.status} (Expected 400) -> ${noTokenRes.body}`);

  // Test 4.2: Invalid / forged token
  const fakeTokenRes = await fetchRoute('/api/unsubscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: 'fake-tampered-token-12345' }),
  });
  console.log(`  Test 4.2 (Tampered Token): HTTP ${fakeTokenRes.status} (Expected 400) -> ${fakeTokenRes.body}`);

  // Test 4.3: Valid Signed HMAC Token Unsubscribe
  const validToken = createUnsubscribeToken(testEmail);
  const unsubRes = await fetchRoute('/api/unsubscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: validToken }),
  });
  console.log(`  Test 4.3 (Signed HMAC Token Unsubscribe): HTTP ${unsubRes.status} (Expected 200) -> ${unsubRes.body}`);

  // --- 5. SECURITY HEADERS & ENVIRONMENT POLICY AUDIT ---
  console.log('\n--- 5. SECURITY & ENVIRONMENT POLICY AUDIT ---');
  const rootRes = await fetchRoute('/');
  console.log(`  X-Content-Type-Options: ${rootRes.headers['x-content-type-options'] || 'Missing'}`);
  console.log(`  X-Frame-Options:        ${rootRes.headers['x-frame-options'] || 'Missing'}`);
  console.log(`  Referrer-Policy:        ${rootRes.headers['referrer-policy'] || 'Missing'}`);
  console.log(`  Permissions-Policy:     ${rootRes.headers['permissions-policy'] || 'Missing'}`);
  console.log(`  Content-Security-Policy:${rootRes.headers['content-security-policy'] ? '✓ Configured' : 'Missing'}`);
  console.log(`  X-Robots-Tag:           ${rootRes.headers['x-robots-tag'] || 'None (Correct for Production indexability)'}`);

  // --- 6. ROBOTS.TXT & SITEMAP.XML AUDIT ---
  console.log('\n--- 6. ROBOTS.TXT & SITEMAP.XML AUDIT ---');
  const robotsRes = await fetchRoute('/robots.txt');
  console.log(`  /robots.txt HTTP Status: ${robotsRes.status}`);
  console.log(`  /robots.txt preview:\n${robotsRes.body.trim().split('\n').map(l => '    ' + l).join('\n')}`);

  const sitemapRes = await fetchRoute('/sitemap.xml');
  console.log(`\n  /sitemap.xml HTTP Status: ${sitemapRes.status}`);
  const sitemapUrls = [...sitemapRes.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  console.log(`  Total Sitemap URLs: ${sitemapUrls.length}`);
  const allHttpsProd = sitemapUrls.every(u => u.startsWith('https://sochi.app/'));
  console.log(`  All URLs canonicalized to https://sochi.app/: ${allHttpsProd ? '✓ PASS' : '✗ FAIL'}`);

  console.log('\n======================================================');
  console.log('PHASE 8 AUDIT SUITE EXECUTION COMPLETED');
  console.log('======================================================');
}

runPhase8Audit().catch(err => {
  console.error('[Audit Error]', err);
  process.exit(1);
});
