import { useEffect, useRef, useState, type RefObject } from "react";
import { STORES } from "./config";

export type EventName =
  | "notify_cta_click"
  | "waitlist_submit"
  | "waitlist_success"
  | "feature_view"
  | "product_demo_interaction"
  | "blog_article_view"
  | "blog_to_product_click"
  | "hero_download_click"
  | "store_click"
  | "final_cta_click"
  | "prelaunch_signup";

const GA_MEASUREMENT_ID = (import.meta.env.VITE_GA_MEASUREMENT_ID || "").trim();

let gaInitialized = false;
export function initGA() {
  if (typeof window === "undefined" || !GA_MEASUREMENT_ID || gaInitialized) return;
  gaInitialized = true;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_MEASUREMENT_ID)}`;
  document.head.appendChild(script);

  const w = window as unknown as { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void };
  w.dataLayer ||= [];
  function gtag(...args: unknown[]) {
    w.dataLayer?.push(args);
  }
  w.gtag = gtag;
  gtag("js", new Date());
  gtag("config", GA_MEASUREMENT_ID, {
    send_page_view: true,
    anonymize_ip: true,
  });
}

export function track(name: EventName, params: Record<string, string | number | boolean> = {}) {
  // Strict PII sanitization: NEVER push email, names, phone, tokens, or identifiable values to GA4
  const sanitizedParams: Record<string, string | number | boolean> = {};
  for (const [k, v] of Object.entries(params)) {
    if (/email|name|phone|address|ip|token|subscriber|id$|user_id|body|content|form|hp/i.test(k)) continue;
    if (typeof v === "string" && (v.includes("@") || v.length > 100)) continue;
    sanitizedParams[k] = v;
  }

  const w = window as unknown as { dataLayer?: unknown[]; gtag?: (type: string, name: string, params: unknown) => void };
  (w.dataLayer ||= []).push({ event: name, ...sanitizedParams });

  // Direct GA4 dispatch if gtag is loaded
  if (typeof w.gtag === "function") {
    w.gtag("event", name, sanitizedParams);
  }

  // Custom event for DOM/test observability
  window.dispatchEvent(new CustomEvent("analytics", { detail: { name, ...sanitizedParams } }));
}

export interface WaitlistResponse {
  ok: boolean;
  status: "success" | "duplicate" | "invalid_email" | "rate_limited" | "error";
  message: string;
}

export async function submitWaitlist(
  email: string,
  source = "web",
  honeypot = ""
): Promise<WaitlistResponse> {
  const cleanEmail = email.trim();
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

  if (!cleanEmail || !emailRegex.test(cleanEmail)) {
    return {
      ok: false,
      status: "invalid_email",
      message: "Địa chỉ email không đúng định dạng. Vui lòng kiểm tra lại.",
    };
  }

  track("waitlist_submit", { source });

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: cleanEmail, source, hp: honeypot }),
      signal: controller.signal,
    });

    const data = await res.json().catch(() => ({}));

    if ((res.status === 200 || res.status === 201) && data.ok === true) {
      track("waitlist_success", { source });
      return {
        ok: true,
        status: data.duplicate ? "duplicate" : "success",
        message: data.message || "Đã lưu thông tin nhận thông báo của bạn. Cảm ơn bạn!",
      };
    }

    if (res.status === 429) {
      return {
        ok: false,
        status: "rate_limited",
        message: "Bạn đã gửi yêu cầu quá nhanh. Vui lòng thử lại sau vài phút.",
      };
    }

    if (res.status === 400) {
      return {
        ok: false,
        status: "invalid_email",
        message: data.message || "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.",
      };
    }

    return {
      ok: false,
      status: "error",
      message: "Chưa thể lưu đăng ký lúc này. Vui lòng thử lại sau.",
    };
  } catch {
    return {
      ok: false,
      status: "error",
      message: "Chưa thể kết nối. Kiểm tra kết nối mạng rồi thử lại; đăng ký của bạn chưa được xác nhận.",
    };
  } finally {
    window.clearTimeout(timeout);
  }
}

export function openPrelaunchSheet(source = "mobile") {
  track("notify_cta_click", { source });
  window.dispatchEvent(new CustomEvent("sochi:open-prelaunch-sheet", { detail: { source } }));
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
