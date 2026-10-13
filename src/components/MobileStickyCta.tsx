import { useEffect, useState } from "react";
import { track } from "../lib";
import { usePath } from "../router";

interface MobileStickyCtaProps {
  onOpenSheet: () => void;
  isSheetOpen: boolean;
  menuOpen: boolean;
}

export default function MobileStickyCta({
  onOpenSheet,
  isSheetOpen,
  menuOpen,
}: MobileStickyCtaProps) {
  const [pastHero, setPastHero] = useState(false);
  const [finalCtaInView, setFinalCtaInView] = useState(false);
  const [viewerInView, setViewerInView] = useState(false);
  const [homeFinalNear, setHomeFinalNear] = useState(false);
  const path = usePath();

  useEffect(() => {
    setHomeFinalNear(false);
    if (path !== "/") return;
    const final = document.querySelector("#tai-ung-dung.home-waitlist");
    if (!final) return;
    const observer = new IntersectionObserver(([entry]) => setHomeFinalNear(entry.isIntersecting), { rootMargin: "0px 0px 140px 0px", threshold: 0 });
    observer.observe(final);
    return () => observer.disconnect();
  }, [path]);

  // 1. Detect scroll past hero
  useEffect(() => {
    let frame = 0;
    const checkScroll = () => {
      frame = 0;
      const hero =
        document.getElementById("top") ||
        document.querySelector("header.product-page-hero") ||
        document.querySelector("header.blog-hero") ||
        document.querySelector("header.article-hero");

      if (hero) {
        const rect = hero.getBoundingClientRect();
        // past hero when bottom of hero is within 120px of top of viewport or scrolled past
        setPastHero(rect.bottom <= 120);
      } else {
        setPastHero(window.scrollY > 280);
      }

      // Check if interactive walkthrough stages are in or near viewport
      const activeViewer = Array.from(
        document.querySelectorAll<HTMLElement>(
          ".mobile-product-viewer, .mobile-transaction-stage, .mobile-statistics-stage, .mobile-budget-stage, .mobile-features-stage, .mobile-home-stage, .home-data-category"
        )
      ).some((el) => {
        const r = el.getBoundingClientRect();
        return r.top < window.innerHeight + 80 && r.bottom > -80;
      });
      setViewerInView(activeViewer);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(checkScroll);
    };

    checkScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  // Keep the compact walkthrough controls clear while they are on screen.
  useEffect(() => {
    const viewers = Array.from(
      document.querySelectorAll<HTMLElement>(
        ".mobile-product-viewer, .mobile-transaction-stage, .mobile-statistics-stage, .mobile-budget-stage, .mobile-features-stage, .mobile-home-stage, .home-data-category"
      )
    );
    if (viewers.length === 0) return;

    const visible = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.add(entry.target);
          else visible.delete(entry.target);
        });
        setViewerInView(visible.size > 0);
      },
      { threshold: 0, rootMargin: "140px 0px 140px 0px" }
    );

    viewers.forEach((viewer) => observer.observe(viewer));
    return () => observer.disconnect();
  }, []);

  // 2. IntersectionObserver to hide when final CTA section or footer enters viewport
  useEffect(() => {
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>(
        "#tai-ung-dung, .cta-panel, footer, .s6-copy, .related-links"
      )
    );

    if (targets.length === 0) return;

    const intersectingSet = new Set<Element>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            intersectingSet.add(entry.target);
          } else {
            intersectingSet.delete(entry.target);
          }
        });
        setFinalCtaInView(intersectingSet.size > 0);
      },
      {
        rootMargin: "0px 0px -40px 0px",
        threshold: 0.05,
      }
    );

    targets.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, []);

  const isVisible = pastHero && !finalCtaInView && !homeFinalNear && !viewerInView && !isSheetOpen && !menuOpen;

  return (
    <div
      aria-hidden={!isVisible}
      className={`mobile-sticky-cta fixed inset-x-4 z-40 mx-auto max-w-sm md:hidden transition-all duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isVisible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-6 pointer-events-none"
      }`}
      style={{
        bottom: "max(1rem, calc(env(safe-area-inset-bottom) + 0.65rem))",
      }}
    >
      <button
        type="button"
        tabIndex={isVisible ? 0 : -1}
        onClick={() => {
          track("hero_download_click", { source: "sticky_mobile" });
          onOpenSheet();
        }}
        className="group relative flex min-h-12 w-full cursor-pointer items-center justify-between rounded-full border border-paper/15 bg-lacquer/95 px-4 py-2.5 text-sm font-medium text-paper shadow-[0_8px_24px_rgba(12,10,9,0.35)] backdrop-blur-xl transition-transform duration-200 active:scale-[0.97] select-none"
        aria-label="Nhận thông báo khi ra mắt"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            className="size-2 rounded-full bg-vermilion shrink-0"
            aria-hidden
          />
          <span className="truncate tracking-normal text-[13.5px]">
            Nhận thông báo
          </span>
        </div>
        <span
          className="text-base transition-transform duration-200 group-hover:translate-x-1 group-active:translate-x-1 shrink-0 ml-2"
          aria-hidden
        >
          →
        </span>
      </button>
    </div>
  );
}
