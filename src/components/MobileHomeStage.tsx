import { useState, useEffect, useRef, type PointerEvent } from "react";
import { track } from "../lib";

interface HomeFeatureMode {
  id: "thu-chi" | "thong-ke" | "ngan-sach";
  label: string;
  badge: string;
  title: string;
  desc: string;
  auraClass: string;
  chipTone: "vermilion" | "gold" | "emerald";
  floatingCard: {
    tag: string;
    headline: string;
    detail: string;
    accent: string;
    accentBg: string;
    icon: string;
  };
}

const MODES: HomeFeatureMode[] = [
  {
    id: "thu-chi",
    label: "Theo dõi",
    badge: "01 · THEO DÕI THU CHI",
    title: "Ghi chép tức thì, kiểm soát tức thì",
    desc: "Mỗi khoản chi được tự động phân loại và cập nhật vào dòng tiền hôm nay chỉ sau 3 giây.",
    auraClass: "bg-[radial-gradient(ellipse_at_50%_40%,rgba(210,58,34,0.24)_0%,rgba(14,12,10,0.96)_75%)]",
    chipTone: "vermilion",
    floatingCard: {
      tag: "Vừa ghi nhận",
      headline: "Cà phê sáng",
      detail: "Ăn uống · −45.000 ₫",
      accent: "#d23a22",
      accentBg: "rgba(210,58,34,0.12)",
      icon: "☕",
    },
  },
  {
    id: "thong-ke",
    label: "Thống kê",
    badge: "02 · PHÂN TÍCH TÀI CHÍNH",
    title: "Thấu hiểu dòng tiền từ biểu đồ",
    desc: "Nhận biết chính xác nhóm chi nhiều nhất và biến động chi tiêu qua từng tuần, từng tháng.",
    auraClass: "bg-[radial-gradient(ellipse_at_50%_40%,rgba(218,165,32,0.24)_0%,rgba(14,12,10,0.96)_75%)]",
    chipTone: "gold",
    floatingCard: {
      tag: "Báo cáo kỳ này",
      headline: "6.240.000 ₫",
      detail: "Giảm 12% so với tháng trước",
      accent: "#daa520",
      accentBg: "rgba(218,165,32,0.14)",
      icon: "📊",
    },
  },
  {
    id: "ngan-sach",
    label: "Ngân sách",
    badge: "03 · KIỂM SOÁT HẠN MỨC",
    title: "Chủ động chi tiêu, không lo hụt hẫng",
    desc: "Cảnh báo thông minh khi danh mục chi tiêu sắp chạm trần ngân sách bạn đã đặt trước.",
    auraClass: "bg-[radial-gradient(ellipse_at_50%_40%,rgba(16,185,129,0.22)_0%,rgba(14,12,10,0.96)_75%)]",
    chipTone: "emerald",
    floatingCard: {
      tag: "Cảnh báo hạn mức",
      headline: "Mua sắm: 91%",
      detail: "Còn lại 450.000 ₫ đến cuối tháng",
      accent: "#f43f5e",
      accentBg: "rgba(244,63,94,0.14)",
      icon: "⚠️",
    },
  },
];

function HomePhoneScreen({ mode }: { mode: HomeFeatureMode }) {
  if (mode.id === "thu-chi") {
    return (
      <div className="flex flex-col justify-between h-full p-2.5 pt-3.5 text-ink select-none bg-[#f7f2e7]">
        {/* Status bar */}
        <div className="flex items-center justify-between text-[7px] text-ink/60">
          <span>09:41</span>
          <span>5G · 100%</span>
        </div>

        {/* User header */}
        <div className="mt-0.5">
          <span className="text-[7.5px] text-ink/50 uppercase tracking-wider">Hôm nay</span>
          <strong className="block font-display text-[11px] font-semibold text-ink leading-tight">Thứ Ba, 15 Th7</strong>
        </div>

        {/* Balance Card */}
        <div className="rounded-lg bg-lacquer p-2 text-paper shadow-xs">
          <span className="text-[7px] text-paper/70">Số dư khả dụng</span>
          <div className="flex items-baseline justify-between">
            <strong className="font-display text-[12px] font-bold text-paper">24.635.000 ₫</strong>
            <span className="text-[6.5px] rounded bg-emerald-500/20 px-1 py-0.2 text-emerald-300 font-medium">+18,5 tr</span>
          </div>
          <div className="mt-1 flex justify-between text-[6.5px] text-paper/60 border-t border-paper/15 pt-0.5">
            <span>Chi hôm nay: <b className="text-paper/90">130.000 ₫</b></span>
            <span>7 giao dịch</span>
          </div>
        </div>

        {/* Transactions list */}
        <div className="flex flex-col gap-1 text-[7px]">
          <span className="text-[6.5px] font-bold text-ink/40 uppercase">Gần đây</span>
          <div className="flex items-center justify-between rounded p-1 bg-vermilion/10 border border-vermilion/30">
            <div className="flex items-center gap-1">
              <span className="size-3.5 rounded bg-vermilion/20 text-vermilion flex items-center justify-center text-[7px] font-bold">☕</span>
              <div>
                <span className="block font-medium">Cà phê sáng</span>
                <span className="text-[6px] text-ink/50">Ăn uống · 08:30</span>
              </div>
            </div>
            <b className="text-vermilion font-semibold">−45.000 ₫</b>
          </div>
          <div className="flex items-center justify-between rounded p-1 bg-ink/5">
            <div className="flex items-center gap-1">
              <span className="size-3.5 rounded bg-amber-500/20 text-amber-800 flex items-center justify-center text-[7px] font-bold">🍱</span>
              <div>
                <span className="block font-medium">Cơm trưa văn phòng</span>
                <span className="text-[6px] text-ink/50">Ăn uống · 12:15</span>
              </div>
            </div>
            <b className="text-ink/80 font-medium">−85.000 ₫</b>
          </div>
        </div>

        {/* Action Button */}
        <div className="rounded-full bg-vermilion py-1 text-center text-[7.5px] text-paper font-semibold shadow-xs">
          + Ghi khoản chi
        </div>
      </div>
    );
  }

  if (mode.id === "thong-ke") {
    return (
      <div className="flex flex-col justify-between h-full p-2.5 pt-3.5 text-ink select-none bg-[#f7f2e7]">
        {/* Status bar */}
        <div className="flex items-center justify-between text-[7px] text-ink/60">
          <span>09:41</span>
          <span>5G · 100%</span>
        </div>

        {/* Report header */}
        <div className="mt-0.5">
          <span className="text-[7.5px] text-ink/50 uppercase tracking-wider">Phân tích</span>
          <strong className="block font-display text-[11px] font-semibold text-ink leading-tight">Tháng 7, 2025</strong>
        </div>

        {/* Total Expense Card */}
        <div className="rounded-lg bg-lacquer p-2 text-paper shadow-xs">
          <span className="text-[7px] text-paper/70">Tổng chi tiêu tháng này</span>
          <div className="flex items-baseline justify-between">
            <strong className="font-display text-[12px] font-bold text-paper">6.240.000 ₫</strong>
            <span className="text-[6.5px] text-emerald-300">↓ 12% tháng trước</span>
          </div>
        </div>

        {/* Mini Multi-Bar Chart */}
        <div className="rounded bg-ink/5 p-1.5 flex flex-col justify-between h-20">
          <div className="flex justify-between text-[6.5px] text-ink/60 font-medium">
            <span>Chi theo tuần</span>
            <span>Cao nhất: T3</span>
          </div>
          <div className="flex items-end justify-between gap-1.5 h-12 pt-1">
            {[
              { label: "T1", h: 45, bg: "bg-lacquer/60" },
              { label: "T2", h: 65, bg: "bg-lacquer/60" },
              { label: "T3", h: 90, bg: "bg-vermilion" },
              { label: "T4", h: 55, bg: "bg-lacquer/60" },
            ].map((col, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-0.5 h-full justify-end">
                <div style={{ height: `${col.h}%` }} className={`w-full rounded-t-xs ${col.bg}`} />
                <span className="text-[6px] text-ink/50">{col.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category breakdown pill */}
        <div className="rounded bg-gold/15 p-1 flex justify-between items-center text-[7px] text-ink">
          <span>Ăn uống chiếm nhiều nhất:</span>
          <b className="text-vermilion">38% (2.370k)</b>
        </div>
      </div>
    );
  }

  // mode.id === "ngan-sach"
  return (
    <div className="flex flex-col justify-between h-full p-2.5 pt-3.5 text-ink select-none bg-[#f7f2e7]">
      {/* Status bar */}
      <div className="flex items-center justify-between text-[7px] text-ink/60">
        <span>09:41</span>
        <span>5G · 100%</span>
      </div>

      {/* Header */}
      <div className="mt-0.5">
        <span className="text-[7.5px] text-ink/50 uppercase tracking-wider">Hạn mức tháng 7</span>
        <strong className="block font-display text-[11px] font-semibold text-ink leading-tight">10.000.000 ₫</strong>
      </div>

      {/* Overview Ring Card */}
      <div className="rounded-lg bg-lacquer p-2 text-paper shadow-xs flex items-center gap-2">
        <div className="size-9 rounded-full border-2 border-paper/20 border-t-rose-400 border-r-rose-400 flex items-center justify-center shrink-0">
          <span className="text-[6.5px] font-bold text-rose-300">62%</span>
        </div>
        <div>
          <span className="text-[6.5px] text-paper/60">Còn khả dụng</span>
          <b className="block text-[8.5px] text-paper leading-tight">3.800.000 ₫</b>
          <span className="text-[6px] text-emerald-300">Đủ cho 16 ngày tới</span>
        </div>
      </div>

      {/* Progress Tracks */}
      <div className="flex flex-col gap-1 text-[7px]">
        <div className="rounded p-1 bg-ink/5">
          <div className="flex justify-between items-center">
            <span>Ăn uống (3.000.000 ₫)</span>
            <b className="text-ink/80">63%</b>
          </div>
          <div className="h-1 bg-ink/10 rounded-full mt-0.5 overflow-hidden">
            <div className="h-full bg-vermilion w-[63%]" />
          </div>
        </div>

        <div className="rounded p-1 bg-rose-50 border border-rose-200">
          <div className="flex justify-between items-center text-rose-900 font-semibold">
            <span>Mua sắm (2.000.000 ₫)</span>
            <b className="text-rose-600">91% ⚠️</b>
          </div>
          <div className="h-1 bg-rose-200 rounded-full mt-0.5 overflow-hidden">
            <div className="h-full bg-rose-500 w-[91%]" />
          </div>
        </div>
      </div>

      {/* Warning banner */}
      <div className="rounded bg-rose-100 p-1 text-center text-[6.5px] text-rose-950 font-medium">
        Mua sắm sắp chạm trần (còn 180k)
      </div>
    </div>
  );
}

export default function MobileHomeStage({ id = "mobile-home-product" }: { id?: string }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const pointerStart = useRef<number | null>(null);

  const selectMode = (idx: number, source: "tab" | "swipe" | "button") => {
    const nextIdx = (idx + MODES.length) % MODES.length;
    setActiveIdx(nextIdx);
    track("product_demo_interaction", { stage: "home_mobile", feature: MODES[nextIdx].id, source });
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

  return (
    <section
      id={id}
      className="mobile-home-stage md:hidden relative overflow-hidden bg-ink min-h-[82svh] flex flex-col justify-center pt-5 pb-6 px-4 text-paper scroll-mt-14"
      aria-labelledby="mobile-home-stage-title"
    >
      {/* 1. BRAND / CHART / DEPTH LAYER (Aura + Orbit) */}
      <div
        className={`pointer-events-none absolute inset-0 transition-opacity duration-700 ${current.auraClass}`}
        aria-hidden
      />

      {/* Atmospheric Concentric Brand Rings */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-10" aria-hidden>
        <div className="size-[270px] rounded-full border border-paper/30" />
        <div className="size-[370px] rounded-full border border-paper/15 absolute" />
      </div>

      <div className="relative z-10 mx-auto max-w-[340px] flex flex-col items-center">
        {/* Eyebrow & Headline */}
        <header className="w-full text-center">
          <p className="flex items-center justify-center gap-1.5 text-[9.5px] font-semibold uppercase tracking-[0.22em] text-paper/60">
            <span className="text-vermilion font-display text-xs">五</span>
            <span className="h-px w-5 bg-current opacity-30" />
            <span>Trải nghiệm sản phẩm</span>
          </p>
          <h2
            id="mobile-home-stage-title"
            className="mt-1 font-display text-[1.42rem] font-normal leading-[1.12] tracking-tight text-paper text-balance"
          >
            Chỉ cần mở app. <span className="italic text-paper/85">Mọi thứ rõ ràng.</span>
          </h2>
        </header>

        {/* 3-Feature Segmented Selector */}
        <nav
          className="mt-2.5 w-full grid grid-cols-3 gap-1 rounded-full border border-paper/15 bg-paper/5 p-0.5 backdrop-blur-md"
          role="tablist"
          aria-label="Chọn tính năng trải nghiệm"
        >
          {MODES.map((m, idx) => (
            <button
              key={m.id}
              type="button"
              role="tab"
              aria-selected={activeIdx === idx}
              onClick={() => selectMode(idx, "tab")}
              className={`min-h-[2.15rem] rounded-full px-1 text-[11px] font-medium tracking-tight transition-all duration-300 active:scale-95 ${
                activeIdx === idx
                  ? "bg-vermilion text-paper shadow-md shadow-vermilion/40 font-semibold"
                  : "text-paper/65 hover:text-paper"
              }`}
            >
              {m.label}
            </button>
          ))}
        </nav>

        {/* 2.5D INTERACTIVE VISUAL COMPOSITION */}
        <div
          className="relative mt-3.5 w-full flex items-center justify-center touch-pan-y select-none min-h-[355px]"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          tabIndex={0}
          aria-label="Vuốt ngang để đổi tính năng demo"
        >
          {/* 2. SUPPORTING UI LAYER (Floating Contextual Card lifted +35px) */}
          <div
            key={`home-support-${activeIdx}`}
            className="absolute -top-1.5 right-0 z-30 flex items-center gap-2 rounded-xl border border-paper/20 bg-lacquer/95 px-3 py-1.5 text-paper shadow-2xl backdrop-blur-xl animate-fade-in"
            style={{
              maxWidth: "230px",
              boxShadow: "0 12px 28px rgba(0,0,0,0.45), 0 0 16px rgba(210,58,34,0.18)",
            }}
          >
            <span
              className="flex size-6 shrink-0 items-center justify-center rounded-lg text-xs"
              style={{ background: current.floatingCard.accentBg }}
            >
              {current.floatingCard.icon}
            </span>
            <div className="min-w-0">
              <span className="block text-[7.5px] uppercase tracking-wider font-semibold opacity-60">
                {current.floatingCard.tag}
              </span>
              <strong className="block text-[10.5px] font-semibold text-paper truncate leading-tight">
                {current.floatingCard.headline}
              </strong>
              <span className="block text-[8px] text-paper/70 truncate">
                {current.floatingCard.detail}
              </span>
            </div>
          </div>

          {/* 3. CENTRAL PHONE (2.5D Device Frame) */}
          <div
            className="mobile-stage-perspective-wrap relative flex items-center justify-center"
            style={{ perspective: "1000px" }}
          >
            <div
              className="relative transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                width: "228px",
                height: "346px",
                transform: "rotateY(-4deg) rotateX(2deg) translateZ(15px)",
              }}
            >
              {/* Outer Phone Shell */}
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

                {/* Screen UI */}
                <HomePhoneScreen mode={current} />
              </div>

              {/* Ground Shadow */}
              <div
                className="pointer-events-none absolute -bottom-4 inset-x-4 h-5 rounded-full bg-black/60 blur-md -z-10"
                aria-hidden
              />
            </div>
          </div>

          {/* Subtle Parallax Floating Chip on Bottom-Left */}
          <div
            key={`home-chip-bl-${activeIdx}`}
            className="absolute -bottom-1 left-0 z-30 flex items-center gap-1.5 rounded-full border border-paper/15 bg-paper/10 px-2.5 py-0.5 text-[9.5px] text-paper shadow-lg backdrop-blur-md animate-fade-in"
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
            <span className="font-medium tracking-tight">
              {current.label} thời gian thực
            </span>
          </div>
        </div>

        {/* Short Value Copy */}
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

        {/* Navigation Bar */}
        <div className="mt-2.5 w-full flex items-center justify-between px-0.5">
          {/* Previous Button */}
          <button
            type="button"
            onClick={() => selectMode(activeIdx - 1, "button")}
            className="flex size-9 items-center justify-center rounded-full border border-paper/20 bg-paper/5 text-paper transition-all hover:bg-paper/15 active:scale-95 text-xs"
            aria-label="Chế độ trước"
          >
            ←
          </button>

          {/* Dots Indicator */}
          <div className="flex items-center gap-1.5" aria-label={`Chế độ ${activeIdx + 1} trên 3`}>
            {MODES.map((m, idx) => (
              <button
                key={m.id}
                type="button"
                onClick={() => selectMode(idx, "button")}
                className={`transition-all duration-300 rounded-full ${
                  activeIdx === idx
                    ? "h-1.5 w-5 bg-vermilion"
                    : "size-1.5 bg-paper/25 hover:bg-paper/50"
                }`}
                aria-label={`Xem tính năng ${m.label}`}
              />
            ))}
          </div>

          {/* Next Action Button */}
          <button
            type="button"
            onClick={() => {
              if (activeIdx === MODES.length - 1) {
                selectMode(0, "button");
              } else {
                selectMode(activeIdx + 1, "button");
              }
            }}
            className="flex min-h-9 items-center gap-1 rounded-full bg-vermilion px-3.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-paper shadow-md shadow-vermilion/30 transition-all hover:opacity-90 active:scale-95"
          >
            <span>{activeIdx === MODES.length - 1 ? "Xem lại ↺" : "Tiếp theo →"}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
