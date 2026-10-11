import { useEffect, useRef, useState, type CSSProperties } from "react";
import Phone from "./Phone";
import { APP, CATEGORIES, FEATURES, MONTHS, STORES, TREND } from "./config";
import ContentPage, { ALL_PAGES } from "./pages";
import { Link, usePath } from "./router";
import { storeUrl, track, useCountUp, useInView, useScrollProgress } from "./lib";

const d = (s: number): CSSProperties => ({ animationDelay: `${s}s` });
const [F1, F2, F3] = FEATURES;

/* ---------- shared ---------- */
function Eyebrow({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.28em] opacity-70">
      <span className="font-display text-base normal-case tracking-normal text-vermilion">{n}</span>
      <span className="h-px w-8 bg-current opacity-50" />
      {children}
    </p>
  );
}

function DownloadButtons({ source, event }: { source: string; event: "final_cta_click" | "store_click" }) {
  const links = [
    { kind: "appStore" as const, label: "App Store", sub: "Tải trên" },
    { kind: "googlePlay" as const, label: "Google Play", sub: "Tải trên" },
  ].filter((l) => STORES[l.kind]);

  if (!links.length) {
    return (
      <p className="max-w-sm border-l-2 border-vermilion pl-4 text-sm leading-relaxed opacity-80">
        Liên kết App Store và Google Play chính thức sẽ xuất hiện tại đây ngay khi ứng dụng được phát hành.
      </p>
    );
  }
  return (
    <div className="flex flex-wrap gap-3">
      {links.map((l) => (
        <a
          key={l.kind}
          href={storeUrl(l.kind, source)}
          rel="noopener"
          onClick={() => track(event, { store: l.kind, source })}
          className="group flex min-h-14 items-center gap-3 rounded-full border border-current/30 px-7 py-3 transition-colors duration-200 hover:border-vermilion hover:bg-vermilion hover:text-paper"
        >
          <span className="text-[10px] uppercase tracking-widest opacity-70">{l.sub}</span>
          <span className="font-display text-lg">{l.label}</span>
        </a>
      ))}
    </div>
  );
}

/* ---------- nav ---------- */
const SCENES = [
  ["top", "Khởi đầu"],
  ["trai-nghiem", "Giao diện"],
  ["tinh-nang", "Tính năng"],
  ["du-lieu", "Số liệu"],
  ["demo", "Trải nghiệm"],
  ["tai-ung-dung", "Bắt đầu"],
] as const;

function Nav({ showJourney }: { showJourney: boolean }) {
  const [activeScene, setActiveScene] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const progress = useRef<HTMLSpanElement>(null);
  const links = [
    ["/#trai-nghiem", "Trải nghiệm"],
    ["/tinh-nang", "Tính năng"],
    ["/#du-lieu", "Số liệu"],
  ];

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.current?.style.setProperty("transform", `scaleX(${max > 0 ? y / max : 0})`);
      setScrolled(y > 32);
      if (!showJourney) return;
      const marker = window.innerHeight * 0.45;
      const next = SCENES.findIndex(([id]) => {
        const bounds = document.getElementById(id)?.getBoundingClientRect();
        return bounds && bounds.top <= marker && bounds.bottom > marker;
      });
      if (next >= 0) setActiveScene(next);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [showJourney]);

  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", close);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", close);
    };
  }, [menuOpen]);

  return (
    <>
      <header className={`site-header fixed inset-x-0 top-0 z-50 mix-blend-difference text-white ${scrolled ? "is-scrolled" : ""}`}>
        <nav aria-label="Điều hướng chính" className="nav-inner mx-auto flex max-w-[1500px] items-center justify-between px-5 py-5 md:px-10">
          <Link href="/" className="flex items-center gap-3 font-display text-xl">
            <span className="brand-mark size-4 rounded-full bg-white" aria-hidden />
            {APP.name}
          </Link>
          <ul className="hidden items-center gap-9 text-sm md:flex">
            {links.map(([h, t]) => (
              <li key={h}>
                <Link href={h} className="opacity-80 transition-opacity duration-200 hover:opacity-100">{t}</Link>
              </li>
            ))}
          </ul>
          <a
            href="/#tai-ung-dung"
            onClick={() => track("hero_download_click", { source: "nav" })}
            className="hidden rounded-full border border-white/70 px-5 py-2 text-sm transition-colors duration-200 hover:bg-white hover:text-black md:block"
          >
            Tải ứng dụng
          </a>
          <button
            type="button"
            aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
            className={`menu-toggle md:hidden ${menuOpen ? "is-open" : ""}`}
          >
            <span /><span />
          </button>
        </nav>
        <span className="scroll-progress" aria-hidden><span ref={progress} /></span>
      </header>
      <div id="mobile-menu" className={`mobile-menu md:hidden ${menuOpen ? "is-open" : ""}`} aria-hidden={!menuOpen}>
        <div className="mobile-menu-orbit" aria-hidden />
        <nav aria-label="Điều hướng di động" className="mobile-menu-inner">
          <p><span>目次</span> Mục lục</p>
          <ol>
            {[
              ["/#trai-nghiem", "Trải nghiệm"],
              ["/tinh-nang", "Tính năng"],
              ["/#du-lieu", "Số liệu"],
              ["/gioi-thieu", "Giới thiệu"],
              ["/cau-hoi-thuong-gap", "Câu hỏi thường gặp"],
            ].map(([href, label], index) => (
              <li key={href}>
                <Link href={href} onClick={() => setMenuOpen(false)}>
                  <span>0{index + 1}</span>
                  {label}
                  <i aria-hidden>↗</i>
                </Link>
              </li>
            ))}
          </ol>
          <Link
            href="/#tai-ung-dung"
            onClick={() => {
              setMenuOpen(false);
              track("hero_download_click", { source: "mobile_menu" });
            }}
            className="mobile-menu-cta"
          >
            Tải ứng dụng <span aria-hidden>→</span>
          </Link>
        </nav>
      </div>
      {showJourney && (
        <nav className="scene-rail" aria-label="Các phân cảnh">
          <span className="scene-rail-line" aria-hidden />
          {SCENES.map(([id, label], index) => (
            <a
              key={id}
              href={`#${id}`}
              aria-label={`Phân cảnh ${index + 1}: ${label}`}
              aria-current={activeScene === index ? "step" : undefined}
              className={activeScene === index ? "is-active" : ""}
            >
              <span className="scene-label">{label}</span>
              <span className="scene-dot" aria-hidden />
              <span className="scene-number">0{index + 1}</span>
            </a>
          ))}
        </nav>
      )}
      {!menuOpen && (
        <a
          href="/#tai-ung-dung"
          onClick={() => track("hero_download_click", { source: "sticky_mobile" })}
          className="fixed inset-x-4 bottom-4 z-50 flex min-h-12 items-center justify-center rounded-full bg-vermilion text-sm font-medium text-paper shadow-xl md:hidden"
        >
          Tải ứng dụng
        </a>
      )}
    </>
  );
}

/* ---------- SCENE 01 ---------- */
function Hero() {
  return (
    <section id="top" data-scene aria-labelledby="h1" className="relative isolate flex min-h-svh items-center overflow-hidden bg-ink">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_70%_45%,#2a211c_0%,#0c0a09_62%)]" />
      <div className="mx-auto grid w-full max-w-[1500px] items-center gap-10 px-6 pb-28 pt-28 md:grid-cols-[1.05fr_1fr] md:px-10 md:pb-16">
        <div className="order-2 md:order-1">
          <div className="hero-fade" style={d(1.6)}>
            <Eyebrow n="一">Ứng dụng quản lý chi tiêu</Eyebrow>
          </div>
          <h1 id="h1" className="mt-8 font-display text-[clamp(2.6rem,6.6vw,6.2rem)] font-light leading-[1.04] tracking-[-0.01em]">
            <span className="mask block overflow-hidden pb-1"><span style={d(1.7)}>Chi tiêu rõ ràng.</span></span>
            <span className="mask block overflow-hidden pb-2"><span style={d(1.95)} className="italic text-vermilion">Cuộc sống chủ động.</span></span>
          </h1>
          <p className="hero-fade mt-7 max-w-md text-lg font-light leading-relaxed text-paper/75" style={d(2.4)}>
            Mọi khoản thu chi, trong một trải nghiệm đơn giản.
          </p>
          <div className="hero-fade mt-10 flex flex-wrap items-center gap-4" style={d(2.7)}>
            <a
              href="#tai-ung-dung"
              onClick={() => track("hero_download_click", { source: "hero" })}
              className="flex min-h-14 items-center rounded-full bg-vermilion px-8 font-medium text-paper transition-transform duration-200 hover:scale-[1.03]"
            >
              Tải ứng dụng
            </a>
            <a href="#trai-nghiem" className="flex min-h-14 items-center gap-2 px-3 text-paper/80 transition-colors duration-200 hover:text-paper">
              Khám phá trải nghiệm <span aria-hidden>↓</span>
            </a>
          </div>
        </div>

        <div className="order-1 flex justify-center md:order-2" style={{ perspective: "1400px" }}>
          <div className="hero-stage relative flex items-center justify-center">
            <div
              aria-hidden
              className="hero-sun absolute size-[min(78vw,520px)] rounded-full bg-[radial-gradient(circle_at_40%_35%,#e04a2c,#8f2312_70%)] opacity-90 blur-[0.5px]"
              style={{ boxShadow: "0 0 140px 20px rgba(210,58,34,0.25)" }}
            />
            <div aria-hidden className="absolute size-[min(92vw,620px)] rounded-full border border-paper/10" />
            <Phone
              className="hero-phone"
              src={F1.shot}
              screen={F1.id}
              alt={`Màn hình chính của ứng dụng ${APP.name}`}
              w="clamp(170px, 24vw, 310px)"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- SCENE 02 ---------- */
function Interface() {
  const ref = useRef<HTMLElement>(null);
  useScrollProgress(ref);
  return (
    <section id="trai-nghiem" data-scene ref={ref} aria-labelledby="h-s2" className="scroll-scene s2 h-[260svh]" style={{ "--p": 0 } as CSSProperties}>
      <div className="stage">
        <div className="s2-head absolute left-6 top-[13svh] z-10 max-w-md md:left-[7vw] md:top-[22svh]">
          <Eyebrow n="二">Giao diện</Eyebrow>
          <h2 id="h-s2" className="mt-6 font-display text-[clamp(2rem,4.4vw,4.2rem)] font-light leading-[1.08]">
            Chỉ cần mở app.<br />
            <em className="text-vermilion">Mọi thứ trở nên rõ ràng.</em>
          </h2>
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="s2-phone relative">
            <Phone src={F1.shot} screen={F1.id} alt={`Màn hình tổng quan của ứng dụng ${APP.name}`} w="clamp(190px, 28vw, 330px)" />
            <div aria-hidden className="s2-ring pointer-events-none absolute left-[8%] right-[8%] top-[17%] z-10 h-[16%] rounded-2xl border-2 border-vermilion" />
          </div>
        </div>

        <div className="s2-notes absolute inset-x-6 bottom-24 z-10 grid gap-4 md:inset-x-auto md:bottom-auto md:right-[6vw] md:top-1/2 md:max-w-xs md:-translate-y-1/2">
          {[
            ["Tổng quan", "Số dư và các khoản gần đây ngay màn hình đầu tiên."],
            ["Ghi nhanh", "Thêm một khoản thu hoặc chi chỉ trong vài chạm."],
          ].map(([t, s]) => (
            <div key={t} className="border-l-2 border-vermilion pl-4">
              <h3 className="font-display text-xl">{t}</h3>
              <p className="mt-1 text-sm leading-relaxed opacity-75">{s}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- SCENE 03 ---------- */
function FeatureShowcase() {
  const ref = useRef<HTMLElement>(null);
  useScrollProgress(ref);
  const w = "clamp(170px, 20vw, 290px)";
  const items: [(typeof FEATURES)[number], string][] = [[F2, "s3-l"], [F1, "s3-c"], [F3, "s3-r"]];
  return (
    <section id="tinh-nang" data-scene ref={ref} aria-labelledby="h-s3" className="scroll-scene s3 washi bg-paper text-ink md:h-[240svh]" style={{ "--p": 0 } as CSSProperties}>
      {/* desktop / tablet: spreading devices */}
      <div className="stage hidden md:block">
        <div className="absolute inset-x-0 top-[11svh] z-10 text-center">
          <div className="flex justify-center"><Eyebrow n="三">Tính năng</Eyebrow></div>
          <h2 id="h-s3" className="mt-5 font-display text-[clamp(2rem,3.6vw,3.4rem)] font-light">
            Một ứng dụng. <em className="text-vermilion">Nhiều khả năng.</em>
          </h2>
        </div>
        {items.map(([f, cls]) => (
          <figure key={f.id} className={`s3-dev ${cls}`}>
            <Phone src={f.shot} screen={f.id} alt={`${f.title} trong ứng dụng ${APP.name}`} w={w} />
            <figcaption className="s3-label absolute left-1/2 top-full mt-6 w-64 -translate-x-1/2 text-center" style={cls === "s3-c" ? { opacity: 1 } : undefined}>
              <span className="font-display text-xl">{f.title}</span>
              <span className="mt-1 block text-sm leading-relaxed text-ink/65">{f.desc}</span>
            </figcaption>
          </figure>
        ))}
      </div>

      {/* mobile: one device at a time, swipeable */}
      <div className="py-24 md:hidden">
        <div className="px-6">
          <Eyebrow n="三">Tính năng</Eyebrow>
          <h2 className="mt-5 font-display text-4xl font-light leading-tight">
            Một ứng dụng. <em className="text-vermilion">Nhiều khả năng.</em>
          </h2>
        </div>
        <ul className="snap-x-hide mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto px-[18vw]">
          {FEATURES.map((f) => (
            <li key={f.id} className="shrink-0 snap-center text-center" style={{ width: "64vw" }}>
              <div className="flex justify-center"><Phone src={f.shot} screen={f.id} alt={`${f.title} trong ứng dụng ${APP.name}`} w="56vw" /></div>
              <h3 className="mt-6 font-display text-xl">{f.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink/65">{f.desc}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-center text-xs uppercase tracking-widest text-ink/45">Vuốt để xem thêm</p>
      </div>
    </section>
  );
}

/* ---------- SCENE 04 ---------- */
function DataInMotion() {
  const [ref, seen] = useInView<HTMLElement>(0.3);
  const [active, setActive] = useState<number | null>(null);
  const total = useCountUp(12480000, seen);
  const R = 90;
  const C = 2 * Math.PI * R;
  let acc = 0;
  const max = Math.max(...TREND);
  const pts = TREND.map((v, i) => [30 + i * 80, 190 - (v / max) * 150] as const);
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x},${y}`).join(" ");

  return (
    <section id="du-lieu" data-scene ref={ref} aria-labelledby="h-s4" className={`${seen ? "in" : ""} relative bg-washi px-6 py-28 text-ink md:px-10 md:py-40`}>
      <div className="mx-auto max-w-[1300px]">
        <Eyebrow n="四">Số liệu</Eyebrow>
        <h2 id="h-s4" className="mt-6 max-w-2xl font-display text-[clamp(2.2rem,5vw,4.6rem)] font-light leading-[1.06]">
          Những con số.<br /><em className="text-vermilion">Giờ đây dễ hiểu hơn.</em>
        </h2>

        <div className="mt-16 grid gap-14 md:mt-24 md:grid-cols-2 md:gap-20">
          <figure>
            <div className="flex items-center gap-8">
              <svg viewBox="0 0 240 240" role="img" aria-label="Biểu đồ tròn minh họa cơ cấu chi tiêu theo nhóm" className="w-[min(52vw,260px)] shrink-0 -rotate-90">
                {CATEGORIES.map((c, i) => {
                  const len = (c.pct / 100) * C;
                  const off = -acc * C / 100;
                  acc += c.pct;
                  return (
                    <circle
                      key={c.name}
                      cx="120" cy="120" r={R} fill="none" stroke={c.color} strokeWidth={active === i ? 34 : 26}
                      strokeDasharray={`${seen ? len - 2 : 0} ${C}`} strokeDashoffset={off}
                      opacity={active === null || active === i ? 1 : 0.25}
                      className="seg" style={{ transitionDelay: `${i * 120}ms` }}
                    />
                  );
                })}
              </svg>
              <ul className="space-y-1 text-sm">
                {CATEGORIES.map((c, i) => (
                  <li key={c.name}>
                    <button
                      onMouseEnter={() => setActive(i)} onMouseLeave={() => setActive(null)}
                      onFocus={() => setActive(i)} onBlur={() => setActive(null)}
                      onClick={() => { setActive(i); track("product_demo_interaction", { chart: "category", item: c.name }); }}
                      className="flex min-h-10 items-center gap-3 text-left transition-opacity duration-200"
                      style={{ opacity: active === null || active === i ? 1 : 0.45 }}
                    >
                      <span className="size-3 rounded-full" style={{ background: c.color }} />
                      <span className="w-20">{c.name}</span>
                      <span className="font-display text-lg tabular-nums">{c.pct}%</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <figcaption className="mt-6 text-xs text-ink/55">Cơ cấu chi tiêu theo nhóm. Dữ liệu minh họa.</figcaption>
          </figure>

          <figure>
            <p className="text-xs uppercase tracking-[0.25em] text-ink/55">Tổng chi trong kỳ</p>
            <p className="mt-2 font-display text-[clamp(2.4rem,5vw,4.4rem)] font-light tabular-nums">
              {total.toLocaleString("vi-VN")} <span className="text-vermilion">₫</span>
            </p>
            <svg viewBox="0 0 580 220" role="img" aria-label="Biểu đồ xu hướng chi tiêu minh họa theo bảy tháng" className="mt-6 w-full overflow-visible">
              {TREND.map((v, i) => (
                <rect key={i} className="bar" style={{ "--i": i } as CSSProperties} x={pts[i][0] - 18} y={190 - (v / max) * 150} width="36" height={(v / max) * 150} fill="#17120f" opacity="0.08" />
              ))}
              <path d={line} fill="none" stroke="#d23a22" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="draw" style={{ "--len": 700 } as CSSProperties} pathLength={700} />
              {pts.map(([x, y], i) => (
                <g key={i}>
                  <circle cx={x} cy={y} r="4.5" fill="#f2ecdf" stroke="#d23a22" strokeWidth="2" opacity={seen ? 1 : 0} style={{ transition: `opacity 400ms ${900 + i * 120}ms` }} />
                  <text x={x} y="212" textAnchor="middle" fontSize="12" fill="#17120f" opacity="0.55">{MONTHS[i]}</text>
                </g>
              ))}
            </svg>
            <figcaption className="mt-4 text-xs text-ink/55">Xu hướng chi tiêu theo tháng. Dữ liệu minh họa.</figcaption>
          </figure>
        </div>

        <table className="sr-only">
          <caption>Bảng dữ liệu minh họa tương ứng với biểu đồ</caption>
          <tbody>
            {CATEGORIES.map((c) => <tr key={c.name}><th>{c.name}</th><td>{c.pct}%</td></tr>)}
            {TREND.map((v, i) => <tr key={i}><th>{MONTHS[i]}</th><td>{v}</td></tr>)}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* ---------- SCENE 05 ---------- */
function Experience() {
  const [i, setI] = useState(0);
  const f = FEATURES[i];
  return (
    <section id="demo" data-scene aria-labelledby="h-s5" className="washi relative bg-paper px-6 py-28 text-ink md:px-10 md:py-40">
      <div className="mx-auto grid max-w-[1300px] items-center gap-16 md:grid-cols-[1fr_auto_1fr]">
        <div>
          <Eyebrow n="五">Trải nghiệm sản phẩm</Eyebrow>
          <h2 id="h-s5" className="mt-6 font-display text-[clamp(2rem,4vw,3.8rem)] font-light leading-[1.08]">
            Chọn một tính năng.<br /><em className="text-vermilion">Xem ngay trên màn hình.</em>
          </h2>
          <div role="tablist" aria-label="Tính năng ứng dụng" className="mt-12 border-t border-ink/15">
            {FEATURES.map((x, k) => (
              <button
                key={x.id}
                role="tab"
                aria-selected={k === i}
                onClick={() => { setI(k); track("product_demo_interaction", { feature: x.id }); track("feature_view", { feature: x.id }); }}
                className="group flex min-h-16 w-full items-center gap-5 border-b border-ink/15 py-4 text-left transition-colors duration-200"
              >
                <span className={`font-display text-sm tabular-nums transition-colors ${k === i ? "text-vermilion" : "text-ink/40"}`}>0{k + 1}</span>
                <span className={`font-display text-2xl transition-opacity duration-200 ${k === i ? "opacity-100" : "opacity-45 group-hover:opacity-80"}`}>{x.title}</span>
                <span aria-hidden className={`ml-auto h-px bg-vermilion transition-all duration-500 ${k === i ? "w-10" : "w-0"}`} />
              </button>
            ))}
          </div>
          <p key={f.id} role="tabpanel" className="hero-fade mt-6 max-w-md leading-relaxed text-ink/70" style={{ animationDuration: "500ms" }}>{f.desc}</p>
        </div>

        <div className="relative order-first flex justify-center md:order-none">
          <div aria-hidden className="absolute top-1/2 size-[min(70vw,440px)] -translate-y-1/2 rounded-full bg-vermilion/90" />
          <div key={f.id} className="hero-fade relative" style={{ animationDuration: "600ms" }}>
            <Phone src={f.shot} screen={f.id} alt={`${f.title} trong ứng dụng ${APP.name}`} w="clamp(200px, 26vw, 300px)" />
          </div>
        </div>

        <div className="hidden md:block" />
      </div>
    </section>
  );
}

/* ---------- SCENE 06 ---------- */
function FinalReveal() {
  const ref = useRef<HTMLElement>(null);
  useScrollProgress(ref);
  const w = "clamp(170px, 20vw, 280px)";
  return (
    <section id="tai-ung-dung" data-scene ref={ref} aria-labelledby="h-s6" className="scroll-scene s6 h-[230svh] bg-ink" style={{ "--p": 0 } as CSSProperties}>
      <div className="stage">
        <div className="s3-dev s6-l"><Phone src={F2.shot} screen={F2.id} alt={F2.title} w={w} /></div>
        <div className="s3-dev s6-r"><Phone src={F3.shot} screen={F3.id} alt={F3.title} w={w} /></div>
        <div className="s3-dev s6-c"><Phone src={F1.shot} screen={F1.id} alt={F1.title} w={w} /></div>
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-ink via-ink/70 to-transparent" style={{ opacity: "clamp(0, calc((var(--p) - 0.45) * 3), 1)" }} aria-hidden />
        <div className="s6-copy absolute inset-x-6 bottom-24 z-20 text-paper md:inset-x-[7vw] md:bottom-[9svh]">
          <div className="flex items-center gap-3 text-sm uppercase tracking-[0.3em] text-paper/70">
            <span className="size-3 rounded-full bg-vermilion" aria-hidden /> {APP.name}
          </div>
          <h2 id="h-s6" className="mt-5 font-display text-[clamp(2.2rem,5.4vw,5rem)] font-light leading-[1.05]">
            Hiểu rõ tiền của bạn.<br /><em className="text-vermilion">Bắt đầu từ hôm nay.</em>
          </h2>
          <div className="mt-8"><DownloadButtons source="final" event="final_cta_click" /></div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-ink px-6 pb-28 pt-16 text-paper md:px-10 md:pb-12">
      <div className="mx-auto flex max-w-[1300px] flex-col gap-10 border-t border-paper/15 pt-10 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="flex items-center gap-3 font-display text-2xl"><span className="size-4 rounded-full bg-vermilion" aria-hidden />{APP.name}</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-paper/60">
            Ứng dụng quản lý chi tiêu cá nhân. Giúp bạn ghi chép thu chi, xem thống kê và lập ngân sách.
          </p>
        </div>
        <nav aria-label="Liên kết chân trang" className="grid gap-3 text-sm text-paper/70 sm:grid-cols-2 sm:gap-x-12">
          {ALL_PAGES.map((p) => <Link key={p.path} href={p.path} className="hover:text-paper">{p.nav}</Link>)}
          <a href="/#tai-ung-dung" className="hover:text-paper">Tải ứng dụng</a>
        </nav>
      </div>
      <p className="mx-auto mt-10 max-w-[1300px] text-xs text-paper/40">© {new Date().getFullYear()} {APP.name}. Số liệu trong biểu đồ chỉ mang tính minh họa.</p>
    </footer>
  );
}

export default function App() {
  const path = usePath();
  const page = ALL_PAGES.find((p) => p.path === path);

  useEffect(() => {
    document.documentElement.lang = "vi";
    document.title = page ? `${page.title} | ${APP.name}` : `${APP.name} — Ứng dụng quản lý chi tiêu cá nhân`;
    const desc = page
      ? page.description
      : "Ứng dụng quản lý chi tiêu cá nhân: theo dõi thu chi, xem thống kê tài chính và lập ngân sách trong một trải nghiệm đơn giản.";
    let m = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!m) {
      m = document.createElement("meta");
      m.name = "description";
      document.head.appendChild(m);
    }
    m.content = desc;
    if (APP.siteUrl) {
      let c = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (!c) {
        c = document.createElement("link");
        c.rel = "canonical";
        document.head.appendChild(c);
      }
      c.href = APP.siteUrl + (page ? page.path : "/");
    }
  }, [page]);

  useEffect(() => {
    if (!page && path === "/" && window.location.hash) {
      document.getElementById(window.location.hash.slice(1))?.scrollIntoView();
    }
  }, [page, path]);

  return (
    <>
      <Nav showJourney={!page} />
      {page ? (
        <ContentPage page={page} />
      ) : (
        <main>
          <Hero />
          <Interface />
          <FeatureShowcase />
          <DataInMotion />
          <Experience />
          <FinalReveal />
        </main>
      )}
      <Footer />
    </>
  );
}
