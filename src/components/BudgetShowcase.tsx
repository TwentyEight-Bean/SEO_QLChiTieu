import { useState } from "react";
import DeviceMockup from "./DeviceMockup";

const BUDGET_STAGES = [
  { pct: 35, label: "Đầu tháng (35%)", desc: "Dòng tiền an toàn, tiến độ chi tiêu nằm trong tầm kiểm soát hoàn toàn.", tone: "safe", warning: false },
  { pct: 55, label: "Giữa tháng (55%)", desc: "Đã dùng hơn một nửa ngân sách dự kiến, nhịp chi tiêu đều đặn.", tone: "safe", warning: false },
  { pct: 78, label: "Gần cuối tháng (78%)", desc: "Tiến độ chạm ngưỡng cân nhắc, nên giảm các khoản mua sắm ngẫu hứng.", tone: "caution", warning: false },
  { pct: 91, label: "Chạm ngưỡng (91%)", desc: "Cảnh báo điềm đạm: Chỉ còn 100.000 ₫ trong hạn mức nhóm Mua sắm.", tone: "warning", warning: true },
];

const CATEGORY_CARDS = [
  { id: "food", name: "Ăn uống", limit: "3.000.000 ₫", used: "1.900.000 ₫", pct: 63, depth: "depth-1", tone: "red" },
  { id: "transport", name: "Di chuyển", limit: "1.200.000 ₫", used: "680.000 ₫", pct: 56, depth: "depth-2", tone: "gold" },
  { id: "shopping", name: "Mua sắm", limit: "1.500.000 ₫", used: "1.365.000 ₫", pct: 91, depth: "depth-3", tone: "alert" },
  { id: "entertainment", name: "Giải trí", limit: "1.000.000 ₫", used: "350.000 ₫", pct: 35, depth: "depth-4", tone: "ink" },
];

export default function BudgetShowcase() {
  const [activeStage, setActiveStage] = useState(3); // default to 91% to showcase the design challenge
  const [selectedCat, setSelectedCat] = useState("shopping");

  const currentStage = BUDGET_STAGES[activeStage];
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (currentStage.pct / 100) * circumference;

  return (
    <section className="budget-showcase-section relative overflow-hidden bg-ink py-20 text-paper md:py-32" aria-labelledby="budget-showcase-title">
      {/* Background radial atmosphere */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_25%_40%,#261912_0%,#0c0a09_70%)]" />

      <div className="mx-auto max-w-[1300px] px-6 md:px-10">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="flex items-center justify-center gap-3 text-[11px] font-medium uppercase tracking-[0.28em] text-paper/60">
            <span className="font-display text-base text-vermilion">01</span>
            <span className="h-px w-8 bg-current opacity-40" />
            Kiểm soát ngưỡng an toàn
          </p>
          <h2 id="budget-showcase-title" className="mt-4 font-display text-[clamp(2.3rem,5vw,4.5rem)] font-light leading-[1.08]">
            Biết giới hạn trước khi vượt qua <br />
            <span className="italic text-paper/80">với vòng tròn tiến độ trực quan</span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-paper/70">
            Ngân sách của Sổ Chi không phải chiếc cùm ngăn bạn chi tiêu. Nó đóng vai trò như chiếc la bàn cảnh báo điềm đạm trước khi bạn chạm ngưỡng.
          </p>
        </div>

        {/* Stage 1: Circular Progress Interactive Showcase */}
        <div className="mt-16 grid items-center gap-12 lg:grid-cols-[400px_1fr]">
          {/* Left: Device Mockup */}
          <div className="flex justify-center">
            <DeviceMockup
              screen="ngan-sach"
              alt="Màn hình quản lý ngân sách trong Sổ Chi"
              perspective="perspective-right"
              w="clamp(230px, 24vw, 300px)"
              ambientGlow={currentStage.warning ? "vermilion" : "gold"}
              floatingChips={[
                {
                  id: "budget-alert-chip",
                  position: "top-right",
                  content: (
                    <div
                      className={`flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[11px] shadow-xl backdrop-blur-md transition-colors ${
                        currentStage.warning
                          ? "border-vermilion/50 bg-vermilion/20 text-paper font-medium"
                          : "border-paper/20 bg-lacquer/90 text-paper"
                      }`}
                    >
                      <span className={`size-2 rounded-full ${currentStage.warning ? "bg-vermilion animate-ping" : "bg-gold"}`} />
                      <span>{currentStage.warning ? "Sắp chạm hạn mức" : "Tiến độ bình thường"}</span>
                    </div>
                  ),
                },
              ]}
            />
          </div>

          {/* Right: Large Circular Progress Visual & Interactive Stepper */}
          <div className="rounded-3xl border border-paper/15 bg-gradient-to-b from-[#1c1613] to-[#0f0c0b] p-6 shadow-2xl md:p-10">
            <div className="flex flex-col items-center justify-between gap-8 sm:flex-row">
              {/* SVG Animated Circular Gauge */}
              <div className="relative flex size-44 items-center justify-center shrink-0">
                <svg className="size-full -rotate-90 transform" viewBox="0 0 160 160">
                  {/* Track background */}
                  <circle cx="80" cy="80" r={radius} fill="none" stroke="rgba(242,236,223,0.1)" strokeWidth="12" />
                  {/* Active progress */}
                  <circle
                    cx="80"
                    cy="80"
                    r={radius}
                    fill="none"
                    stroke={currentStage.warning ? "#d23a22" : currentStage.pct > 70 ? "#b8935a" : "#e8e0cf"}
                    strokeWidth="12"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-700 ease-out"
                  />
                </svg>
                {/* Center text */}
                <div className="absolute text-center">
                  <span className={`font-display text-4xl font-light ${currentStage.warning ? "text-vermilion" : "text-paper"}`}>
                    {currentStage.pct}%
                  </span>
                  <p className="text-[10px] uppercase tracking-widest text-paper/50">Đã dùng</p>
                </div>
              </div>

              {/* Progress Stage Description */}
              <div className="flex-1">
                <span className="text-xs uppercase tracking-[0.2em] text-paper/50">Mô phỏng 4 mức tiến độ</span>
                <h3 className="mt-2 font-display text-2xl font-light text-paper md:text-3xl">
                  {currentStage.label}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-paper/70">{currentStage.desc}</p>

                <div
                  className={`mt-4 flex items-center gap-2.5 rounded-xl border p-3 text-xs transition-all duration-300 ${
                    currentStage.warning
                      ? "border-vermilion/40 bg-vermilion/10 text-paper/90 shadow-sm"
                      : "border-paper/10 bg-paper/5 text-paper/65"
                  }`}
                >
                  <span
                    className={`flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                      currentStage.warning ? "bg-vermilion text-paper" : "bg-paper/20 text-paper/70"
                    }`}
                  >
                    {currentStage.warning ? "!" : "✓"}
                  </span>
                  <span>
                    {currentStage.warning
                      ? "Cảnh báo tinh tế bằng sắc đỏ son (Vermilion) — không gây áp lực hoảng sợ."
                      : "Duy trì nhịp chi tiêu này để đạt mục tiêu thặng dư an toàn cuối tháng."}
                  </span>
                </div>
              </div>
            </div>

            {/* Stepper Buttons */}
            <div className="mt-8 flex flex-wrap gap-2.5 border-t border-paper/10 pt-6">
              {BUDGET_STAGES.map((stg, idx) => (
                <button
                  key={stg.pct}
                  type="button"
                  onClick={() => setActiveStage(idx)}
                  className={`cursor-pointer rounded-full px-4 py-2 text-xs uppercase tracking-[0.14em] transition-all ${
                    activeStage === idx
                      ? "bg-vermilion text-paper font-medium shadow-md shadow-vermilion/30"
                      : "border border-paper/15 text-paper/60 hover:border-paper/30 hover:text-paper"
                  }`}
                >
                  {stg.pct}%
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stage 2: 2.5D Layered Depth Category Cards (Depth Stagger) */}
        <div className="mt-28">
          <div className="mx-auto max-w-2xl text-center">
            <p className="flex items-center justify-center gap-3 text-[11px] font-medium uppercase tracking-[0.28em] text-paper/60">
              <span className="font-display text-base text-vermilion">02</span>
              <span className="h-px w-8 bg-current opacity-40" />
              Tách lớp đa chiều theo danh mục
            </p>
            <h3 className="mt-3 font-display text-3xl font-light md:text-4xl">
              Chọn danh mục để đưa lên tiền cảnh
            </h3>
            <p className="mt-2 text-sm text-paper/65">
              Mỗi nhóm ngân sách có hạn mức độc lập. Chạm vào bất kỳ nhóm nào để quan sát mức độ an toàn.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORY_CARDS.map((cat) => {
              const isSelected = selectedCat === cat.id;
              return (
                <div
                  key={cat.id}
                  onClick={() => setSelectedCat(cat.id)}
                  className={`group cursor-pointer rounded-2xl border p-5 transition-all duration-500 ${
                    isSelected
                      ? "border-vermilion bg-paper/10 scale-105 shadow-2xl shadow-vermilion/20"
                      : "border-paper/15 bg-paper/5 opacity-80 hover:opacity-100 hover:border-paper/30"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-widest text-paper/50">{cat.name}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        cat.pct > 85 ? "bg-vermilion/30 text-vermilion border border-vermilion/40" : "bg-paper/10 text-paper/70"
                      }`}
                    >
                      {cat.pct}%
                    </span>
                  </div>

                  <strong className="mt-3 block font-display text-2xl font-normal text-paper">{cat.used}</strong>
                  <span className="text-xs text-paper/50">Hạn mức: {cat.limit}</span>

                  {/* Progress bar */}
                  <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-paper/15">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${cat.pct > 85 ? "bg-vermilion" : "bg-gold"}`}
                      style={{ width: `${cat.pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stage 3: Budget vs Actual Split Composition */}
        <div className="mt-24 rounded-3xl border border-paper/15 bg-gradient-to-r from-[#17120f] to-[#120f0d] p-8 md:p-12">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <span className="text-xs uppercase tracking-[0.24em] text-paper/50">So sánh thực chi vs Dự toán</span>
              <h3 className="mt-3 font-display text-3xl font-light text-paper md:text-4xl">
                Không lo thiếu hụt <br />
                <span className="italic text-paper/80">vào những ngày cuối tháng</span>
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-paper/70">
                Sổ Chi tự động tính toán số tiền an toàn bạn có thể chi mỗi ngày từ phần ngân sách còn lại. Nếu hôm nay chi ít hơn, ngày mai bạn sẽ có thêm khoản tự do.
              </p>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-paper/10 bg-paper/5 p-4">
                <div className="flex justify-between text-xs text-paper/60">
                  <span>Hạn mức tháng</span>
                  <span className="font-display text-sm text-paper">10.000.000 ₫</span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-paper/10">
                  <div className="h-full rounded-full bg-paper/40" style={{ width: "100%" }} />
                </div>
              </div>

              <div className="rounded-2xl border border-vermilion/30 bg-vermilion/5 p-4">
                <div className="flex justify-between text-xs text-paper/80">
                  <span>Đã chi thực tế</span>
                  <span className="font-display text-sm text-vermilion">6.200.000 ₫ (62%)</span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-paper/10">
                  <div className="h-full rounded-full bg-vermilion" style={{ width: "62%" }} />
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4">
                <div className="flex justify-between text-xs text-emerald-400">
                  <span>Còn lại cho 19 ngày tới</span>
                  <span className="font-display text-base font-medium text-emerald-300">3.800.000 ₫ (~200.000 ₫/ngày)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
