import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

import { getCriticalCss } from './build-critical.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

async function prerender() {
  console.log('\n--- SỔ CHI PRERENDER (SSG) BUILD PIPELINE ---');

  // 1. Validate Canonical Production Origin
  let envSiteUrl = process.env.VITE_SITE_URL?.trim();

  if (!envSiteUrl) {
    const envProdPath = path.resolve(rootDir, '.env.production');
    if (fs.existsSync(envProdPath)) {
      const content = fs.readFileSync(envProdPath, 'utf8');
      const match = content.match(/^VITE_SITE_URL=(.+)$/m);
      if (match) envSiteUrl = match[1].trim();
    }
  }

  if (!envSiteUrl) {
    throw new Error(
      '[SEO BUILD ERROR] Missing required production canonical origin!\n' +
      'VITE_SITE_URL must be explicitly configured in environment variables or in .env.production for production builds.\n' +
      'Silently falling back to an unverified origin or allowing localhost/preview domains is strictly prohibited.'
    );
  }

  const siteUrl = envSiteUrl.replace(/\/$/, '');
  if (!siteUrl.startsWith('https://') || siteUrl.includes('localhost') || siteUrl.includes('127.0.0.1')) {
    throw new Error(`[SEO BUILD ERROR] Invalid production origin: "${siteUrl}". Production canonical URLs must use HTTPS and cannot be localhost.`);
  }

  console.log(`[SEO INFO] Validated production canonical origin: ${siteUrl}`);

  // 2. Build SSR Bundle
  console.log('[SSG 1/5] Building SSR bundle with Vite...');
  execSync('npx vite build --ssr src/entry-server.tsx --outDir dist-ssr', {
    cwd: rootDir,
    stdio: 'inherit',
  });

  // 3. Load SSR Entry and Base HTML
  console.log('[SSG 2/5] Loading SSR renderer and dist/index.html template...');
  const ssrPath = path.resolve(rootDir, 'dist-ssr', 'entry-server.js');
  const { render, ROUTE_PATHS } = await import(`file://${ssrPath.replace(/\\/g, '/')}`);

  const templatePath = path.resolve(rootDir, 'dist', 'index.html');
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Base template not found at ${templatePath}. Run "vite build" first.`);
  }
  const baseTemplate = fs.readFileSync(templatePath, 'utf8');
  const criticalCss = getCriticalCss(rootDir);

  // Collect all target routes
  const routesToPrerender = Array.from(new Set([...ROUTE_PATHS, '/404']));
  console.log(`[SSG 3/5] Prerendering ${routesToPrerender.length} routes...`);

  for (const route of routesToPrerender) {
    const is404 = route === '/404';
    const { appHtml, meta, canonicalUrl, structuredData, isNotFound } = render(route, siteUrl);

    let html = baseTemplate;

    // Transform CSS Link: inline minimal critical CSS and defer non-blocking full stylesheet
    const cssMatch = html.match(/<link\s+rel="stylesheet"\s+crossorigin\s+href="([^"]+)"\s*\/?>/i)
      || html.match(/<link\s+rel="stylesheet"\s+href="([^"]+)"\s*\/?>/i);
    if (cssMatch) {
      const cssHref = cssMatch[1];
      const nonBlockingCss = `  <style id="critical-css">\n${criticalCss}\n  </style>\n` +
        `  <link rel="preload" href="${cssHref}" as="style" onload="this.onload=null;this.rel='stylesheet'" />\n` +
        `  <noscript><link rel="stylesheet" href="${cssHref}" /></noscript>\n`;
      html = html.replace(cssMatch[0], nonBlockingCss);
    }

    // Relocate client script to bottom of <body> so it doesn't compete with head critical path
    const scriptMatch = html.match(/<script\s+type="module"\s+crossorigin\s+src="([^"]+)"\s*><\/script>/i);
    if (scriptMatch) {
      const headIdx = html.indexOf('</head>');
      const scriptIdx = html.indexOf(scriptMatch[0]);
      if (scriptIdx !== -1 && scriptIdx < headIdx) {
        html = html.replace(scriptMatch[0], '');
        html = html.replace('</body>', `  ${scriptMatch[0]}\n</body>`);
      }
    }

    // Replace Title
    html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(meta.title)}</title>`);

    // Replace Meta Description
    html = html.replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/gi, '');
    html = html.replace(/<\/head>/, `  <meta name="description" content="${escapeHtml(meta.description)}" />\n  </head>`);

    // Replace Canonical
    html = html.replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/gi, '');
    if (!is404) {
      html = html.replace(/<\/head>/, `  <link rel="canonical" href="${escapeHtml(canonicalUrl)}" />\n  </head>`);
    }

    // Replace Open Graph Meta
    html = html.replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/gi, '');
    html = html.replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/gi, '');
    html = html.replace(/<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/gi, '');
    html = html.replace(/<meta\s+property="og:type"\s+content="[^"]*"\s*\/?>/gi, '');

    const ogType = route.startsWith('/blog/') && route !== '/blog' ? 'article' : 'website';
    const ogTags = `  <meta property="og:title" content="${escapeHtml(meta.title)}" />
  <meta property="og:description" content="${escapeHtml(meta.description)}" />
  <meta property="og:url" content="${escapeHtml(canonicalUrl)}" />
  <meta property="og:type" content="${ogType}" />\n`;
    html = html.replace(/<\/head>/, `${ogTags}  </head>`);

    // Replace Twitter Meta
    html = html.replace(/<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/gi, '');
    html = html.replace(/<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/gi, '');
    const twitterTags = `  <meta name="twitter:title" content="${escapeHtml(meta.title)}" />
  <meta name="twitter:description" content="${escapeHtml(meta.description)}" />\n`;
    html = html.replace(/<\/head>/, `${twitterTags}  </head>`);

    // Inject Structured Data (JSON-LD)
    if (structuredData) {
      const jsonLdScript = `  <script type="application/ld+json" data-seo-json="true">\n${JSON.stringify(structuredData, null, 2)}\n  </script>\n`;
      html = html.replace(/<\/head>/, `${jsonLdScript}  </head>`);
    }

    // Handle 404 Noindex
    if (is404) {
      html = html.replace(/<\/head>/, `  <meta name="robots" content="noindex, follow" />\n  </head>`);
    }

    // Inject Root Application HTML
    html = html.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);

    // Determine Destination Path
    let destPath;
    if (route === '/') {
      destPath = path.resolve(rootDir, 'dist', 'index.html');
    } else if (is404) {
      destPath = path.resolve(rootDir, 'dist', '404.html');
    } else {
      const routeDir = path.resolve(rootDir, 'dist', route.replace(/^\//, ''));
      if (!fs.existsSync(routeDir)) {
        fs.mkdirSync(routeDir, { recursive: true });
      }
      destPath = path.resolve(routeDir, 'index.html');
    }

    fs.writeFileSync(destPath, html, 'utf8');
    console.log(`  ✓ Prerendered: ${route.padEnd(45)} -> ${path.relative(rootDir, destPath)} (${Math.round(html.length / 1024)} KB)`);
  }

  // 4. Generate Production Hosting Configs for Real HTTP 404
  console.log('[SSG 4/5] Generating hosting configuration for production HTTP 404 handling...');

  // Netlify _redirects: Known routes serve their HTML; fallback to 404 with 404 status code
  const netlifyRedirects = `# Known public static routes
${routesToPrerender.filter(r => r !== '/' && r !== '/404').map(r => `${r}  ${r}/index.html  200`).join('\n')}

# Explicit 404 Not Found response for any unknown path
/*  /404.html  404
`;
  fs.writeFileSync(path.resolve(rootDir, 'dist', '_redirects'), netlifyRedirects, 'utf8');

  // Cloudflare Pages / Static Hosting headers
  const cloudflareHeaders = `/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN
  Referrer-Policy: strict-origin-when-cross-origin

/404.html
  Cache-Control: no-cache, no-store, must-revalidate
`;
  fs.writeFileSync(path.resolve(rootDir, 'dist', '_headers'), cloudflareHeaders, 'utf8');

  // Vercel config
  const vercelConfig = {
    version: 2,
    routes: [
      ...routesToPrerender.filter(r => r !== '/' && r !== '/404').map(r => ({
        src: `^${r}$`,
        dest: `${r}/index.html`,
      })),
      {
        src: "/(.*)",
        dest: "/404.html",
        status: 404,
      },
    ],
  };
  fs.writeFileSync(path.resolve(rootDir, 'dist', 'vercel.json'), JSON.stringify(vercelConfig, null, 2), 'utf8');

  // 5. Cleanup Temporary SSR Directory
  console.log('[SSG 5/5] Cleaning up temporary build artifacts...');
  const distSsrDir = path.resolve(rootDir, 'dist-ssr');
  if (fs.existsSync(distSsrDir)) {
    fs.rmSync(distSsrDir, { recursive: true, force: true });
  }

  console.log('✓ Prerendering complete! All SEO routes generated with static HTML.\n');
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

prerender().catch(err => {
  console.error('\x1b[31m%s\x1b[0m', 'Prerender failed:', err);
  process.exit(1);
});
