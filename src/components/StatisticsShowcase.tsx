import { useState, useId } from "react";
import DeviceMockup from "./DeviceMockup";

type PeriodKey = "day" | "week" | "month";

interface PeriodData {
  key: PeriodKey;
  label: string;
  sub: string;
  totalNum: number;
  totalFormatted: string;
  trend: string;
  trendPositive: boolean;
  highlightCategory: string;
  highlightAmount: string;
  curvePath: string;
  areaPath: string;
  points: { x: number; y: number; val: string; label: string }[];
  bars: { label: string; height: number; isPeak?: boolean; val: string }[];
  categories: { name: string; pct: number; color: string; amount: string }[];
}

const PERIODS: Record<PeriodKey, PeriodData> = {
  day: {
    key: "day",
    label: "Ngày",
    sub: "Hôm nay, 12 Thg 10",
    totalNum: 185000,
    totalFormatted: "185.000 ₫",
    trend: "↓ 35% so với hôm qua",
    trendPositive: true,
    highlightCategory: "Ăn uống",
    highlightAmount: "120.000 ₫ (65%)",
    curvePath: "M 30 180 C 110 140, 190 220, 270 90 C 350 30, 430 150, 510 120 C 590 100, 670 60, 750 80",
    areaPath: "M 30 180 C 110 140, 190 220, 270 90 C 350 30, 430 150, 510 120 C 590 100, 670 60, 750 80 L 750 250 L 30 250 Z",
    points: [
      { x: 30, y: 180, val: "25.000 ₫", label: "08:00" },
      { x: 270, y: 90, val: "85.000 ₫", label: "12:30" },
      { x: 510, y: 120, val: "35.000 ₫", label: "15:45" },
      { x: 750, y: 80, val: "40.000 ₫", label: "19:00" },
    ],
    bars: [
      { label: "Sáng", height: 35, val: "25.000 ₫" },
      { label: "Trưa", height: 85, isPeak: true, val: "85.000 ₫" },
      { label: "Chiều", height: 42, val: "35.000 ₫" },
      { label: "Tối", height: 48, val: "40.000 ₫" },
    ],
    categories: [
      { name: "Ăn uống", pct: 65, color: "#d23a22", amount: "120.000 ₫" },
      { name: "Di chuyển", pct: 22, color: "#b8935a", amount: "40.000 ₫" },
      { name: "Khác", pct: 13, color: "#9a9183", amount: "25.000 ₫" },
    ],
  },
  week: {
    key: "week",
    label: "Tuần",
    sub: "Tuần 41, 2026",
    totalNum: 1450000,
    totalFormatted: "1.450.000 ₫",
    trend: "↓ 8% so với tuần trước",
    trendPositive: true,
    highlightCategory: "Ăn uống",
    highlightAmount: "610.000 ₫ (42%)",
    curvePath: "M 30 190 C 90 160, 150 210, 210 140 C 270 70, 330 180, 390 120 C 450 60, 510 50, 570 40 C 630 30, 690 110, 750 90",
    areaPath: "M 30 190 C 90 160, 150 210, 210 140 C 270 70, 330 180, 390 120 C 450 60, 510 50, 570 40 C 630 30, 690 110, 750 90 L 750 250 L 30 250 Z",
    points: [
      { x: 30, y: 190, val: "140.000 ₫", label: "T2" },
      { x: 150, y: 210, val: "110.000 ₫", label: "T3" },
      { x: 270, y: 70, val: "260.000 ₫", label: "T4" },
      { x: 390, y: 120, val: "190.000 ₫", label: "T5" },
      { x: 570, y: 40, val: "380.000 ₫", label: "T6" },
      { x: 750, y: 90, val: "370.000 ₫", label: "CN" },
    ],
    bars: [
      { label: "T2", height: 38, val: "140k" },
      { label: "T3", height: 30, val: "110k" },
      { label: "T4", height: 68, val: "260k" },
      { label: "T5", height: 50, val: "190k" },
      { label: "T6", height: 95, isPeak: true, val: "380k" },
      { label: "T7", height: 75, val: "290k" },
      { label: "CN", height: 25, val: "80k" },
    ],
    categories: [
      { name: "Ăn uống", pct: 42, color: "#d23a22", amount: "610.000 ₫" },
      { name: "Mua sắm", pct: 26, color: "#17120f", amount: "380.000 ₫" },
      { name: "Di chuyển", pct: 18, color: "#b8935a", amount: "260.000 ₫" },
      { name: "Khác", pct: 14, color: "#9a9183", amount: "200.000 ₫" },
    ],
  },
  month: {
    key: "month",
    label: "Tháng",
    sub: "Tháng 10, 2026",
    totalNum: 6240000,
    totalFormatted: "6.240.000 ₫",
    trend: "↓ 12% so với tháng trước",
    trendPositive: true,
    highlightCategory: "Ăn uống",
    highlightAmount: "2.370.000 ₫ (38%)",
    curvePath: "M 30 170 C 120 120, 210 190, 300 130 C 390 70, 480 150, 570 90 C 660 30, 710 40, 750 60",
    areaPath: "M 30 170 C 120 120, 210 190, 300 130 C 390 70, 480 150, 570 90 C 660 30, 710 40, 750 60 L 750 250 L 30 250 Z",
    points: [
      { x: 30, y: 170, val: "1.250.000 ₫", label: "Tuần 1" },
      { x: 300, y: 130, val: "1.620.000 ₫", label: "Tuần 2" },
      { x: 570, y: 90, val: "1.920.000 ₫", label: "Tuần 3" },
      { x: 750, y: 60, val: "1.450.000 ₫", label: "Tuần 4" },
    ],
    bars: [
      { label: "T1", height: 42, val: "4,2 tr" },
      { label: "T2", height: 61, val: "6,1 tr" },
      { label: "T3", height: 48, val: "4,8 tr" },
      { label: "T4", height: 76, val: "7,6 tr" },
      { label: "T5", height: 58, val: "5,8 tr" },
      { label: "T6", height: 88, isPeak: true, val: "8,8 tr" },
      { label: "T7", height: 68, val: "6,2 tr" },
    ],
    categories: [
      { name: "Ăn uống", pct: 38, color: "#d23a22", amount: "2.370.000 ₫" },
      { name: "Nhà ở", pct: 27, color: "#17120f", amount: "1.685.000 ₫" },
      { name: "Di chuyển", pct: 19, color: "#b8935a", amount: "1.185.000 ₫" },
      { name: "Khác", pct: 16, color: "#9a9183", amount: "1.000.000 ₫" },
    ],
  },
};

export default function StatisticsShowcase() {
  const [period, setPeriod] = useState<PeriodKey>("month");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activePoint, setActivePoint] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const gradId = useId();

  const data = PERIODS[period];

  return (
    <section className="stat-showcase-section relative overflow-hidden bg-ink py-20 text-paper md:py-32" aria-labelledby="stat-showcase-title">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_30%,#241a14_0%,#0c0a09_70%)]" />
      <div className="pointer-events-none absolute -right-20 top-1/4 -z-10 size-[min(70vw,600px)] rounded-full border border-paper/10" aria-hidden>
        <span className="absolute inset-[25%] rounded-full border border-vermilion/20" />
        <span className="absolute inset-[50%] rounded-full bg-vermilion/50 blur-[80px]" />
      </div>

      <div className="mx-auto max-w-[1300px] px-6 md:px-10">
        {/* Section Header */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.28em] text-paper/60">
              <span className="font-display text-base text-vermilion">01</span>
              <span className="h-px w-8 bg-current opacity-40" />
              Tương tác dữ liệu dòng tiền
            </p>
            <h2 id="stat-showcase-title" className="mt-4 font-display text-[clamp(2.2rem,5vw,4.5rem)] font-light leading-[1.08]">
              Biểu đồ mở rộng <br />
              <span className="italic text-paper/85">vượt ra khỏi màn hình nhỏ</span>
            </h2>
          </div>

          {/* Period Selector Pills */}
          <div className="flex items-center gap-2 rounded-full border border-paper/20 bg-paper/5 p-1.5 backdrop-blur-md">
            {(["day", "week", "month"] as PeriodKey[]).map((pKey) => (
              <button
                key={pKey}
                type="button"
                onClick={() => {
                  setPeriod(pKey);
                  setActivePoint(null);
                }}
                className={`cursor-pointer rounded-full px-5 py-2 text-xs uppercase tracking-[0.16em] transition-all duration-300 ${
                  period === pKey
                    ? "bg-vermilion text-paper shadow-lg shadow-vermilion/30"
                    : "text-paper/65 hover:text-paper"
                }`}
              >
                {PERIODS[pKey].label}
              </button>
            ))}
          </div>
        </div>

        {/* 2.5D Composition: Phone + Expanding Out-of-Screen Chart */}
        <div className="mt-14 grid items-center gap-12 lg:grid-cols-[340px_1fr]">
          {/* Left: Perspective Device with Connected Floating Chip */}
          <div className="relative flex justify-center lg:justify-start">
            <DeviceMockup
              screen="thong-ke"
              alt="Màn hình Thống kê tài chính trong Sổ Chi"
              perspective="perspective-right"
              w="clamp(230px, 24vw, 300px)"
              ambientGlow="vermilion"
              floatingChips={[
                {
                  id: "stat-sync-chip",
                  position: "top-right",
                  content: (
                    <div className="flex items-center gap-2.5 rounded-full border border-paper/25 bg-lacquer/90 px-3.5 py-1.5 text-[11px] text-paper shadow-xl backdrop-blur-md">
                      <span className="size-2 animate-pulse rounded-full bg-vermilion" />
                      <span>Đồng bộ tức thì</span>
                    </div>
                  ),
                },
              ]}
            />

            {/* Glowing Data Conduit from Phone to Chart (Desktop) */}
            <svg
              className="pointer-events-none absolute -right-16 top-1/2 hidden h-28 w-24 -translate-y-1/2 lg:block"
              viewBox="0 0 100 80"
              fill="none"
              aria-hidden
            >
              <path
                d="M 10 40 C 40 40, 60 40, 90 40"
                stroke="url(#conduitGrad)"
                strokeWidth="2"
                strokeDasharray="4 4"
                className="animate-[dash_12s_linear_infinite]"
              />
              <circle cx="90" cy="40" r="4" fill="#d23a22" />
              <defs>
                <linearGradient id="conduitGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#d23a22" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#d23a22" stopOpacity="0.9" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Right: Expanded Dynamic SVG Chart Canvas */}
          <div
            className={`group relative overflow-hidden rounded-3xl border border-paper/15 bg-gradient-to-b from-[#1c1613] to-[#0f0c0b] p-6 shadow-2xl transition-all duration-700 md:p-8 ${
              isExpanded ? "scale-[1.02] border-vermilion/50" : ""
            }`}
          >
            {/* Top Bar with Dynamic Metrics */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-paper/10 pb-6">
              <div>
                <span className="text-xs uppercase tracking-[0.2em] text-paper/50">{data.sub}</span>
                <div className="mt-1 flex items-baseline gap-3">
                  <span className="font-display text-3xl font-light text-paper md:text-5xl">{data.totalFormatted}</span>
                  <span className="rounded-full bg-emerald-950/60 px-3 py-1 text-xs font-medium text-emerald-400 border border-emerald-500/20">
                    {data.trend}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsExpanded((prev) => !prev)}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-paper/20 px-4 py-2 text-xs uppercase tracking-[0.14em] text-paper/70 transition-colors hover:border-paper/40 hover:text-paper"
                  title="Phóng to khung nhìn biểu đồ"
                >
                  <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                  </svg>
                  <span>{isExpanded ? "Thu gọn" : "Toàn cảnh"}</span>
                </button>
              </div>
            </div>

            {/* SVG Morphing Curve Area */}
            <div className="relative mt-6 h-56 w-full md:h-64">
              <svg className="h-full w-full overflow-visible" viewBox="0 0 780 250" preserveAspectRatio="none">
                <defs>
                  <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#d23a22" stopOpacity="0.45" />
                    <stop offset="60%" stopColor="#d23a22" stopOpacity="0.08" />
                    <stop offset="100%" stopColor="#d23a22" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Guide Lines */}
                <line x1="30" y1="60" x2="750" y2="60" stroke="rgba(242,236,223,0.06)" strokeDasharray="3 3" />
                <line x1="30" y1="120" x2="750" y2="120" stroke="rgba(242,236,223,0.06)" strokeDasharray="3 3" />
                <line x1="30" y1="180" x2="750" y2="180" stroke="rgba(242,236,223,0.06)" strokeDasharray="3 3" />

                {/* Area under curve */}
                <path d={data.areaPath} fill={`url(#${gradId})`} className="transition-all duration-700 ease-out" />

                {/* Main line curve */}
                <path
                  d={data.curvePath}
                  fill="none"
                  stroke="#d23a22"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-all duration-700 ease-out"
                />

                {/* Interactive data points */}
                {data.points.map((pt, idx) => (
                  <g
                    key={`${pt.label}-${idx}`}
                    className="cursor-pointer transition-transform duration-300 hover:scale-125"
                    onClick={() => setActivePoint(activePoint === idx ? null : idx)}
                  >
                    <circle cx={pt.x} cy={pt.y} r="8" fill="#d23a22" fillOpacity="0.25" />
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="4.5"
                      fill={activePoint === idx ? "#ffffff" : "#d23a22"}
                      stroke="#f2ecdf"
                      strokeWidth="1.5"
                    />
                    {/* Tooltip on active point */}
                    {activePoint === idx && (
                      <g className="animate-fade-in">
                        <rect
                          x={Math.max(20, pt.x - 55)}
                          y={pt.y - 48}
                          width="110"
                          height="36"
                          rx="6"
                          fill="#17120f"
                          stroke="rgba(242,236,223,0.3)"
                        />
                        <text
                          x={Math.max(20, pt.x - 55) + 55}
                          y={pt.y - 26}
                          textAnchor="middle"
                          fill="#f2ecdf"
                          fontSize="11"
                          fontWeight="500"
                        >
                          {pt.val}
                        </text>
                      </g>
                    )}
                  </g>
                ))}
              </svg>
            </div>

            {/* X-Axis Labels */}
            <div className="mt-2 flex justify-between px-2 text-[11px] uppercase tracking-wider text-paper/40">
              {data.points.map((pt) => (
                <span key={pt.label}>{pt.label}</span>
              ))}
            </div>

            {/* Bottom Row: Distribution Bars & Category Ring */}
            <div className="mt-8 grid gap-6 border-t border-paper/10 pt-6 sm:grid-cols-2">
              {/* Daily / Period Bar Distribution */}
              <div>
                <span className="text-[11px] uppercase tracking-[0.2em] text-paper/50">Phân bổ chu kỳ</span>
                <div className="mt-4 flex items-end justify-between gap-2 h-20 px-2">
                  {data.bars.map((bar) => (
                    <div key={bar.label} className="group/bar flex flex-1 flex-col items-center gap-1.5 h-full justify-end">
                      <div className="relative w-full">
                        <div
                          className={`w-full rounded-t-sm transition-all duration-500 ${
                            bar.isPeak ? "bg-vermilion shadow-md shadow-vermilion/50" : "bg-paper/20 group-hover/bar:bg-paper/40"
                          }`}
                          style={{ height: `${bar.height}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-paper/45">{bar.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category Breakdown Chips */}
              <div>
                <span className="text-[11px] uppercase tracking-[0.2em] text-paper/50">Tỷ trọng nhóm chi</span>
                <div className="mt-4 flex flex-col gap-2">
                  {data.categories.map((cat) => (
                    <div
                      key={cat.name}
                      onMouseEnter={() => setActiveCategory(cat.name)}
                      onMouseLeave={() => setActiveCategory(null)}
                      className={`flex items-center justify-between rounded-lg p-2 transition-colors ${
                        activeCategory === cat.name ? "bg-paper/10" : "hover:bg-paper/5"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="size-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                        <span className="text-xs text-paper/85">{cat.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-medium text-paper">{cat.amount}</span>
                        <span className="min-w-8 text-right text-[11px] text-paper/50">{cat.pct}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Micro hint */}
            <p className="mt-5 text-right text-[10px] text-paper/35">
              * Dữ liệu mô phỏng tương tác giao diện tính năng Thống kê của Sổ Chi.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
