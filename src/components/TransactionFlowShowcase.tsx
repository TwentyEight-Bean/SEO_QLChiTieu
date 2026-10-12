import { useState, useEffect } from "react";
import DeviceMockup from "./DeviceMockup";

interface DemoTransaction {
  id: string;
  icon: string;
  name: string;
  meta: string;
  value: string;
  tone: "red" | "green" | "gold";
}

const INITIAL_TRANSACTIONS: DemoTransaction[] = [
  { id: "tx-1", icon: "Ă", name: "Bữa trưa", meta: "Ăn uống · 12:30", value: "−85.000 ₫", tone: "red" },
  { id: "tx-2", icon: "X", name: "Xăng xe", meta: "Di chuyển · 08:15", value: "−50.000 ₫", tone: "gold" },
  { id: "tx-3", icon: "L", name: "Thưởng dự án", meta: "Thu nhập · Hôm qua", value: "+2.500.000 ₫", tone: "green" },
];

export default function TransactionFlowShowcase() {
  const [step, setStep] = useState(0); // 0: Ready, 1: Form popup, 2: Insert into list, 3: Category highlight, 4: Summary update
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setTimeout(() => {
      setStep((prev) => (prev < 4 ? prev + 1 : 0));
    }, 1800);
    return () => clearTimeout(timer);
  }, [isPlaying, step]);

  const handleNextStep = () => {
    setIsPlaying(false);
    setStep((prev) => (prev < 4 ? prev + 1 : 0));
  };

  return (
    <section className="transaction-flow-section relative overflow-hidden bg-ink py-20 text-paper md:py-32" aria-labelledby="tx-flow-title">
      {/* Background ambient light */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_70%_20%,#261912_0%,#0c0a09_70%)]" />

      <div className="mx-auto max-w-[1300px] px-6 md:px-10">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="flex items-center justify-center gap-3 text-[11px] font-medium uppercase tracking-[0.28em] text-paper/60">
            <span className="font-display text-base text-vermilion">01</span>
            <span className="h-px w-8 bg-current opacity-40" />
            Mô phỏng quy trình ghi chép
          </p>
          <h2 id="tx-flow-title" className="mt-4 font-display text-[clamp(2.3rem,5vw,4.5rem)] font-light leading-[1.08]">
            Mọi giao dịch trở nên rõ ràng <br />
            <span className="italic text-paper/80">trong chưa đầy 3 giây</span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-paper/70">
            Không biểu mẫu rườm rà. Nhập số tiền, chạm chọn danh mục và giao dịch lập tức được kết nối vào bức tranh tài chính tổng thể của bạn.
          </p>
        </div>

        {/* Interactive Controls Bar */}
        <div className="mx-auto mt-10 max-w-5xl">
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-2.5">
            {[
              { s: 0, label: "01. Khởi tạo" },
              { s: 1, label: "02. Nhập khoản chi" },
              { s: 2, label: "03. Trượt danh sách" },
              { s: 3, label: "04. Chiếu sáng nhóm" },
              { s: 4, label: "05. Cập nhật tiền" },
            ].map((item) => (
              <button
                key={item.s}
                type="button"
                onClick={() => {
                  setIsPlaying(false);
                  setStep(item.s);
                }}
                className={`flex min-h-11 cursor-pointer items-center whitespace-nowrap rounded-full border px-4 py-2.5 text-xs uppercase tracking-[0.12em] transition-colors ${
                  step === item.s
                    ? "border-vermilion bg-vermilion text-paper font-medium shadow-md shadow-vermilion/30"
                    : "border-paper/15 text-paper/60 hover:border-paper/30 hover:text-paper"
                }`}
              >
                {item.label}
              </button>
            ))}

            {/* Play/Pause Button with FIXED WIDTH so it NEVER causes line jumps */}
            <button
              type="button"
              onClick={() => setIsPlaying((prev) => !prev)}
              className="inline-flex min-h-11 w-36 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-3 py-2.5 text-xs uppercase tracking-[0.12em] text-gold transition-colors hover:bg-gold hover:text-ink font-medium"
            >
              <span className={`size-1.5 rounded-full ${isPlaying ? "bg-emerald-400" : "bg-gold animate-pulse"}`} />
              <span>{isPlaying ? "Tạm dừng" : "Tự động ▶"}</span>
            </button>
          </div>
        </div>

        {/* 2.5D Interactive Stage */}
        <div className="mt-16 grid items-center gap-12 lg:grid-cols-[380px_1fr]">
          {/* Left: Interactive Phone Mockup with Emerging Transaction Row */}
          <div className="relative flex justify-center">
            <DeviceMockup
              screen="thu-chi"
              alt="Giao diện ghi chép thu chi của Sổ Chi"
              perspective="perspective-left"
              w="clamp(230px, 24vw, 300px)"
              ambientGlow="vermilion"
              floatingChips={[
                {
                  id: "tx-live-toast",
                  position: "top-left",
                  content: (
                    <div className="flex items-center gap-2 rounded-full border border-paper/20 bg-lacquer/90 px-3.5 py-1.5 text-[11px] text-paper shadow-xl backdrop-blur-md">
                      <span className="size-2 rounded-full bg-emerald-400" />
                      <span>{step >= 2 ? "Đã lưu 1 giao dịch" : "Sẵn sàng ghi nhanh"}</span>
                    </div>
                  ),
                },
              ]}
            />

            {/* Emerging Floating Transaction Card (2.5D Layer) */}
            {step >= 1 && (
              <div
                className={`absolute left-1/2 top-1/3 z-30 w-64 -translate-x-1/2 rounded-2xl border border-vermilion/50 bg-[#1f1915] p-4 text-paper shadow-2xl backdrop-blur-md transition-all duration-700 ${
                  step === 1
                    ? "scale-105 translate-y-0 opacity-100"
                    : step >= 2
                    ? "scale-95 translate-y-24 opacity-0 pointer-events-none"
                    : "opacity-0"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-widest text-vermilion font-medium">Khoản chi mới</span>
                  <span className="rounded-full bg-vermilion/20 px-2 py-0.5 text-[10px] text-vermilion">Vừa nhập</span>
                </div>
                <div className="mt-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="flex size-7 items-center justify-center rounded-full bg-vermilion text-xs font-semibold text-paper">
                      Ă
                    </span>
                    <div>
                      <strong className="block text-xs font-normal">Cà phê sáng</strong>
                      <span className="text-[10px] text-paper/50">Ăn uống · 09:15</span>
                    </div>
                  </div>
                  <strong className="font-display text-base text-vermilion">−45.000 ₫</strong>
                </div>
              </div>
            )}
          </div>

          {/* Right: Step-by-Step Interactive Flow Breakdown */}
          <div className="rounded-3xl border border-paper/15 bg-gradient-to-b from-[#1c1613] to-[#0f0c0b] p-6 shadow-2xl md:p-10">
            <span className="text-xs uppercase tracking-[0.24em] text-paper/50">Diễn giải chuyển động tương tác</span>

            {/* Mobile Vertical Flow Sequence Indicator (Section 9 Requirement) */}
            <div className="mt-4 md:hidden rounded-2xl border border-paper/10 bg-paper/5 p-4">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-paper/50">Trình tự luồng dữ liệu</span>
              <div className="mt-3 flex flex-col items-center gap-1.5 text-xs text-paper/80">
                <div className={`w-full flex items-center justify-between rounded-lg px-3 py-2 transition-colors ${step === 1 ? "bg-vermilion/20 border border-vermilion/40 text-paper font-medium" : "bg-paper/5"}`}>
                  <span>Khoản chi mới</span>
                  <span className="text-vermilion font-medium">−45.000 ₫</span>
                </div>
                <span className="text-paper/40 text-xs" aria-hidden>↓</span>
                <div className={`w-full flex items-center justify-between rounded-lg px-3 py-2 transition-colors ${step === 3 ? "bg-vermilion/20 border border-vermilion/40 text-paper font-medium" : "bg-paper/5"}`}>
                  <span>Danh mục</span>
                  <span className="text-gold">Ăn uống</span>
                </div>
                <span className="text-paper/40 text-xs" aria-hidden>↓</span>
                <div className={`w-full flex items-center justify-between rounded-lg px-3 py-2 transition-colors ${step === 2 ? "bg-vermilion/20 border border-vermilion/40 text-paper font-medium" : "bg-paper/5"}`}>
                  <span>Danh sách giao dịch</span>
                  <span className="text-paper/60">09:15 sáng</span>
                </div>
                <span className="text-paper/40 text-xs" aria-hidden>↓</span>
                <div className={`w-full flex items-center justify-between rounded-lg px-3 py-2 transition-colors ${step === 4 ? "bg-vermilion/20 border border-vermilion/40 text-paper font-medium" : "bg-paper/5"}`}>
                  <span>Tổng chi ngày</span>
                  <span className="text-paper font-semibold">180.000 ₫</span>
                </div>
                <span className="text-paper/40 text-xs" aria-hidden>↓</span>
                <div className={`w-full flex items-center justify-between rounded-lg px-3 py-2 transition-colors ${step === 0 || step === 4 ? "bg-vermilion/20 border border-vermilion/40 text-paper font-medium" : "bg-paper/5"}`}>
                  <span>Bức tranh tổng thể</span>
                  <span className="text-emerald-400">24.680.000 ₫</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-6">
              {/* Step item 1 */}
              <div
                className={`rounded-2xl border p-4 md:p-5 transition-all duration-300 ${
                  step === 1
                    ? "border-vermilion bg-vermilion/10 text-paper"
                    : "border-paper/10 bg-paper/5 text-paper/70 hover:border-paper/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <strong className="text-sm font-medium">1. Giao dịch xuất hiện từ thao tác nhanh</strong>
                  <span className="font-display text-sm text-vermilion">Bước 1</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-paper/65">
                  Bấm nút “Ghi giao dịch”, số tiền −45.000 ₫ và nhóm Ăn uống lập tức tách lớp nổi lên khỏi bề mặt điện thoại theo chiều sâu 2.5D.
                </p>
              </div>

              {/* Step item 2 */}
              <div
                className={`rounded-2xl border p-4 md:p-5 transition-all duration-300 ${
                  step === 2
                    ? "border-vermilion bg-vermilion/10 text-paper"
                    : "border-paper/10 bg-paper/5 text-paper/70 hover:border-paper/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <strong className="text-sm font-medium">2. Trượt êm ái vào dòng thời gian hôm nay</strong>
                  <span className="font-display text-sm text-vermilion">Bước 2</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-paper/65">
                  Khoản chi tự động trượt vào danh sách theo đúng mốc thời gian, đẩy các khoản trước đó xuống một bậc mà không làm nhấp nháy giao diện.
                </p>
              </div>

              {/* Step item 3 */}
              <div
                className={`rounded-2xl border p-4 md:p-5 transition-all duration-300 ${
                  step === 3
                    ? "border-vermilion bg-vermilion/10 text-paper"
                    : "border-paper/10 bg-paper/5 text-paper/70 hover:border-paper/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <strong className="text-sm font-medium">3. Nhóm chi tiêu được chiếu sáng đồng bộ</strong>
                  <span className="font-display text-sm text-vermilion">Bước 3</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-paper/65">
                  Biểu tượng nhóm “Ăn uống” phát sáng nhẹ, báo hiệu dữ liệu này đã được gán nhãn chính xác cho báo cáo thống kê và hạn mức ngân sách.
                </p>
              </div>

              {/* Step item 4 */}
              <div
                className={`rounded-2xl border p-4 md:p-5 transition-all duration-300 ${
                  step === 4
                    ? "border-vermilion bg-vermilion/10 text-paper"
                    : "border-paper/10 bg-paper/5 text-paper/70 hover:border-paper/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <strong className="text-sm font-medium">4. Tổng chi ngày nhảy số và dòng tiền cập nhật</strong>
                  <span className="font-display text-sm text-vermilion">Bước 4</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-paper/65">
                  Tổng chi ngày nhảy từ 135.000 ₫ lên 180.000 ₫, số dư khả dụng cập nhật tương ứng. Người dùng lập tức thấy được tác động của khoản tiền.
                </p>
              </div>
            </div>

            {/* Next step button */}
            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={handleNextStep}
                className="cursor-pointer rounded-full bg-vermilion px-6 py-2.5 text-xs uppercase tracking-[0.16em] font-medium text-paper transition-opacity hover:opacity-90"
              >
                {step === 4 ? "Bắt đầu lại chu kỳ" : "Xem bước tiếp theo →"}
              </button>
            </div>
          </div>
        </div>

        {/* Large Typography Interlude (Requested by Prompt) */}
        <div className="mt-28 border-t border-paper/15 pt-20 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-paper/50">Triết lý thiết kế Sổ Chi</p>
          <div className="mt-6 flex flex-col items-center justify-center font-display text-[clamp(2.8rem,7vw,6.5rem)] font-light leading-[1.05] tracking-tight">
            <span className="transition-transform duration-700 hover:scale-105 hover:text-vermilion">Ghi lại.</span>
            <span className="italic text-paper/85 transition-transform duration-700 hover:scale-105 hover:text-vermilion">Hiểu rõ.</span>
            <span className="text-vermilion transition-transform duration-700 hover:scale-105">Kiểm soát.</span>
          </div>
          <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-paper/65">
            Không cần cố nhớ mọi thứ trong đầu. Chỉ cần 3 giây ghi chép mỗi khi thanh toán, sự an tâm tài chính sẽ bắt đầu hình thành.
          </p>
        </div>
      </div>
    </section>
  );
}
