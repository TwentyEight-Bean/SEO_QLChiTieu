import { useState, useEffect, useRef } from "react";
import Phone from "../Phone";

type ExpansionStage = 0 | 1 | 2 | 3;

interface StageInfo {
  index: ExpansionStage;
  label: string;
  sub: string;
  tag: string;
  title: string;
  desc: string;
}

const STAGES: StageInfo[] = [
  {
    index: 0,
    label: "01. Màn hình gốc",
    sub: "Giao diện phẳng",
    tag: "Khởi đầu",
    title: "Dữ liệu gói gọn trong khung máy",
    desc: "Mọi thống kê bắt đầu từ một màn hình di động quen thuộc. Nhưng chiều sâu thực sự của dòng tiền nằm ở mối quan hệ giữa các con số.",
  },
  {
    index: 1,
    label: "02. Vượt khung viền",
    sub: "Giải phóng biểu đồ",
    tag: "Tách lớp",
    title: "Biểu đồ nâng lên khỏi mặt kính",
    desc: "Các cột chi tiêu và đường cong biến động tự động nổi khối về phía trước (+80px), giải phóng thị giác khỏi giới hạn viền màn hình.",
  },
  {
    index: 2,
    label: "03. Phân tầng không gian",
    sub: "Đa chiều 2.5D",
    tag: "Không gian hóa",
    title: "Bóc tách 3 tầng dữ liệu độc lập",
    desc: "Thân máy lùi về hậu cảnh (-60px). Tầng tiền cảnh làm nổi bật các đỉnh chi tiêu đột biến và danh mục trọng yếu bằng thẻ kính nổi.",
  },
  {
    index: 3,
    label: "04. Hội tụ tín hiệu",
    sub: "Bức tranh hoàn chỉnh",
    tag: "Toàn cảnh",
    title: "Bức tranh tài chính thấu suốt",
    desc: "Các lớp dữ liệu khóa lại thành một bố cục phân tích cân bằng. Bạn thấy rõ bức tranh tổng thể và từng mắt xích chi tiêu cùng lúc.",
  },
];

export default function DataExpansionSequence() {
  const [currentStage, setCurrentStage] = useState<ExpansionStage>(1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto progression on scroll trigger
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.4) {
            // Once in view, encourage exploration
          }
        });
      },
      { threshold: [0.2, 0.5, 0.8] }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const stage = STAGES[currentStage];

  return (
    <section
      ref={containerRef}
      className="data-expansion-section relative overflow-hidden bg-[#0e0b0a] py-24 text-paper md:py-36"
      aria-labelledby="expansion-heading"
    >
      {/* 3D Atmospheric Background */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_35%,#2b1812_0%,#0e0b0a_70%)] opacity-80" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,transparent_0%,rgba(210,58,34,0.03)_50%,transparent_100%)]" />

      {/* Grid Floor Perspective Lines */}
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 -z-10 h-[400px] w-[1400px] -translate-x-1/2 opacity-25"
        style={{
          background:
            "linear-gradient(to top, rgba(242,236,223,0.08) 1px, transparent 1px), linear-gradient(to right, rgba(242,236,223,0.08) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          transform: "perspective(600px) rotateX(65deg)",
          maskImage: "linear-gradient(to top, black 20%, transparent 95%)",
        }}
        aria-hidden
      />

      <div className="mx-auto max-w-[1300px] px-6 md:px-10">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="flex items-center justify-center gap-3 text-[11px] font-medium uppercase tracking-[0.28em] text-paper/60">
            <span className="font-display text-base text-vermilion">Trải nghiệm thị giác</span>
            <span className="h-px w-8 bg-current opacity-40" />
            App → Data Expansion
          </p>
          <h2 id="expansion-heading" className="mt-4 font-display text-[clamp(2.4rem,5vw,4.5rem)] font-light leading-[1.08]">
            Khi dữ liệu vượt ra ngoài <br />
            <span className="italic text-paper/80">khung viền chiếc điện thoại</span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-paper/70">
            Khám phá quy trình Sổ Chi bóc tách dòng tiền: từ một màn hình ghi chép phẳng nở ra thành không gian phân tích đa tầng trực quan.
          </p>
        </div>

        {/* Milestone Steps Bar */}
        <div className="mt-12 flex flex-wrap justify-center gap-2 md:gap-4" role="tablist" aria-label="Các giai đoạn tách lớp dữ liệu">
          {STAGES.map((s) => (
            <button
              key={s.index}
              type="button"
              role="tab"
              aria-selected={currentStage === s.index}
              onClick={() => setCurrentStage(s.index)}
              className={`group flex cursor-pointer items-center gap-2.5 rounded-full border px-4 py-2 text-xs uppercase tracking-[0.16em] transition-all duration-300 md:px-5 md:py-2.5 ${
                currentStage === s.index
                  ? "border-vermilion bg-vermilion text-paper font-medium shadow-lg shadow-vermilion/40 scale-105"
                  : "border-paper/15 bg-paper/5 text-paper/60 hover:border-paper/30 hover:bg-paper/10 hover:text-paper"
              }`}
            >
              <span>{s.label}</span>
              <span className="hidden text-[10px] opacity-70 sm:inline">· {s.sub}</span>
            </button>
          ))}
        </div>

        {/* Interactive 3D Stage & Story Grid */}
        <div className="mt-16 grid items-center gap-12 lg:grid-cols-[1fr_420px]">
          {/* Left: The 2.5D Expanding Holographic Canvas */}
          <div className="expansion-stage relative mx-auto flex min-h-[540px] w-full max-w-[660px] items-center justify-center">
            {/* Ambient Vermilion Flare */}
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-vermilion/20 blur-[80px] transition-all duration-700"
              style={{
                opacity: currentStage === 0 ? 0.3 : currentStage === 2 ? 0.8 : 0.6,
                transform: `translate(-50%, -50%) scale(${1 + currentStage * 0.15})`,
              }}
              aria-hidden
            />

            {/* Base Phone Chassis */}
            <div
              className="expansion-phone-layer transition-all duration-700 ease-out"
              style={{
                transform:
                  currentStage === 0
                    ? "translateZ(0px) scale(1) rotateY(0deg) rotateX(0deg)"
                    : currentStage === 1
                    ? "translateZ(-20px) scale(0.96) rotateY(-6deg) rotateX(4deg)"
                    : currentStage === 2
                    ? "translateZ(-80px) scale(0.88) rotateY(-14deg) rotateX(8deg)"
                    : "translateZ(-40px) scale(0.92) rotateY(-8deg) rotateX(4deg)",
                filter: currentStage === 0 ? "brightness(1)" : currentStage === 2 ? "brightness(0.75)" : "brightness(0.9)",
                opacity: currentStage === 0 ? 1 : currentStage === 2 ? 0.75 : 0.9,
              }}
            >
              <Phone screen="thong-ke" alt="Màn hình thống kê gốc" w="clamp(240px, 25vw, 290px)" />
            </div>

            {/* Layer 1: Floating Volumetric 3D Bar Columns (Break out beyond the screen) */}
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-out"
              style={{
                opacity: currentStage === 0 ? 0 : 1,
                transform:
                  currentStage === 0
                    ? "translate(-50%, -50%) translateZ(0px) scale(0.8)"
                    : currentStage === 1
                    ? "translate(calc(-50% + 20px), calc(-50% - 30px)) translateZ(70px) scale(1.05) rotateY(-6deg)"
                    : currentStage === 2
                    ? "translate(calc(-50% + 50px), calc(-50% - 50px)) translateZ(120px) scale(1.12) rotateY(-14deg)"
                    : "translate(calc(-50% + 30px), calc(-50% - 35px)) translateZ(85px) scale(1.06) rotateY(-8deg)",
              }}
            >
              <div className="flex items-end gap-3 rounded-2xl border border-vermilion/40 bg-[#1c1412]/85 p-4 shadow-2xl backdrop-blur-xl">
                <div className="flex flex-col items-center gap-1.5">
                  <span className="text-[9px] text-paper/50">T2</span>
                  <div className="w-4 rounded-t-sm bg-paper/20 transition-all duration-700" style={{ height: currentStage >= 2 ? "52px" : "36px" }} />
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <span className="text-[9px] text-paper/50">T3</span>
                  <div className="w-4 rounded-t-sm bg-paper/20 transition-all duration-700" style={{ height: currentStage >= 2 ? "44px" : "30px" }} />
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <span className="text-[9px] text-paper/50">T4</span>
                  <div className="w-4 rounded-t-sm bg-paper/30 transition-all duration-700" style={{ height: currentStage >= 2 ? "78px" : "58px" }} />
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <span className="text-[9px] text-paper/50">T5</span>
                  <div className="w-4 rounded-t-sm bg-paper/30 transition-all duration-700" style={{ height: currentStage >= 2 ? "60px" : "46px" }} />
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <span className="text-[9px] font-semibold text-vermilion">T6 ★</span>
                  <div className="w-5 rounded-t-sm bg-gradient-to-t from-vermilion to-vermilion-bright shadow-lg shadow-vermilion/50 transition-all duration-700" style={{ height: currentStage >= 2 ? "110px" : "90px" }} />
                  <span className="text-[9px] font-medium text-vermilion">380k</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <span className="text-[9px] text-paper/50">T7</span>
                  <div className="w-4 rounded-t-sm bg-paper/40 transition-all duration-700" style={{ height: currentStage >= 2 ? "85px" : "68px" }} />
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <span className="text-[9px] text-paper/50">CN</span>
                  <div className="w-4 rounded-t-sm bg-paper/40 transition-all duration-700" style={{ height: currentStage >= 2 ? "74px" : "55px" }} />
                </div>
              </div>
            </div>

            {/* Layer 2: Floating Foreground Insight Chips (Depth z-index 40) */}
            <div
              className="pointer-events-none absolute left-2 top-8 z-30 transition-all duration-700 ease-out md:left-6 md:top-12"
              style={{
                opacity: currentStage >= 2 ? 1 : 0,
                transform: currentStage >= 2 ? "translateZ(140px) scale(1) translateY(0)" : "translateZ(30px) scale(0.8) translateY(20px)",
              }}
            >
              <div className="rounded-xl border border-paper/20 bg-[#16110f]/90 px-3.5 py-2.5 shadow-2xl backdrop-blur-md">
                <span className="block text-[9px] uppercase tracking-wider text-paper/50">Nhóm chi lớn nhất</span>
                <div className="mt-0.5 flex items-center gap-2">
                  <span className="size-2 rounded-full bg-vermilion" />
                  <strong className="text-xs font-medium text-paper">Ăn uống · 38%</strong>
                  <span className="text-[10px] text-paper/60">(2.370.000 ₫)</span>
                </div>
              </div>
            </div>

            <div
              className="pointer-events-none absolute -bottom-4 right-4 z-30 transition-all duration-700 ease-out md:bottom-2 md:right-8"
              style={{
                opacity: currentStage >= 2 ? 1 : 0,
                transform: currentStage >= 2 ? "translateZ(150px) scale(1) translateY(0)" : "translateZ(30px) scale(0.8) translateY(-20px)",
              }}
            >
              <div className="rounded-xl border border-gold/40 bg-[#1a140f]/90 px-3.5 py-2.5 shadow-2xl backdrop-blur-md">
                <span className="block text-[9px] uppercase tracking-wider text-gold">Nhịp chi cuối tuần</span>
                <strong className="mt-0.5 block text-xs font-medium text-paper">T6 - CN chiếm 52% tuần</strong>
                <p className="mt-0.5 text-[10px] text-paper/60">Tăng mạnh vào các buổi họp mặt</p>
              </div>
            </div>

            {/* Layer 3: Dynamic Measurement Grid Wireframe (Stage 3 & 4) */}
            <div
              className="pointer-events-none absolute inset-4 -z-5 rounded-3xl border border-paper/10 transition-all duration-700"
              style={{
                opacity: currentStage === 3 ? 0.6 : 0,
                transform: currentStage === 3 ? "translateZ(40px) scale(1.05)" : "translateZ(-20px) scale(0.9)",
              }}
              aria-hidden
            >
              <span className="absolute left-4 top-4 text-[9px] font-mono text-paper/40">+Z DEPTH: 140PX</span>
              <span className="absolute bottom-4 right-4 text-[9px] font-mono text-paper/40">HUD RESOLVED ✓</span>
            </div>
          </div>

          {/* Right: Narrative Story Card */}
          <div className="rounded-3xl border border-paper/15 bg-gradient-to-b from-[#1a1412] to-[#0c0908] p-8 shadow-2xl md:p-10">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.24em] text-vermilion font-medium">{stage.tag}</span>
              <span className="font-mono text-xs text-paper/40">GIAI ĐOẠN 0{stage.index + 1}/04</span>
            </div>

            <h3 className="mt-4 font-display text-3xl font-light text-paper md:text-4xl">
              {stage.title}
            </h3>

            <p className="mt-4 text-sm leading-relaxed text-paper/70">
              {stage.desc}
            </p>

            {/* Micro Feature Bullet Points */}
            <div className="mt-8 border-t border-paper/10 pt-6">
              <span className="text-[11px] uppercase tracking-[0.2em] text-paper/50">Chi tiết kỹ thuật:</span>
              <ul className="mt-3 space-y-3">
                <li className="flex items-center gap-3 text-xs text-paper/85">
                  <span className="size-1.5 rounded-full bg-vermilion" />
                  <span>
                    {currentStage === 0 && "Render chuẩn xác 1:1 tỉ lệ màn hình thực tế."}
                    {currentStage === 1 && "Trục Z đẩy cột biểu đồ nổi +80px về phía mắt nhìn."}
                    {currentStage === 2 && "Phân tách rõ ràng tiền cảnh (insight) và hậu cảnh (thân máy)."}
                    {currentStage === 3 && "Tự động cân bằng thị giác, không làm loãng thông tin cốt lõi."}
                  </span>
                </li>
                <li className="flex items-center gap-3 text-xs text-paper/85">
                  <span className="size-1.5 rounded-full bg-gold" />
                  <span>
                    {currentStage === 0 && "Phù hợp ghi chép hằng ngày trong 3 giây."}
                    {currentStage === 1 && "Nhận diện tức thì cột cao nhất (đỉnh chi tiêu)."}
                    {currentStage === 2 && "Dữ liệu được sắp xếp theo mức độ ưu tiên hành vi."}
                    {currentStage === 3 && "Sẵn sàng cho việc lập kế hoạch ngân sách chu kỳ tới."}
                  </span>
                </li>
              </ul>
            </div>

            {/* Quick Next/Prev Navigation */}
            <div className="mt-8 flex items-center justify-between border-t border-paper/10 pt-6">
              <button
                type="button"
                disabled={currentStage === 0}
                onClick={() => setCurrentStage((prev) => Math.max(0, prev - 1) as ExpansionStage)}
                className="cursor-pointer text-xs uppercase tracking-wider text-paper/60 transition-colors hover:text-paper disabled:cursor-not-allowed disabled:opacity-30"
              >
                ← Bước trước
              </button>
              <div className="flex gap-1.5">
                {STAGES.map((s) => (
                  <span
                    key={s.index}
                    onClick={() => setCurrentStage(s.index)}
                    className={`block size-2 cursor-pointer rounded-full transition-all ${
                      currentStage === s.index ? "w-6 bg-vermilion" : "bg-paper/20 hover:bg-paper/40"
                    }`}
                  />
                ))}
              </div>
              <button
                type="button"
                disabled={currentStage === 3}
                onClick={() => setCurrentStage((prev) => Math.min(3, prev + 1) as ExpansionStage)}
                className="cursor-pointer text-xs uppercase tracking-wider text-vermilion font-medium transition-colors hover:text-vermilion-bright disabled:cursor-not-allowed disabled:opacity-30"
              >
                Bước tiếp →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
