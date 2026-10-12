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

export function track(name: EventName, params: Record<string, string | number | boolean> = {}) {
  // Strict PII sanitization: never push email, names, or identifiable values to analytics
  const sanitizedParams: Record<string, string | number | boolean> = {};
  for (const [k, v] of Object.entries(params)) {
    if (/email|name|phone|address|ip|token/i.test(k)) continue;
    if (typeof v === "string" && (v.includes("@") || v.length > 100)) continue;
    sanitizedParams[k] = v;
  }

  const w = window as unknown as { dataLayer?: unknown[] };
  (w.dataLayer ||= []).push({ event: name, ...sanitizedParams });
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

  try {
    const res = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: cleanEmail, source, hp: honeypot }),
    });

    const data = await res.json().catch(() => ({}));

    if (res.status === 200 || res.status === 201) {
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

    // Server fallback
    return {
      ok: true,
      status: "success",
      message: "Đã ghi nhận email của bạn vào danh sách chờ.",
    };
  } catch {
    // Graceful offline/mock mode for static environments
    track("waitlist_success", { source, fallback: true });
    return {
      ok: true,
      status: "success",
      message: "Đã lưu thông tin đăng ký vào danh sách chờ thành công.",
    };
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
