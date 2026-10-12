import http from 'http';
import fs from 'fs';

const BASE_URL = 'http://localhost:8080';

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

async function runVerification() {
  console.log('======================================================');
  console.log('PHASE 7 — STAGING & PRODUCTION READINESS AUDIT SUITE');
  console.log('======================================================\n');

  // --- 1. REAL HTTP STATUS VERIFICATION ---
  console.log('--- 1. HTTP STATUS CODE AUDIT ---');
  const routesToTest = [
    { path: '/', expected: 200 },
    { path: '/tinh-nang', expected: 200 },
    { path: '/thong-ke-tai-chinh', expected: 200 },
    { path: '/blog', expected: 200 },
    { path: '/blog/ghi-chep-chi-tieu-hang-ngay', expected: 200 },
    { path: '/a-route-that-does-not-exist', expected: 404 },
    { path: '/this-page-does-not-exist', expected: 404 },
    { path: '/invalid/nested/path', expected: 404 },
  ];

  let statusPass = true;
  for (const r of routesToTest) {
    const res = await fetchRoute(r.path);
    const match = res.status === r.expected;
    console.log(`  [${match ? 'PASS' : 'FAIL'}] ${r.path.padEnd(35)} -> HTTP ${res.status} (Expected ${r.expected})`);
    if (!match) statusPass = false;
  }

  // --- 2. STATIC HTML BEFORE JAVASCRIPT ---
  console.log('\n--- 2. STATIC HTML SEO CONTENT AUDIT (BEFORE JS) ---');
  const seoCheckRoutes = [
    '/',
    '/thong-ke-tai-chinh',
    '/blog',
    '/blog/ghi-chep-chi-tieu-hang-ngay',
  ];

  for (const path of seoCheckRoutes) {
    const res = await fetchRoute(path);
    const html = res.body;

    const hasTitle = /<title>[^<]+<\/title>/.test(html);
    const hasMetaDesc = /<meta\s+name="description"\s+content="[^"]+"/.test(html);
    const hasCanonical = /<link\s+rel="canonical"\s+href="https:\/\/sochi\.app[^"]*"/.test(html);
    const hasH1 = /<h1[^>]*>[\s\S]*?<\/h1>/.test(html);
    const hasJsonLd = html.includes('application/ld+json');
    const hasInternalLinks = /href="\/(tinh-nang|thong-ke-tai-chinh|blog|chinh-sach-bao-mat)"/.test(html);

    console.log(`Route: ${path}`);
    console.log(`  - Title tag:           ${hasTitle ? '✓ Present' : '✗ Missing'}`);
    console.log(`  - Meta description:    ${hasMetaDesc ? '✓ Present' : '✗ Missing'}`);
    console.log(`  - Canonical link:      ${hasCanonical ? '✓ Correct (https://sochi.app...)' : '✗ Invalid'}`);
    console.log(`  - H1 heading:          ${hasH1 ? '✓ Server Rendered' : '✗ Missing'}`);
    console.log(`  - JSON-LD Structured:  ${hasJsonLd ? '✓ Present' : '✗ Missing'}`);
    console.log(`  - Semantic links:      ${hasInternalLinks ? '✓ Present' : '✗ Missing'}`);
  }

  // --- 3. CANONICAL INTEGRITY CHECK ---
  console.log('\n--- 3. CANONICAL PRODUCTION PURITY AUDIT ---');
  const distDir = 'd:/Apps_works/Dự án IT/SEO_QUANLYCHITIEU/dist';
  const htmlFiles = [];

  function scanHtml(dir) {
    for (const f of fs.readdirSync(dir)) {
      const full = `${dir}/${f}`;
      if (fs.statSync(full).isDirectory()) scanHtml(full);
      else if (f.endsWith('.html') && f !== '404.html') htmlFiles.push(full);
    }
  }
  scanHtml(distDir);

  let canonicalViolations = 0;
  for (const file of htmlFiles) {
    const content = fs.readFileSync(file, 'utf8');
    const match = content.match(/<link\s+rel="canonical"\s+href="([^"]+)"/);
    if (match) {
      const href = match[1];
      if (href.includes('localhost') || href.includes('127.0.0.1') || href.includes('staging') || !href.startsWith('https://sochi.app')) {
        console.error(`  ✗ VIOLATION in ${file}: ${href}`);
        canonicalViolations++;
      }
    }
  }
  console.log(`  Scanned ${htmlFiles.length} HTML files.`);
  console.log(`  Canonical Violations: ${canonicalViolations} (Must be 0) -> ${canonicalViolations === 0 ? '✓ CLEAN' : '✗ FAILED'}`);

  // --- 4. ROBOTS.TXT & SITEMAP.XML ---
  console.log('\n--- 4. ROBOTS.TXT & SITEMAP.XML AUDIT ---');
  const robotsRes = await fetchRoute('/robots.txt');
  console.log(`  /robots.txt HTTP Status: ${robotsRes.status}`);
  console.log(`  /robots.txt content preview:\n${robotsRes.body.trim().split('\n').map(l => '    ' + l).join('\n')}`);

  const sitemapRes = await fetchRoute('/sitemap.xml');
  console.log(`\n  /sitemap.xml HTTP Status: ${sitemapRes.status}`);
  const sitemapUrls = [...sitemapRes.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  console.log(`  Sitemap URLs count: ${sitemapUrls.length}`);
  const hasOnlyProdOrigin = sitemapUrls.every(u => u.startsWith('https://sochi.app/'));
  console.log(`  All URLs start with https://sochi.app/: ${hasOnlyProdOrigin ? '✓ Verified' : '✗ Failed'}`);
  console.log(`  Contains test/dev URLs: ${sitemapUrls.some(u => u.includes('test') || u.includes('localhost')) ? '✗ YES' : '✓ NO'}`);

  // --- 5. REAL 404 PAGE AUDIT ---
  console.log('\n--- 5. REAL 404 NOT FOUND AUDIT ---');
  const test404 = await fetchRoute('/this-page-does-not-exist');
  console.log(`  HTTP Status: ${test404.status} (Expected 404)`);
  const has404Heading = test404.body.includes('404') && test404.body.includes('Không tìm thấy trang');
  console.log(`  Renders 404 UI: ${has404Heading ? '✓ Verified' : '✗ Failed'}`);

  // --- 6. WAITLIST BACKEND API AUDIT ---
  console.log('\n--- 6. WAITLIST BACKEND API AUDIT (/api/waitlist) ---');

  // Test 1: Invalid email format
  const badEmailRes = await fetchRoute('/api/waitlist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'not-an-email', source: 'test' }),
  });
  console.log(`  Test 1 (Invalid Email): HTTP ${badEmailRes.status} -> ${badEmailRes.body}`);

  // Test 2: Valid new email submission
  const testEmail = `test_${Date.now()}@example.com`;
  const validRes = await fetchRoute('/api/waitlist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail, source: 'audit_suite' }),
  });
  console.log(`  Test 2 (Valid Email Submission): HTTP ${validRes.status} -> ${validRes.body}`);

  // Test 3: Duplicate submission check
  const dupRes = await fetchRoute('/api/waitlist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail, source: 'audit_suite' }),
  });
  console.log(`  Test 3 (Duplicate Email Submission): HTTP ${dupRes.status} -> ${dupRes.body}`);

  // Test 4: Anti-spam Honeypot Trap
  const spamRes = await fetchRoute('/api/waitlist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'bot@spam.com', hp_code: 'i-am-a-bot', source: 'bot' }),
  });
  console.log(`  Test 4 (Honeypot Anti-Spam Trap): HTTP ${spamRes.status} -> ${spamRes.body}`);

  // --- 7. SECURITY & ENVIRONMENT HEADERS ---
  console.log('\n--- 7. SECURITY & STAGING HEADERS AUDIT ---');
  const rootRes = await fetchRoute('/');
  console.log(`  X-Content-Type-Options: ${rootRes.headers['x-content-type-options'] || 'Missing'}`);
  console.log(`  X-Frame-Options:        ${rootRes.headers['x-frame-options'] || 'Missing'}`);
  console.log(`  Referrer-Policy:        ${rootRes.headers['referrer-policy'] || 'Missing'}`);
  console.log(`  Permissions-Policy:     ${rootRes.headers['permissions-policy'] || 'Missing'}`);
  console.log(`  Content-Security-Policy:${rootRes.headers['content-security-policy'] ? '✓ Configured' : 'Missing'}`);
  console.log(`  Staging X-Robots-Tag:   ${rootRes.headers['x-robots-tag'] || 'None'} (Should be "noindex, nofollow" on staging)`);

  console.log('\n======================================================');
  console.log('AUDIT SUITE EXECUTION COMPLETED');
  console.log('======================================================');
}

runVerification().catch(console.error);
