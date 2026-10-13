import fs from 'fs';
import path from 'path';

export function getCriticalCss(rootDir) {
  const fontsCssPath = path.resolve(rootDir, 'public', 'fonts', 'fonts.css');
  const fontsCss = fs.existsSync(fontsCssPath) ? fs.readFileSync(fontsCssPath, 'utf8') : '';

  return `
/* --- SỔ CHI CRITICAL RENDERING PATH CSS --- */
${fontsCss}

/* The full stylesheet must override this first-paint fallback, including
   responsive utilities such as hidden + md:block. */
@layer critical, properties, theme, base, components, utilities;
@layer critical {
:root {
  --font-display: 'Noto Serif Display', 'Times New Roman', serif;
  --font-sans: 'Be Vietnam Pro', system-ui, sans-serif;
  --color-ink: #0c0a09;
  --color-lacquer: #17120f;
  --color-paper: #f2ecdf;
  --color-washi: #e8e0cf;
  --color-vermilion: #d23a22;
  --color-gold: #b8935a;
  --ease-cine: cubic-bezier(0.22, 0.8, 0.2, 1);
  --dur-micro: 200ms;
  --dur-ui: 350ms;
  --dur-product: 900ms;
  --dur-cine: 1600ms;
}

html {
  background: var(--color-ink);
  color: var(--color-paper);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  max-width: 100vw;
  overflow-x: clip;
}
body {
  margin: 0;
  padding: 0;
  background: var(--color-ink);
  color: var(--color-paper);
  font-family: var(--font-sans);
  overflow-x: clip;
}
*, ::before, ::after {
  box-sizing: border-box;
}

.font-display { font-family: var(--font-display); }
.font-sans { font-family: var(--font-sans); }
.font-light { font-weight: 300; }
.font-normal { font-weight: 400; }
.font-medium { font-weight: 500; }
.font-semibold { font-weight: 600; }
.italic { font-style: italic; }
.text-vermilion { color: var(--color-vermilion); }
.text-paper { color: var(--color-paper); }
.text-paper\\/75 { color: rgba(242, 236, 223, 0.75); }
.text-paper\\/80 { color: rgba(242, 236, 223, 0.80); }
.text-white { color: #fff; }
.bg-ink { background-color: var(--color-ink); }
.bg-vermilion { background-color: var(--color-vermilion); }

.relative { position: relative; }
.absolute { position: absolute; }
.fixed { position: fixed; }
.isolate { isolation: isolate; }
.inset-0 { inset: 0; }
.inset-x-0 { left: 0; right: 0; }
.top-0 { top: 0; }
.z-50 { z-index: 50; }
.-z-10 { z-index: -10; }
.flex { display: flex; }
.grid { display: grid; }
.block { display: block; }
.inline-block { display: inline-block; }
.hidden { display: none; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.justify-center { justify-content: center; }
.flex-wrap { flex-wrap: wrap; }
.flex-col { flex-direction: column; }
.min-h-svh { min-height: 100svh; }
.min-h-14 { min-height: 3.5rem; }
.overflow-hidden { overflow: hidden; }
.mx-auto { margin-left: auto; margin-right: auto; }
.w-full { width: 100%; }
.max-w-\\[1500px\\] { max-width: 1500px; }
.max-w-md { max-width: 28rem; }
.gap-3 { gap: 0.75rem; }
.gap-4 { gap: 1rem; }
.gap-10 { gap: 2.5rem; }
.px-5 { padding-left: 1.25rem; padding-right: 1.25rem; }
.px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
.px-8 { padding-left: 2rem; padding-right: 2rem; }
.px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
.py-5 { padding-top: 1.25rem; padding-bottom: 1.25rem; }
.pt-28 { padding-top: 7rem; }
.pb-28 { padding-bottom: 7rem; }
.pb-1 { padding-bottom: 0.25rem; }
.pb-2 { padding-bottom: 0.5rem; }
.mt-7 { margin-top: 1.75rem; }
.mt-8 { margin-top: 2rem; }
.mt-10 { margin-top: 2.5rem; }
.mt-4 { margin-top: 1rem; }
.order-1 { order: 1; }
.order-2 { order: 2; }
.rounded-full { border-radius: 9999px; }
.mix-blend-difference { mix-blend-mode: difference; }
.text-lg { font-size: 1.125rem; }
.text-xl { font-size: 1.25rem; }
.leading-relaxed { line-height: 1.625; }

@media (min-width: 768px) {
  .md\\:grid-cols-\\[1\\.05fr_1fr\\] { grid-template-columns: 1.05fr 1fr; }
  .md\\:px-10 { padding-left: 2.5rem; padding-right: 2.5rem; }
  .md\\:pb-16 { padding-bottom: 4rem; }
  .md\\:order-1 { order: 1; }
  .md\\:order-2 { order: 2; }
  .md\\:mt-0 { margin-top: 0; }
  .md\\:flex { display: flex; }
}
@media (min-width: 1024px) {
  .lg\\:flex { display: flex; }
  .lg\\:hidden { display: none; }
}

.site-header { transition: background var(--dur-ui) var(--ease-cine), border-color var(--dur-ui) ease; }
.brand-mark { width: 1.5rem; height: 1.5rem; display: inline-flex; align-items: center; justify-content: center; border-radius: 0.35rem; background: var(--color-vermilion); color: var(--color-paper); font-size: 0.85rem; font-weight: 700; }
.hero-stage { position: relative; display: flex; align-items: center; justify-content: center; }
.hero-sun { position: absolute; width: min(78vw, 520px); height: min(78vw, 520px); border-radius: 9999px; background: radial-gradient(circle at 40% 35%, #e04a2c, #8f2312 70%); opacity: 0.9; box-shadow: 0 0 140px 20px rgba(210,58,34,0.25); }
.hero-phone { position: relative; z-index: 10; }
.phone { position: relative; width: min(84vw, 320px); aspect-ratio: 9/19.5; border-radius: 44px; background: #17120f; box-shadow: 0 25px 60px -15px rgba(0,0,0,0.7), inset 0 0 0 2px rgba(242,236,223,0.12); padding: 10px; }
.phone-screen { position: relative; width: 100%; height: 100%; border-radius: 36px; overflow: hidden; background: #0c0a09; }
}
`;
}
