import { useState, useEffect, useRef, type PointerEvent } from "react";
import { track } from "../lib";

interface FeatureScreen {
  id: "thu-chi" | "thong-ke" | "ngan-sach";
  name: string;
  badge: string;
  title: string;
  desc: string;
  chipText: string;
  chipTone: "vermilion" | "gold" | "emerald";
}

const SCREENS: FeatureScreen[] = [
  {
    id: "thu-chi",
    name: "Theo dõi",
    badge: "HỆ SINH THÁI 01 / 03 · THEO DÕI",
    title: "Ghi chép và dòng tiền hôm nay",
    desc: "Mỗi khoản thu chi lập tức vào đúng nhóm và cập nhật số dư khả dụng tức thì.",
    chipText: "Theo dõi dòng tiền hàng ngày",
    chipTone: "vermilion",
  },
  {
    id: "thong-ke",
    name: "Thống kê",
    badge: "HỆ SINH THÁI 02 / 03 · THỐNG KÊ",
    title: "Hiểu rõ tiền đang đi về đâu",
    desc: "Biểu đồ trực quan giúp nhận ra nhóm chi tiêu nhiều nhất và xu hướng qua các tháng.",
    chipText: "Phân tích cơ cấu & xu hướng",
    chipTone: "gold",
  },
  {
    id: "ngan-sach",
    name: "Ngân sách",
    badge: "HỆ SINH THÁI 03 / 03 · NGÂN SÁCH",
    title: "Chủ động hạn mức và kiểm soát",
    desc: "Biết chính xác số tiền còn lại của từng danh mục để chi tiêu tự tin đến cuối tháng.",
    chipText: "Kiểm soát hạn mức từng nhóm",
    chipTone: "emerald",
  },
];

function MiniPhoneScreen({ screenId }: { screenId: "thu-chi" | "thong-ke" | "ngan-sach" }) {
  if (screenId === "thu-chi") {
    return (
      <div className="flex flex-col justify-between h-full p-2.5 pt-4 text-ink select-none">
        <div className="flex items-center justify-between text-[7px] text-ink/60">
          <span>09:41</span>
          <span>5G</span>
        </div>
        <div>
          <span className="text-[7.5px] text-ink/50 uppercase">Xin chào,</span>
          <strong className="block font-display text-[11px] font-semibold text-ink leading-none">Minh Anh</strong>
        </div>
        <div className="rounded-lg bg-lacquer p-1.5 text-paper shadow-2xs">
          <span className="text-[7px] text-paper/70">Số dư hiện tại</span>
          <strong className="block font-display text-[11px] font-semibold text-paper">24.635.000 ₫</strong>
          <div className="mt-1 flex justify-between text-[6.5px] text-paper/60 border-t border-paper/15 pt-0.5">
            <span>Thu: ↑18,5 tr</span>
            <span>Chi: ↓6,25 tr</span>
          </div>
        </div>
        <div className="flex flex-col gap-1 text-[7px]">
          <div className="flex items-center justify-between rounded p-1 bg-vermilion/10 border border-vermilion/40">
            <span>Ă · Cà phê sáng</span>
            <b className="text-vermilion">−45.000 ₫</b>
          </div>
          <div className="flex items-center justify-between rounded p-1 bg-ink/5">
            <span>Ă · Bữa trưa</span>
            <b>−85.000 ₫</b>
          </div>
        </div>
        <div className="rounded-full bg-vermilion p-1 text-center text-[7px] text-paper font-medium">
          + Ghi giao dịch
        </div>
      </div>
    );
  }

  if (screenId === "thong-ke") {
    return (
      <div className="flex flex-col justify-between h-full p-2.5 pt-4 text-ink select-none">
        <div className="flex items-center justify-between text-[7px] text-ink/60">
          <span>09:41</span>
          <span>5G</span>
        </div>
        <div>
          <span className="text-[7.5px] text-ink/50 uppercase">Báo cáo</span>
          <strong className="block font-display text-[11px] font-semibold text-ink leading-none">Tháng 7, 2025</strong>
        </div>
        <div className="rounded-lg bg-lacquer p-1.5 text-paper shadow-2xs">
          <span className="text-[7px] text-paper/70">Tổng chi tiêu</span>
          <strong className="block font-display text-[11px] font-semibold text-paper">6.240.000 ₫</strong>
          <span className="text-[6.5px] text-emerald-300">↓ 12% so với tháng trước</span>
        </div>
        {/* Mini Bars */}
        <div className="flex items-end justify-between gap-1 h-12 bg-ink/5 rounded p-1">
          {[35, 55, 45, 70, 50, 85, 60].map((h, i) => (
            <div key={i} style={{ height: `${h}%` }} className={`w-full rounded-t-xs ${i === 5 ? "bg-vermilion" : "bg-lacquer/50"}`} />
          ))}
        </div>
        <div className="rounded bg-gold/15 p-1 text-center text-[7px] text-ink font-medium">
          Ăn uống chiếm 38%
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between h-full p-2.5 pt-4 text-ink select-none">
      <div className="flex items-center justify-between text-[7px] text-ink/60">
        <span>09:41</span>
        <span>5G</span>
      </div>
      <div>
        <span className="text-[7.5px] text-ink/50 uppercase">Kế hoạch</span>
        <strong className="block font-display text-[11px] font-semibold text-ink leading-none">Ngân sách tháng 7</strong>
      </div>
      <div className="rounded-lg bg-lacquer p-1.5 text-paper shadow-2xs flex items-center gap-1.5">
        <div className="size-8 rounded-full border-2 border-paper/20 border-t-vermilion flex items-center justify-center shrink-0">
          <span className="text-[6px] font-bold">62%</span>
        </div>
        <div>
          <span className="text-[6.5px] text-paper/60">Còn lại</span>
          <b className="block text-[8px] text-paper leading-tight">3.800.000 ₫</b>
        </div>
      </div>
      <div className="flex flex-col gap-1 text-[7px]">
        <div className="rounded p-1 bg-ink/5">
          <div className="flex justify-between">
            <span>Ăn uống</span>
            <b>63%</b>
          </div>
          <div className="h-0.5 bg-ink/10 rounded-full mt-0.5"><div className="h-full bg-vermilion w-[63%]" /></div>
        </div>
        <div className="rounded p-1 bg-rose-50 border border-rose-200">
          <div className="flex justify-between text-rose-800">
            <span>Mua sắm</span>
            <b>91%</b>
          </div>
          <div className="h-0.5 bg-ink/10 rounded-full mt-0.5"><div className="h-full bg-rose-500 w-[91%]" /></div>
        </div>
      </div>
      <div className="rounded bg-rose-100 p-1 text-center text-[6.5px] text-rose-900 font-medium">
        Mua sắm sắp chạm trần
      </div>
    </div>
  );
}

export default function MobileFeaturesStage({ id = "mobile-features-stage" }: { id?: string }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const pointerStart = useRef<number | null>(null);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev < SCREENS.length - 1 ? prev + 1 : 0));
    }, 3400);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const selectScreen = (idx: number, source: "tab" | "swipe" | "button") => {
    const nextIdx = (idx + SCREENS.length) % SCREENS.length;
    setActiveIdx(nextIdx);
    track("product_demo_interaction", { variant: "features", feature: SCREENS[nextIdx].id, source });
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
        selectScreen(activeIdx + 1, "swipe");
      } else {
        selectScreen(activeIdx - 1, "swipe");
      }
    }
  };

  const current = SCREENS[activeIdx];
  const prevIdx = (activeIdx - 1 + SCREENS.length) % SCREENS.length;
  const nextIdx = (activeIdx + 1) % SCREENS.length;

  return (
    <section
      id={id}
      className="mobile-features-stage md:hidden relative overflow-hidden bg-ink min-h-[85svh] flex flex-col justify-center pt-5 pb-6 px-4 text-paper scroll-mt-14"
      aria-labelledby="mobile-feat-stage-title"
    >
      {/* Ambient Radial Aura */}
      <div
        className={`pointer-events-none absolute inset-0 transition-opacity duration-700 ${
          activeIdx === 0
            ? "bg-[radial-gradient(circle_at_50%_40%,rgba(210,58,34,0.22)_0%,rgba(12,10,9,0.95)_75%)]"
            : activeIdx === 1
            ? "bg-[radial-gradient(circle_at_50%_40%,rgba(218,165,32,0.22)_0%,rgba(12,10,9,0.95)_75%)]"
            : "bg-[radial-gradient(circle_at_50%_40%,rgba(16,185,129,0.20)_0%,rgba(12,10,9,0.95)_75%)]"
        }`}
        aria-hidden
      />

      {/* Atmospheric concentric rings */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center -z-0 opacity-12" aria-hidden>
        <div className="size-[290px] rounded-full border border-paper/20" />
        <div className="size-[390px] rounded-full border border-paper/10 absolute" />
      </div>

      <div className="relative z-10 mx-auto max-w-[340px] flex flex-col items-center">
        {/* Eyebrow & Headline */}
        <header className="w-full text-center">
          <p className="flex items-center justify-center gap-1.5 text-[9.5px] font-semibold uppercase tracking-[0.22em] text-paper/60">
            <span className="text-vermilion font-display text-xs">04</span>
            <span className="h-px w-5 bg-current opacity-30" />
            <span>Hệ sinh thái tính năng</span>
          </p>
          <h2
            id="mobile-feat-stage-title"
            className="mt-1 font-display text-[1.42rem] font-normal leading-[1.12] tracking-tight text-paper text-balance"
          >
            Ba trụ cột quản lý tiền <span className="italic text-paper/85">trong một ứng dụng</span>
          </h2>
        </header>

        {/* 3-Feature Segmented Selector */}
        <nav
          className="mt-2.5 w-full grid grid-cols-3 gap-1 rounded-full border border-paper/15 bg-paper/5 p-0.5 backdrop-blur-md"
          role="tablist"
          aria-label="Chọn tính năng trong hệ sinh thái"
        >
          {SCREENS.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={activeIdx === idx}
              onClick={() => {
                setIsPlaying(false);
                selectScreen(idx, "tab");
              }}
              className={`min-h-[2.15rem] rounded-full px-1 text-[11px] font-medium tracking-tight transition-all duration-300 active:scale-95 ${
                activeIdx === idx
                  ? "bg-vermilion text-paper shadow-md shadow-vermilion/40 font-semibold"
                  : "text-paper/65 hover:text-paper"
              }`}
            >
              {s.name}
            </button>
          ))}
        </nav>

        {/* 2.5D EXPLODED PRODUCT ECOSYSTEM STAGE */}
        <div
          className="relative mt-3.5 w-full flex items-center justify-center touch-pan-y select-none min-h-[355px]"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          tabIndex={0}
          aria-label="Vuốt ngang để đổi màn hình tính năng"
        >
          {/* Floating Contextual Chip */}
          <div
            key={`feat-chip-${activeIdx}`}
            className="absolute -top-2.5 right-1 z-30 flex items-center gap-1.5 rounded-full border border-paper/20 bg-lacquer/95 px-2.5 py-0.5 text-[10px] text-paper shadow-xl backdrop-blur-lg animate-fade-in"
          >
            <span
              className={`size-1.5 rounded-full ${
                current.chipTone === "vermilion"
                  ? "bg-vermilion animate-ping"
                  : current.chipTone === "gold"
                  ? "bg-gold animate-pulse"
                  : "bg-emerald-400"
              }`}
            />
            <span className="font-medium tracking-tight truncate max-w-[210px]">
              {current.chipText}
            </span>
          </div>

          {/* Exploded 3-Phone Orbital Perspective Container */}
          <div
            className="mobile-stage-perspective-wrap relative flex items-center justify-center w-full"
            style={{
              perspective: "1200px",
            }}
          >
            {/* 1. Behind / Left Orbital Phone */}
            <div
              onClick={() => selectScreen(prevIdx, "button")}
              className="absolute left-0 cursor-pointer transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] opacity-40 hover:opacity-60"
              style={{
                width: "170px",
                height: "270px",
                transform: "translateX(-45px) rotateY(20deg) scale(0.82) translateZ(-60px)",
                zIndex: 5,
              }}
              aria-label={`Chuyển sang ${SCREENS[prevIdx].name}`}
            >
              <div className="h-full w-full rounded-[1.8rem] border-[2px] border-paper/15 bg-lacquer overflow-hidden shadow-lg">
                <div className="h-full w-full bg-[#f7f2e7] pointer-events-none opacity-85">
                  <MiniPhoneScreen screenId={SCREENS[prevIdx].id} />
                </div>
              </div>
            </div>

            {/* 2. Center / Primary Focus Phone */}
            <div
              className="relative transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                width: "228px",
                height: "346px",
                transform: "rotateY(-4deg) rotateX(2deg) scale(1.0) translateZ(25px)",
                zIndex: 20,
              }}
            >
              {/* Outer Phone Frame */}
              <div className="relative h-full w-full overflow-hidden rounded-[2.3rem] border-[3px] border-[#2c241e] bg-lacquer shadow-[0_18px_45px_rgba(0,0,0,0.75),0_6px_16px_rgba(210,58,34,0.15)] ring-1 ring-paper/20">
                {/* Specular glass reflection */}
                <div
                  className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-tr from-white/10 via-transparent to-white/5 opacity-60"
                  aria-hidden
                />

                {/* Dynamic Island */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 h-3 w-14 rounded-full bg-black/95 flex items-center justify-end pr-1" aria-hidden>
                  <span className="size-1 rounded-full bg-[#151c2c]/80" />
                </div>

                {/* Living Active Feature Screen */}
                <div className="relative h-full w-full overflow-hidden bg-[#f7f2e7] text-ink">
                  <MiniPhoneScreen screenId={current.id} />
                </div>
              </div>

              {/* Ground Shadow */}
              <div
                className="pointer-events-none absolute -bottom-4 inset-x-4 h-5 rounded-full bg-black/60 blur-md -z-10"
                aria-hidden
              />
            </div>

            {/* 3. Foreground / Right Orbital Phone */}
            <div
              onClick={() => selectScreen(nextIdx, "button")}
              className="absolute right-0 cursor-pointer transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] opacity-40 hover:opacity-60"
              style={{
                width: "170px",
                height: "270px",
                transform: "translateX(45px) rotateY(-20deg) scale(0.82) translateZ(-60px)",
                zIndex: 5,
              }}
              aria-label={`Chuyển sang ${SCREENS[nextIdx].name}`}
            >
              <div className="h-full w-full rounded-[1.8rem] border-[2px] border-paper/15 bg-lacquer overflow-hidden shadow-lg">
                <div className="h-full w-full bg-[#f7f2e7] pointer-events-none opacity-85">
                  <MiniPhoneScreen screenId={SCREENS[nextIdx].id} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Short Supporting Editorial Copy */}
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

        {/* Navigation Controls */}
        <div className="mt-2.5 w-full flex items-center justify-between px-0.5">
          {/* Previous Button */}
          <button
            type="button"
            onClick={() => {
              setIsPlaying(false);
              selectScreen(activeIdx - 1, "button");
            }}
            className="flex size-9 items-center justify-center rounded-full border border-paper/20 bg-paper/5 text-paper transition-all hover:bg-paper/15 active:scale-95 text-xs"
            aria-label="Tính năng trước"
          >
            ←
          </button>

          {/* Dots Indicator */}
          <div className="flex items-center gap-1.5" aria-label={`Tính năng ${activeIdx + 1} trên 3`}>
            {SCREENS.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setIsPlaying(false);
                  selectScreen(idx, "button");
                }}
                className={`transition-all duration-300 rounded-full ${
                  activeIdx === idx
                    ? "h-1.5 w-5 bg-vermilion"
                    : "size-1.5 bg-paper/25 hover:bg-paper/50"
                }`}
                aria-label={`Xem tính năng ${s.name}`}
              />
            ))}
          </div>

          {/* Next Action Button */}
          <button
            type="button"
            onClick={() => {
              if (activeIdx === SCREENS.length - 1) {
                setIsPlaying(false);
                selectScreen(0, "button");
              } else {
                setIsPlaying(false);
                selectScreen(activeIdx + 1, "button");
              }
            }}
            className="flex min-h-9 items-center gap-1 rounded-full bg-vermilion px-3.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-paper shadow-md shadow-vermilion/30 transition-all hover:opacity-90 active:scale-95"
          >
            <span>{activeIdx === SCREENS.length - 1 ? "Xem lại ↺" : "Tiếp theo →"}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
