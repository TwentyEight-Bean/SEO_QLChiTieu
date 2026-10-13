import { useState, useEffect, useRef, type PointerEvent } from "react";
import { track } from "../lib";

interface StatMode {
  id: string;
  tabLabel: string;
  badge: string;
  title: string;
  desc: string;
  chip: {
    text: string;
    tone: "vermilion" | "gold" | "emerald";
  };
}

const MODES: StatMode[] = [
  {
    id: "total",
    tabLabel: "Tổng chi",
    badge: "GÓC NHÌN 01 / 03 · TỔNG QUAN",
    title: "Biết tháng này đã tiêu bao nhiêu",
    desc: "Một con số rõ ràng để bạn biết mình đang đi đúng hướng hay không.",
    chip: {
      text: "Tổng chi: 6.240.000 ₫ (↓ 12%)",
      tone: "emerald",
    },
  },
  {
    id: "category",
    tabLabel: "Nhóm chi",
    badge: "GÓC NHÌN 02 / 03 · CƠ CẤU",
    title: "Nhận ra khoản nào đang chi nhiều nhất",
    desc: "Xem tỷ trọng từng nhóm mà không phải dò lại từng giao dịch nhỏ lẻ.",
    chip: {
      text: "Ăn uống chiếm 38% ngân sách",
      tone: "gold",
    },
  },
  {
    id: "trend",
    tabLabel: "Thời gian",
    badge: "GÓC NHÌN 03 / 03 · XU HƯỚNG",
    title: "Thấy xu hướng qua từng giai đoạn",
    desc: "So sánh các tháng để điều chỉnh trước khi chi tiêu vượt kế hoạch.",
    chip: {
      text: "↓ Giảm 8% so với TB 3 tháng",
      tone: "vermilion",
    },
  },
];

export default function MobileStatisticsStage({ id = "mobile-statistics-stage" }: { id?: string }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const pointerStart = useRef<number | null>(null);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev < MODES.length - 1 ? prev + 1 : 0));
    }, 3200);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const selectMode = (idx: number, source: "tab" | "swipe" | "button") => {
    const nextIdx = (idx + MODES.length) % MODES.length;
    setActiveIdx(nextIdx);
    track("product_demo_interaction", { variant: "statistics", mode: MODES[nextIdx].id, source });
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
        selectMode(activeIdx + 1, "swipe");
      } else {
        selectMode(activeIdx - 1, "swipe");
      }
    }
  };

  const current = MODES[activeIdx];
  const bars = [42, 61, 48, 76, 58, 88, 68];

  return (
    <section
      id={id}
      className="mobile-statistics-stage md:hidden relative overflow-hidden bg-ink min-h-[85svh] flex flex-col justify-center pt-5 pb-6 px-4 text-paper scroll-mt-14"
      aria-labelledby="mobile-stat-stage-title"
    >
      {/* Ambient background glow matching current data dimension */}
      <div
        className={`pointer-events-none absolute inset-0 transition-opacity duration-700 ${
          activeIdx === 0
            ? "bg-[radial-gradient(circle_at_50%_40%,rgba(16,185,129,0.20)_0%,rgba(12,10,9,0.95)_75%)]"
            : activeIdx === 1
            ? "bg-[radial-gradient(circle_at_50%_40%,rgba(218,165,32,0.22)_0%,rgba(12,10,9,0.95)_75%)]"
            : "bg-[radial-gradient(circle_at_50%_42%,rgba(210,58,34,0.22)_0%,rgba(12,10,9,0.95)_75%)]"
        }`}
        aria-hidden
      />

      {/* Atmospheric coordinate grid rings */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center -z-0 opacity-12" aria-hidden>
        <div className="size-[290px] rounded-full border border-paper/20" />
        <div className="size-[390px] rounded-full border border-paper/10 absolute" />
      </div>

      <div className="relative z-10 mx-auto max-w-[340px] flex flex-col items-center">
        {/* Eyebrow & Headline */}
        <header className="w-full text-center">
          <p className="flex items-center justify-center gap-1.5 text-[9.5px] font-semibold uppercase tracking-[0.22em] text-paper/60">
            <span className="text-gold font-display text-xs">02</span>
            <span className="h-px w-5 bg-current opacity-30" />
            <span>Thống kê tài chính</span>
          </p>
          <h2
            id="mobile-stat-stage-title"
            className="mt-1 font-display text-[1.42rem] font-normal leading-[1.12] tracking-tight text-paper text-balance"
          >
            Đọc bức tranh tiền bạc <span className="italic text-paper/85">theo cách bạn cần</span>
          </h2>
        </header>

        {/* 3-Mode Segmented Selector */}
        <nav
          className="mt-2.5 w-full grid grid-cols-3 gap-1 rounded-full border border-paper/15 bg-paper/5 p-0.5 backdrop-blur-md"
          role="tablist"
          aria-label="Các góc nhìn thống kê"
        >
          {MODES.map((m, idx) => (
            <button
              key={m.id}
              type="button"
              role="tab"
              aria-selected={activeIdx === idx}
              onClick={() => {
                setIsPlaying(false);
                selectMode(idx, "tab");
              }}
              className={`min-h-[2.15rem] rounded-full px-1 text-[11px] font-medium tracking-tight transition-all duration-300 active:scale-95 ${
                activeIdx === idx
                  ? "bg-gold text-ink shadow-md shadow-gold/30 font-semibold"
                  : "text-paper/65 hover:text-paper"
              }`}
            >
              {m.tabLabel}
            </button>
          ))}
        </nav>

        {/* 2.5D DATA EXPANSION STAGE */}
        <div
          className="relative mt-3.5 w-full flex items-center justify-center touch-pan-y select-none"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          tabIndex={0}
          aria-label="Vuốt ngang để đổi góc nhìn dữ liệu"
        >
          {/* Floating Contextual Pill outside phone */}
          <div
            key={`stat-chip-${activeIdx}`}
            className="absolute -top-2.5 right-1 z-30 flex items-center gap-1.5 rounded-full border border-paper/20 bg-lacquer/95 px-2.5 py-0.5 text-[10px] text-paper shadow-xl backdrop-blur-lg animate-fade-in"
          >
            <span
              className={`size-1.5 rounded-full ${
                current.chip.tone === "emerald"
                  ? "bg-emerald-400"
                  : current.chip.tone === "gold"
                  ? "bg-gold animate-pulse"
                  : "bg-vermilion animate-ping"
              }`}
            />
            <span className="font-medium tracking-tight truncate max-w-[210px]">
              {current.chip.text}
            </span>
          </div>

          {/* Perspective Rig: Phone recedes, Data expands in 2.5D */}
          <div
            className="mobile-stage-perspective-wrap"
            style={{
              perspective: "1100px",
            }}
          >
            <div
              className={`mobile-stat-device relative transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                activeIdx === 0
                  ? "rotate-y-[4deg] rotate-x-[2deg] scale-[0.98]"
                  : activeIdx === 1
                  ? "rotate-y-[-4deg] rotate-x-[3deg] scale-[0.99]"
                  : "rotate-y-[2deg] rotate-x-[1deg] scale-[1.0]"
              }`}
              style={{
                transformStyle: "preserve-3d",
                width: "228px",
                height: "346px",
              }}
            >
              {/* Outer Phone Frame */}
              <div className="relative h-full w-full overflow-hidden rounded-[2.3rem] border-[3px] border-[#2c241e] bg-lacquer shadow-[0_16px_40px_rgba(0,0,0,0.7),0_6px_16px_rgba(200,150,40,0.15)] ring-1 ring-paper/20">
                {/* Specular Highlight */}
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

                  {/* Screen Header */}
                  <div className="mt-1 flex items-center justify-between px-0.5">
                    <div>
                      <span className="block text-[8px] text-ink/50 uppercase tracking-wider leading-none">Báo cáo</span>
                      <strong className="block font-display text-[12.5px] font-semibold leading-tight text-ink">Tháng 7, 2025</strong>
                    </div>
                    {/* Period Switcher inside phone */}
                    <div className="flex items-center rounded-full bg-ink/10 p-0.5 text-[7.5px] font-medium text-ink/60">
                      <span className="px-1.5 py-0.2">Tuần</span>
                      <span className="rounded-full bg-paper px-1.5 py-0.2 text-ink font-semibold shadow-2xs">Tháng</span>
                      <span className="px-1.5 py-0.2">Năm</span>
                    </div>
                  </div>

                  {/* Card 1: Stat Summary */}
                  <div className="mt-1.5 rounded-xl bg-lacquer p-2 text-paper shadow-sm">
                    <div className="flex items-center justify-between text-[8px] text-paper/70">
                      <span>Tổng chi tiêu tháng</span>
                      <span className="rounded-full bg-emerald-500/20 border border-emerald-400/30 px-1 py-0.2 text-[7px] font-semibold text-emerald-300">
                        ↓ 12%
                      </span>
                    </div>
                    <strong className="block mt-0.5 font-display text-[14px] font-semibold tracking-tight text-paper">
                      6.240.000 ₫
                    </strong>
                    <div className="mt-0.5 flex items-center justify-between text-[7.5px] text-paper/60">
                      <span>Tháng trước: 7.100.000 ₫</span>
                      <span className="text-emerald-300 font-medium">Tiết kiệm 860k</span>
                    </div>
                  </div>

                  {/* Mode-Specific Data Visual Layers */}
                  <div className="mt-1 flex-1 relative flex flex-col justify-between">
                    {/* Mode 0: Interactive Bar Chart */}
                    {activeIdx === 0 && (
                      <div className="h-full flex flex-col justify-between animate-fade-in">
                        <div className="flex items-center justify-between text-[8.5px] text-ink/75 px-0.5">
                          <span className="font-semibold">Chi theo ngày trong tuần</span>
                          <span className="text-[7.5px] text-vermilion font-medium">Hôm qua cao nhất (88%)</span>
                        </div>
                        {/* Bar Chart Container */}
                        <div className="my-1.5 flex h-20 items-end justify-between gap-1 rounded-lg bg-ink/5 p-2">
                          {bars.map((h, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                              <div
                                style={{ height: `${h}%` }}
                                className={`w-full rounded-t-sm transition-all duration-500 ${
                                  i === 5
                                    ? "bg-vermilion shadow-sm shadow-vermilion/50"
                                    : "bg-lacquer/40 hover:bg-lacquer/60"
                                }`}
                              />
                              <span className={`text-[7px] ${i === 5 ? "font-bold text-vermilion" : "text-ink/50"}`}>
                                T{i + 2}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-1.5 text-center text-[7.5px] text-emerald-800 font-medium">
                          ✓ Đang ở mức chi tiêu an toàn của tuần
                        </div>
                      </div>
                    )}

                    {/* Mode 1: Donut Structure with Expanded Foreground Breakdown */}
                    {activeIdx === 1 && (
                      <div className="h-full flex flex-col justify-between animate-fade-in">
                        <div className="flex items-center justify-between text-[8.5px] text-ink/75 px-0.5">
                          <span className="font-semibold">Cơ cấu chi theo nhóm</span>
                          <span className="text-[7.5px] text-gold font-bold">100% tỷ trọng</span>
                        </div>
                        {/* Donut & Legend representation */}
                        <div className="my-1 flex items-center justify-around rounded-lg bg-ink/5 p-2 gap-2">
                          {/* Mini Donut graphic */}
                          <div className="relative size-16 rounded-full border-4 border-vermilion flex items-center justify-center shrink-0">
                            <div className="absolute inset-0 rounded-full border-4 border-gold border-t-transparent border-l-transparent -rotate-45" />
                            <div className="flex flex-col items-center leading-none">
                              <span className="text-[9px] font-bold text-ink">38%</span>
                              <span className="text-[6.5px] text-ink/50">Ăn uống</span>
                            </div>
                          </div>
                          {/* Legend list */}
                          <div className="flex flex-col gap-1 text-[8px] flex-1">
                            <div className="flex items-center justify-between">
                              <span className="flex items-center gap-1">
                                <span className="size-1.5 rounded-full bg-vermilion" />
                                <span>Ăn uống</span>
                              </span>
                              <b className="font-semibold text-vermilion">38%</b>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="flex items-center gap-1">
                                <span className="size-1.5 rounded-full bg-lacquer" />
                                <span>Nhà ở</span>
                              </span>
                              <b className="font-semibold text-ink">27%</b>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="flex items-center gap-1">
                                <span className="size-1.5 rounded-full bg-gold" />
                                <span>Di chuyển</span>
                              </span>
                              <b className="font-semibold text-gold">19%</b>
                            </div>
                          </div>
                        </div>
                        <div className="rounded-lg bg-gold/15 border border-gold/30 p-1.5 text-center text-[7.5px] text-ink font-medium">
                          Khoản chi ăn uống đang chiếm phần lớn chi tiêu
                        </div>
                      </div>
                    )}

                    {/* Mode 2: Multi-Month Trend Forecast */}
                    {activeIdx === 2 && (
                      <div className="h-full flex flex-col justify-between animate-fade-in">
                        <div className="flex items-center justify-between text-[8.5px] text-ink/75 px-0.5">
                          <span className="font-semibold">Xu hướng 3 tháng gần nhất</span>
                          <span className="text-[7.5px] text-emerald-700 font-bold">Xu hướng giảm</span>
                        </div>
                        <div className="my-1 flex flex-col gap-1.5 rounded-lg bg-ink/5 p-2 text-[8px]">
                          <div className="flex items-center justify-between">
                            <span className="text-ink/60">Tháng 5</span>
                            <div className="flex items-center gap-1.5 flex-1 mx-2">
                              <div className="h-2 rounded-full bg-lacquer/30 w-[82%]" />
                            </div>
                            <b className="font-mono text-[8px]">6,8 tr</b>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-ink/60">Tháng 6</span>
                            <div className="flex items-center gap-1.5 flex-1 mx-2">
                              <div className="h-2 rounded-full bg-vermilion/50 w-[89%]" />
                            </div>
                            <b className="font-mono text-[8px]">7,1 tr</b>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-emerald-700">Tháng 7</span>
                            <div className="flex items-center gap-1.5 flex-1 mx-2">
                              <div className="h-2 rounded-full bg-emerald-600 w-[74%]" />
                            </div>
                            <b className="font-mono text-[8px] text-emerald-700">6,24 tr</b>
                          </div>
                        </div>
                        <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-1.5 text-center text-[7.5px] text-emerald-800 font-medium">
                          Chi tiêu giảm đều đặn so với 2 tháng trước
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bottom Navigation */}
                  <div className="mt-1 flex items-center justify-around border-t border-ink/10 pt-0.5 text-[7px] text-ink/50" aria-hidden>
                    <span>Tổng quan</span>
                    <span className="font-semibold text-gold flex flex-col items-center">
                      <b className="size-0.5 rounded-full bg-gold mb-0.5" />
                      Thống kê
                    </span>
                    <span>Ngân sách</span>
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
          <span className="text-[9.5px] font-bold uppercase tracking-[0.16em] text-gold">
            {current.badge}
          </span>
          <h3 className="mt-0.5 font-display text-[1.15rem] font-medium leading-snug text-paper text-balance">
            {current.title}
          </h3>
          <p className="mt-0.5 text-[11.5px] leading-relaxed text-paper/70 text-balance">
            {current.desc}
          </p>
        </div>

        {/* Navigation Controls: Prev / Dots / Next */}
        <div className="mt-2.5 w-full flex items-center justify-between px-0.5">
          {/* Previous Button */}
          <button
            type="button"
            onClick={() => {
              setIsPlaying(false);
              selectMode(activeIdx - 1, "button");
            }}
            className="flex size-11 items-center justify-center rounded-full border border-paper/20 bg-paper/5 text-paper transition-all hover:bg-paper/15 active:scale-95 text-xs focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none"
            aria-label="Góc nhìn trước"
          >
            ←
          </button>

          {/* Dots Indicator */}
          <div className="flex items-center gap-1.5" aria-label={`Góc nhìn ${activeIdx + 1} trên 3`}>
            {MODES.map((m, idx) => (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  setIsPlaying(false);
                  selectMode(idx, "button");
                }}
                className={`transition-all duration-300 rounded-full focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none ${
                  activeIdx === idx
                    ? "h-2 w-5 bg-gold"
                    : "size-2 bg-paper/25 hover:bg-paper/50"
                }`}
                aria-label={`Xem ${m.tabLabel}`}
              />
            ))}
          </div>

          {/* Next Action Button */}
          <button
            type="button"
            onClick={() => {
              if (activeIdx === MODES.length - 1) {
                setIsPlaying(false);
                selectMode(0, "button");
              } else {
                setIsPlaying(false);
                selectMode(activeIdx + 1, "button");
              }
            }}
            className="flex min-h-11 items-center gap-1 rounded-full bg-gold px-4 text-[11.5px] font-semibold uppercase tracking-[0.1em] text-ink shadow-md shadow-gold/30 transition-all hover:opacity-90 active:scale-95 focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none"
          >
            <span>{activeIdx === MODES.length - 1 ? "Xem lại ↺" : "Tiếp theo →"}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
