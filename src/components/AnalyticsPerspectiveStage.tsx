import { useState } from "react";

const CATEGORY_SLICES = [
  { name: "Ăn uống", pct: 38, amount: "2.370.000 ₫", color: "#d23a22", icon: "Ă", detail: "Trung bình 79.000 ₫/ngày · 32 giao dịch" },
  { name: "Nhà ở & Tiện ích", pct: 27, amount: "1.685.000 ₫", color: "#17120f", icon: "N", detail: "Điện nước, internet và đồ dùng sinh hoạt" },
  { name: "Di chuyển", pct: 19, amount: "1.185.000 ₫", color: "#b8935a", icon: "X", detail: "Xăng xe, gửi xe, 14 chuyến đi trong tháng" },
  { name: "Khác", pct: 16, amount: "1.000.000 ₫", color: "#9a9183", icon: "K", detail: "Chi phí phát sinh và mua sắm cá nhân" },
];

export default function AnalyticsPerspectiveStage() {
  const [selectedCat, setSelectedCat] = useState(0);

  const active = CATEGORY_SLICES[selectedCat];

  return (
    <section className="perspective-analytics-stage relative overflow-hidden bg-paper px-6 py-24 text-ink md:px-10 md:py-32">
      <div className="mx-auto max-w-[1240px]">
        {/* Section kicker & title */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="flex items-center justify-center gap-3 text-[11px] font-medium uppercase tracking-[0.28em] text-ink/60">
            <span className="font-display text-base text-vermilion">02</span>
            <span className="h-px w-8 bg-current opacity-40" />
            Tách lớp chiều sâu 2.5D
          </p>
          <h2 className="mt-4 font-display text-[clamp(2.2rem,4.5vw,4rem)] font-light leading-[1.1]">
            Nhìn thấu từng dòng tiền <br />
            <span className="italic text-ink/75">dưới mọi góc độ phân tích</span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-ink/70">
            Dữ liệu thu chi không nằm phẳng trên một màn hình tĩnh. Sổ Chi tự động bóc tách tỷ trọng theo danh mục và làm nổi bật các biến động cần lưu ý.
          </p>
        </div>

        {/* 2.5D Layered Composition */}
        <div className="mt-16 grid items-center gap-12 lg:grid-cols-[1fr_420px]">
          {/* Left: Interactive Category Expansion Donut & Depth Cards */}
          <div className="relative rounded-3xl border border-ink/10 bg-washi/40 p-8 shadow-xl md:p-12">
            <div className="grid items-center gap-8 md:grid-cols-[220px_1fr]">
              {/* SVG Dynamic Donut Visual */}
              <div className="relative flex justify-center">
                <svg className="size-48 -rotate-90 transform" viewBox="0 0 160 160">
                  <circle cx="80" cy="80" r="62" fill="none" stroke="currentColor" strokeOpacity="0.08" strokeWidth="18" />
                  
                  {/* Category Arcs */}
                  {/* Ăn uống 38%: dasharray: 148 241, offset: 0 */}
                  <circle
                    cx="80"
                    cy="80"
                    r="62"
                    fill="none"
                    stroke="#d23a22"
                    strokeWidth={selectedCat === 0 ? "24" : "18"}
                    strokeDasharray="148 241"
                    strokeDashoffset="0"
                    className="cursor-pointer transition-all duration-300"
                    onClick={() => setSelectedCat(0)}
                  />
                  {/* Nhà ở 27%: dasharray: 105 284, offset: -148 */}
                  <circle
                    cx="80"
                    cy="80"
                    r="62"
                    fill="none"
                    stroke="#17120f"
                    strokeWidth={selectedCat === 1 ? "24" : "18"}
                    strokeDasharray="105 284"
                    strokeDashoffset="-148"
                    className="cursor-pointer transition-all duration-300"
                    onClick={() => setSelectedCat(1)}
                  />
                  {/* Di chuyển 19%: dasharray: 74 315, offset: -253 */}
                  <circle
                    cx="80"
                    cy="80"
                    r="62"
                    fill="none"
                    stroke="#b8935a"
                    strokeWidth={selectedCat === 2 ? "24" : "18"}
                    strokeDasharray="74 315"
                    strokeDashoffset="-253"
                    className="cursor-pointer transition-all duration-300"
                    onClick={() => setSelectedCat(2)}
                  />
                  {/* Khác 16%: dasharray: 62 327, offset: -327 */}
                  <circle
                    cx="80"
                    cy="80"
                    r="62"
                    fill="none"
                    stroke="#9a9183"
                    strokeWidth={selectedCat === 3 ? "24" : "18"}
                    strokeDasharray="62 327"
                    strokeDashoffset="-327"
                    className="cursor-pointer transition-all duration-300"
                    onClick={() => setSelectedCat(3)}
                  />
                </svg>

                {/* Center of Donut */}
                <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                  <span className="font-display text-3xl font-light text-ink">{active.pct}%</span>
                  <p className="text-[10px] uppercase tracking-widest text-ink/50">{active.name}</p>
                </div>
              </div>

              {/* Active Category Deep Detail */}
              <div className="flex flex-col justify-center">
                <span className="text-[11px] uppercase tracking-[0.22em] text-ink/50">Chi tiết nhóm được chọn</span>
                <h3 className="mt-2 font-display text-2xl font-light md:text-3xl" style={{ color: active.color === "#17120f" ? "inherit" : active.color }}>
                  {active.name}
                </h3>
                <p className="mt-1 font-display text-xl text-ink/80">{active.amount}</p>
                <p className="mt-3 text-sm leading-relaxed text-ink/65">{active.detail}</p>

                {/* Category Selector Tabs */}
                <div className="mt-6 flex flex-wrap gap-2">
                  {CATEGORY_SLICES.map((cat, idx) => (
                    <button
                      key={cat.name}
                      type="button"
                      onClick={() => setSelectedCat(idx)}
                      className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs transition-all ${
                        selectedCat === idx
                          ? "border-vermilion bg-vermilion text-paper font-medium"
                          : "border-ink/20 text-ink/70 hover:border-ink/40"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: 3 Layered Floating Metric Cards with 2.5D Depth Stagger */}
          <div className="relative flex flex-col gap-4">
            {/* Layer 1: Net Cashflow */}
            <div className="group rounded-2xl border border-ink/10 bg-paper p-5 shadow-lg transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-[0.18em] text-ink/55">Dòng tiền ròng</span>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-medium text-emerald-800">Dương</span>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <strong className="font-display text-2xl font-normal text-ink">+12.260.000 ₫</strong>
                <span className="text-xs text-ink/60">Thu 18,5 tr · Chi 6,2 tr</span>
              </div>
              <p className="mt-2 text-xs text-ink/60">Tỷ lệ thặng dư đạt 66% tổng thu nhập tháng.</p>
            </div>

            {/* Layer 2: Spending Spike Callout */}
            <div className="group relative rounded-2xl border border-vermilion/30 bg-paper p-5 shadow-lg transition-transform duration-300 hover:-translate-y-1 hover:border-vermilion hover:shadow-xl">
              <span className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-vermilion text-[10px] text-paper shadow">
                !
              </span>
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-[0.18em] text-ink/55">Chi tiêu cần chú ý</span>
                <span className="text-xs font-semibold text-vermilion">Đỉnh đột biến</span>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <strong className="font-display text-2xl font-normal text-ink">Thứ Bảy, 10 Thg 10</strong>
                <span className="text-xs text-vermilion font-medium">850.000 ₫</span>
              </div>
              <p className="mt-2 text-xs text-ink/60">Gấp 4,5 lần mức chi trung bình ngày do mua đồ gia dụng.</p>
            </div>

            {/* Layer 3: Savings Rate & Goal Progress */}
            <div className="group rounded-2xl border border-ink/10 bg-paper p-5 shadow-lg transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-[0.18em] text-ink/55">Mục tiêu tiết kiệm</span>
                <span className="text-xs font-medium text-gold">Đạt 85%</span>
              </div>
              <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-ink/10">
                <div className="h-full rounded-full bg-gold transition-all duration-1000" style={{ width: "85%" }} />
              </div>
              <p className="mt-2 text-xs text-ink/60">Còn 760.000 ₫ để hoàn thành kế hoạch tích lũy tháng này.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
