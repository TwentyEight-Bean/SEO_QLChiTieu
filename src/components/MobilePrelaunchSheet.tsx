import { useEffect, useRef, useState, type FormEvent } from "react";
import { track, submitWaitlist } from "../lib";

interface MobilePrelaunchSheetProps {
  isOpen: boolean;
  onClose: () => void;
  source?: string;
}

export default function MobilePrelaunchSheet({
  isOpen,
  onClose,
  source = "mobile_sheet",
}: MobilePrelaunchSheetProps) {
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus management & Escape key & Body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    // Prevent background scrolling
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Focus input or first focusable element
    const focusTimer = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      } else if (closeButtonRef.current) {
        closeButtonRef.current.focus();
      }
    }, 120);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      // Simple focus trap
      if (e.key === "Tab" && sheetRef.current) {
        const focusable = sheetRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(focusTimer);
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Handle Form Submission with Real Backend
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setIsSubmitting(true);
    setErrorMessage("");

    const res = await submitWaitlist(email, source, honeypot);
    setIsSubmitting(false);

    if (res.ok) {
      setStatusMessage(res.message);
      setSubmitted(true);
    } else {
      setErrorMessage(res.message);
    }
  };

  const handleReset = () => {
    setEmail("");
    setHoneypot("");
    setSubmitted(false);
    setErrorMessage("");
    setStatusMessage("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="sheet-prelaunch-title"
      className="fixed inset-0 z-[100] md:hidden"
    >
      {/* Subtle Backdrop Dim & Blur */}
      <div
        className="mobile-sheet-backdrop fixed inset-0 bg-ink/75 backdrop-blur-sm transition-opacity duration-350"
        onClick={onClose}
        aria-hidden
      />

      {/* Bottom Sheet Container */}
      <div
        ref={sheetRef}
        className="mobile-sheet-panel fixed inset-x-0 bottom-0 z-10 mx-auto max-w-lg max-h-[92svh] overflow-y-auto rounded-t-[28px] border-t border-paper/15 bg-gradient-to-b from-[#181210] to-[#0e0a09] px-6 pt-3 shadow-[0_-16px_40px_rgba(0,0,0,0.8)]"
        style={{
          paddingBottom: "max(1.75rem, calc(env(safe-area-inset-bottom) + 1.25rem))",
        }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pb-2 pt-1" aria-hidden>
          <div className="h-1.25 w-11 rounded-full bg-paper/25" />
        </div>

        {/* Decorative Brand Circle Geometry (Subtle ambient movement) */}
        <div
          className="pointer-events-none absolute right-[-24px] top-[-24px] size-40 select-none overflow-hidden opacity-[0.16]"
          aria-hidden
        >
          <div className="sheet-brand-orbit size-full rounded-full border border-paper/40" />
          <div className="absolute inset-4 rounded-full border border-vermilion/50" />
          <div className="absolute right-6 top-8 size-2 rounded-full bg-vermilion" />
        </div>

        {/* Header with Title & Close button */}
        <div className="relative z-10 mt-2 flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <span className="size-2.5 rounded-full bg-vermilion" aria-hidden />
            <span className="text-[11px] font-medium uppercase tracking-[0.24em] text-paper/60">
              Sổ Chi · Bản phát hành
            </span>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Đóng hộp thoại"
            className="flex size-11 -mr-2 -mt-1 cursor-pointer items-center justify-center rounded-full text-paper/60 transition-colors hover:bg-paper/10 hover:text-paper active:scale-95"
          >
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content: Form vs Success State */}
        {!submitted ? (
          <div className="mt-4 pb-2">
            <h3
              id="sheet-prelaunch-title"
              className="font-display text-2xl font-light text-paper tracking-tight"
            >
              Sổ Chi sắp ra mắt.
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-paper/70">
              Nhận thông báo ngay khi ứng dụng chính thức sẵn sàng.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {/* Anti-spam Honeypot field (hidden from real users) */}
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
                <label
                  htmlFor="sheet-email-input"
                  className="block text-[11px] font-medium uppercase tracking-[0.16em] text-paper/60"
                >
                  Địa chỉ email của bạn
                </label>
                <div className="relative mt-2">
                  <input
                    ref={inputRef}
                    id="sheet-email-input"
                    type="email"
                    name="email"
                    inputMode="email"
                    autoComplete="email"
                    required
                    placeholder="ban@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="min-h-12 w-full rounded-2xl border border-paper/20 bg-paper/5 px-4 text-sm text-paper placeholder:text-paper/40 focus:border-vermilion focus:bg-paper/10 focus:outline-none focus:ring-1 focus:ring-vermilion"
                  />
                </div>
              </div>

              {errorMessage && (
                <p className="rounded-xl bg-vermilion/15 border border-vermilion/30 px-3 py-2 text-xs text-paper/90" role="alert">
                  {errorMessage}
                </p>
              )}

              {/* Primary action button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative flex min-h-12 w-full cursor-pointer items-center justify-center gap-2.5 rounded-2xl bg-vermilion px-6 text-sm font-medium text-paper shadow-lg shadow-vermilion/30 transition-transform active:scale-[0.98] disabled:opacity-60"
              >
                <span>{isSubmitting ? "Đang gửi..." : "Nhận thông báo khi ra mắt"}</span>
                <span
                  className="text-base transition-transform duration-200 group-hover:translate-x-1 group-active:translate-x-1"
                  aria-hidden
                >
                  →
                </span>
              </button>

              {/* Privacy & Contact disclosure */}
              <div className="text-center text-[11px] text-paper/50 pt-1 space-y-1">
                <p>Cam kết bảo mật: Chúng tôi chỉ gửi một email khi ứng dụng ra mắt.</p>
                <p>
                  Bạn có thể chủ động{" "}
                  <a href="/huy-dang-ky" className="underline hover:text-paper">
                    hủy nhận tin bất kỳ lúc nào
                  </a>
                  .
                </p>
              </div>
            </form>
          </div>
        ) : (
          <div className="mt-6 pb-4 text-center animate-fade-in">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-vermilion/20 text-vermilion">
              <svg className="size-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h3 className="mt-4 font-display text-2xl font-light text-paper">
              ✓ Đã ghi nhận
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-paper/70">
              {statusMessage || "Chúng tôi sẽ gửi thông báo đến bạn khi Sổ Chi chính thức ra mắt."}
            </p>

            <button
              type="button"
              onClick={handleReset}
              className="mt-6 min-h-11 w-full rounded-2xl border border-paper/20 bg-paper/5 px-6 text-xs uppercase tracking-[0.16em] text-paper font-medium transition-colors hover:bg-paper/10"
            >
              Hoàn tất
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
