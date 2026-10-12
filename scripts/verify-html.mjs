import fs from 'fs';
import path from 'path';

const routes = [
  '/',
  '/tinh-nang',
  '/quan-ly-thu-chi',
  '/thong-ke-tai-chinh',
  '/lap-ngan-sach',
  '/ung-dung-quan-ly-chi-tieu',
  '/blog',
  '/blog/ghi-chep-chi-tieu-hang-ngay',
  '/blog/lap-ngan-sach-ca-nhan',
  '/blog/doc-bieu-do-chi-tieu',
  '/blog/quan-ly-chi-tieu-sinh-vien',
  '/blog/phuong-phap-50-30-20',
  '/blog/cuoi-thang-tien-di-dau',
  '/gioi-thieu',
  '/cau-hoi-thuong-gap',
  '/chinh-sach-bao-mat',
  '/dieu-khoan-su-dung',
  '/404'
];

console.log('=== RAW STATIC HTML SEO VERIFICATION ===\n');

for (const r of routes) {
  let filePath;
  if (r === '/') filePath = 'dist/index.html';
  else if (r === '/404') filePath = 'dist/404.html';
  else filePath = path.join('dist', r.slice(1), 'index.html');

  if (!fs.existsSync(filePath)) {
    console.log(`${r.padEnd(45)} -> MISSING FILE! [CLIENT-ONLY]`);
    continue;
  }

  const html = fs.readFileSync(filePath, 'utf8');
  const titleMatch = html.match(/<title>([^<]+)<\/title>/);
  const title = titleMatch ? titleMatch[1] : 'MISSING';
  const descMatch = html.match(/<meta\s+name="description"\s+content="([^"]+)"/);
  const desc = descMatch ? descMatch[1] : 'MISSING';
  const canonicalMatch = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/);
  const canonical = canonicalMatch ? canonicalMatch[1] : (r === '/404' ? 'N/A (404 noindex)' : 'MISSING');
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  const hasH1 = !!h1Match;
  const hasJsonLd = html.includes('application/ld+json');
  const linksCount = (html.match(/<a\s+[^>]*href=/g) || []).length;
  const isPrerendered = html.includes('<header class="site-header');

  console.log(`Route: ${r}`);
  console.log(`  Classification: ${isPrerendered ? 'STATIC HTML' : 'CLIENT-ONLY'}`);
  console.log(`  File:           ${filePath}`);
  console.log(`  Title:          ${title}`);
  console.log(`  Canonical:      ${canonical}`);
  console.log(`  H1:             ${hasH1 ? 'YES' : 'NO'}`);
  console.log(`  JSON-LD:        ${hasJsonLd ? 'YES' : 'NO'}`);
  console.log(`  Links count:    ${linksCount}`);
  console.log(`  Description:    ${desc.slice(0, 60)}...`);
  console.log(`  Size:           ${Math.round(html.length / 1024)} KB\n`);
}
