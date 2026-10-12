import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

async function runMultiTest() {
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

  const results = [];
  const runsCount = 3;

  for (let run = 1; run <= runsCount; run++) {
    console.log(`\n--- RUNNING AUDIT ${run}/${runsCount} ---`);
    const outputPath = `C:/Users/Admin/AppData/Local/Temp/lighthouse_run_${run}.json`;

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

    const data = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
    const a = data.audits;

    const runResult = {
      run,
      score: data.categories.performance.score * 100,
      fcp: a['first-contentful-paint'].numericValue,
      lcp: a['largest-contentful-paint'].numericValue,
      cls: a['cumulative-layout-shift'].numericValue,
      tbt: a['total-blocking-time'].numericValue,
      fcpDisplay: a['first-contentful-paint'].displayValue,
      lcpDisplay: a['largest-contentful-paint'].displayValue,
      clsDisplay: a['cumulative-layout-shift'].displayValue,
      tbtDisplay: a['total-blocking-time'].displayValue,
      lcpNode: a['lcp-breakdown-insight']?.details?.items?.find(i => i.type === 'node')?.nodeLabel || 'N/A',
      lcpSnippet: a['lcp-breakdown-insight']?.details?.items?.find(i => i.type === 'node')?.snippet || 'N/A',
    };

    results.push(runResult);
    console.log(`Run ${run} complete: LCP = ${runResult.lcpDisplay}, FCP = ${runResult.fcpDisplay}, Score = ${runResult.score.toFixed(1)}`);
  }

  // Kill preview server
  preview.kill();

  console.log('\n======================================================');
  console.log('PHASE 6.7 MULTI-RUN STATISTICAL RESULTS (3 RUNS):');
  console.log('======================================================');

  results.forEach(r => {
    console.log(`Run ${r.run}: Score=${r.score.toFixed(1)} | FCP=${r.fcpDisplay} (${r.fcp.toFixed(1)}ms) | LCP=${r.lcpDisplay} (${r.lcp.toFixed(1)}ms) | CLS=${r.clsDisplay} | TBT=${r.tbtDisplay}`);
  });

  const getStats = (arr, key) => {
    const sorted = [...arr].map(x => x[key]).sort((a, b) => a - b);
    return {
      best: sorted[0],
      median: sorted[Math.floor(sorted.length / 2)],
      worst: sorted[sorted.length - 1],
    };
  };

  const lcpStats = getStats(results, 'lcp');
  const fcpStats = getStats(results, 'fcp');
  const scoreStats = getStats(results, 'score');
  const tbtStats = getStats(results, 'tbt');
  const clsStats = getStats(results, 'cls');

  console.log('\n--- LCP (Largest Contentful Paint) ---');
  console.log(`  Best:   ${(lcpStats.best / 1000).toFixed(2)}s (${lcpStats.best.toFixed(1)} ms)`);
  console.log(`  Median: ${(lcpStats.median / 1000).toFixed(2)}s (${lcpStats.median.toFixed(1)} ms)`);
  console.log(`  Worst:  ${(lcpStats.worst / 1000).toFixed(2)}s (${lcpStats.worst.toFixed(1)} ms)`);

  console.log('\n--- FCP (First Contentful Paint) ---');
  console.log(`  Best:   ${(fcpStats.best / 1000).toFixed(2)}s (${fcpStats.best.toFixed(1)} ms)`);
  console.log(`  Median: ${(fcpStats.median / 1000).toFixed(2)}s (${fcpStats.median.toFixed(1)} ms)`);
  console.log(`  Worst:  ${(fcpStats.worst / 1000).toFixed(2)}s (${fcpStats.worst.toFixed(1)} ms)`);

  console.log('\n--- TBT (Total Blocking Time) ---');
  console.log(`  Best:   ${tbtStats.best.toFixed(1)} ms`);
  console.log(`  Median: ${tbtStats.median.toFixed(1)} ms`);
  console.log(`  Worst:  ${tbtStats.worst.toFixed(1)} ms`);

  console.log('\n--- CLS (Cumulative Layout Shift) ---');
  console.log(`  Median: ${clsStats.median.toFixed(6)}`);

  const scoresSorted = [...results].map(r => r.score).sort((a, b) => a - b);
  console.log('\n--- PERFORMANCE SCORE ---');
  console.log(`  Best:   ${scoresSorted[scoresSorted.length - 1].toFixed(1)} / 100`);
  console.log(`  Median: ${scoresSorted[Math.floor(scoresSorted.length / 2)].toFixed(1)} / 100`);
  console.log(`  Worst:  ${scoresSorted[0].toFixed(1)} / 100`);

  console.log('\nLCP Element:');
  console.log(`  Node: ${results[0].lcpNode}`);
  console.log(`  Snippet: ${results[0].lcpSnippet}`);
}

runMultiTest().catch(err => {
  console.error(err);
  process.exit(1);
});
