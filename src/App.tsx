import { useEffect, useRef, useState, type CSSProperties } from "react";
import Phone from "./Phone";
import { lazy, Suspense } from "react";
import { APP, CATEGORIES, FEATURES, MONTHS, STORES, TREND } from "./config";
import { Link, usePath } from "./router";
import { ALL_PAGES, PRODUCT_PAGES, getCanonicalPath, getPageMeta, getRoute, getStructuredData } from "./pagesData";

const LazyContentPage = lazy(() => import("./pages"));
const LazyNotFoundPage = lazy(() => import("./pages").then((m) => ({ default: m.NotFoundPage })));
import { openPrelaunchSheet, storeUrl, submitWaitlist, track, useCountUp, useInView, useScrollProgress } from "./lib";
import MobilePrelaunchSheet from "./components/MobilePrelaunchSheet";
import MobileStickyCta from "./components/MobileStickyCta";
import MobileHomeStage from "./components/MobileHomeStage";

const d = (s: number): CSSProperties => ({ animationDelay: `${s}s` });
const [F1, F2, F3] = FEATURES;
const HAS_STORE_LINKS = Boolean(STORES.appStore || STORES.googlePlay);
const PRIMARY_CTA_LABEL = HAS_STORE_LINKS ? "Tải ứng dụng" : "Nhận thông báo khi ra mắt";
const SHORT_CTA_LABEL = HAS_STORE_LINKS ? "Tải ứng dụng" : "Nhận thông báo khi ra mắt";

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

function PrelaunchSignup({ source, compact = false }: { source: string; compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    setErrorMessage("");

    const res = await submitWaitlist(email, source, honeypot);
    setIsSubmitting(false);

    if (res.ok) {
      setSubmitted(true);
      setStatusMessage(res.message);
    } else {
      setErrorMessage(res.message);
    }
  };

  return (
    <div className="w-full max-w-lg">
      {/* Mobile Refined Pre-launch CTA Experience (< md) */}
      <div className="md:hidden space-y-3.5">
        <p className="text-sm font-light leading-relaxed text-paper/75">
          Sổ Chi đang chuẩn bị phát hành. Để lại email để được báo khi ứng dụng sẵn sàng.
        </p>
        <button
          type="button"
          onClick={() => {
            track("notify_cta_click", { source: `${source}_mobile` });
            openPrelaunchSheet(source);
          }}
          className="group relative flex min-h-12 w-full cursor-pointer items-center justify-between rounded-full bg-vermilion px-6 py-3.5 text-sm font-medium text-paper shadow-lg shadow-vermilion/25 transition-transform duration-200 active:scale-[0.98]"
        >
          <span>Nhận thông báo khi ra mắt</span>
          <span
            className="text-base transition-transform duration-200 group-hover:translate-x-1 group-active:translate-x-1"
            aria-hidden
          >
            →
          </span>
        </button>
      </div>

      {/* Desktop Inline Form (>= md) */}
      <form
        className={`hidden md:block prelaunch-form ${compact ? "is-compact" : ""}`}
        onSubmit={handleSubmit}
      >
        <div className="hidden" aria-hidden="true">
          <input
            type="text"
            name="hp_code"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor={`prelaunch-email-${source}`}>Nhận thông báo khi Sổ Chi ra mắt</label>
          <p id={`prelaunch-note-${source}`}>
            Chúng tôi sẽ gửi một email ngắn khi ứng dụng sẵn sàng. Không có liên kết store giả, không làm phiền.
          </p>
        </div>
        <div className="prelaunch-form-row">
          <input
            id={`prelaunch-email-${source}`}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="Email của bạn"
            aria-describedby={`prelaunch-note-${source}`}
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Đang gửi..." : submitted ? "Đã ghi nhận" : "Nhận thông báo"}
          </button>
        </div>
        {errorMessage && (
          <p className="mt-2 text-xs text-vermilion" role="alert">
            {errorMessage}
          </p>
        )}
        {submitted && (
          <p className="prelaunch-form-status" role="status">
            {statusMessage || "Cảm ơn bạn. Sổ Chi sẽ báo khi bản phát hành chính thức sẵn sàng."}
          </p>
        )}
      </form>
    </div>
  );
}

function DownloadButtons({ source, event }: { source: string; event: "final_cta_click" | "store_click" }) {
  const links = [
    { kind: "appStore" as const, label: "App Store", sub: "Tải trên" },
    { kind: "googlePlay" as const, label: "Google Play", sub: "Tải trên" },
  ].filter((l) => STORES[l.kind]);

  if (!links.length) {
    return <PrelaunchSignup source={source} />;
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

type MenuItemData = {
  href: string;
  label: string;
  num: string;
  tag: string;
  desc: string;
  badge: {
    label: string;
    value: string;
    sub: string;
    detail: string;
  };
};

const MENU_ITEMS: MenuItemData[] = [
  {
    href: "/#trai-nghiem",
    label: "Trải nghiệm",
    num: "01",
    tag: "Product Preview",
    desc: "Khám phá phần trình diễn giao diện ghi chép tài chính tối giản, được dựng để giới thiệu trải nghiệm cốt lõi của Sổ Chi.",
    badge: {
      label: "Xem trước trải nghiệm",
      value: "Minh họa",
      sub: "Giao diện thu chi • Chuyển cảnh sản phẩm",
      detail: "Màn hình mô phỏng giúp người dùng hiểu tinh thần sản phẩm trước khi ứng dụng phát hành.",
    },
  },
  {
    href: "/tinh-nang",
    label: "Tính năng",
    num: "02",
    tag: "Core Capabilities",
    desc: "Ba nhóm tính năng nền tảng cho quản lý chi tiêu cá nhân: theo dõi thu chi, xem thống kê và lập ngân sách.",
    badge: {
      label: "Bộ tính năng cốt lõi",
      value: "3 nhóm",
      sub: "Thu chi • Thống kê • Ngân sách",
      detail: "Tập trung vào những hành động quan trọng nhất để người dùng bắt đầu theo dõi tiền rõ ràng hơn.",
    },
  },
  {
    href: "/quan-ly-thu-chi",
    label: "Quản lý thu chi",
    num: "03",
    tag: "Cashflow Tracking",
    desc: "Ghi lại khoản thu và khoản chi trong một cấu trúc dễ nhìn, giúp người dùng biết dòng tiền đang đi đâu.",
    badge: {
      label: "Nhật ký dòng tiền",
      value: "Rõ ràng",
      sub: "Khoản thu • Khoản chi • Giao dịch gần",
      detail: "Nội dung tập trung vào thói quen ghi chép đều đặn, không hứa các chỉ số tốc độ chưa được kiểm chứng.",
    },
  },
  {
    href: "/thong-ke-tai-chinh",
    label: "Thống kê tài chính",
    num: "04",
    tag: "Analytics & Trends",
    desc: "Báo cáo phân tích trực quan với biểu đồ thanh thoát, giúp bạn thấu hiểu xu hướng tiêu dùng theo thời gian.",
    badge: {
      label: "Phân tích xu hướng",
      value: "Trực quan",
      sub: "Cơ cấu nhóm chi • Biểu đồ kỳ hạn",
      detail: "Biến những con số khô khan thành tín hiệu rõ ràng để điều chỉnh kế hoạch.",
    },
  },
  {
    href: "/lap-ngan-sach",
    label: "Lập ngân sách",
    num: "05",
    tag: "Budget Planning",
    desc: "Theo dõi mức đã dùng theo từng nhóm chi tiêu để người dùng chủ động điều chỉnh trước khi vượt kế hoạch.",
    badge: {
      label: "Kế hoạch chi tiêu",
      value: "Chủ động",
      sub: "Hạn mức nhóm • Theo dõi mức đã dùng",
      detail: "Dựa trên chi tiêu thực tế thay vì những con số lý tưởng xa vời.",
    },
  },
  {
    href: "/blog",
    label: "Blog",
    num: "06",
    tag: "Editorial & Insights",
    desc: "Chia sẻ tri thức quản lý tài chính cá nhân, kinh nghiệm tích lũy và góc nhìn về lối sống chi tiêu có ý thức.",
    badge: {
      label: "Bài viết chuyên đề",
      value: "Chuyên sâu",
      sub: "Tư duy tiền tệ • Mẹo tiết kiệm",
      detail: "Góc nhìn tĩnh tại, hướng dẫn thực tế từ các bài viết tuyển chọn.",
    },
  },
  {
    href: "/gioi-thieu",
    label: "Giới thiệu",
    num: "07",
    tag: "About & Philosophy",
    desc: "Triết lý sản phẩm hướng đến sự rõ ràng, bình tĩnh và tôn trọng dữ liệu cá nhân của người dùng.",
    badge: {
      label: "Triết lý thương hiệu",
      value: "Đơn giản",
      sub: "Rõ ràng • Tôn trọng dữ liệu",
      detail: "Thiết kế phục vụ con người, mang lại cảm giác bình tâm trong tài chính.",
    },
  },
  {
    href: "/cau-hoi-thuong-gap",
    label: "Câu hỏi thường gặp",
    num: "08",
    tag: "Help & Support",
    desc: "Tổng hợp các câu hỏi cơ bản về cách ghi chép, phân loại khoản chi và chuẩn bị sử dụng khi sản phẩm ra mắt.",
    badge: {
      label: "Trung tâm trợ giúp",
      value: "Cơ bản",
      sub: "Ghi chép • Phân loại • Ngân sách",
      detail: "Các câu hỏi được viết theo hướng hỗ trợ người dùng mới, không giả định tính năng chưa công bố.",
    },
  },
];

function Nav({
  showJourney,
  isSheetOpen = false,
  onOpenSheet,
}: {
  showJourney: boolean;
  isSheetOpen?: boolean;
  onOpenSheet?: () => void;
}) {
  const [activeScene, setActiveScene] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(0);
  const currentPath = usePath();
  const progress = useRef<HTMLSpanElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const menuPanel = useRef<HTMLDivElement>(null);
  const links = [
    ["/#trai-nghiem", "Trải nghiệm"],
    ["/tinh-nang", "Tính năng"],
    ["/#du-lieu", "Số liệu"],
  ];

  useEffect(() => {
    if (menuOpen) {
      const idx = MENU_ITEMS.findIndex(
        (item) => item.href === currentPath || (item.href === "/#trai-nghiem" && currentPath === "/")
      );
      if (idx >= 0) setHoveredIndex(idx);
    }
  }, [menuOpen, currentPath]);

  const activeMenuItem = MENU_ITEMS[hoveredIndex] ?? MENU_ITEMS[0];

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
    const previousFocus = document.activeElement instanceof HTMLElement && document.activeElement !== document.body ? document.activeElement : menuButton.current;
    const focusable = () => Array.from(menuPanel.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? []).filter((el) => el.offsetParent !== null);
    const focusFirst = () => {
      (focusable()[0] ?? menuPanel.current)?.focus();
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusable();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    requestAnimationFrame(focusFirst);
    window.setTimeout(focusFirst, 80);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
      (previousFocus ?? menuButton.current)?.focus();
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
            {PRIMARY_CTA_LABEL}
          </a>
          <button
            ref={menuButton}
            type="button"
            aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            onClick={() => setMenuOpen((open) => !open)}
            className={`menu-toggle ${menuOpen ? "is-open" : ""}`}
          >
            <span /><span />
          </button>
        </nav>
        <span className="scroll-progress" aria-hidden><span ref={progress} /></span>
      </header>
      <div id="site-menu" ref={menuPanel} role="dialog" aria-modal="true" tabIndex={-1} className={`mobile-menu site-menu ${menuOpen ? "is-open" : ""}`} aria-hidden={!menuOpen}>
        {/* MOBILE VIEW (< 1024px) - Preserved exact original mobile structure and classes */}
        <div className="lg:hidden h-full">
          <div className="mobile-menu-orbit" aria-hidden />
          <nav aria-label="Điều hướng toàn trang" className="mobile-menu-inner">
            <p><span>目次</span> Mục lục</p>
            <ol>
              {MENU_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} onClick={() => setMenuOpen(false)}>
                    <span>{item.num}</span>
                    {item.label}
                    <i aria-hidden>↗</i>
                  </Link>
                </li>
              ))}
            </ol>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                track("hero_download_click", { source: "mobile_menu" });
                if (onOpenSheet) {
                  onOpenSheet();
                } else {
                  openPrelaunchSheet("mobile_menu");
                }
              }}
              className="mobile-menu-cta w-full cursor-pointer border-0"
            >
              <span>{PRIMARY_CTA_LABEL}</span> <span aria-hidden>→</span>
            </button>
          </nav>
        </div>

        {/* DESKTOP FULLSCREEN EDITORIAL NAVIGATION (>= 1024px) */}
        <div className="hidden lg:flex desktop-menu-layout h-full flex-col justify-between max-w-[1500px] w-full mx-auto px-8 xl:px-16 pt-24 pb-7">
          {/* Top Editorial Meta Bar */}
          <div className="flex items-center justify-between border-b border-paper/[0.08] pb-3.5 font-mono text-[11px] uppercase tracking-[0.25em] text-paper/40">
            <div className="flex items-center gap-3">
              <span className="text-vermilion font-display text-sm tracking-normal">目次</span>
              <span className="h-px w-6 bg-paper/20" />
              <span>MỤC LỤC & ĐIỀU HƯỚNG</span>
              <span className="text-paper/20">•</span>
              <span className="text-paper/50">08 PHÂN HỆ</span>
            </div>
            <div className="flex items-center gap-4 text-paper/35">
              <span>BẤM [ESC] HOẶC TAB ĐỂ DUYỆT</span>
              <span className="text-paper/20">•</span>
              <span>SỔ CHI STUDIO</span>
            </div>
          </div>

          {/* Two-Column Editorial Layout */}
          <div className="grid grid-cols-12 gap-10 xl:gap-14 items-center my-auto py-2">
            {/* LEFT COLUMN: 58% width (7 of 12 columns) */}
            <div className="col-span-7 flex flex-col justify-center">
              <ol className="flex flex-col border-y border-paper/[0.08] divide-y divide-paper/[0.06]" role="list">
                {MENU_ITEMS.map((item, index) => {
                  const isHovered = hoveredIndex === index;
                  const isCurrent = currentPath === item.href || (item.href === "/#trai-nghiem" && currentPath === "/");
                  return (
                    <li key={item.href} className="desktop-menu-item">
                      <Link
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onFocus={() => setHoveredIndex(index)}
                        className={`group flex items-center justify-between py-2.5 xl:py-3 px-3.5 -mx-3.5 rounded-xl transition-all duration-300 ${
                          isHovered
                            ? "bg-white/[0.035]"
                            : ""
                        }`}
                      >
                        <div className="flex items-center gap-5 xl:gap-7 min-w-0">
                          <span
                            className={`font-mono text-xs xl:text-sm tracking-widest transition-colors duration-300 ${
                              isHovered || isCurrent ? "text-vermilion font-semibold" : "text-paper/35 group-hover:text-vermilion"
                            }`}
                          >
                            {item.num}
                          </span>
                          <span
                            className={`font-display text-xl xl:text-2xl 2xl:text-[1.75rem] font-light tracking-wide transition-all duration-300 whitespace-nowrap truncate ${
                              isHovered
                                ? "translate-x-2 text-vermilion"
                                : isCurrent
                                ? "text-paper group-hover:text-vermilion group-hover:translate-x-2"
                                : "text-paper/90 group-hover:text-vermilion group-hover:translate-x-2"
                            }`}
                          >
                            {item.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0 ml-4">
                          {isCurrent && (
                            <span className="hidden 2xl:inline-block text-[10px] tracking-widest uppercase font-mono px-2 py-0.5 rounded-full border border-vermilion/30 text-vermilion/90 bg-vermilion/10">
                              Đang xem
                            </span>
                          )}
                          <span
                            aria-hidden
                            className={`font-sans text-sm xl:text-base transition-all duration-300 ${
                              isHovered
                                ? "opacity-100 text-vermilion translate-x-1 -translate-y-0.5"
                                : "opacity-25 text-paper group-hover:opacity-100 group-hover:text-vermilion group-hover:translate-x-1 group-hover:-translate-y-0.5"
                            }`}
                          >
                            ↗
                          </span>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </div>

            {/* RIGHT COLUMN: 42% width (5 of 12 columns) */}
            <div className="col-span-5 relative desktop-menu-preview flex flex-col justify-between min-h-[440px] xl:min-h-[480px] pl-4 xl:pl-8">
              {/* Decorative Circular Graphic Composition in Background */}
              <div className="absolute -inset-10 pointer-events-none flex items-center justify-center overflow-hidden" aria-hidden>
                {/* Outer subtle orbit circle */}
                <div className="w-[460px] xl:w-[540px] aspect-square rounded-full border border-paper/[0.07] desktop-orbit-spin" />
                {/* Middle vermilion accent orbit */}
                <div className="absolute w-[340px] xl:w-[400px] aspect-square rounded-full border border-vermilion/[0.18]" />
                {/* Inner calm orbit circle */}
                <div className="absolute w-[210px] xl:w-[250px] aspect-square rounded-full border border-paper/[0.04]" />
                {/* Soft ambient vermilion glow */}
                <div className="absolute w-[280px] h-[280px] rounded-full bg-vermilion/[0.04] blur-3xl" />
              </div>

              {/* Contextual description & label for hovered item */}
              <div className="relative z-10 space-y-4">
                <div>
                  <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-white/[0.03] border border-paper/[0.09] backdrop-blur-md mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-vermilion animate-pulse" />
                    <span className="font-mono text-[10px] xl:text-[11px] tracking-[0.2em] uppercase text-paper/70">
                      {activeMenuItem.num} / 08 • {activeMenuItem.tag}
                    </span>
                  </div>
                  <h3 className="font-display text-2xl xl:text-3xl font-light text-paper tracking-wide">
                    {activeMenuItem.label}
                  </h3>
                  <p className="mt-2 text-xs xl:text-sm leading-relaxed text-paper/70 font-sans max-w-sm">
                    {activeMenuItem.desc}
                  </p>
                </div>

                {/* Small visual/thumbnail/product reference card */}
                <div className="relative overflow-hidden rounded-2xl border border-paper/[0.1] bg-white/[0.025] backdrop-blur-md p-4 xl:p-5 shadow-xl shadow-black/20">
                  <div className="flex items-center justify-between border-b border-paper/[0.08] pb-2.5 text-xs font-mono">
                    <span className="text-paper/50 flex items-center gap-2 text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-vermilion" />
                      {activeMenuItem.badge.label}
                    </span>
                    <span className="text-vermilion font-medium px-2 py-0.5 rounded bg-vermilion/10 text-[10px] xl:text-[11px]">
                      {activeMenuItem.badge.value}
                    </span>
                  </div>
                  <div className="pt-2.5">
                    <p className="text-xs xl:text-sm font-medium text-paper flex items-center gap-2">
                      {activeMenuItem.badge.sub}
                    </p>
                    <p className="mt-1 text-[11px] xl:text-xs leading-relaxed text-paper/60 font-sans">
                      {activeMenuItem.badge.detail}
                    </p>
                  </div>
                </div>
              </div>

              {/* Compact Premium CTA at lower right */}
              <div className="relative z-10 pt-4 border-t border-paper/[0.08] flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-wider text-paper/40">Sẵn sàng trải nghiệm?</p>
                  <p className="text-xs text-paper/70 font-sans">{HAS_STORE_LINKS ? "Dành cho iOS & Android" : "Đăng ký nhận tin ra mắt"}</p>
                </div>
                <Link
                  href="/#tai-ung-dung"
                  onClick={() => {
                    setMenuOpen(false);
                    track("hero_download_click", { source: "desktop_menu" });
                  }}
                  className="group inline-flex items-center gap-2.5 rounded-full bg-vermilion px-5 py-2.5 text-xs font-medium uppercase tracking-wider text-paper shadow-md shadow-vermilion/20 transition-all duration-300 hover:bg-[#bd321c] hover:shadow-lg hover:shadow-vermilion/30 hover:scale-[1.03] active:scale-[0.98]"
                >
                  <span>{PRIMARY_CTA_LABEL}</span>
                  <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Editorial Sub-bar */}
          <div className="flex items-center justify-between border-t border-paper/[0.08] pt-3 font-mono text-[11px] text-paper/35">
            <div>
              <span>© 2026 SỔ CHI • BẢO MẬT TUYỆT ĐỐI TRÊN THIẾT BỊ</span>
            </div>
            <div className="flex items-center gap-4">
              <span>PHIÊN BẢN 1.0</span>
              <span className="text-paper/20">•</span>
              <span>THIẾT KẾ THỦ CÔNG</span>
            </div>
          </div>
        </div>
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
      <MobileStickyCta
        onOpenSheet={onOpenSheet || (() => openPrelaunchSheet("sticky_mobile"))}
        isSheetOpen={isSheetOpen}
        menuOpen={menuOpen}
      />
    </>
  );
}

/* ---------- SCENE 01 ---------- */
function Hero() {
  return (
    <section id="top" data-scene aria-labelledby="h1" className="relative isolate flex min-h-svh items-center overflow-hidden bg-ink">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_70%_45%,#2a211c_0%,#0c0a09_62%)]" />
      <div className="mx-auto grid w-full max-w-[1500px] items-center gap-10 px-6 pb-28 pt-28 md:grid-cols-[1.05fr_1fr] md:px-10 md:pb-16">
        <div className="order-1 md:order-1">
          <div>
            <Eyebrow n="一">Ứng dụng quản lý chi tiêu</Eyebrow>
          </div>
          <h1 id="h1" className="mt-8 font-display text-[clamp(2.2rem,6.2vw,6.2rem)] font-light leading-[1.06] tracking-[-0.01em] [text-wrap:balance]">
            <span className="block pb-1">Chi tiêu rõ ràng.</span>
            <span className="block pb-2 italic text-vermilion">Cuộc sống chủ động.</span>
          </h1>
          <p className="mt-7 max-w-md text-lg font-light leading-relaxed text-paper/75">
            Mọi khoản thu chi, trong một trải nghiệm đơn giản.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#tai-ung-dung"
              onClick={() => track("hero_download_click", { source: "hero" })}
              className="flex min-h-14 items-center rounded-full bg-vermilion px-8 font-medium text-paper transition-transform duration-200 hover:scale-[1.03]"
            >
              {PRIMARY_CTA_LABEL}
            </a>
            <a href="#trai-nghiem" className="flex min-h-14 items-center gap-2 px-3 text-paper/80 transition-colors duration-200 hover:text-paper">
              Khám phá trải nghiệm <span aria-hidden>↓</span>
            </a>
          </div>
        </div>

        <div className="order-2 flex justify-center md:order-2 mt-4 md:mt-0" style={{ perspective: "1400px" }}>
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
              w="clamp(220px, 64vw, 310px)"
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
  const featureStyle = {
    "--feature-shift": `${(i - 1) * 14}px`,
    "--feature-tilt": `${(1 - i) * 1.6}deg`,
    "--feature-scale": i === 1 ? 1.035 : 1,
    "--feature-orbit-scale": i === 1 ? 1.04 : 0.98,
    "--feature-glow-x": `${50 + (i - 1) * 8}%`,
  } as CSSProperties;

  const selectFeature = (index: number, id: string) => {
    setI(index);
    track("product_demo_interaction", { feature: id });
    track("feature_view", { feature: id });
  };

  return (
    <section id="demo" data-scene aria-labelledby="h-s5" className="product-demo washi relative bg-paper px-6 py-28 text-ink md:px-10 md:py-40" data-feature={f.id}>
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
                aria-controls="feature-panel"
                onClick={() => selectFeature(k, x.id)}
                className="group flex min-h-16 w-full items-center gap-5 border-b border-ink/15 py-4 text-left transition-colors duration-200"
              >
                <span className={`font-display text-sm tabular-nums transition-colors ${k === i ? "text-vermilion" : "text-ink/40"}`}>0{k + 1}</span>
                <span className={`font-display text-2xl transition-opacity duration-200 ${k === i ? "opacity-100" : "opacity-45 group-hover:opacity-80"}`}>{x.title}</span>
                <span aria-hidden className={`ml-auto h-px bg-vermilion transition-all duration-500 ${k === i ? "w-10" : "w-0"}`} />
              </button>
            ))}
          </div>
          <p key={f.id} id="feature-panel" role="tabpanel" className="feature-copy-motion mt-6 max-w-md leading-relaxed text-ink/70">{f.desc}</p>
        </div>

        <div className="relative order-first flex justify-center md:order-none" style={featureStyle}>
          <div aria-hidden className="demo-orbit absolute top-1/2 size-[min(70vw,440px)] -translate-y-1/2 rounded-full bg-vermilion/90" />
          <div className="demo-phone-wrap relative">
            <span aria-hidden className="demo-light" />
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
            Hiểu rõ tiền của bạn.<br /><em className="text-vermilion">{HAS_STORE_LINKS ? "Bắt đầu từ hôm nay." : "Nhận tin khi ra mắt."}</em>
          </h2>
          <div className="mt-8"><DownloadButtons source="final" event="final_cta_click" /></div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-ink px-6 pb-28 pt-16 text-paper md:px-10 md:pb-14">
      <div className="mx-auto max-w-[1300px] border-t border-paper/15 pt-12">
        <div className="grid gap-10 md:grid-cols-12 lg:gap-14">
          {/* Brand & Description */}
          <div className="md:col-span-5 lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-3 font-display text-2xl text-paper">
              <span className="size-4 rounded-full bg-vermilion" aria-hidden />
              {APP.name}
            </Link>
            <p className="mt-3.5 max-w-sm text-sm leading-relaxed text-paper/65">
              Ứng dụng quản lý chi tiêu cá nhân. Giúp bạn ghi chép thu chi nhanh gọn, đọc hiểu bức tranh tài chính và lập ngân sách chủ động mỗi ngày.
            </p>
            <div className="mt-6 flex items-center gap-3 text-xs text-paper/40">
              <span className="size-2 rounded-full bg-emerald-500/80" />
              <span>Bản quyền © {new Date().getFullYear()} Sổ Chi. Hoạt động độc lập.</span>
            </div>
          </div>

          {/* Links Column 1: Core Features */}
          <div className="md:col-span-3 lg:col-span-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-paper/50">Tính năng cốt lõi</p>
            <ul className="mt-4 space-y-1 text-sm text-paper/75">
              {PRODUCT_PAGES.map((p) => (
                <li key={p.path}>
                  <Link
                    href={p.path}
                    className="flex min-h-11 items-center py-2 transition-colors hover:text-paper"
                  >
                    {p.nav}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Column 2: Knowledge & Prelaunch */}
          <div className="md:col-span-4 lg:col-span-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-paper/50">Kiến thức & Phát hành</p>
            <ul className="mt-4 space-y-1 text-sm text-paper/75">
              <li>
                <Link
                  href="/blog"
                  className="flex min-h-11 items-center py-2 transition-colors hover:text-paper"
                >
                  Blog quản lý chi tiêu
                </Link>
              </li>
              <li>
                <Link
                  href="/blog/ghi-chep-chi-tieu-hang-ngay"
                  className="flex min-h-11 items-center py-2 transition-colors hover:text-paper"
                >
                  Ghi chép chi tiêu hằng ngày
                </Link>
              </li>
              <li>
                <Link
                  href="/blog/doc-bieu-do-chi-tieu"
                  className="flex min-h-11 items-center py-2 transition-colors hover:text-paper"
                >
                  Cách đọc biểu đồ chi tiêu
                </Link>
              </li>
              <li>
                <a
                  href="/#tai-ung-dung"
                  className="flex min-h-11 items-center py-2 font-medium text-vermilion transition-colors hover:text-vermilion-bright"
                >
                  {PRIMARY_CTA_LABEL} →
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Legal note */}
        <div className="mt-12 border-t border-paper/10 pt-8 text-xs leading-relaxed text-paper/40 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <p>© {new Date().getFullYear()} {APP.name}. Mọi quyền được bảo lưu.</p>
            <span className="hidden sm:inline text-paper/20">|</span>
            <p>Số liệu và hình ảnh biểu đồ mang tính minh họa giao diện sản phẩm.</p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs text-paper/60">
            <Link href="/chinh-sach-bao-mat" className="transition-colors hover:text-paper">
              Chính sách bảo mật
            </Link>
            <span aria-hidden className="text-paper/20">·</span>
            <Link href="/dieu-khoan-su-dung" className="transition-colors hover:text-paper">
              Điều khoản sử dụng
            </Link>
            <span aria-hidden className="text-paper/20">·</span>
            <Link href="/cau-hoi-thuong-gap" className="transition-colors hover:text-paper">
              Câu hỏi thường gặp
            </Link>
            <span aria-hidden className="text-paper/20">·</span>
            <Link href="/gioi-thieu" className="transition-colors hover:text-paper">
              Về Sổ Chi
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function App({
  initialPath,
  ContentComponent,
  NotFoundComponent,
}: {
  initialPath?: string;
  ContentComponent?: React.ComponentType<{ page: any }>;
  NotFoundComponent?: React.ComponentType<{ path: string }>;
} = {}) {
  const ResolvedContentPage = ContentComponent || LazyContentPage;
  const ResolvedNotFoundPage = NotFoundComponent || LazyNotFoundPage;
  const path = usePath(initialPath);
  const page = getRoute(path);
  const [isPrelaunchOpen, setIsPrelaunchOpen] = useState(false);
  const [prelaunchSource, setPrelaunchSource] = useState("mobile");

  useEffect(() => {
    const handleOpen = (e: Event) => {
      const detail = (e as CustomEvent<{ source?: string }>).detail;
      if (detail?.source) setPrelaunchSource(detail.source);
      setIsPrelaunchOpen(true);
    };
    window.addEventListener("sochi:open-prelaunch-sheet", handleOpen);
    return () => window.removeEventListener("sochi:open-prelaunch-sheet", handleOpen);
  }, []);

  useEffect(() => {
    const isNotFound = path !== "/" && !page;
    const origin = (import.meta.env.VITE_SITE_URL as string | undefined) || APP.siteUrl;
    const ogImageUrl = `${origin}/og-image.jpg`;

    const setNamedMeta = (name: string, content: string) => {
      let tag = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.name = name;
        document.head.appendChild(tag);
      }
      tag.content = content;
    };

    const setPropertyMeta = (property: string, content: string) => {
      let tag = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("property", property);
        document.head.appendChild(tag);
      }
      tag.content = content;
    };

    document.documentElement.lang = "vi";

    if (isNotFound) {
      document.title = `404: Không tìm thấy trang | ${APP.name}`;
      setNamedMeta("robots", "noindex, follow");
      setNamedMeta("description", "Trang bạn tìm kiếm không tồn tại hoặc đã được thay đổi đường dẫn.");
      document.querySelector<HTMLScriptElement>('script[data-seo-json="true"]')?.remove();
      return;
    }

    // Clear noindex on valid routes
    document.querySelector<HTMLMetaElement>('meta[name="robots"]')?.remove();

    const meta = getPageMeta(page);
    const canonicalPath = getCanonicalPath(page, path);
    const canonicalUrl = `${origin}${canonicalPath === "/" ? "/" : canonicalPath}`;

    document.title = meta.title;
    setNamedMeta("description", meta.description);
    setPropertyMeta("og:title", meta.title);
    setPropertyMeta("og:description", meta.description);
    setPropertyMeta("og:type", page?.kind === "article" ? "article" : "website");
    setPropertyMeta("og:url", canonicalUrl);
    setPropertyMeta("og:image", ogImageUrl);
    setPropertyMeta("og:image:width", "1376");
    setPropertyMeta("og:image:height", "768");
    setPropertyMeta("og:site_name", APP.name);
    setPropertyMeta("og:locale", "vi_VN");

    setNamedMeta("twitter:card", "summary_large_image");
    setNamedMeta("twitter:title", meta.title);
    setNamedMeta("twitter:description", meta.description);
    setNamedMeta("twitter:image", ogImageUrl);

    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    document.querySelector<HTMLScriptElement>('script[data-seo-json="true"]')?.remove();
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.dataset.seoJson = "true";
    script.textContent = JSON.stringify(getStructuredData(page, origin));
    document.head.appendChild(script);
  }, [page, path]);

  useEffect(() => {
    if (!window.location.hash) return;

    let attempts = 0;
    let timer = 0;
    const scrollToHash = () => {
      const target = document.getElementById(window.location.hash.slice(1));
      if (target) {
        target.scrollIntoView({ block: "start" });
        return;
      }
      if (attempts < 8) {
        attempts += 1;
        timer = window.setTimeout(scrollToHash, 60);
      }
    };

    scrollToHash();
    return () => window.clearTimeout(timer);
  }, [page, path]);

  return (
    <>
      <Nav
        showJourney={!page}
        isSheetOpen={isPrelaunchOpen}
        onOpenSheet={() => {
          setPrelaunchSource("sticky_mobile");
          setIsPrelaunchOpen(true);
        }}
      />
      {page ? (
        <Suspense fallback={<div className="min-h-screen bg-ink" />}>
          <ResolvedContentPage page={page} />
        </Suspense>
      ) : path === "/" ? (
        <main>
          <Hero />
          <MobileHomeStage id="mobile-home-product" />
          <Interface />
          <FeatureShowcase />
          <DataInMotion />
          <Experience />
          <FinalReveal />
        </main>
      ) : (
        <Suspense fallback={<div className="min-h-screen bg-ink" />}>
          <ResolvedNotFoundPage path={path} />
        </Suspense>
      )}
      <Footer />
      <MobilePrelaunchSheet
        isOpen={isPrelaunchOpen}
        onClose={() => setIsPrelaunchOpen(false)}
        source={prelaunchSource}
      />
    </>
  );
}
