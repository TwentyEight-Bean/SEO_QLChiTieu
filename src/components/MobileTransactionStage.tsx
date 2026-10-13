import { useState, useEffect, useRef, type PointerEvent } from "react";
import { track } from "../lib";

interface StepData {
  num: string;
  tabLabel: string;
  badge: string;
  title: string;
  desc: string;
  floatingChip: {
    icon: string;
    text: string;
    tone: "vermilion" | "gold" | "emerald";
  };
}

const STEPS: StepData[] = [
  {
    num: "01",
    tabLabel: "01 Ghi nhanh",
    badge: "BƯỚC 1 / 4",
    title: "Ghi nhanh một khoản chi",
    desc: "Nhập số tiền và chọn nhóm trong vài giây.",
    floatingChip: {
      icon: "✎",
      text: "Đang nhập: Cà phê sáng (−45k)",
      tone: "vermilion",
    },
  },
  {
    num: "02",
    tabLabel: "02 Phân loại",
    badge: "BƯỚC 2 / 4",
    title: "Được xếp đúng nhóm",
    desc: "Khoản chi vừa ghi xuất hiện ngay trong nhóm phù hợp.",
    floatingChip: {
      icon: "✨",
      text: "Nhóm Ăn uống · 38% ngân sách",
      tone: "gold",
    },
  },
  {
    num: "03",
    tabLabel: "03 Vào sổ",
    badge: "BƯỚC 3 / 4",
    title: "Xuất hiện ngay trong giao dịch hôm nay",
    desc: "Không cần đợi cuối tháng mới biết tiền đã đi đâu.",
    floatingChip: {
      icon: "●",
      text: "Đã trượt vào sổ hôm nay (09:15)",
      tone: "vermilion",
    },
  },
  {
    num: "04",
    tabLabel: "04 Cập nhật",
    badge: "BƯỚC 4 / 4",
    title: "Tổng chi cập nhật tức thì",
    desc: "Luôn biết hôm nay mình đã tiêu bao nhiêu.",
    floatingChip: {
      icon: "✓",
      text: "Số dư: 24.635.000 ₫ (−45k)",
      tone: "emerald",
    },
  },
];

export default function MobileTransactionStage({ id = "mobile-transactions-stage" }: { id?: string }) {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const pointerStart = useRef<number | null>(null);

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : 0));
    }, 2800);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const selectStep = (idx: number, source: "tab" | "swipe" | "button") => {
    const nextIdx = (idx + STEPS.length) % STEPS.length;
    setStep(nextIdx);
    track("product_demo_interaction", { variant: "transactions", step: nextIdx, source });
  };

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    pointerStart.current = e.clientX;
  };

  const handlePointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (pointerStart.current === null) return;
    const distance = e.clientX - pointerStart.current;
    pointerStart.current = null;
    if (Math.abs(distance) > 35) {
      if (distance < 0) {
        selectStep(step + 1, "swipe");
      } else {
        selectStep(step - 1, "swipe");
      }
    }
  };

  const current = STEPS[step];
  const isInputModalOpen = step === 0;
  const isCategoryFocused = step === 1;
  const hasSlidIn = step >= 2;
  const isBalanceUpdated = step === 3;

  return (
    <section
      id={id}
      className="mobile-transaction-stage md:hidden relative overflow-hidden bg-ink min-h-[85svh] flex flex-col justify-center pt-5 pb-6 px-4 text-paper scroll-mt-14"
      aria-labelledby="mobile-tx-stage-title"
    >
      {/* Dynamic atmospheric radial background glow shifting with each step */}
      <div
        className={`pointer-events-none absolute inset-0 transition-opacity duration-700 ${
          step === 0
            ? "bg-[radial-gradient(circle_at_50%_42%,rgba(210,58,34,0.24)_0%,rgba(12,10,9,0.95)_75%)]"
            : step === 1
            ? "bg-[radial-gradient(circle_at_50%_42%,rgba(218,165,32,0.22)_0%,rgba(12,10,9,0.95)_75%)]"
            : step === 2
            ? "bg-[radial-gradient(circle_at_50%_45%,rgba(210,58,34,0.20)_0%,rgba(12,10,9,0.95)_75%)]"
            : "bg-[radial-gradient(circle_at_50%_38%,rgba(16,185,129,0.22)_0%,rgba(12,10,9,0.95)_75%)]"
        }`}
        aria-hidden
      />

      {/* Subtle fine concentric aura rings for visual depth */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center -z-0 opacity-12" aria-hidden>
        <div className="size-[290px] rounded-full border border-paper/20" />
        <div className="size-[390px] rounded-full border border-paper/10 absolute" />
      </div>

      <div className="relative z-10 mx-auto max-w-[340px] flex flex-col items-center">
        {/* Section Eyebrow & Compact Headline */}
        <header className="w-full text-center">
          <p className="flex items-center justify-center gap-1.5 text-[9.5px] font-semibold uppercase tracking-[0.22em] text-paper/60">
            <span className="text-vermilion font-display text-xs">01</span>
            <span className="h-px w-5 bg-current opacity-30" />
            <span>Mô phỏng quy trình ghi chép</span>
          </p>
          <h2
            id="mobile-tx-stage-title"
            className="mt-1 font-display text-[1.42rem] font-normal leading-[1.12] tracking-tight text-paper text-balance"
          >
            Mọi khoản chi, rõ ngay <span className="italic text-paper/85">trong 3 giây</span>
          </h2>
        </header>

        {/* Compact Segmented 4-Step Selector */}
        <nav
          className="mt-2.5 w-full grid grid-cols-4 gap-1 rounded-full border border-paper/15 bg-paper/5 p-0.5 backdrop-blur-md"
          role="tablist"
          aria-label="Các bước quy trình ghi chép"
        >
          {STEPS.map((s, idx) => (
            <button
              key={s.num}
              type="button"
              role="tab"
              aria-selected={step === idx}
              onClick={() => {
                setIsPlaying(false);
                selectStep(idx, "tab");
              }}
              className={`min-h-[2.15rem] rounded-full px-1 text-[10.5px] font-medium tracking-tight transition-all duration-300 active:scale-95 ${
                step === idx
                  ? "bg-vermilion text-paper shadow-md shadow-vermilion/40 font-semibold"
                  : "text-paper/65 hover:text-paper"
              }`}
            >
              {s.tabLabel.replace(/^0\d\s*/, "")}
            </button>
          ))}
        </nav>

        {/* 2.5D INTERACTIVE PRODUCT STAGE */}
        <div
          className="relative mt-3.5 w-full flex items-center justify-center touch-pan-y select-none"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          tabIndex={0}
          aria-label="Vuốt ngang để đổi bước minh họa"
        >
          {/* Floating Contextual Pill outside phone (Secondary Visual Layer) */}
          <div
            key={`chip-${step}`}
            className="absolute -top-2.5 right-1 z-30 flex items-center gap-1.5 rounded-full border border-paper/20 bg-lacquer/95 px-2.5 py-0.5 text-[10px] text-paper shadow-xl backdrop-blur-lg animate-fade-in"
          >
            <span
              className={`size-1.5 rounded-full ${
                current.floatingChip.tone === "vermilion"
                  ? "bg-vermilion animate-ping"
                  : current.floatingChip.tone === "gold"
                  ? "bg-gold animate-pulse"
                  : "bg-emerald-400"
              }`}
            />
            <span className="font-medium tracking-tight truncate max-w-[195px]">
              {current.floatingChip.text}
            </span>
          </div>

          {/* 2.5D Phone Shell with authentic perspective and micro camera tilt */}
          <div
            className="mobile-stage-perspective-wrap"
            style={{
              perspective: "1100px",
            }}
          >
            <div
              data-step={step}
              className="mobile-stage-device relative"
              style={{
                width: "228px",
                height: "368px",
              }}
            >
              {/* Outer Phone Hardware Chasis */}
              <div className="relative h-full w-full overflow-hidden rounded-[2.3rem] border-[3px] border-[#2c241e] bg-lacquer shadow-[0_16px_40px_rgba(0,0,0,0.7),0_6px_16px_rgba(210,58,34,0.15)] ring-1 ring-paper/20">
                {/* Gloss / specular highlights on phone glass */}
                <div
                  className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-tr from-white/10 via-transparent to-white/5 opacity-60"
                  aria-hidden
                />

                {/* Dynamic Island Pill */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 h-3 w-14 rounded-full bg-black/95 flex items-center justify-end pr-1" aria-hidden>
                  <span className="size-1 rounded-full bg-[#151c2c]/80" />
                </div>

                {/* Living Sổ Chi Screen Container */}
                <div className="relative h-full w-full overflow-hidden bg-[#f7f2e7] text-ink select-none flex flex-col justify-between p-3 pt-5.5">
                  {/* Mock Status Bar */}
                  <div className="flex items-center justify-between text-[8px] font-semibold text-ink/70 px-0.5 pt-0.5" aria-hidden>
                    <span>09:41</span>
                    <div className="flex items-center gap-1">
                      <span className="inline-flex gap-0.5 items-end h-1.5">
                        <b className="w-0.5 h-1 bg-current rounded-sm" />
                        <b className="w-0.5 h-1.5 bg-current rounded-sm" />
                      </span>
                      <span>5G</span>
                      <span className="w-3 h-1.5 rounded-xs border border-current p-0.2 flex items-center">
                        <b className="w-full h-full bg-current rounded-xs" />
                      </span>
                    </div>
                  </div>

                  {/* App Header */}
                  <div className="mt-1 flex items-center justify-between px-0.5">
                    <div>
                      <span className="block text-[8px] text-ink/50 uppercase tracking-wider leading-none">Xin chào,</span>
                      <strong className="block font-display text-[12.5px] font-semibold leading-tight text-ink">Minh Anh</strong>
                    </div>
                    <span className="flex size-5 items-center justify-center rounded-full bg-lacquer text-[8px] font-bold text-paper shadow-sm">
                      SC
                    </span>
                  </div>

                  {/* Dynamic Balance Card with Live Reactive States */}
                  <div
                    className={`mt-1.5 rounded-xl p-2 text-paper transition-all duration-500 ${
                      isBalanceUpdated
                        ? "bg-gradient-to-br from-[#122518] to-lacquer ring-2 ring-emerald-400 shadow-md shadow-emerald-500/25 scale-[1.01]"
                        : "bg-lacquer shadow-sm"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[8px] text-paper/70">
                      <span>Số dư hiện tại</span>
                      {isBalanceUpdated && (
                        <span className="rounded-full bg-emerald-500/25 border border-emerald-400/40 px-1 py-0.2 text-[7px] font-bold text-emerald-300 animate-pulse">
                          −45.000 ₫
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 flex items-baseline gap-1">
                      {isBalanceUpdated && (
                        <span className="text-[8px] line-through text-paper/40 font-mono">
                          24.680.000 ₫
                        </span>
                      )}
                      <strong
                        className={`font-display text-[13.5px] font-semibold leading-none tracking-tight ${
                          isBalanceUpdated ? "text-emerald-200" : ""
                        }`}
                      >
                        {isBalanceUpdated ? "24.635.000 ₫" : "24.680.000 ₫"}
                      </strong>
                    </div>
                    <div className="mt-1.5 grid grid-cols-2 gap-1 border-t border-paper/15 pt-1 text-[7.5px]">
                      <div>
                        <span className="text-paper/55 block">Thu nhập</span>
                        <b className="font-semibold text-emerald-300">↑ 18,5 tr</b>
                      </div>
                      <div>
                        <span className="text-paper/55 block">Chi tiêu</span>
                        <b className={`font-semibold ${isBalanceUpdated ? "text-rose-300 font-bold" : "text-paper"}`}>
                          ↓ {isBalanceUpdated ? "6,25 tr" : "6,2 tr"}
                        </b>
                      </div>
                    </div>
                  </div>

                  {/* Step 1: Category Synchronization Banner inside phone */}
                  {isCategoryFocused && (
                    <div className="mt-1 rounded-lg border border-gold/70 bg-gradient-to-r from-[#291b12] to-[#1a1410] p-1.5 text-paper shadow-sm animate-fade-in">
                      <div className="flex items-center justify-between text-[8px]">
                        <span className="flex items-center gap-1 font-bold text-gold">
                          <span className="size-1 rounded-full bg-gold animate-ping" />
                          Nhóm: Ăn uống
                        </span>
                        <span className="text-vermilion font-bold">+45.000 ₫</span>
                      </div>
                      <div className="mt-0.5 flex items-center justify-between text-[7px] text-paper/75">
                        <span>Hôm nay: 130.000 ₫</span>
                        <span className="text-gold font-medium">38% ngân sách</span>
                      </div>
                      <div className="mt-0.5 h-1 w-full overflow-hidden rounded-full bg-paper/20">
                        <div className="h-full bg-gradient-to-r from-gold to-vermilion w-[38%] transition-all duration-700" />
                      </div>
                    </div>
                  )}

                  {/* Section Title */}
                  <div className="mt-1.5 flex items-center justify-between px-0.5 text-[8.5px]">
                    <strong className="font-display font-semibold text-ink">Giao dịch gần đây</strong>
                    <span className="text-[7.5px]">
                      {isInputModalOpen && <span className="text-vermilion font-medium">Đang nhập...</span>}
                      {isCategoryFocused && <span className="text-gold font-semibold">✨ Nhóm Ăn uống</span>}
                      {step === 2 && <span className="text-vermilion font-semibold animate-pulse">● Vừa trượt vào</span>}
                      {isBalanceUpdated && <span className="text-emerald-700 font-semibold">✓ Tổng: 180k</span>}
                    </span>
                  </div>

                  {/* Transaction List with Living Sliding Transitions */}
                  <div className="mt-0.5 relative flex flex-col gap-1 flex-1">
                    {/* Step 0: Foreground 2.5D Transaction Input Modal Overlay */}
                    {isInputModalOpen && (
                      <div className="absolute inset-x-0 -top-0.5 z-30 rounded-xl border border-vermilion/70 bg-[#1c1511]/98 p-1.5 text-paper shadow-xl backdrop-blur-md animate-fade-in">
                        <div className="flex items-center justify-between border-b border-paper/15 pb-0.5 text-[7px]">
                          <span className="font-semibold uppercase tracking-wider text-vermilion flex items-center gap-1">
                            <span className="size-1 rounded-full bg-vermilion animate-ping" />
                            Ghi chép nhanh
                          </span>
                          <span className="text-paper/60">09:15 sáng</span>
                        </div>
                        <div className="mt-1 flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <span className="flex size-5 items-center justify-center rounded bg-vermilion text-[8px] font-bold text-paper shadow-xs">
                              Ă
                            </span>
                            <div>
                              <strong className="block text-[8.5px] font-medium leading-tight">Cà phê sáng</strong>
                              <span className="text-[6.5px] text-paper/60">Ăn uống · Tiền mặt</span>
                            </div>
                          </div>
                          <strong className="font-display text-[10.5px] font-semibold text-vermilion">−45.000 ₫</strong>
                        </div>
                        <div className="mt-1 rounded bg-paper/10 px-1 py-0.5 text-center text-[7px] text-paper/80 font-medium">
                          Chạm bước 02 để xếp nhóm →
                        </div>
                      </div>
                    )}

                    {/* New Transaction: Slid in at Step 2 & settled at Step 3 */}
                    {hasSlidIn && (
                      <div
                        className={`flex items-center justify-between rounded-lg p-1 transition-all duration-500 ${
                          step === 2
                            ? "bg-vermilion/15 border border-vermilion/60 shadow-xs -translate-y-0.5 animate-fade-in"
                            : "bg-paper/5 border border-paper/10"
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          <span className="flex size-5 items-center justify-center rounded bg-vermilion text-[8px] font-bold text-paper">
                            Ă
                          </span>
                          <div>
                            <b className="flex items-center gap-1 text-[8px] leading-tight font-medium text-ink">
                              Cà phê sáng
                              {step === 2 && (
                                <span className="rounded bg-vermilion px-0.5 py-0.1 text-[6px] font-bold text-paper uppercase">
                                  Mới
                                </span>
                              )}
                            </b>
                            <small className="block text-[6.5px] text-ink/55">Ăn uống · 09:15</small>
                          </div>
                        </div>
                        <strong className="text-[8.5px] font-semibold text-vermilion">−45.000 ₫</strong>
                      </div>
                    )}

                    {/* Baseline transactions */}
                    <div className="flex items-center justify-between rounded-lg p-1 bg-ink/5">
                      <div className="flex items-center gap-1">
                        <span className="flex size-5 items-center justify-center rounded bg-vermilion/10 text-[8px] font-bold text-vermilion">
                          Ă
                        </span>
                        <div>
                          <b className="block text-[8px] leading-tight font-medium text-ink">Bữa trưa</b>
                          <small className="block text-[6.5px] text-ink/55">Ăn uống · Hôm nay</small>
                        </div>
                      </div>
                      <strong className="text-[8.5px] font-semibold text-ink">−85.000 ₫</strong>
                    </div>

                    <div className="flex items-center justify-between rounded-lg p-1 bg-ink/5">
                      <div className="flex items-center gap-1">
                        <span className="flex size-5 items-center justify-center rounded bg-emerald-700/10 text-[8px] font-bold text-emerald-700">
                          L
                        </span>
                        <div>
                          <b className="block text-[8px] leading-tight font-medium text-ink">Lương tháng</b>
                          <small className="block text-[6.5px] text-ink/55">Thu nhập · Hôm qua</small>
                        </div>
                      </div>
                      <strong className="text-[8.5px] font-semibold text-emerald-700">+18.500.000 ₫</strong>
                    </div>
                  </div>

                  {/* Quick Add Button inside phone */}
                  <div
                    className={`mt-1 flex items-center justify-center gap-1 rounded-full py-1 px-2.5 text-[8px] font-medium transition-all duration-300 ${
                      isInputModalOpen
                        ? "bg-vermilion text-paper ring-1.5 ring-paper shadow-sm scale-102"
                        : "bg-vermilion/90 text-paper"
                    }`}
                  >
                    <span>+</span>
                    <span>{isInputModalOpen ? "Đang ghi..." : "Ghi giao dịch"}</span>
                  </div>

                  {/* Bottom Navigation */}
                  <div className="mt-1 flex items-center justify-around border-t border-ink/10 pt-0.5 text-[7px] text-ink/50" aria-hidden>
                    <span className="font-semibold text-vermilion flex flex-col items-center">
                      <b className="size-0.5 rounded-full bg-vermilion mb-0.5" />
                      Tổng quan
                    </span>
                    <span>Thống kê</span>
                    <span>Ngân sách</span>
                  </div>
                </div>
              </div>

              {/* Realistic Ground Shadow */}
              <div
                className="pointer-events-none absolute -bottom-4 inset-x-4 h-5 rounded-full bg-black/60 blur-md -z-10"
                aria-hidden
              />
            </div>
          </div>
        </div>

        {/* Short Supporting Editorial Copy (Section 8 Standard) */}
        <div className="mt-3 w-full text-center px-1">
          <span className="text-[9.5px] font-bold uppercase tracking-[0.16em] text-vermilion">
            {current.badge}
          </span>
          <h3 className="mt-0.5 font-display text-[1.15rem] font-medium leading-snug text-paper text-balance">
            {current.title}
          </h3>
          <p className="mt-0.5 text-[11.5px] leading-relaxed text-paper/70 text-balance">
            {current.desc}
          </p>
        </div>

        {/* Navigation Controls: Prev / Dots / Next / Auto Play */}
        <div className="mt-2.5 w-full flex items-center justify-between px-0.5">
          {/* Previous Button */}
          <button
            type="button"
            onClick={() => {
              setIsPlaying(false);
              selectStep(step - 1, "button");
            }}
            className="flex size-9 items-center justify-center rounded-full border border-paper/20 bg-paper/5 text-paper transition-all hover:bg-paper/15 active:scale-95 text-xs"
            aria-label="Bước trước"
          >
            ←
          </button>

          {/* Step Dots & Progress */}
          <div className="flex items-center gap-1.5" aria-label={`Bước ${step + 1} trên 4`}>
            {STEPS.map((s, idx) => (
              <button
                key={s.num}
                type="button"
                onClick={() => {
                  setIsPlaying(false);
                  selectStep(idx, "button");
                }}
                className={`transition-all duration-300 rounded-full ${
                  step === idx
                    ? "h-1.5 w-5 bg-vermilion"
                    : "size-1.5 bg-paper/25 hover:bg-paper/50"
                }`}
                aria-label={`Xem ${s.tabLabel}`}
              />
            ))}
          </div>

          {/* Next / Replay Action Button */}
          <button
            type="button"
            onClick={() => {
              if (step === STEPS.length - 1) {
                setIsPlaying(false);
                selectStep(0, "button");
              } else {
                setIsPlaying(false);
                selectStep(step + 1, "button");
              }
            }}
            className="flex min-h-9 items-center gap-1 rounded-full bg-vermilion px-3.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-paper shadow-md shadow-vermilion/30 transition-all hover:opacity-90 active:scale-95"
          >
            <span>{step === STEPS.length - 1 ? "Xem lại ↺" : "Tiếp theo →"}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
