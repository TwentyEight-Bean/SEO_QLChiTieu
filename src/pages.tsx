import { useEffect, useMemo, useState } from "react";
import Phone, { type PhoneScreen } from "./Phone";
import { APP, CATEGORIES, FEATURES } from "./config";
import { Link } from "./router";
import DeviceMockup from "./components/DeviceMockup";
import StatisticsShowcase from "./components/StatisticsShowcase";
import AnalyticsPerspectiveStage from "./components/AnalyticsPerspectiveStage";
import TransactionFlowShowcase from "./components/TransactionFlowShowcase";
import BudgetShowcase from "./components/BudgetShowcase";
import FeatureEcosystemShowcase from "./components/FeatureEcosystemShowcase";
import DataExpansionSequence from "./components/DataExpansionSequence";
import StatisticsVisualStories from "./components/StatisticsVisualStories";
import MobileProductViewer from "./components/MobileProductViewer";
import MobileTransactionStage from "./components/MobileTransactionStage";
import MobileStatisticsStage from "./components/MobileStatisticsStage";
import MobileBudgetStage from "./components/MobileBudgetStage";
import { openPrelaunchSheet, track } from "./lib";
import {
  type FaqItem,
  type ProductPageDef,
  type ArticleDef,
  type BlogIndexDef,
  type RouteDef,
  PRODUCT_PAGES,
  BLOG_INDEX,
  ALL_PAGES,
  ROUTE_PATHS,
  getRoute,
  getPageMeta,
  getCanonicalPath,
  getStructuredData,
  featureById,
  ARTICLES,
  PRODUCT_CTA_LABEL
} from "./pagesData";

export {
  type FaqItem,
  type ProductPageDef,
  type ArticleDef,
  type BlogIndexDef,
  type RouteDef,
  PRODUCT_PAGES,
  BLOG_INDEX,
  ALL_PAGES,
  ROUTE_PATHS,
  getRoute,
  getPageMeta,
  getCanonicalPath,
  getStructuredData
};

/* ---------- Shared components ---------- */

function ReadingMeta({ article }: { article: ArticleDef }) {
  return (
    <div className="page-meta-strip">
      <p><span>Tác giả</span>{article.author}</p>
      <p><span>Ngày đăng</span><time dateTime={article.date}>{formatDate(article.date)}</time></p>
      {article.updatedAt && article.updatedAt !== article.date && (
        <p><span>Cập nhật</span><time dateTime={article.updatedAt}>{formatDate(article.updatedAt)}</time></p>
      )}
      <p><span>Thời lượng</span>{article.readingMinutes} phút đọc</p>
      <p><span>Chuyên mục</span>{article.category}</p>
    </div>
  );
}

function FaqSection({ items }: { items: FaqItem[] }) {
  return (
    <section className="faq-section scroll-mt-28" id="faq">
      <span className="section-kicker">Câu hỏi thường gặp</span>
      <h2>Bạn có thắc mắc?</h2>
      <dl className="faq-list">
        {items.map((item) => (
          <div key={item.q} className="faq-item">
            <dt>{item.q}</dt>
            <dd>{item.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/* ---------- Product page ---------- */

/* ---------- Product Pages: Specialized 2.5D Visual Implementations ---------- */

function ProductHero({ page, screen, perspective }: { page: ProductPageDef; screen: PhoneScreen; perspective: "hero" | "perspective-left" | "perspective-right" }) {
  const feature = page.featureId ? featureById[page.featureId] : featureById[screen === "thong-ke" ? "thong-ke" : screen === "ngan-sach" ? "ngan-sach" : "thu-chi"];

  return (
    <header className="product-page-hero relative isolate overflow-hidden bg-ink px-6 pb-20 pt-32 text-paper md:px-10 md:pb-28">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_75%_35%,#2a211c_0%,#0c0a09_62%)]" />
      <div className="absolute right-[-18vw] top-20 -z-10 size-[min(90vw,680px)] rounded-full border border-paper/10" aria-hidden>
        <span className="absolute inset-[18%] rounded-full border border-vermilion/25" />
        <span className="absolute inset-[36%] rounded-full bg-vermilion/80 blur-[1px]" />
      </div>
      <div className="mx-auto grid max-w-[1300px] items-center gap-14 lg:grid-cols-[1.1fr_auto]">
        <div>
          <nav aria-label="Đường dẫn" className="breadcrumb">
            <Link href="/">Trang chủ</Link>
            <span aria-hidden />
            <span>{page.nav}</span>
          </nav>
          <p className="mt-12 text-[11px] uppercase tracking-[0.28em] text-paper/55">{page.eyebrow}</p>
          <h1 className="mt-5 max-w-4xl font-display text-[clamp(2.15rem,6.2vw,5.5rem)] font-light leading-[1.08] [text-wrap:balance]">{page.h1}</h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-paper/70">{page.intro}</p>
          <div className="mt-9 flex flex-wrap gap-3 text-xs uppercase tracking-[0.18em] text-paper/65">
            {page.metrics.map((metric) => <span key={metric} className="rounded-full border border-paper/20 px-4 py-2">{metric}</span>)}
          </div>
          <button
            type="button"
            onClick={() => openPrelaunchSheet("product_hero_mobile")}
            className="product-hero-mobile-cta mt-6 hidden min-h-12 items-center justify-center rounded-full bg-vermilion px-6 text-sm font-semibold text-paper active:scale-[0.97]"
          >
            Nhận thông báo <span aria-hidden className="ml-2">→</span>
          </button>
        </div>
        <figure className="product-hero-phone justify-self-center">
          <DeviceMockup
            screen={screen}
            src={feature.shot}
            alt={`${page.nav} trong ${APP.name}`}
            perspective={perspective}
            w="clamp(220px, 25vw, 320px)"
          />
          <figcaption className="mt-5 text-center text-xs text-paper/45">Màn hình minh họa trong giai đoạn chuẩn bị phát hành.</figcaption>
        </figure>
      </div>
    </header>
  );
}

function ProductContentBody({ page }: { page: ProductPageDef }) {
  const related = page.related.map((path) => ALL_PAGES.find((item) => item.path === path)).filter(Boolean) as RouteDef[];
  const tocItems = [
    { href: "#mo-phong", label: "00 Trực quan" },
    ...page.sections.map((s, i) => ({ href: `#muc-${i + 1}`, label: `0${i + 1} ${s.h}` })),
    { href: "#loi-ich", label: "Lợi ích" },
    ...(page.faq && page.faq.length > 0 ? [{ href: "#faq", label: "Câu hỏi thường gặp" }] : []),
  ];

  return (
    <section className="washi px-6 py-20 md:px-10 md:py-28">
      <div className="mx-auto grid max-w-[1200px] gap-8 lg:gap-14 lg:grid-cols-[260px_minmax(0,780px)] lg:justify-between">
        {/* Mobile Collapsible TOC */}
        <details className="block lg:hidden rounded-2xl border border-ink/15 bg-paper/60 p-4 shadow-sm group">
          <summary className="flex cursor-pointer items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-ink/70 select-none">
            <span className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-vermilion" />
              Mục lục nội dung ({tocItems.length} mục)
            </span>
            <span className="text-xs transition-transform duration-200 group-open:rotate-180">▼</span>
          </summary>
          <nav aria-label="Mục lục (di động)" className="mt-3 divide-y divide-ink/10 border-t border-ink/10 pt-2 text-sm">
            {tocItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="flex min-h-11 items-center py-2 text-ink/80 transition-colors hover:text-vermilion"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </details>

        {/* Desktop Sticky TOC */}
        <aside className="secondary-toc hidden lg:block">
          <p>Trong trang</p>
          <nav aria-label="Mục lục">
            {tocItems.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
          </nav>
        </aside>
        <article className="secondary-article">
          {page.sections.map((section, index) => (
            <section id={`muc-${index + 1}`} key={section.h} className="scroll-mt-28">
              <span className="section-kicker">0{index + 1}</span>
              <h2>{section.h}</h2>
              {section.p.map((text) => <p key={text}>{text}</p>)}
              {section.list && (
                <ul>
                  {section.list.map((item) => <li key={item}>{item}</li>)}
                </ul>
              )}
            </section>
          ))}

          <section id="loi-ich" className="scroll-mt-28">
            <span className="section-kicker">Lợi ích</span>
            <h2>Khi dùng đều đặn, dữ liệu trở nên hữu ích hơn</h2>
            <div className="benefit-grid">
              {page.benefits.map((benefit, index) => (
                <p key={benefit}><span>0{index + 1}</span>{benefit}</p>
              ))}
            </div>
          </section>

          {page.faq && page.faq.length > 0 && <FaqSection items={page.faq} />}

          <aside className="cta-panel">
            <p>Áp dụng với {APP.name}</p>
            <h2>Hiểu rõ tiền của bạn. Bắt đầu từ những khoản nhỏ nhất.</h2>
            <Link
              href="/#tai-ung-dung"
              onClick={(e) => {
                if (window.innerWidth < 768) {
                  e.preventDefault();
                  openPrelaunchSheet("product_page_cta");
                }
              }}
            >
              {PRODUCT_CTA_LABEL} <span aria-hidden>→</span>
            </Link>
          </aside>
        </article>
      </div>

      <RelatedLinks title="Liên kết liên quan" items={related} />
    </section>
  );
}

function StatisticsProductPage({ page }: { page: ProductPageDef }) {
  return (
    <main className="min-h-svh bg-paper text-ink overflow-x-hidden">
      <ProductHero page={page} screen="thong-ke" perspective="perspective-right" />
      <div id="mo-phong" className="scroll-mt-20">
        <MobileStatisticsStage id="mobile-statistics-stage" />
        <div className="mobile-product-desktop-only">
          <StatisticsShowcase />
          <AnalyticsPerspectiveStage />
          <DataExpansionSequence />
          <StatisticsVisualStories page={page} />
        </div>
      </div>
    </main>
  );
}

function TransactionProductPage({ page }: { page: ProductPageDef }) {
  return (
    <main className="min-h-svh bg-paper text-ink">
      <ProductHero page={page} screen="thu-chi" perspective="perspective-left" />
      <div id="mo-phong" className="scroll-mt-20">
        <MobileTransactionStage id="mobile-transactions-stage" />
        <div className="mobile-product-desktop-only">
          <TransactionFlowShowcase />
        </div>
      </div>
      <ProductContentBody page={page} />
    </main>
  );
}

function BudgetProductPage({ page }: { page: ProductPageDef }) {
  return (
    <main className="min-h-svh bg-paper text-ink">
      <ProductHero page={page} screen="ngan-sach" perspective="perspective-right" />
      <div id="mo-phong" className="scroll-mt-20">
        <MobileBudgetStage id="mobile-budget-stage" />
        <div className="mobile-product-desktop-only">
          <BudgetShowcase />
        </div>
      </div>
      <ProductContentBody page={page} />
    </main>
  );
}

function FeaturesProductPage({ page }: { page: ProductPageDef }) {
  return (
    <main className="min-h-svh bg-paper text-ink">
      <ProductHero page={page} screen="thu-chi" perspective="hero" />
      <div id="mo-phong" className="scroll-mt-20">
        <MobileProductViewer variant="features" id="mobile-features-viewer" />
        <div className="mobile-product-desktop-only">
          <FeatureEcosystemShowcase />
        </div>
      </div>
      <ProductContentBody page={page} />
    </main>
  );
}

function GenericProductPage({ page }: { page: ProductPageDef }) {
  return (
    <main className="min-h-svh bg-paper text-ink">
      <ProductHero page={page} screen={page.screen} perspective="hero" />
      <ProductContentBody page={page} />
    </main>
  );
}

function ProductPage({ page }: { page: ProductPageDef }) {
  if (page.path === "/thong-ke-tai-chinh") return <StatisticsProductPage page={page} />;
  if (page.path === "/quan-ly-thu-chi") return <TransactionProductPage page={page} />;
  if (page.path === "/lap-ngan-sach") return <BudgetProductPage page={page} />;
  if (page.path === "/tinh-nang") return <FeaturesProductPage page={page} />;
  return <GenericProductPage page={page} />;
}


/* ---------- Blog index ---------- */

const TOPIC_DESCRIPTIONS: Record<string, string> = {
  "Thói quen tài chính": "Xây dựng thói quen ghi chép và quản lý tiền bền vững qua từng ngày.",
  "Ngân sách": "Cách lập và duy trì ngân sách cá nhân thực tế theo tháng.",
  "Thống kê": "Đọc và hiểu dữ liệu chi tiêu từ biểu đồ một cách rõ ràng.",
  "Tài chính sinh viên": "Quản lý tài chính cá nhân trong giai đoạn sinh viên, ngân sách nhỏ.",
  "Quản lý chi tiêu": "Tổng quan về theo dõi và kiểm soát dòng tiền hằng ngày.",
};

function BlogIndex() {
  const topics = ["Tất cả", ...Array.from(new Set(ARTICLES.map((article) => article.category)))];
  const [topic, setTopic] = useState("Tất cả");
  const visible = useMemo(() => topic === "Tất cả" ? ARTICLES : ARTICLES.filter((article) => article.category === topic), [topic]);
  const featured = ARTICLES[0];

  return (
    <main className="min-h-svh bg-paper text-ink">
      <header className="blog-hero bg-ink px-6 pb-20 pt-32 text-paper md:px-10 md:pb-28">
        <div className="mx-auto max-w-[1300px]">
          <nav aria-label="Đường dẫn" className="breadcrumb">
            <Link href="/">Trang chủ</Link>
            <span aria-hidden />
            <span>Blog</span>
          </nav>
          <p className="mt-12 text-[11px] uppercase tracking-[0.28em] text-paper/55">Góc kiến thức</p>
          <h1 className="mt-5 max-w-4xl font-display text-[clamp(3rem,8vw,7rem)] font-light leading-[1.02]">Blog quản lý chi tiêu</h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-paper/70">Các bài viết ngắn, thực tế và có thể áp dụng ngay cho việc ghi chép thu chi, đọc số liệu và lập ngân sách.</p>
          <div className="blog-topic-pills" aria-label="Chủ đề bài viết">
            {topics.slice(1).map((t) => (
              <span key={t} className="blog-topic-pill">{t}</span>
            ))}
          </div>
        </div>
      </header>

      <section className="washi px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-[1200px]">
          {/* Featured article */}
          <article className="featured-article">
            <div>
              <p className="section-kicker">Bài nổi bật</p>
              <h2>{featured.title}</h2>
              <p>{featured.description}</p>
              <div className="blog-article-meta">
                <span>{featured.category}</span>
                <span aria-hidden>·</span>
                <span>{featured.readingMinutes} phút đọc</span>
              </div>
            </div>
            <Link href={featured.path}>Đọc bài viết <span aria-hidden>→</span></Link>
          </article>

          {/* Topic filter */}
          <div className="topic-filter" role="tablist" aria-label="Lọc chủ đề blog">
            {topics.map((item) => (
              <button key={item} type="button" role="tab" aria-selected={topic === item} onClick={() => setTopic(item)}>
                {item}
              </button>
            ))}
          </div>

          {/* Topic description */}
          {topic !== "Tất cả" && TOPIC_DESCRIPTIONS[topic] && (
            <p className="blog-topic-desc">{TOPIC_DESCRIPTIONS[topic]}</p>
          )}

          {/* Article list */}
          <div className="article-list" role="feed" aria-label={`Bài viết về ${topic}`}>
            {visible.map((article) => (
              <Link key={article.path} href={article.path} className="article-row">
                <span>{article.category}</span>
                <strong>{article.title}</strong>
                <small>{article.readingMinutes} phút đọc · <time dateTime={article.date}>{formatDate(article.date)}</time></small>
              </Link>
            ))}
          </div>

          {/* Feature CTA */}
          <aside className="blog-feature-cta">
            <div>
              <p className="section-kicker">Áp dụng ngay</p>
              <h2>Đưa kiến thức vào thực hành với {APP.name}</h2>
            </div>
            <Link href="/tinh-nang">Khám phá tính năng <span aria-hidden>→</span></Link>
          </aside>
        </div>
      </section>
    </main>
  );
}

/* ---------- Article page ---------- */

function ArticlePage({ article }: { article: ArticleDef }) {
  useEffect(() => {
    track("blog_article_view", { slug: article.slug, category: article.category });
  }, [article.slug, article.category]);

  const related = article.related.map((path) => ARTICLES.find((item) => item.path === path)).filter(Boolean) as ArticleDef[];

  // Find contextual product links not already in related
  const contextualProductPaths = ["/quan-ly-thu-chi", "/thong-ke-tai-chinh", "/lap-ngan-sach", "/tinh-nang"];
  const contextualProductLinks = contextualProductPaths
    .filter((p) => !article.related.includes(p))
    .map((p) => PRODUCT_PAGES.find((pp) => pp.path === p))
    .filter(Boolean)
    .slice(0, 2) as ProductPageDef[];

  return (
    <main className="min-h-svh bg-paper text-ink">
      <header className="article-hero bg-ink px-6 pb-20 pt-32 text-paper md:px-10 md:pb-28">
        <div className="mx-auto max-w-[1100px]">
          <nav aria-label="Đường dẫn" className="breadcrumb">
            <Link href="/">Trang chủ</Link>
            <span aria-hidden />
            <Link href="/blog">Blog</Link>
            <span aria-hidden />
            <span>{article.nav}</span>
          </nav>
          <p className="mt-12 text-[11px] uppercase tracking-[0.28em] text-paper/55">{article.category}</p>
          <h1 className="mt-5 font-display text-[clamp(2.15rem,6.2vw,5.5rem)] font-light leading-[1.08] [text-wrap:balance]">{article.title}</h1>
          <p className="mt-8 max-w-3xl text-lg leading-relaxed text-paper/70">{article.intro}</p>
          <ReadingMeta article={article} />
        </div>
      </header>

      <div className="washi px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto grid max-w-[1200px] gap-8 lg:gap-14 lg:grid-cols-[260px_minmax(0,760px)] lg:justify-between">
          {/* Mobile Collapsible TOC */}
          <details className="block lg:hidden rounded-2xl border border-ink/15 bg-paper/60 p-4 shadow-sm group">
            <summary className="flex cursor-pointer items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-ink/70 select-none">
              <span className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-vermilion" />
                Mục lục bài viết ({article.sections.length} phần)
              </span>
              <span className="text-xs transition-transform duration-200 group-open:rotate-180">▼</span>
            </summary>
            <nav aria-label="Mục lục bài viết (di động)" className="mt-3 divide-y divide-ink/10 border-t border-ink/10 pt-2 text-sm">
              {article.sections.map((section, index) => (
                <a
                  key={section.h}
                  href={`#muc-${index + 1}`}
                  className="flex min-h-11 items-center py-2 text-ink/80 transition-colors hover:text-vermilion"
                >
                  <span className="font-mono text-xs text-ink/40 mr-2.5">0{index + 1}</span>
                  <span>{section.h}</span>
                </a>
              ))}
            </nav>
            {contextualProductLinks.length > 0 && (
              <div className="mt-3 border-t border-ink/10 pt-3">
                <p className="text-[10px] uppercase tracking-wider text-ink/50 font-medium">Tính năng liên quan</p>
                <nav aria-label="Tính năng liên quan" className="mt-1 flex flex-wrap gap-2">
                  {contextualProductLinks.map((p) => (
                    <Link
                      key={p.path}
                      href={p.path}
                      onClick={() => track("blog_to_product_click", { destination: p.path, article: article.slug })}
                      className="min-h-11 inline-flex items-center rounded-full border border-ink/15 px-3.5 py-1.5 text-xs text-ink/80 hover:border-vermilion hover:text-vermilion"
                    >
                      {p.nav} →
                    </Link>
                  ))}
                </nav>
              </div>
            )}
          </details>

          {/* Desktop Sticky TOC */}
          <aside className="secondary-toc hidden lg:block">
            <p>Trong bài viết</p>
            <nav aria-label="Mục lục bài viết">
              {article.sections.map((section, index) => <a key={section.h} href={`#muc-${index + 1}`}>0{index + 1} {section.h}</a>)}
            </nav>
            {contextualProductLinks.length > 0 && (
              <div className="toc-feature-links">
                <p>Tính năng liên quan</p>
                <nav aria-label="Tính năng liên quan">
                  {contextualProductLinks.map((p) => (
                    <Link
                      key={p.path}
                      href={p.path}
                      onClick={() => track("blog_to_product_click", { destination: p.path, article: article.slug })}
                    >
                      {p.nav} <span aria-hidden>→</span>
                    </Link>
                  ))}
                </nav>
              </div>
            )}
          </aside>

          <article className="secondary-article article-body">
            <p className="article-lede">{article.intro}</p>
            {article.sections.map((section, index) => (
              <section id={`muc-${index + 1}`} key={section.h} className="scroll-mt-28">
                <h2>{section.h}</h2>
                {section.p.map((text) => <p key={text}>{text}</p>)}
                {section.h3?.map((item) => (
                  <div key={item.h}>
                    <h3>{item.h}</h3>
                    <p>{item.p}</p>
                  </div>
                ))}
                {section.list && <ul>{section.list.map((item) => <li key={item}>{item}</li>)}</ul>}
              </section>
            ))}

            <aside className="cta-panel">
              <p>Áp dụng với {APP.name}</p>
              <h2>Biến bài học thành thói quen quản lý chi tiêu hằng ngày.</h2>
              <Link
                href="/tinh-nang"
                onClick={() => track("blog_to_product_click", { destination: "/tinh-nang", article: article.slug })}
              >
                Xem tính năng phù hợp <span aria-hidden>→</span>
              </Link>
            </aside>
          </article>
        </div>

        <RelatedLinks title="Bài viết liên quan" items={related} />
      </div>
    </main>
  );
}

/* ---------- Shared ---------- */

function RelatedLinks({ title, items }: { title: string; items: RouteDef[] }) {
  if (!items.length) return null;
  return (
    <nav aria-label={title} className="related-links mx-auto mt-24 max-w-[1200px]">
      <div>
        <p className="section-kicker">Khám phá thêm</p>
        <h2>{title}</h2>
      </div>
      <ul>
        {items.map((item, index) => (
          <li key={item.path}>
            <Link href={item.path}>
              <span>0{index + 1}</span>
              {item.nav}
              <i aria-hidden>→</i>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(date));
}

function UnsubscribePage({ page }: { page: ProductPageDef }) {
  const [token, setToken] = useState("");
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const t = params.get("token") || "";
      if (t) {
        setToken(t);
      }
    }
  }, []);

  const handleUnsubscribe = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!token) {
      setStatus("error");
      setMessage("Vui lòng cung cấp mã xác thực hủy đăng ký hoặc sử dụng liên kết trong email bạn đã nhận.");
      return;
    }
    setStatus("processing");
    try {
      const res = await fetch("/api/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus("success");
        setMessage(data.message || "Bạn đã hủy đăng ký nhận thông báo thành công.");
      } else {
        setStatus("error");
        setMessage(data.message || "Mã xác thực không hợp lệ hoặc đã hết hạn.");
      }
    } catch {
      setStatus("error");
      setMessage("Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại sau.");
    }
  };

  return (
    <main className="min-h-svh bg-paper text-ink">
      <header className="article-hero bg-ink px-6 pb-20 pt-32 text-paper md:px-10 md:pb-28">
        <div className="mx-auto max-w-[1100px] text-center">
          <nav aria-label="Đường dẫn" className="breadcrumb justify-center">
            <Link href="/">Trang chủ</Link>
            <span aria-hidden />
            <span>{page.nav}</span>
          </nav>
          <p className="mt-12 text-[11px] uppercase tracking-[0.28em] text-paper/55">{page.eyebrow}</p>
          <h1 className="mt-5 font-display text-[clamp(2.15rem,6.2vw,4.5rem)] font-light leading-[1.08]">
            {page.h1}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-paper/70">
            {page.intro}
          </p>
        </div>
      </header>

      <div className="washi px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-xl rounded-2xl border border-ink/10 bg-paper/80 p-8 shadow-sm backdrop-blur-sm">
          {status === "success" ? (
            <div className="text-center py-6 animate-fade-in">
              <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-vermilion/20 text-vermilion">
                <svg className="size-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <h2 className="mt-5 font-display text-2xl font-light text-ink">Đã hủy đăng ký thành công</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink/70">{message}</p>
              <div className="mt-8">
                <Link
                  href="/"
                  className="inline-flex min-h-12 items-center rounded-full bg-ink px-7 py-3 text-xs uppercase tracking-[0.16em] font-medium text-paper transition-transform active:scale-95 hover:bg-ink/90"
                >
                  ← Về trang chủ Sổ Chi
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleUnsubscribe} className="space-y-6">
              <div>
                <h2 className="font-display text-xl font-light text-ink">Xác nhận ngừng nhận thông báo</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">
                  Khi xác nhận, email của bạn sẽ được đánh dấu ngừng nhận thông báo ra mắt ứng dụng Sổ Chi.
                </p>
              </div>

              {!token && (
                <div>
                  <label htmlFor="token-input" className="block text-xs uppercase tracking-wider text-ink/60 mb-2 font-medium">
                    Mã xác thực hủy đăng ký
                  </label>
                  <input
                    id="token-input"
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Dán mã xác thực từ email..."
                    className="w-full rounded-xl border border-ink/20 bg-paper px-4 py-3 text-sm text-ink outline-none transition focus:border-vermilion focus:ring-1 focus:ring-vermilion"
                  />
                </div>
              )}

              {status === "error" && (
                <div className="rounded-lg bg-vermilion/10 p-3.5 text-xs text-vermilion font-medium">
                  {message}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  disabled={status === "processing"}
                  className="inline-flex min-h-12 flex-1 items-center justify-center rounded-full bg-vermilion px-6 py-3 text-xs uppercase tracking-[0.16em] font-medium text-paper transition active:scale-95 disabled:opacity-50"
                >
                  {status === "processing" ? "Đang xử lý..." : "Xác nhận hủy đăng ký"}
                </button>
                <Link
                  href="/"
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-ink/20 px-6 py-3 text-xs uppercase tracking-[0.16em] text-ink/70 hover:border-ink/50"
                >
                  Giữ lại đăng ký
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}

export function NotFoundPage({ path }: { path: string }) {
  return (
    <main className="min-h-svh bg-ink text-paper flex items-center justify-center px-6 py-32">
      <div className="mx-auto max-w-xl text-center">
        <p className="flex items-center justify-center gap-3 text-[11px] font-medium uppercase tracking-[0.28em] text-paper/60">
          <span className="font-display text-base text-vermilion">404</span>
          <span className="h-px w-8 bg-current opacity-40" />
          Lỗi điều hướng
        </p>
        <h1 className="mt-6 font-display text-[clamp(2.5rem,6vw,4.5rem)] font-light leading-[1.08]">
          Không tìm thấy trang
        </h1>
        <p className="mt-5 text-base leading-relaxed text-paper/70">
          Đường dẫn <code className="rounded bg-paper/10 px-2 py-0.5 text-vermilion text-sm">{path}</code> không tồn tại hoặc đã được thay đổi.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex min-h-12 items-center rounded-full bg-vermilion px-7 py-3 text-xs uppercase tracking-[0.16em] font-medium text-paper shadow-lg shadow-vermilion/30 transition-transform active:scale-95"
          >
            ← Về trang chủ
          </Link>
          <Link
            href="/tinh-nang"
            className="inline-flex min-h-12 items-center rounded-full border border-paper/20 px-7 py-3 text-xs uppercase tracking-[0.16em] text-paper/80 transition-colors hover:border-paper hover:text-paper"
          >
            Xem tính năng
          </Link>
          <Link
            href="/blog"
            className="inline-flex min-h-12 items-center rounded-full border border-paper/20 px-7 py-3 text-xs uppercase tracking-[0.16em] text-paper/80 transition-colors hover:border-paper hover:text-paper"
          >
            Đọc Blog
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function ContentPage({ page }: { page: RouteDef }) {
  if (page.kind === "blog") return <BlogIndex />;
  if (page.kind === "article") return <ArticlePage article={page} />;
  if (page.path === "/huy-dang-ky") return <UnsubscribePage page={page} />;
  return <ProductPage page={page} />;
}
