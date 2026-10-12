import { useState, useId } from "react";
import { Link } from "../router";
import { type ProductPageDef, type RouteDef, ALL_PAGES } from "../pages";
import { CATEGORIES } from "../config";
import DeviceMockup from "./DeviceMockup";
import { openPrelaunchSheet } from "../lib";

// --- Types & Data for Timeline Section A ---
type TimelineView = "day" | "week" | "month";

interface TimelinePoint {
  time: string;
  amount: string;
  category: string;
  note: string;
}

const TIMELINE_DATA: Record<
  TimelineView,
  {
    label: string;
    total: string;
    sub: string;
    trend: string;
    points: TimelinePoint[];
    svgPath: string;
    areaPath: string;
    highlight: string;
  }
> = {
  day: {
    label: "Hôm nay (24h)",
    total: "185.000 ₫",
    sub: "4 giao dịch phát sinh",
    trend: "↓ 35% so với hôm qua",
    highlight: "Đỉnh chi vào bữa trưa (85.000 ₫)",
    svgPath: "M 20 120 C 100 130, 180 30, 260 30 C 340 30, 420 90, 500 90 C 580 90, 660 50, 740 50",
    areaPath: "M 20 120 C 100 130, 180 30, 260 30 C 340 30, 420 90, 500 90 C 580 90, 660 50, 740 50 L 740 180 L 20 180 Z",
    points: [
      { time: "08:15", amount: "25.000 ₫", category: "Ăn uống", note: "Cà phê sáng" },
      { time: "12:30", amount: "85.000 ₫", category: "Ăn uống", note: "Cơm trưa văn phòng (Đỉnh chi)" },
      { time: "15:45", amount: "35.000 ₫", category: "Ăn uống", note: "Trà chiều cùng đồng nghiệp" },
      { time: "19:10", amount: "40.000 ₫", category: "Di chuyển", note: "Đổ xăng xe máy" },
    ],
  },
  week: {
    label: "Tuần này (7 ngày)",
    total: "1.450.000 ₫",
    sub: "21 giao dịch phát sinh",
    trend: "↓ 8% so với tuần trước",
    highlight: "Thứ Sáu và Thứ Bảy chiếm 52% tổng chi",
    svgPath: "M 20 140 C 120 150, 200 80, 320 80 C 440 80, 520 20, 620 20 C 680 20, 710 70, 740 70",
    areaPath: "M 20 140 C 120 150, 200 80, 320 80 C 440 80, 520 20, 620 20 C 680 20, 710 70, 740 70 L 740 180 L 20 180 Z",
    points: [
      { time: "T2 - T4", amount: "420.000 ₫", category: "Thiết yếu", note: "Chi tiêu sinh hoạt cơ bản ổn định" },
      { time: "T5", amount: "190.000 ₫", category: "Ăn uống", note: "Ăn tối ngoài" },
      { time: "T6", amount: "380.000 ₫", category: "Gặp gỡ", note: "Liên hoan cuối tuần (Đỉnh tuần)" },
      { time: "T7 - CN", amount: "460.000 ₫", category: "Mua sắm", note: "Siêu thị và đồ dùng cá nhân" },
    ],
  },
  month: {
    label: "Tháng 7 (30 ngày)",
    total: "6.240.000 ₫",
    sub: "84 giao dịch phát sinh",
    trend: "↓ 7% so với tháng trước",
    highlight: "Tiết kiệm thêm được 480.000 ₫ so với kế hoạch",
    svgPath: "M 20 150 C 150 130, 280 110, 400 70 C 520 30, 650 40, 740 30",
    areaPath: "M 20 150 C 150 130, 280 110, 400 70 C 520 30, 650 40, 740 30 L 740 180 L 20 180 Z",
    points: [
      { time: "Tuần 1", amount: "1.420.000 ₫", category: "Đầu tháng", note: "Thanh toán hóa đơn điện thoại, wifi" },
      { time: "Tuần 2", amount: "1.650.000 ₫", category: "Sinh hoạt", note: "Mua đồ khô và đồ gia dụng" },
      { time: "Tuần 3", amount: "1.380.000 ₫", category: "Điều chỉnh", note: "Giảm ăn ngoài để cân đối ngân sách" },
      { time: "Tuần 4", amount: "1.790.000 ₫", category: "Cuối tháng", note: "Tổng kết, đạt mức an toàn 62% ngân sách" },
    ],
  },
};

// --- Data for Month-to-Month Comparison C ---
interface MonthPlan {
  month: string;
  total: string;
  saving: string;
  savingRate: string;
  color: string;
  depthZ: number;
  rotateY: number;
  notes: string;
  barHeights: number[];
}

const MONTH_COMPARISONS: MonthPlan[] = [
  {
    month: "Tháng 8",
    total: "5.890.000 ₫",
    saving: "+2.110.000 ₫",
    savingRate: "26%",
    color: "#9a9183",
    depthZ: -50,
    rotateY: 10,
    notes: "Tháng chi tiêu kỷ luật nhất, hạn chế phát sinh ngoài kế hoạch.",
    barHeights: [35, 45, 30, 50, 65, 40, 35],
  },
  {
    month: "Tháng 9",
    total: "6.720.000 ₫",
    saving: "+1.280.000 ₫",
    savingRate: "16%",
    color: "#b8935a",
    depthZ: -15,
    rotateY: 4,
    notes: "Đỉnh chi tiêu trong quý do có chuyến công tác và mua thiết bị mới.",
    barHeights: [55, 60, 75, 80, 95, 70, 60],
  },
  {
    month: "Tháng 10 (Hiện tại)",
    total: "6.240.000 ₫",
    saving: "+1.760.000 ₫",
    savingRate: "22%",
    color: "#d23a22",
    depthZ: 25,
    rotateY: 0,
    notes: "Đã chủ động siết lại nhóm ăn ngoài, dòng tiền trở về ngưỡng lý tưởng.",
    barHeights: [40, 48, 52, 60, 85, 55, 45],
  },
];

export default function StatisticsVisualStories({ page }: { page: ProductPageDef }) {
  // Timeline state (Section A)
  const [timelineView, setTimelineView] = useState<TimelineView>("week");
  const [activePointIdx, setActivePointIdx] = useState<number>(2);

  // Category breakdown state (Section B)
  const [selectedCatIdx, setSelectedCatIdx] = useState<number>(0);

  // Month comparison mode (Section C)
  const [comparisonMode, setComparisonMode] = useState<"3d" | "merged">("3d");
  const [activeMonthIdx, setActiveMonthIdx] = useState<number>(2);

  // FAQ accordion state
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  const curTimeline = TIMELINE_DATA[timelineView];
  const curCategory = CATEGORIES[selectedCatIdx] || CATEGORIES[0];
  const curMonth = MONTH_COMPARISONS[activeMonthIdx];

  // Related links resolution
  const relatedRoutes = page.related
    .map((p) => ALL_PAGES.find((item) => item.path === p))
    .filter(Boolean) as RouteDef[];

  return (
    <div className="statistics-visual-stories overflow-x-hidden">
      {/* =========================================================================
          SECTION A: TOTAL SPENDING OVER TIME (#muc-1)
          Controlled Zone: Clean Warm Cream (#fbf9f4)
          Visual Ratio: ~70% Visual, 30% Editorial SEO Text
      ========================================================================= */}
      <section id="muc-1" className="scroll-mt-28 border-t border-ink/10 bg-[#fbf9f4] py-20 md:py-32" aria-labelledby="heading-muc-1">
        <div className="mx-auto max-w-[1240px] px-6 md:px-10">
          <div className="grid items-center gap-12 lg:grid-cols-[380px_1fr]">
            {/* Left: Editorial SEO Text Column */}
            <div>
              <span className="text-[11px] font-medium uppercase tracking-[0.24em] text-vermilion">01 · Trục thời gian</span>
              <h2 id="heading-muc-1" className="mt-3 font-display text-3xl font-light text-ink md:text-4xl">
                Nhìn tổng chi theo kỳ
              </h2>
              <p className="mt-4 text-base leading-relaxed text-ink/75">
                Một con số tổng quan giúp bạn biết tháng này đang đi theo hướng nào. Từ đó, các biểu đồ chi tiết mới có ý nghĩa hơn thay vì chỉ là trang trí.
              </p>

              {/* View Period Selector Pills */}
              <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Chọn chu kỳ xem tổng chi">
                {(["day", "week", "month"] as TimelineView[]).map((view) => (
                  <button
                    key={view}
                    type="button"
                    role="tab"
                    aria-selected={timelineView === view}
                    onClick={() => {
                      setTimelineView(view);
                      setActivePointIdx(0);
                    }}
                    className={`cursor-pointer rounded-full border px-4 py-2 text-xs uppercase tracking-wider transition-all duration-300 ${
                      timelineView === view
                        ? "border-ink bg-ink text-paper font-medium shadow-md"
                        : "border-ink/20 bg-paper/60 text-ink/70 hover:border-ink/40 hover:bg-paper"
                    }`}
                  >
                    {view === "day" ? "Ngày" : view === "week" ? "Tuần" : "Tháng"}
                  </button>
                ))}
              </div>

              {/* Key Insight Highlight Pill */}
              <div className="mt-8 rounded-2xl border border-ink/10 bg-paper p-4.5 shadow-sm">
                <span className="text-[11px] uppercase tracking-wider text-ink/50">Tín hiệu đáng giá:</span>
                <p className="mt-1 font-display text-lg font-normal text-ink">{curTimeline.highlight}</p>
                <span className="mt-1 inline-block text-xs font-medium text-vermilion">{curTimeline.trend}</span>
              </div>
            </div>

            {/* Right: Large Visual Interactive Timeline Canvas */}
            <div className="relative rounded-3xl border border-ink/12 bg-paper p-6 shadow-xl md:p-10">
              {/* Header inside visual card */}
              <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-ink/10 pb-6">
                <div>
                  <span className="text-xs uppercase tracking-[0.2em] text-ink/50">{curTimeline.label}</span>
                  <div className="mt-1 flex items-baseline gap-3">
                    <strong className="font-display text-3xl font-light text-ink md:text-5xl">{curTimeline.total}</strong>
                    <span className="text-xs text-ink/60">· {curTimeline.sub}</span>
                  </div>
                </div>
                <div className="rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-medium text-emerald-800">
                  {curTimeline.trend}
                </div>
              </div>

              {/* Dynamic SVG Wave Timeline */}
              <div className="relative mt-8 h-48 w-full overflow-hidden">
                <svg className="size-full overflow-visible" viewBox="0 0 760 180" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="timelineGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#d23a22" stopOpacity="0.22" />
                      <stop offset="100%" stopColor="#d23a22" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Grid Lines */}
                  <line x1="20" y1="40" x2="740" y2="40" stroke="currentColor" strokeOpacity="0.06" strokeDasharray="4 4" />
                  <line x1="20" y1="90" x2="740" y2="90" stroke="currentColor" strokeOpacity="0.06" strokeDasharray="4 4" />
                  <line x1="20" y1="140" x2="740" y2="140" stroke="currentColor" strokeOpacity="0.06" strokeDasharray="4 4" />

                  {/* Area fill */}
                  <path d={curTimeline.areaPath} fill="url(#timelineGrad)" className="transition-all duration-700 ease-out" />

                  {/* Stroke path */}
                  <path
                    d={curTimeline.svgPath}
                    fill="none"
                    stroke="#d23a22"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    className="transition-all duration-700 ease-out"
                  />
                </svg>
              </div>

              {/* Scrubber / Interactive Timeline Milestones */}
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {curTimeline.points.map((pt, idx) => (
                  <button
                    key={pt.time}
                    type="button"
                    onClick={() => setActivePointIdx(idx)}
                    className={`group cursor-pointer rounded-2xl border p-3.5 text-left transition-all duration-300 ${
                      activePointIdx === idx
                        ? "border-vermilion bg-vermilion/5 shadow-md ring-1 ring-vermilion/30"
                        : "border-ink/10 bg-paper/50 hover:border-ink/25 hover:bg-paper"
                    }`}
                  >
                    <span className="text-[10px] uppercase tracking-wider text-ink/50 group-hover:text-ink/70">{pt.time}</span>
                    <strong className="mt-1 block font-display text-base font-normal text-ink">{pt.amount}</strong>
                    <span className="mt-0.5 block truncate text-[11px] text-ink/60">{pt.note}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION B: CATEGORY BREAKDOWN (#muc-2)
          Controlled Zone: Warm Washi Paper Accent (#f2ece0)
          Visual Ratio: ~70% Visual, 30% Editorial SEO Text
      ========================================================================= */}
      <section id="muc-2" className="scroll-mt-28 border-t border-ink/10 bg-[#f2ece0] py-20 md:py-32" aria-labelledby="heading-muc-2">
        <div className="mx-auto max-w-[1240px] px-6 md:px-10">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_420px]">
            {/* Left: Interactive Orbital Category Concentric Discs */}
            <div className="relative rounded-3xl border border-ink/12 bg-paper/90 p-8 shadow-xl md:p-12">
              <div className="grid items-center gap-8 md:grid-cols-[260px_1fr]">
                {/* Concentric Rings Visual */}
                <div className="relative flex justify-center">
                  <svg className="size-60 -rotate-90 transform" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="82" fill="none" stroke="currentColor" strokeOpacity="0.08" strokeWidth="10" />
                    <circle cx="100" cy="100" r="66" fill="none" stroke="currentColor" strokeOpacity="0.08" strokeWidth="10" />
                    <circle cx="100" cy="100" r="50" fill="none" stroke="currentColor" strokeOpacity="0.08" strokeWidth="10" />
                    <circle cx="100" cy="100" r="34" fill="none" stroke="currentColor" strokeOpacity="0.08" strokeWidth="10" />

                    {/* Ring 1: Ăn uống (38%) */}
                    <circle
                      cx="100"
                      cy="100"
                      r="82"
                      fill="none"
                      stroke="#d23a22"
                      strokeWidth={selectedCatIdx === 0 ? "16" : "10"}
                      strokeDasharray="195 320"
                      strokeDashoffset="0"
                      strokeLinecap="round"
                      className="cursor-pointer transition-all duration-300"
                      onClick={() => setSelectedCatIdx(0)}
                    />

                    {/* Ring 2: Nhà ở (27%) */}
                    <circle
                      cx="100"
                      cy="100"
                      r="66"
                      fill="none"
                      stroke="#17120f"
                      strokeWidth={selectedCatIdx === 1 ? "16" : "10"}
                      strokeDasharray="112 302"
                      strokeDashoffset="0"
                      strokeLinecap="round"
                      className="cursor-pointer transition-all duration-300"
                      onClick={() => setSelectedCatIdx(1)}
                    />

                    {/* Ring 3: Di chuyển (19%) */}
                    <circle
                      cx="100"
                      cy="100"
                      r="50"
                      fill="none"
                      stroke="#b8935a"
                      strokeWidth={selectedCatIdx === 2 ? "16" : "10"}
                      strokeDasharray="60 254"
                      strokeDashoffset="0"
                      strokeLinecap="round"
                      className="cursor-pointer transition-all duration-300"
                      onClick={() => setSelectedCatIdx(2)}
                    />

                    {/* Ring 4: Mua sắm (10%) */}
                    <circle
                      cx="100"
                      cy="100"
                      r="34"
                      fill="none"
                      stroke="#9a9183"
                      strokeWidth={selectedCatIdx === 3 ? "16" : "10"}
                      strokeDasharray="21 192"
                      strokeDashoffset="0"
                      strokeLinecap="round"
                      className="cursor-pointer transition-all duration-300"
                      onClick={() => setSelectedCatIdx(3)}
                    />
                  </svg>

                  {/* Concentric Center Spotlight */}
                  <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                    <span className="font-display text-4xl font-light text-ink">{curCategory.pct}%</span>
                    <p className="mt-0.5 text-[10px] uppercase tracking-widest text-ink/50">{curCategory.name}</p>
                  </div>
                </div>

                {/* Selected Category Deep Analytics Card */}
                <div>
                  <span className="text-[11px] uppercase tracking-[0.22em] text-vermilion font-medium">Chi tiết danh mục</span>
                  <h3 className="mt-1 font-display text-3xl font-light text-ink md:text-4xl">
                    {curCategory.name}
                  </h3>
                  <div className="mt-3 flex items-baseline gap-3">
                    <strong className="font-display text-2xl font-normal text-ink">
                      {selectedCatIdx === 0 ? "2.370.000 ₫" : selectedCatIdx === 1 ? "1.685.000 ₫" : selectedCatIdx === 2 ? "1.185.000 ₫" : "620.000 ₫"}
                    </strong>
                    <span className="text-xs text-ink/60">({curCategory.pct}% ngân sách)</span>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-ink/70">
                    {selectedCatIdx === 0 && "Ăn uống là nhóm có tần suất giao dịch dày nhất (32 lượt/tháng), trung bình 79.000 ₫ mỗi ngày."}
                    {selectedCatIdx === 1 && "Bao gồm tiền thuê nhà, điện nước, internet cố định. Ít biến động nhưng chiếm tỷ trọng cố định lớn."}
                    {selectedCatIdx === 2 && "Xăng xe và các chuyến đi lại hằng ngày. Biến động tăng vào dịp cuối tuần hoặc các chuyến về quê."}
                    {selectedCatIdx === 3 && "Mua sắm đồ gia dụng và trang phục. Thường xuất hiện theo đợt ưu đãi hoặc nhu cầu thay mới."}
                  </p>

                  {/* Category Fast Switcher Pills */}
                  <div className="mt-6 flex flex-wrap gap-2">
                    {CATEGORIES.slice(0, 4).map((cat, idx) => (
                      <button
                        key={cat.name}
                        type="button"
                        onClick={() => setSelectedCatIdx(idx)}
                        className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs transition-all ${
                          selectedCatIdx === idx
                            ? "border-vermilion bg-vermilion text-paper font-medium"
                            : "border-ink/20 bg-paper/50 text-ink/70 hover:border-ink/40"
                        }`}
                      >
                        {cat.name} ({cat.pct}%)
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Editorial SEO Text & Semantic List */}
            <div>
              <span className="text-[11px] font-medium uppercase tracking-[0.24em] text-vermilion">02 · Phân bổ cơ cấu</span>
              <h2 id="heading-muc-2" className="mt-3 font-display text-3xl font-light text-ink md:text-4xl">
                Đọc cơ cấu chi tiêu theo nhóm
              </h2>
              <p className="mt-4 text-base leading-relaxed text-ink/75">
                Nhóm ăn uống, nhà ở, di chuyển hoặc các nhóm tự định nghĩa giúp bạn thấy phần nào đang chiếm nhiều nhất trong ngân sách.
              </p>

              {/* Semantic SEO Crawlable Category List */}
              <div className="mt-8">
                <span className="text-[11px] uppercase tracking-[0.2em] text-ink/50">Dữ liệu phân bổ minh họa:</span>
                <ul className="mt-3 divide-y divide-ink/10 border-y border-ink/10">
                  {CATEGORIES.map((cat, idx) => (
                    <li
                      key={cat.name}
                      onClick={() => setSelectedCatIdx(idx)}
                      className={`flex cursor-pointer items-center justify-between py-2.5 text-xs transition-colors ${
                        selectedCatIdx === idx ? "font-semibold text-vermilion" : "text-ink/80 hover:text-ink"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className="size-2 rounded-full"
                          style={{
                            backgroundColor: idx === 0 ? "#d23a22" : idx === 1 ? "#17120f" : idx === 2 ? "#b8935a" : "#9a9183",
                          }}
                        />
                        <span>{cat.name}</span>
                      </div>
                      <span className="font-mono text-ink/60">{cat.pct}%</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION C: MONTH-TO-MONTH COMPARISON (#muc-3)
          Controlled Zone: Muted Warm Red / Dark Lacquer Break (#181210)
          Visual Ratio: ~70% Visual, 30% Editorial SEO Text
      ========================================================================= */}
      <section id="muc-3" className="scroll-mt-28 border-t border-paper/10 bg-[#181210] py-24 text-paper md:py-36" aria-labelledby="heading-muc-3">
        <div className="mx-auto max-w-[1240px] px-6 md:px-10">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-[11px] font-medium uppercase tracking-[0.28em] text-vermilion">03 · Đối chiếu liên kỳ</span>
            <h2 id="heading-muc-3" className="mt-3 font-display text-[clamp(2.3rem,4.5vw,4.2rem)] font-light leading-[1.1] text-paper">
              So sánh giữa các tháng
            </h2>
            <p className="mt-4 text-base leading-relaxed text-paper/70">
              Khi dữ liệu tích lũy qua vài tháng, bạn bắt đầu thấy xu hướng dài hạn: nhóm nào tăng vào mùa nào, khoản nào lặp lại đều, nhóm nào cần điều chỉnh trong tháng tới.
            </p>

            {/* Mode Switcher: 3D Planes vs Merged View */}
            <div className="mt-8 inline-flex rounded-full border border-paper/20 bg-paper/5 p-1 backdrop-blur-md">
              <button
                type="button"
                onClick={() => setComparisonMode("3d")}
                className={`cursor-pointer rounded-full px-5 py-2 text-xs uppercase tracking-wider transition-all duration-300 ${
                  comparisonMode === "3d" ? "bg-vermilion text-paper font-medium shadow-lg" : "text-paper/60 hover:text-paper"
                }`}
              >
                Tách lớp 3D (Tháng 8 - 9 - 10)
              </button>
              <button
                type="button"
                onClick={() => setComparisonMode("merged")}
                className={`cursor-pointer rounded-full px-5 py-2 text-xs uppercase tracking-wider transition-all duration-300 ${
                  comparisonMode === "merged" ? "bg-vermilion text-paper font-medium shadow-lg" : "text-paper/60 hover:text-paper"
                }`}
              >
                Hội tụ xu hướng (Merged View)
              </button>
            </div>
          </div>

          {/* 3D Depth Comparison Stage */}
          <div className="mt-16">
            {comparisonMode === "3d" ? (
              <div className="month-3d-stage relative mx-auto flex min-h-[460px] max-w-[980px] items-center justify-center" style={{ perspective: "1400px" }}>
                {MONTH_COMPARISONS.map((m, idx) => {
                  const isActive = activeMonthIdx === idx;
                  const offsetX = idx === 0 ? "-240px" : idx === 1 ? "0px" : "+240px";

                  return (
                    <div
                      key={m.month}
                      onClick={() => setActiveMonthIdx(idx)}
                      className="month-chart-plane absolute select-none cursor-pointer rounded-3xl border p-6 transition-all duration-700 ease-out md:p-8"
                      style={{
                        transform: `translateX(${offsetX}) translateZ(${isActive ? 60 : m.depthZ}px) rotateY(${isActive ? 0 : m.rotateY}deg) scale(${
                          isActive ? 1.05 : 0.92
                        })`,
                        zIndex: isActive ? 30 : idx === 1 ? 20 : 10,
                        borderColor: isActive ? "rgba(210,58,34,0.6)" : "rgba(242,236,223,0.15)",
                        backgroundColor: isActive ? "#221714" : "#140e0c",
                        opacity: isActive ? 1 : 0.65,
                        boxShadow: isActive ? "0 25px 50px -12px rgba(210,58,34,0.35)" : "none",
                        width: "clamp(260px, 32vw, 320px)",
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs uppercase tracking-widest text-paper/50">{m.month}</span>
                        {isActive && <span className="rounded-full bg-vermilion/20 px-2 py-0.5 text-[10px] text-vermilion font-medium">Đang chọn</span>}
                      </div>

                      <strong className="mt-3 block font-display text-3xl font-light text-paper">{m.total}</strong>
                      <span className="mt-1 block text-xs font-medium text-gold">Tiết kiệm: {m.saving} ({m.savingRate})</span>

                      {/* Mini Bar Silhouette */}
                      <div className="mt-6 flex h-24 items-end gap-2 border-b border-paper/10 pb-2">
                        {m.barHeights.map((h, bIdx) => (
                          <div
                            key={bIdx}
                            className="flex-1 rounded-t-sm transition-all duration-500"
                            style={{
                              height: `${h}%`,
                              backgroundColor: isActive ? (bIdx === 4 ? "#d23a22" : "rgba(242,236,223,0.35)") : "rgba(242,236,223,0.15)",
                            }}
                          />
                        ))}
                      </div>

                      <p className="mt-4 text-xs leading-relaxed text-paper/60">{m.notes}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Merged Direct Comparison Trend Line */
              <div className="mx-auto max-w-[840px] rounded-3xl border border-paper/15 bg-[#1f1715] p-8 shadow-2xl md:p-12">
                <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-paper/10 pb-6">
                  <div>
                    <span className="text-xs uppercase tracking-widest text-vermilion font-medium">Đối sánh tổng hợp</span>
                    <h3 className="mt-1 font-display text-3xl font-light text-paper">Quỹ đạo 3 tháng liên tiếp</h3>
                  </div>
                  <div className="flex gap-4 text-xs">
                    <span className="flex items-center gap-1.5 text-paper/50"><span className="size-2 rounded-full bg-paper/40" /> T8</span>
                    <span className="flex items-center gap-1.5 text-paper/50"><span className="size-2 rounded-full bg-gold" /> T9</span>
                    <span className="flex items-center gap-1.5 text-paper font-medium"><span className="size-2 rounded-full bg-vermilion" /> T10 (Hiện tại)</span>
                  </div>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  {MONTH_COMPARISONS.map((m) => (
                    <div key={m.month} className="rounded-2xl border border-paper/10 bg-paper/5 p-4">
                      <span className="text-xs text-paper/50">{m.month}</span>
                      <strong className="mt-1 block font-display text-2xl text-paper">{m.total}</strong>
                      <span className="mt-1 block text-xs text-gold">Tỷ lệ thặng dư: {m.savingRate}</span>
                      <p className="mt-2 text-[11px] text-paper/60">{m.notes}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 rounded-2xl border border-vermilion/30 bg-vermilion/10 p-4.5 text-xs leading-relaxed text-paper/85">
                  <strong className="font-semibold text-vermilion">Kết luận xu hướng: </strong>
                  Dòng tiền của bạn đang đi theo đồ thị chữ V phục hồi. Đợt tăng đột biến trong Tháng 9 đã được bù đắp thành công trong Tháng 10 nhờ cắt giảm các khoản ăn ngoài tự phát.
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION D: VALUE OVER TIME — THE 30-DAY PROGRESSION JOURNEY (#loi-ich)
          Controlled Zone: Clean Off-White Paper (#f8f6f0)
          Visual Ratio: ~70% Visual, 30% Editorial SEO Text
      ========================================================================= */}
      <section id="loi-ich" className="scroll-mt-28 border-t border-ink/10 bg-[#f8f6f0] py-20 md:py-32" aria-labelledby="heading-loi-ich">
        <div className="mx-auto max-w-[1240px] px-6 md:px-10">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-[11px] font-medium uppercase tracking-[0.24em] text-vermilion">Lợi ích tích lũy</span>
            <h2 id="heading-loi-ich" className="mt-3 font-display text-[clamp(2.3rem,4.5vw,4rem)] font-light leading-[1.1] text-ink">
              Khi dùng đều đặn, dữ liệu trở nên hữu ích hơn
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink/75">
              Giá trị của Sổ Chi tăng theo cấp số nhân cùng số ngày bạn duy trì thói quen. Hãy xem bức tranh tài chính biến đổi từ những con số rời rạc thành bản đồ định hướng ra sao.
            </p>
          </div>

          {/* 3-Milestone Value Progression Roadmap */}
          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {/* Milestone 1: Ngày 1 (Raw Transactions) */}
            <div className="group relative rounded-3xl border border-ink/12 bg-paper p-8 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-ink/5 px-3 py-1 text-xs font-mono text-ink/60">CỘT MỐC 01</span>
                <span className="text-xs uppercase tracking-wider text-vermilion font-medium">Khởi động</span>
              </div>
              <h3 className="mt-4 font-display text-2xl font-light text-ink">Ngày 1: Giao dịch thô</h3>
              <p className="mt-2 text-xs leading-relaxed text-ink/70">
                Chỉ cần 3 giây ghi chép ngay khi vừa rút ví. Chưa cần biểu đồ phức tạp, mục tiêu là không bỏ sót khoản tiền nào.
              </p>

              {/* Visual Demo Card */}
              <div className="mt-6 rounded-2xl border border-ink/8 bg-ink/[0.02] p-4">
                <span className="text-[10px] uppercase tracking-wider text-ink/40">Giao dịch rời rạc:</span>
                <div className="mt-2.5 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span>☕ Cà phê sáng</span>
                    <strong className="font-mono">25.000 ₫</strong>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span>🍜 Cơm trưa</span>
                    <strong className="font-mono">85.000 ₫</strong>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span>🛵 Đổ xăng</span>
                    <strong className="font-mono">120.000 ₫</strong>
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t border-ink/8 pt-4">
                <span className="text-[11px] font-medium text-ink/80">Lợi ích đạt được:</span>
                <p className="mt-1 text-xs text-ink/65">Giảm 100% áp lực nhớ số tiền vào cuối ngày.</p>
              </div>
            </div>

            {/* Milestone 2: Ngày 14 (Patterns Emerge) */}
            <div className="group relative rounded-3xl border border-vermilion/30 bg-paper p-8 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-vermilion hover:shadow-2xl">
              <span className="absolute -top-3 right-6 rounded-full bg-vermilion px-3 py-0.5 text-[10px] font-medium text-paper shadow">
                Điểm bước ngoặt
              </span>
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-vermilion/10 px-3 py-1 text-xs font-mono text-vermilion font-medium">CỘT MỐC 02</span>
                <span className="text-xs uppercase tracking-wider text-vermilion font-medium">Nhận diện</span>
              </div>
              <h3 className="mt-4 font-display text-2xl font-light text-ink">Ngày 14: Xu hướng thành hình</h3>
              <p className="mt-2 text-xs leading-relaxed text-ink/70">
                Sau 2 tuần, biểu đồ bắt đầu chỉ ra quy luật: ngày nào bạn chi nhiều nhất, nhóm nào chiếm tỷ trọng áp đảo.
              </p>

              {/* Visual Demo Card */}
              <div className="mt-6 rounded-2xl border border-vermilion/20 bg-vermilion/[0.03] p-4">
                <span className="text-[10px] uppercase tracking-wider text-vermilion font-medium">Phát hiện hành vi:</span>
                <div className="mt-2.5 flex items-end gap-1.5 h-16">
                  <div className="flex-1 rounded-t bg-ink/15 h-[30%]" />
                  <div className="flex-1 rounded-t bg-ink/15 h-[40%]" />
                  <div className="flex-1 rounded-t bg-ink/15 h-[35%]" />
                  <div className="flex-1 rounded-t bg-ink/15 h-[45%]" />
                  <div className="flex-1 rounded-t bg-vermilion h-[90%]" />
                  <div className="flex-1 rounded-t bg-ink/25 h-[65%]" />
                  <div className="flex-1 rounded-t bg-ink/20 h-[50%]" />
                </div>
                <span className="mt-2 block text-center text-[10px] text-vermilion font-medium">T6 luôn là đỉnh chi tuần (chiếm 38%)</span>
              </div>

              <div className="mt-6 border-t border-ink/8 pt-4">
                <span className="text-[11px] font-medium text-ink/80">Lợi ích đạt được:</span>
                <p className="mt-1 text-xs text-ink/65">Biết chính xác nhóm cần chú ý trước khi ngân sách bị thủng.</p>
              </div>
            </div>

            {/* Milestone 3: Ngày 30 (Meaningful Overview) */}
            <div className="group relative rounded-3xl border border-ink/12 bg-paper p-8 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-ink/5 px-3 py-1 text-xs font-mono text-ink/60">CỘT MỐC 03</span>
                <span className="text-xs uppercase tracking-wider text-gold font-medium">Tự do kiểm soát</span>
              </div>
              <h3 className="mt-4 font-display text-2xl font-light text-ink">Ngày 30: Toàn cảnh rõ ràng</h3>
              <p className="mt-2 text-xs leading-relaxed text-ink/70">
                Toàn bộ dữ liệu 1 tháng đóng vai trò kim chỉ nam giúp bạn lập ngân sách tháng tới bám sát đời sống thực.
              </p>

              {/* Visual Demo Card */}
              <div className="mt-6 rounded-2xl border border-ink/8 bg-ink/[0.02] p-4">
                <span className="text-[10px] uppercase tracking-wider text-ink/40">Báo cáo tháng hoàn chỉnh:</span>
                <div className="mt-2 flex items-baseline justify-between">
                  <strong className="font-display text-xl text-ink">6.240.000 ₫</strong>
                  <span className="text-xs text-emerald-700 font-medium">+1.760.000 ₫ thặng dư</span>
                </div>
                <div className="mt-2 h-1.5 w-full rounded-full bg-ink/10">
                  <div className="h-full rounded-full bg-emerald-600" style={{ width: "78%" }} />
                </div>
                <span className="mt-2 block text-[10px] text-ink/50">Đã đạt 78% kế hoạch tích lũy cá nhân</span>
              </div>

              <div className="mt-6 border-t border-ink/8 pt-4">
                <span className="text-[11px] font-medium text-ink/80">Lợi ích đạt được:</span>
                <p className="mt-1 text-xs text-ink/65">Có cơ sở dữ liệu thật để lập ngân sách tháng sau chính xác 100%.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION E: FAQ ACCORDION (#faq)
          Controlled Zone: Clean Minimal Paper
      ========================================================================= */}
      {page.faq && page.faq.length > 0 && (
        <section id="faq" className="scroll-mt-28 border-t border-ink/10 bg-paper py-20 md:py-28" aria-labelledby="heading-faq">
          <div className="mx-auto max-w-[860px] px-6 md:px-10">
            <div className="text-center">
              <span className="text-[11px] font-medium uppercase tracking-[0.24em] text-vermilion">Giải đáp thắc mắc</span>
              <h2 id="heading-faq" className="mt-3 font-display text-3xl font-light text-ink md:text-4xl">
                Câu hỏi thường gặp về Thống kê
              </h2>
            </div>

            <div className="mt-12 divide-y divide-ink/10 border-y border-ink/10">
              {page.faq.map((item, idx) => {
                const isOpen = openFaqIdx === idx;
                return (
                  <div key={item.q} className="py-6">
                    <button
                      type="button"
                      onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                      className="flex w-full cursor-pointer items-start justify-between gap-4 text-left font-display text-xl font-normal text-ink transition-colors hover:text-vermilion"
                    >
                      <span>{item.q}</span>
                      <span className="mt-1 font-mono text-base text-vermilion transition-transform duration-300" style={{ transform: isOpen ? "rotate(45deg)" : "none" }}>
                        +
                      </span>
                    </button>
                    {isOpen && (
                      <p className="mt-3 text-sm leading-relaxed text-ink/75 transition-opacity duration-300">
                        {item.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION F: FINAL CTA — CLOSING SHOT
          Controlled Zone: Near-Black Cinematic Stage (#0c0a09)
      ========================================================================= */}
      <section className="relative overflow-hidden bg-[#0c0a09] py-24 text-paper md:py-36" aria-labelledby="cta-heading">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_40%,#261713_0%,#0c0a09_75%)]" />
        
        <div className="mx-auto max-w-[1240px] px-6 md:px-10">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_auto]">
            {/* Left: Closing Editorial Callout */}
            <div>
              <p className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.28em] text-paper/60">
                <span className="font-display text-base text-vermilion">Sổ Chi</span>
                <span className="h-px w-8 bg-current opacity-40" />
                Sắp ra mắt trên iOS & Android
              </p>
              <h2 id="cta-heading" className="mt-4 font-display text-[clamp(2.5rem,5.5vw,4.8rem)] font-light leading-[1.06] text-paper">
                Hiểu rõ tiền của bạn. <br />
                <span className="italic text-paper/80">Bắt đầu từ một con số hôm nay.</span>
              </h2>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-paper/70">
                Gia nhập danh sách chờ để nhận quyền trải nghiệm sớm bản phát hành chính thức của Sổ Chi. Hoàn toàn miễn phí và không spam.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link
                  href="/#tai-ung-dung"
                  onClick={(e) => {
                    if (window.innerWidth < 768) {
                      e.preventDefault();
                      openPrelaunchSheet("stats_stories");
                    }
                  }}
                  className="inline-flex cursor-pointer items-center gap-3 rounded-full bg-vermilion px-8 py-4 text-sm uppercase tracking-[0.16em] font-medium text-paper shadow-xl shadow-vermilion/40 transition-all duration-300 hover:bg-vermilion-bright hover:shadow-2xl hover:scale-105 active:scale-[0.98]"
                >
                  Nhận thông báo khi ra mắt <span aria-hidden>→</span>
                </Link>
                <Link
                  href="/tinh-nang"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-paper/20 px-6 py-4 text-sm uppercase tracking-[0.16em] text-paper/80 transition-colors hover:border-paper/40 hover:text-paper"
                >
                  Khám phá toàn bộ tính năng
                </Link>
              </div>

              <div className="mt-8 flex items-center gap-6 text-xs text-paper/50">
                <span className="flex items-center gap-2">✓ Bảo mật dữ liệu</span>
                <span className="flex items-center gap-2">✓ Không quảng cáo rác</span>
                <span className="flex items-center gap-2">✓ Tối ưu cho người Việt</span>
              </div>
            </div>

            {/* Right: Closing Product Perspective Display */}
            <div className="flex justify-center">
              <DeviceMockup
                screen="thong-ke"
                alt="Màn hình thống kê Sổ Chi hoàn chỉnh"
                perspective="perspective-right"
                w="clamp(250px, 28vw, 320px)"
                ambientGlow="vermilion"
              />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION G: EDITORIAL RELATED LINKS
          Controlled Zone: Clean Paper (#f7f4ed)
      ========================================================================= */}
      {relatedRoutes.length > 0 && (
        <section className="border-t border-ink/10 bg-[#f7f4ed] py-20 md:py-28" aria-label="Liên kết liên quan">
          <div className="mx-auto max-w-[1200px] px-6 md:px-10">
            <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-ink/10 pb-6">
              <div>
                <span className="text-[11px] uppercase tracking-[0.24em] text-vermilion font-medium">Khám phá tiếp</span>
                <h2 className="mt-2 font-display text-3xl font-light text-ink md:text-4xl">Trang liên quan</h2>
              </div>
              <Link href="/tinh-nang" className="text-xs uppercase tracking-wider text-ink/60 hover:text-ink">
                Xem tất cả tính năng →
              </Link>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {relatedRoutes.map((route, idx) => (
                <Link
                  key={route.path}
                  href={route.path}
                  className="group block rounded-3xl border border-ink/10 bg-paper p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-vermilion/50 hover:shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold text-vermilion">0{idx + 1}</span>
                    <span className="text-[10px] uppercase tracking-wider text-ink/40">
                      {route.kind === "article" ? "Bài viết" : "Tính năng"}
                    </span>
                  </div>

                  <h3 className="mt-4 font-display text-2xl font-light text-ink group-hover:text-vermilion transition-colors">
                    {route.nav}
                  </h3>

                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-ink/65">
                    {route.description}
                  </p>

                  <div className="mt-6 flex items-center gap-2 text-xs font-medium text-vermilion">
                    <span>Tìm hiểu thêm</span>
                    <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
