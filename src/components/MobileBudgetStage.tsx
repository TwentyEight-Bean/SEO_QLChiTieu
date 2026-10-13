import { useState, useEffect, useRef, type PointerEvent } from "react";
import { track } from "../lib";

interface BudgetCategory {
  id: string;
  name: string;
  pct: number;
  used: string;
  total: string;
  remaining: string;
  icon: string;
  statusBadge: string;
  statusTone: "emerald" | "gold" | "warning";
  title: string;
  desc: string;
  chipText: string;
}

const CATEGORIES: BudgetCategory[] = [
  {
    id: "food",
    name: "Ăn uống",
    pct: 63,
    used: "1,89 tr",
    total: "3,0 tr",
    remaining: "1.110.000 ₫",
    icon: "Ă",
    statusBadge: "HẠN MỨC 01 / 03 · AN TOÀN",
    statusTone: "emerald",
    title: "Ăn uống đang ở mức an toàn",
    desc: "Còn 1.110.000 ₫ trong ngân sách tháng này để bạn chi tiêu thoải mái.",
    chipText: "Ăn uống: Còn 1.110.000 ₫ (63%)",
  },
  {
    id: "transport",
    name: "Di chuyển",
    pct: 56,
    used: "680k",
    total: "1,2 tr",
    remaining: "520.000 ₫",
    icon: "X",
    statusBadge: "HẠN MỨC 02 / 03 · DƯ DỰNG",
    statusTone: "gold",
    title: "Di chuyển vẫn còn nhiều dư địa",
    desc: "Còn 520.000 ₫ cho việc đi lại đến cuối tháng mà không lo vượt hạn mức.",
    chipText: "Di chuyển: Còn 520.000 ₫ (56%)",
  },
  {
    id: "shopping",
    name: "Mua sắm",
    pct: 91,
    used: "1,4 tr",
    total: "1,5 tr",
    remaining: "100.000 ₫",
    icon: "M",
    statusBadge: "HẠN MỨC 03 / 03 · CẢNH BÁO",
    statusTone: "warning",
    title: "Mua sắm sắp chạm hạn mức",
    desc: "Chỉ còn 100.000 ₫. Đây là lúc nên cân nhắc kỹ trước khoản mua tiếp theo.",
    chipText: "Mua sắm: Sắp chạm trần (91%)",
  },
];

export default function MobileBudgetStage({ id = "mobile-budget-stage" }: { id?: string }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const pointerStart = useRef<number | null>(null);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev < CATEGORIES.length - 1 ? prev + 1 : 0));
    }, 3200);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const selectCat = (idx: number, source: "tab" | "swipe" | "button") => {
    const nextIdx = (idx + CATEGORIES.length) % CATEGORIES.length;
    setActiveIdx(nextIdx);
    track("product_demo_interaction", { variant: "budget", item: CATEGORIES[nextIdx].name, source });
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
        selectCat(activeIdx + 1, "swipe");
      } else {
        selectCat(activeIdx - 1, "swipe");
      }
    }
  };

  const current = CATEGORIES[activeIdx];

  return (
    <section
      id={id}
      className="mobile-budget-stage md:hidden relative overflow-hidden bg-ink min-h-[85svh] flex flex-col justify-center pt-5 pb-6 px-4 text-paper scroll-mt-14"
      aria-labelledby="mobile-budget-stage-title"
    >
      {/* Ambient background glow reflecting selected budget state */}
      <div
        className={`pointer-events-none absolute inset-0 transition-opacity duration-700 ${
          activeIdx === 0
            ? "bg-[radial-gradient(circle_at_50%_40%,rgba(16,185,129,0.20)_0%,rgba(12,10,9,0.95)_75%)]"
            : activeIdx === 1
            ? "bg-[radial-gradient(circle_at_50%_40%,rgba(218,165,32,0.22)_0%,rgba(12,10,9,0.95)_75%)]"
            : "bg-[radial-gradient(circle_at_50%_40%,rgba(225,112,85,0.24)_0%,rgba(12,10,9,0.95)_75%)]"
        }`}
        aria-hidden
      />

      {/* Atmospheric concentric aura rings */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center -z-0 opacity-12" aria-hidden>
        <div className="size-[290px] rounded-full border border-paper/20" />
        <div className="size-[390px] rounded-full border border-paper/10 absolute" />
      </div>

      <div className="relative z-10 mx-auto max-w-[340px] flex flex-col items-center">
        {/* Eyebrow & Headline */}
        <header className="w-full text-center">
          <p className="flex items-center justify-center gap-1.5 text-[9.5px] font-semibold uppercase tracking-[0.22em] text-paper/60">
            <span className="text-vermilion font-display text-xs">03</span>
            <span className="h-px w-5 bg-current opacity-30" />
            <span>Ngân sách theo nhóm</span>
          </p>
          <h2
            id="mobile-budget-stage-title"
            className="mt-1 font-display text-[1.42rem] font-normal leading-[1.12] tracking-tight text-paper text-balance"
          >
            Tập trung vào một hạn mức <span className="italic text-paper/85">mỗi lần</span>
          </h2>
        </header>

        {/* 3-Category Segmented Selector */}
        <nav
          className="mt-2.5 w-full grid grid-cols-3 gap-1 rounded-full border border-paper/15 bg-paper/5 p-0.5 backdrop-blur-md"
          role="tablist"
          aria-label="Chọn nhóm ngân sách"
        >
          {CATEGORIES.map((c, idx) => (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={activeIdx === idx}
              onClick={() => {
                setIsPlaying(false);
                selectCat(idx, "tab");
              }}
              className={`min-h-[2.15rem] rounded-full px-1 text-[11px] font-medium tracking-tight transition-all duration-300 active:scale-95 ${
                activeIdx === idx
                  ? idx === 2
                    ? "bg-[#d9534f] text-paper shadow-md shadow-rose-950/40 font-semibold"
                    : "bg-vermilion text-paper shadow-md shadow-vermilion/40 font-semibold"
                  : "text-paper/65 hover:text-paper"
              }`}
            >
              {c.name} {c.pct}%
            </button>
          ))}
        </nav>

        {/* 2.5D BUDGET THRESHOLD STAGE */}
        <div
          className="relative mt-3.5 w-full flex items-center justify-center touch-pan-y select-none"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          tabIndex={0}
          aria-label="Vuốt ngang để đổi nhóm ngân sách"
        >
          {/* Floating Contextual Chip outside phone */}
          <div
            key={`budget-chip-${activeIdx}`}
            className="absolute -top-2.5 right-1 z-30 flex items-center gap-1.5 rounded-full border border-paper/20 bg-lacquer/95 px-2.5 py-0.5 text-[10px] text-paper shadow-xl backdrop-blur-lg animate-fade-in"
          >
            <span
              className={`size-1.5 rounded-full ${
                current.statusTone === "emerald"
                  ? "bg-emerald-400"
                  : current.statusTone === "gold"
                  ? "bg-gold animate-pulse"
                  : "bg-rose-400 animate-ping"
              }`}
            />
            <span className="font-medium tracking-tight truncate max-w-[210px]">
              {current.chipText}
            </span>
          </div>

          {/* Perspective Phone Chasis */}
          <div
            className="mobile-stage-perspective-wrap"
            style={{
              perspective: "1100px",
            }}
          >
            <div
              className={`mobile-budget-device relative transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                activeIdx === 0
                  ? "rotate-y-[-5deg] rotate-x-[3deg] scale-[0.98]"
                  : activeIdx === 1
                  ? "rotate-y-[-2deg] rotate-x-[2deg] scale-[1.0]"
                  : "rotate-y-[-5deg] rotate-x-[4deg] scale-[0.99]"
              }`}
              style={{
                transformStyle: "preserve-3d",
                width: "228px",
                height: "346px",
              }}
            >
              {/* Outer Phone Frame */}
              <div className="relative h-full w-full overflow-hidden rounded-[2.3rem] border-[3px] border-[#2c241e] bg-lacquer shadow-[0_16px_40px_rgba(0,0,0,0.7),0_6px_16px_rgba(210,58,34,0.15)] ring-1 ring-paper/20">
                {/* Specular glass reflection */}
                <div
                  className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-tr from-white/10 via-transparent to-white/5 opacity-60"
                  aria-hidden
                />

                {/* Dynamic Island */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 h-3 w-14 rounded-full bg-black/95 flex items-center justify-end pr-1" aria-hidden>
                  <span className="size-1 rounded-full bg-[#151c2c]/80" />
                </div>

                {/* Living Sổ Chi Screen */}
                <div className="relative h-full w-full overflow-hidden bg-[#f7f2e7] text-ink select-none flex flex-col justify-between p-2.5 pt-5">
                  {/* Status Bar */}
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

                  {/* Header */}
                  <div className="mt-1 flex items-center justify-between px-0.5">
                    <div>
                      <span className="block text-[8px] text-ink/50 uppercase tracking-wider leading-none">Kế hoạch</span>
                      <strong className="block font-display text-[12.5px] font-semibold leading-tight text-ink">Ngân sách tháng 7</strong>
                    </div>
                    <span className="text-[8px] font-medium text-vermilion">Điều chỉnh</span>
                  </div>

                  {/* Budget Hero Card with Dynamic Progress Ring */}
                  <div className="mt-1.5 rounded-xl bg-lacquer p-2 text-paper shadow-sm">
                    <div className="flex items-center gap-2.5">
                      {/* Ring Visual */}
                      <div className="relative size-12 rounded-full border-3 border-paper/15 flex items-center justify-center shrink-0">
                        <div
                          className={`absolute inset-0 rounded-full border-3 border-transparent border-t-vermilion border-r-vermilion transition-transform duration-700 ${
                            activeIdx === 2 ? "-rotate-12 border-t-rose-400 border-r-rose-400" : "-rotate-45"
                          }`}
                        />
                        <div className="flex flex-col items-center leading-none">
                          <span className="text-[6px] text-paper/60 uppercase">Còn</span>
                          <b className="text-[8px] font-bold text-paper">3,8 tr</b>
                        </div>
                      </div>
                      {/* Ring Details */}
                      <div className="flex flex-col">
                        <span className="text-[7.5px] text-paper/70">Tổng ngân sách tháng</span>
                        <strong className="font-display text-[11.5px] font-semibold text-paper">10.000.000 ₫</strong>
                        <span className="text-[7.5px] text-emerald-300 font-medium">Đã dùng 62% ngân sách</span>
                      </div>
                    </div>
                  </div>

                  {/* Categories List with Active Focus */}
                  <div className="mt-1 flex-1 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-[8.5px] text-ink/75 px-0.5">
                      <strong className="font-display font-semibold text-ink">Hạn mức theo nhóm</strong>
                      <span className="text-[7.5px] text-ink/50">3 nhóm chính</span>
                    </div>

                    <div className="flex flex-col gap-1 my-1">
                      {CATEGORIES.map((cat, idx) => (
                        <div
                          key={cat.id}
                          className={`flex flex-col rounded-lg p-1.5 transition-all duration-300 ${
                            activeIdx === idx
                              ? idx === 2
                                ? "bg-rose-500/10 border border-rose-400/60 shadow-xs"
                                : "bg-vermilion/10 border border-vermilion/50 shadow-xs"
                              : "bg-ink/5 border border-transparent opacity-65"
                          }`}
                        >
                          <div className="flex items-center justify-between text-[8px]">
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`flex size-5 items-center justify-center rounded text-[8px] font-bold ${
                                  idx === 0
                                    ? "bg-emerald-600/15 text-emerald-800"
                                    : idx === 1
                                    ? "bg-gold/20 text-ink"
                                    : "bg-rose-500/20 text-rose-800"
                                }`}
                              >
                                {cat.icon}
                              </span>
                              <div>
                                <b className="font-medium text-ink leading-tight block">{cat.name}</b>
                                <span className="text-[6.5px] text-ink/50">{cat.used} / {cat.total}</span>
                              </div>
                            </div>
                            <b
                              className={`font-semibold ${
                                idx === 2 ? "text-rose-700" : "text-ink"
                              }`}
                            >
                              {cat.pct}%
                            </b>
                          </div>
                          {/* Progress Track */}
                          <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-ink/10">
                            <div
                              style={{ width: `${cat.pct}%` }}
                              className={`h-full transition-all duration-700 ${
                                idx === 2
                                  ? "bg-gradient-to-r from-amber-500 to-rose-500"
                                  : "bg-vermilion"
                              }`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Restrained Alert Banner (No flashing red) */}
                    <div
                      className={`rounded-lg p-1 text-center text-[7.5px] transition-all duration-300 ${
                        activeIdx === 2
                          ? "bg-rose-50 border border-rose-300 text-rose-900 font-medium"
                          : activeIdx === 0
                          ? "bg-emerald-50 border border-emerald-200 text-emerald-800 font-medium"
                          : "bg-gold/15 border border-gold/30 text-ink font-medium"
                      }`}
                    >
                      {activeIdx === 2
                        ? "⚠ Mua sắm còn 100.000 ₫ — cân nhắc trước khoản chi mới"
                        : activeIdx === 0
                        ? "✓ Ăn uống còn 1.110.000 ₫ — trong tầm kiểm soát an toàn"
                        : "✓ Di chuyển còn 520.000 ₫ — tiến độ chi tiêu bình thường"}
                    </div>
                  </div>

                  {/* Bottom Nav */}
                  <div className="mt-1 flex items-center justify-around border-t border-ink/10 pt-0.5 text-[7px] text-ink/50" aria-hidden>
                    <span>Tổng quan</span>
                    <span>Thống kê</span>
                    <span className="font-semibold text-vermilion flex flex-col items-center">
                      <b className="size-0.5 rounded-full bg-vermilion mb-0.5" />
                      Ngân sách
                    </span>
                  </div>
                </div>
              </div>

              {/* Ground Shadow */}
              <div
                className="pointer-events-none absolute -bottom-4 inset-x-4 h-5 rounded-full bg-black/60 blur-md -z-10"
                aria-hidden
              />
            </div>
          </div>
        </div>

        {/* Short Supporting Editorial Copy */}
        <div className="mt-3 w-full text-center px-1">
          <span
            className={`text-[9.5px] font-bold uppercase tracking-[0.16em] ${
              activeIdx === 2 ? "text-rose-400" : "text-vermilion"
            }`}
          >
            {current.statusBadge}
          </span>
          <h3 className="mt-0.5 font-display text-[1.15rem] font-medium leading-snug text-paper text-balance">
            {current.title}
          </h3>
          <p className="mt-0.5 text-[11.5px] leading-relaxed text-paper/70 text-balance">
            {current.desc}
          </p>
        </div>

        {/* Navigation Controls */}
        <div className="mt-2.5 w-full flex items-center justify-between px-0.5">
          {/* Previous Button */}
          <button
            type="button"
            onClick={() => {
              setIsPlaying(false);
              selectCat(activeIdx - 1, "button");
            }}
            className="flex size-11 items-center justify-center rounded-full border border-paper/20 bg-paper/5 text-paper transition-all hover:bg-paper/15 active:scale-95 text-xs focus-visible:ring-2 focus-visible:ring-vermilion focus-visible:outline-none"
            aria-label="Nhóm trước"
          >
            ←
          </button>

          {/* Dots Indicator */}
          <div className="flex items-center gap-1.5" aria-label={`Nhóm ${activeIdx + 1} trên 3`}>
            {CATEGORIES.map((c, idx) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setIsPlaying(false);
                  selectCat(idx, "button");
                }}
                className={`transition-all duration-300 rounded-full focus-visible:ring-2 focus-visible:ring-vermilion focus-visible:outline-none ${
                  activeIdx === idx
                    ? idx === 2
                      ? "h-2 w-5 bg-rose-400"
                      : "h-2 w-5 bg-vermilion"
                    : "size-2 bg-paper/25 hover:bg-paper/50"
                }`}
                aria-label={`Xem nhóm ${c.name}`}
              />
            ))}
          </div>

          {/* Next Action Button */}
          <button
            type="button"
            onClick={() => {
              if (activeIdx === CATEGORIES.length - 1) {
                setIsPlaying(false);
                selectCat(0, "button");
              } else {
                setIsPlaying(false);
                selectCat(activeIdx + 1, "button");
              }
            }}
            className={`flex min-h-11 items-center gap-1 rounded-full px-4 text-[11.5px] font-semibold uppercase tracking-[0.1em] text-paper shadow-md transition-all hover:opacity-90 active:scale-95 focus-visible:ring-2 focus-visible:ring-vermilion focus-visible:outline-none ${
              activeIdx === 2
                ? "bg-[#d9534f] shadow-rose-950/30"
                : "bg-vermilion shadow-vermilion/30"
            }`}
          >
            <span>{activeIdx === CATEGORIES.length - 1 ? "Xem lại ↺" : "Tiếp theo →"}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
