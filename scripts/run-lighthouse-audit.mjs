import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

async function runAudit() {
  console.log('1. Starting preview server on http://localhost:4173...');
  const preview = spawn('npx.cmd', ['vite', 'preview', '--port', '4173', '--strictPort'], {
    shell: true,
    stdio: 'pipe',
  });

  // Wait for preview server to be ready
  let ready = false;
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 500));
    try {
      const res = await fetch('http://localhost:4173/');
      if (res.ok) {
        ready = true;
        console.log('Preview server ready (status 200).');
        break;
      }
    } catch {}
  }

  if (!ready) {
    preview.kill();
    throw new Error('Preview server failed to start within 10 seconds.');
  }

  const outputPath = 'C:/Users/Admin/AppData/Local/Temp/lighthouse_retest.json';
  console.log('2. Running Lighthouse mobile audit with Phase 6.5 conditions...');

  const lhArgs = [
    'lighthouse',
    'http://localhost:4173/',
    '--form-factor=mobile',
    '--screenEmulation.mobile=true',
    '--throttling.rttMs=150',
    '--throttling.throughputKbps=1638.4',
    '--throttling.cpuSlowdownMultiplier=4',
    '--output=json',
    `--output-path=${outputPath}`,
    '--chrome-flags="--headless=new"',
    '--only-categories=performance',
  ];

  await new Promise((resolve, reject) => {
    const lh = spawn('npx.cmd', lhArgs, { shell: true, stdio: 'inherit' });
    lh.on('close', code => {
      if (code === 0) resolve();
      else reject(new Error(`Lighthouse exited with code ${code}`));
    });
  });

  // Kill preview server
  preview.kill();

  // Read results
  console.log('3. Extracting measured Core Web Vitals...');
  const data = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
  const a = data.audits;

  const fcp = a['first-contentful-paint'];
  const lcp = a['largest-contentful-paint'];
  const cls = a['cumulative-layout-shift'];
  const tbt = a['total-blocking-time'];
  const score = data.categories.performance.score * 100;

  console.log('\n========================================');
  console.log('LIGHTHOUSE MOBILE RETEST RESULTS:');
  console.log('========================================');
  console.log(`Performance Score: ${score.toFixed(1)} / 100`);
  console.log(`FCP: ${fcp.displayValue} (${fcp.numericValue.toFixed(1)} ms)`);
  console.log(`LCP: ${lcp.displayValue} (${lcp.numericValue.toFixed(1)} ms)`);
  console.log(`CLS: ${cls.displayValue} (${cls.numericValue.toFixed(6)})`);
  console.log(`TBT: ${tbt.displayValue} (${tbt.numericValue.toFixed(1)} ms)`);

  const lcpInsight = a['lcp-breakdown-insight'];
  if (lcpInsight?.details?.items) {
    console.log('LCP Breakdown Subparts:');
    for (const item of lcpInsight.details.items) {
      if (item.type === 'table') {
        for (const row of item.items) {
          console.log(`  - ${row.label}: ${row.duration.toFixed(1)} ms`);
        }
      }
      if (item.type === 'node') {
        console.log(`  - Node: ${item.nodeLabel} (${item.snippet})`);
      }
    }
  }
}

runAudit().catch(err => {
  console.error(err);
  process.exit(1);
});
