import { useState, useEffect } from "react";
import DeviceMockup, { type FloatingChip } from "./DeviceMockup";

function InteractivePhoneScreen({ step }: { step: number }) {
  const hasNewTx = step >= 2;
  const isCategoryLit = step === 3;
  const isBalanceUpdated = step === 4;

  const baseline = [
    { icon: "Ă", name: "Bữa trưa", meta: "Ăn uống · Hôm nay", value: "−85.000 ₫", tone: "red" },
    { icon: "L", name: "Lương tháng", meta: "Thu nhập · Hôm qua", value: "+18.500.000 ₫", tone: "green" },
    { icon: "X", name: "Xăng xe", meta: "Di chuyển · 12 Thg 7", value: "−120.000 ₫", tone: "gold" },
  ];

  return (
    <div className="absolute inset-0 z-[6] select-none overflow-hidden bg-[#f7f2e7] text-ink">
      <div className="mock-app relative h-full">
        {/* Mock Status Bar */}
        <div className="mock-status" aria-hidden>
          <span>09:41</span>
          <span className="mock-status-icons">
            <i className="mock-signal"><b /><b /><b /></i>
            <i className="mock-wifi" />
            <i className="mock-battery"><b /></i>
          </span>
        </div>

        {/* Header */}
        <div className="mock-header">
          <div>
            <span className="mock-eyebrow">Xin chào,</span>
            <strong className="mock-title">Minh Anh</strong>
          </div>
          <span className="mock-avatar">SC</span>
        </div>

        {/* Balance Card with Vivid Reactive States */}
        <div
          className={`balance-card transition-all duration-500 ${
            isBalanceUpdated
              ? "ring-2 ring-emerald-400 bg-gradient-to-br from-[#122518] to-lacquer shadow-xl shadow-emerald-500/30 scale-[1.02]"
              : ""
          }`}
        >
          <div className="flex items-center justify-between">
            <span>Số dư hiện tại</span>
            {isBalanceUpdated && (
              <span className="rounded-full bg-emerald-500/25 border border-emerald-400/40 px-2 py-0.5 text-[0.7em] font-bold text-emerald-300 animate-pulse">
                −45.000 ₫
              </span>
            )}
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            {isBalanceUpdated && (
              <span className="text-[0.62em] font-sans line-through text-paper/40 transition-opacity">
                24.680.000 ₫
              </span>
            )}
            <strong className={`transition-all duration-500 ${isBalanceUpdated ? "text-emerald-200" : ""}`}>
              {isBalanceUpdated ? "24.635.000 ₫" : "24.680.000 ₫"}
            </strong>
          </div>
          <div className="balance-stats">
            <span>
              <i className="up">↑</i>
              <small>Thu nhập</small>
              <b>18,5 tr</b>
            </span>
            <span>
              <i className="down">↓</i>
              <small>Chi tiêu</small>
              <b className={`transition-colors duration-500 ${isBalanceUpdated ? "text-rose-300 font-bold" : ""}`}>
                {isBalanceUpdated ? "6,25 tr" : "6,2 tr"}
              </b>
            </span>
          </div>
        </div>

        {/* Step 3: Dedicated Category Synchronization Banner inside phone */}
        {isCategoryLit && (
          <div className="mt-2 rounded-xl border border-gold/70 bg-gradient-to-r from-[#291b12] to-[#1a1410] p-2 text-paper shadow-lg transition-all duration-500 animate-fade-in">
            <div className="flex items-center justify-between text-[0.72em]">
              <span className="flex items-center gap-1.5 font-bold text-gold">
                <span className="size-1.5 rounded-full bg-gold animate-ping" />
                Chiếu sáng: Nhóm Ăn uống
              </span>
              <span className="text-vermilion font-bold">+45.000 ₫</span>
            </div>
            <div className="mt-0.5 flex items-center justify-between text-[0.64em] text-paper/75">
              <span>Hôm nay: 130.000 ₫</span>
              <span className="text-gold font-medium">38% ngân sách</span>
            </div>
            <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-paper/20">
              <div className="h-full bg-gradient-to-r from-gold to-vermilion w-[38%] transition-all duration-700" />
            </div>
          </div>
        )}

        {/* Section Title */}
        <div className="mock-section-title">
          <strong>Giao dịch gần đây</strong>
          <span className="flex items-center gap-1">
            {step === 2 && (
              <span className="text-vermilion font-semibold animate-pulse text-[0.9em]">
                ● Vừa trượt vào (09:15)
              </span>
            )}
            {step === 3 && (
              <span className="text-gold font-semibold text-[0.9em]">
                ✨ Nhóm Ăn uống
              </span>
            )}
            {step === 4 && (
              <span className="text-emerald-300 font-semibold text-[0.9em]">
                ✓ Tổng chi: 180.000 ₫
              </span>
            )}
            {(step === 0 || step === 1) && <span>Xem tất cả</span>}
          </span>
        </div>

        {/* Transaction List */}
        <div className="transaction-list relative">
          {/* Step 1: In-phone 2.5D Transaction Input Modal Overlay */}
          {step === 1 && (
            <div className="absolute inset-x-0 -top-3 z-20 rounded-2xl border border-vermilion/70 bg-[#1c1511]/98 p-3 text-paper shadow-2xl backdrop-blur-md transition-all duration-300 animate-fade-in">
              <div className="flex items-center justify-between border-b border-paper/15 pb-1.5 text-[0.72em]">
                <span className="font-semibold uppercase tracking-wider text-vermilion flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-vermilion animate-ping" />
                  Ghi chép siêu tốc
                </span>
                <span className="text-paper/60">09:15 sáng</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex size-7 items-center justify-center rounded-lg bg-vermilion text-[0.88em] font-bold text-paper shadow-md shadow-vermilion/40">
                    Ă
                  </span>
                  <div>
                    <strong className="block text-[0.92em] font-medium leading-tight">Cà phê sáng</strong>
                    <span className="text-[0.7em] text-paper/60">Ăn uống · Tiền mặt</span>
                  </div>
                </div>
                <strong className="font-display text-[1.2em] font-semibold text-vermilion">−45.000 ₫</strong>
              </div>
              <div className="mt-2.5 rounded-lg bg-paper/10 px-2 py-1 text-center text-[0.68em] text-paper/80 font-medium">
                Chạm bước 03 để trượt vào sổ ↓
              </div>
            </div>
          )}

          {/* New Transaction: Slid in at Step 2, Category lit at Step 3, Settled at Step 4 */}
          {hasNewTx && (
            <div
              className={`transaction transition-all duration-500 rounded-xl px-2 -mx-2 ${
                step === 2
                  ? "bg-vermilion/15 border border-vermilion/60 shadow-md shadow-vermilion/20 -translate-y-0.5 animate-fade-in"
                  : isCategoryLit
                  ? "bg-gradient-to-r from-amber-500/20 to-vermilion/20 border border-gold/70 shadow-lg shadow-gold/30"
                  : "bg-paper/5 border border-paper/10"
              }`}
            >
              <span
                className={`transaction-icon red transition-all duration-500 ${
                  isCategoryLit
                    ? "ring-2 ring-gold bg-vermilion text-paper scale-110 shadow-lg shadow-vermilion/80 animate-pulse"
                    : step === 2
                    ? "ring-1 ring-vermilion bg-vermilion text-paper"
                    : ""
                }`}
              >
                Ă
              </span>
              <span className="transaction-copy">
                <b className="flex items-center gap-1.5">
                  Cà phê sáng
                  {step === 2 && (
                    <span className="rounded bg-vermilion px-1 py-0.2 text-[0.65em] font-bold text-paper uppercase tracking-wider animate-bounce">
                      Mới
                    </span>
                  )}
                  {isCategoryLit && (
                    <span className="rounded bg-gold/40 text-ink px-1 py-0.2 text-[0.65em] font-bold uppercase tracking-wider">
                      ✨ Ăn uống
                    </span>
                  )}
                </b>
                <small className={isCategoryLit ? "text-vermilion font-semibold" : ""}>
                  Ăn uống · 09:15
                </small>
              </span>
              <strong className="text-vermilion font-semibold">−45.000 ₫</strong>
            </div>
          )}

          {baseline.map((item) => (
            <div className="transaction" key={item.name}>
              <span className={`transaction-icon ${item.tone}`}>{item.icon}</span>
              <span className="transaction-copy">
                <b>{item.name}</b>
                <small>{item.meta}</small>
              </span>
              <strong className={item.tone === "green" ? "positive" : ""}>{item.value}</strong>
            </div>
          ))}
        </div>

        {/* Quick Add Button with Step 1 active state */}
        <span
          className={`quick-add transition-all duration-300 ${
            step === 1 ? "scale-105 ring-2 ring-paper shadow-xl shadow-vermilion/70 bg-vermilion" : ""
          }`}
        >
          <i /> {step === 1 ? "Đang ghi..." : "Ghi giao dịch"}
        </span>

        {/* Bottom Nav */}
        <div className="mock-nav">
          <span className="mock-nav-item is-active"><i />Tổng quan</span>
          <span className="mock-nav-item"><i />Thống kê</span>
          <span className="mock-nav-item"><i />Ngân sách</span>
        </div>
      </div>
    </div>
  );
}

export default function TransactionFlowShowcase() {
  const [step, setStep] = useState(0); // 0: Ready, 1: Form popup, 2: Insert into list, 3: Category highlight, 4: Summary update
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setTimeout(() => {
      setStep((prev) => (prev < 4 ? prev + 1 : 0));
    }, 2400);
    return () => clearTimeout(timer);
  }, [isPlaying, step]);

  const handleNextStep = () => {
    setIsPlaying(false);
    setStep((prev) => (prev < 4 ? prev + 1 : 0));
  };

  // Build responsive, non-blocking floating status chip placed cleanly outside the phone
  const floatingChips: FloatingChip[] = [
    {
      id: "tx-live-toast",
      position: "top-left",
      content: (
        <div className="flex items-center gap-2 rounded-full border border-paper/20 bg-lacquer/95 px-3.5 py-1.5 text-[11px] text-paper shadow-xl backdrop-blur-md">
          <span
            className={`size-2 rounded-full ${
              step >= 2 ? "bg-emerald-400" : step === 1 ? "bg-vermilion animate-ping" : "bg-amber-400 animate-pulse"
            }`}
          />
          <span className="font-medium">
            {step === 0 && "Sẵn sàng ghi nhanh"}
            {step === 1 && "Đang nhập: Cà phê sáng (−45k)"}
            {step === 2 && "Đã trượt vào danh sách (09:15)"}
            {step === 3 && "Đã liên kết: Nhóm Ăn uống"}
            {step === 4 && "Đã cập nhật: Số dư −45k · Chi 180k"}
          </span>
        </div>
      ),
    },
  ];

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
              floatingChips={floatingChips}
            >
              {/* Dynamic Living Sổ Chi Screen reflecting steps 0 through 4 */}
              <InteractivePhoneScreen step={step} />
            </DeviceMockup>
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
                  <span className="text-gold">Ăn uống (Phát sáng)</span>
                </div>
                <span className="text-paper/40 text-xs" aria-hidden>↓</span>
                <div className={`w-full flex items-center justify-between rounded-lg px-3 py-2 transition-colors ${step === 2 ? "bg-vermilion/20 border border-vermilion/40 text-paper font-medium" : "bg-paper/5"}`}>
                  <span>Danh sách giao dịch</span>
                  <span className="text-paper/60">09:15 sáng (Trượt vào)</span>
                </div>
                <span className="text-paper/40 text-xs" aria-hidden>↓</span>
                <div className={`w-full flex items-center justify-between rounded-lg px-3 py-2 transition-colors ${step === 4 ? "bg-vermilion/20 border border-vermilion/40 text-paper font-medium" : "bg-paper/5"}`}>
                  <span>Tổng chi ngày</span>
                  <span className="text-paper font-semibold">180.000 ₫ (Cập nhật)</span>
                </div>
                <span className="text-paper/40 text-xs" aria-hidden>↓</span>
                <div className={`w-full flex items-center justify-between rounded-lg px-3 py-2 transition-colors ${step === 0 || step === 4 ? "bg-vermilion/20 border border-vermilion/40 text-paper font-medium" : "bg-paper/5"}`}>
                  <span>Bức tranh tổng thể</span>
                  <span className="text-emerald-400">{step === 4 ? "24.635.000 ₫" : "24.680.000 ₫"}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-6">
              {/* Step item 1 */}
              <div
                onClick={() => {
                  setIsPlaying(false);
                  setStep(1);
                }}
                className={`cursor-pointer rounded-2xl border p-4 md:p-5 transition-all duration-300 ${
                  step === 1
                    ? "border-vermilion bg-vermilion/10 text-paper shadow-md shadow-vermilion/20 ring-1 ring-vermilion/40"
                    : "border-paper/10 bg-paper/5 text-paper/70 hover:border-paper/20 hover:bg-paper/10"
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
                onClick={() => {
                  setIsPlaying(false);
                  setStep(2);
                }}
                className={`cursor-pointer rounded-2xl border p-4 md:p-5 transition-all duration-300 ${
                  step === 2
                    ? "border-vermilion bg-vermilion/10 text-paper shadow-md shadow-vermilion/20 ring-1 ring-vermilion/40"
                    : "border-paper/10 bg-paper/5 text-paper/70 hover:border-paper/20 hover:bg-paper/10"
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
                onClick={() => {
                  setIsPlaying(false);
                  setStep(3);
                }}
                className={`cursor-pointer rounded-2xl border p-4 md:p-5 transition-all duration-300 ${
                  step === 3
                    ? "border-vermilion bg-vermilion/10 text-paper shadow-md shadow-vermilion/20 ring-1 ring-vermilion/40"
                    : "border-paper/10 bg-paper/5 text-paper/70 hover:border-paper/20 hover:bg-paper/10"
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
                onClick={() => {
                  setIsPlaying(false);
                  setStep(4);
                }}
                className={`cursor-pointer rounded-2xl border p-4 md:p-5 transition-all duration-300 ${
                  step === 4
                    ? "border-vermilion bg-vermilion/10 text-paper shadow-md shadow-vermilion/20 ring-1 ring-vermilion/40"
                    : "border-paper/10 bg-paper/5 text-paper/70 hover:border-paper/20 hover:bg-paper/10"
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

            {/* Next step button & Reset button */}
            <div className="mt-8 flex items-center justify-between">
              {step > 0 ? (
                <button
                  type="button"
                  onClick={() => {
                    setIsPlaying(false);
                    setStep(0);
                  }}
                  className="cursor-pointer text-xs uppercase tracking-wider text-paper/60 transition-colors hover:text-paper"
                >
                  ← Khởi tạo lại
                </button>
              ) : <span />}

              <button
                type="button"
                onClick={handleNextStep}
                className="cursor-pointer rounded-full bg-vermilion px-6 py-2.5 text-xs uppercase tracking-[0.16em] font-medium text-paper transition-opacity hover:opacity-90 shadow-md shadow-vermilion/30"
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
