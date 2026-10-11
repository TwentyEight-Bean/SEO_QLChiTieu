import { useEffect, useRef, useState, type RefObject } from "react";
import { STORES } from "./config";

export type EventName =
  | "hero_download_click"
  | "store_click"
  | "feature_view"
  | "product_demo_interaction"
  | "final_cta_click";

export function track(name: EventName, params: Record<string, string> = {}) {
  const w = window as unknown as { dataLayer?: unknown[] };
  (w.dataLayer ||= []).push({ event: name, ...params });
  window.dispatchEvent(new CustomEvent("analytics", { detail: { name, ...params } }));
}

export function storeUrl(kind: keyof typeof STORES, content: string) {
  const base = STORES[kind];
  if (!base) return "";
  try {
    const u = new URL(base);
    u.searchParams.set("utm_source", "website");
    u.searchParams.set("utm_medium", "landing");
    u.searchParams.set("utm_campaign", "launch");
    u.searchParams.set("utm_content", content);
    return u.toString();
  } catch {
    return base;
  }
}

/** Writes scroll progress (0..1 through a tall section) to --p without re-rendering. */
export function useScrollProgress(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.setProperty("--p", "1");
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
      el.style.setProperty("--p", p.toFixed(4));
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      cancelAnimationFrame(raf);
    };
  }, [ref]);
}

export function useInView<T extends HTMLElement>(threshold = 0.35) {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, seen] as const;
}

export function useCountUp(target: number, run: boolean, ms = 1600) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!run) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setV(target);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / ms);
      setV(Math.round(target * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, run, ms]);
  return v;
}
