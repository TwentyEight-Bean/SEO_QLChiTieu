import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

async function prerender() {
  console.log('\n--- SỔ CHI PRERENDER (SSG) BUILD PIPELINE ---');

  // 1. Validate Canonical Production Origin
  const envSiteUrl = process.env.VITE_SITE_URL?.trim();
  let siteUrl = envSiteUrl || 'https://sochi.app';

  if (!envSiteUrl) {
    console.warn('\x1b[33m%s\x1b[0m', '[SEO WARNING] VITE_SITE_URL environment variable is not defined for production build.');
    console.warn('\x1b[33m%s\x1b[0m', `[SEO WARNING] Falling back to default production canonical origin: ${siteUrl}`);
  } else {
    console.log(`[SEO INFO] Using configured VITE_SITE_URL: ${siteUrl}`);
  }

  if (!siteUrl.startsWith('https://') || siteUrl.includes('localhost') || siteUrl.includes('127.0.0.1')) {
    throw new Error(`[SEO ERROR] Refusing to build production canonical URLs with non-HTTPS or localhost origin: "${siteUrl}"`);
  }

  // Ensure origin has no trailing slash
  siteUrl = siteUrl.replace(/\/$/, '');

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

  // Collect all target routes
  const routesToPrerender = Array.from(new Set([...ROUTE_PATHS, '/404']));
  console.log(`[SSG 3/5] Prerendering ${routesToPrerender.length} routes...`);

  for (const route of routesToPrerender) {
    const is404 = route === '/404';
    const { appHtml, meta, canonicalUrl, structuredData, isNotFound } = render(route, siteUrl);

    let html = baseTemplate;

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
