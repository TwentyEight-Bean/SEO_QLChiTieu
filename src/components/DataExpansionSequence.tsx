import { useState, useEffect, useRef } from "react";
import Phone from "../Phone";

export type ExpansionStage = 0 | 1 | 2 | 3;

interface StageInfo {
  index: ExpansionStage;
  label: string;
  sub: string;
  tag: string;
  title: string;
  desc: string;
  depthZ: string;
  focalLayer: string;
}

const STAGES: StageInfo[] = [
  {
    index: 0,
    label: "01. Màn hình phẳng",
    sub: "Dữ liệu 2D",
    tag: "Khởi đầu",
    title: "Gói gọn trong khung viền điện thoại",
    desc: "Mọi thống kê tài chính bắt đầu từ màn hình điện thoại 2D quen thuộc. Biểu đồ cột và tỷ trọng danh mục nằm phẳng theo mặt kính, sẵn sàng cho việc ghi nhận hằng ngày.",
    depthZ: "0px (Mặt kính)",
    focalLayer: "Màn hình ứng dụng gốc",
  },
  {
    index: 1,
    label: "02. Vượt khung viền",
    sub: "Giải phóng biểu đồ",
    tag: "Tách lớp",
    title: "Biểu đồ nâng lên khỏi mặt kính",
    desc: "Các cột chi tiêu và đường cong biến động tự động nổi khối theo trục Z (+80px), giải phóng thị giác vượt ra ngoài giới hạn vật lý của khung viền điện thoại.",
    depthZ: "+80px (Tiền cảnh)",
    focalLayer: "Cột thể tích 3D & Đỉnh T6",
  },
  {
    index: 2,
    label: "03. Phân tầng không gian",
    sub: "Bóc tách đa chiều",
    tag: "Không gian hóa",
    title: "Bóc tách 3 tầng dữ liệu độc lập",
    desc: "Thân máy lùi sâu về hậu cảnh (-80px). Tầng tiền cảnh (+150px) làm nổi bật vòng cơ cấu danh mục và các thẻ phân tích hành vi với đường chỉ định vị chính xác.",
    depthZ: "+150px / -80px",
    focalLayer: "Vòng cơ cấu & Thẻ hành vi",
  },
  {
    index: 3,
    label: "04. Hội tụ toàn cảnh",
    sub: "Bố cục hoàn chỉnh",
    tag: "Toàn cảnh",
    title: "Bức tranh tài chính thấu suốt",
    desc: "Toàn bộ các tầng dữ liệu khóa lại thành một bố cục trình diễn cân bằng. Bạn vừa quan sát được toàn cảnh dòng tiền vĩ mô, vừa nắm bắt tức thì từng điểm nút chi tiêu vi mô.",
    depthZ: "Cân bằng HUD",
    focalLayer: "Bố cục điều hành đồng bộ",
  },
];

export default function DataExpansionSequence() {
  const [currentStage, setCurrentStage] = useState<ExpansionStage>(1);
  const [activeLayer, setActiveLayer] = useState<"phone" | "bars" | "donut" | "summary">("bars");
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Update focal layer on stage change for mobile clarity
  const selectStage = (stageIdx: ExpansionStage) => {
    setCurrentStage(stageIdx);
    if (stageIdx === 1) setActiveLayer("bars");
    else if (stageIdx === 2) setActiveLayer("donut");
    else if (stageIdx === 3) setActiveLayer("summary");
  };

  // Subtle intersection observer trigger
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.45) {
            // In view, subtle engagement
          }
        });
      },
      { threshold: [0.2, 0.5, 0.8] }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const stage = STAGES[currentStage];

  // Scrub timeline handler (Satisfying Prism craft.md: seek-able progress bar)
  const handleScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const targetStage = Math.round(ratio * 3) as ExpansionStage;
    selectStage(targetStage);
  };

  return (
    <section
      ref={containerRef}
      className="data-expansion-section relative overflow-hidden bg-[#0c0908] py-24 text-paper md:py-36"
      aria-labelledby="expansion-heading"
    >
      {/* Cinematic Studio Backdrop & Lighting */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_40%,#261612_0%,#0c0908_75%)] opacity-90" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-paper/15 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-px bg-gradient-to-r from-transparent via-paper/10 to-transparent" />

      {/* Subtle Studio Geometry Halo */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-[min(80vw,720px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-paper/10 transition-transform duration-700"
        style={{
          transform: `translate(-50%, -50%) scale(${0.9 + currentStage * 0.08})`,
        }}
        aria-hidden
      >
        <span className="absolute inset-[18%] rounded-full border border-vermilion/20" />
      </div>

      <div className="mx-auto max-w-[1300px] px-6 md:px-10">
        {/* Section Editorial Header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="flex items-center justify-center gap-3 text-[11px] font-medium uppercase tracking-[0.28em] text-paper/60">
            <span className="font-display text-base text-vermilion">Trải nghiệm thị giác</span>
            <span className="h-px w-8 bg-current opacity-40" />
            App → Data Expansion
          </p>
          <h2 id="expansion-heading" className="mt-4 font-display text-[clamp(2.4rem,5vw,4.5rem)] font-light leading-[1.08] text-paper">
            Khi dữ liệu vượt ra ngoài <br />
            <span className="italic text-paper/80">khung viền chiếc điện thoại</span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-paper/70">
            Khám phá quy trình Sổ Chi bóc tách dòng tiền: từ một màn hình ghi chép phẳng nở ra thành không gian phân tích 2.5D đa tầng trực quan.
          </p>
        </div>

        {/* Milestone Steps Bar & Seekable Scrubber Track */}
        <div className="mx-auto mt-12 max-w-4xl">
          {/* Milestone Tabs - 4-Column Structured Grid so tabs NEVER wrap or jump */}
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 md:gap-3" role="tablist" aria-label="Các giai đoạn tách lớp dữ liệu">
            {STAGES.map((s) => (
              <button
                key={s.index}
                type="button"
                role="tab"
                aria-selected={currentStage === s.index}
                onClick={() => selectStage(s.index)}
                className={`min-h-11 group flex cursor-pointer flex-col items-center justify-center rounded-2xl border px-3 py-2.5 text-center transition-colors duration-200 ${
                  currentStage === s.index
                    ? "border-vermilion bg-vermilion text-paper font-medium shadow-md shadow-vermilion/40"
                    : "border-paper/15 bg-paper/5 text-paper/65 hover:border-paper/30 hover:bg-paper/10 hover:text-paper"
                }`}
              >
                <span className="text-[11px] font-medium uppercase tracking-[0.14em]">{s.label}</span>
                <span className={`mt-0.5 text-[10px] tracking-normal ${currentStage === s.index ? "text-paper/85" : "text-paper/45"}`}>
                  {s.sub}
                </span>
              </button>
            ))}
          </div>

          {/* Seekable Scrubber Track (Prism craft.md §38) */}
          <div className="mt-6 px-4">
            <div
              ref={trackRef}
              onClick={handleScrub}
              className="group relative h-2 w-full cursor-pointer rounded-full bg-paper/10 transition-colors hover:bg-paper/15"
              title="Kéo hoặc nhấn để tua giai đoạn trình diễn"
            >
              {/* Progress Fill */}
              <div
                className="h-full rounded-full bg-gradient-to-r from-vermilion/80 to-vermilion transition-all duration-500 ease-out"
                style={{ width: `${(currentStage / 3) * 100}%` }}
              />
              {/* Playhead Handle */}
              <div
                className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-paper bg-vermilion shadow-lg shadow-vermilion/50 transition-all duration-500 ease-out group-hover:scale-125"
                style={{ left: `${(currentStage / 3) * 100}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between text-[10px] font-mono uppercase tracking-wider text-paper/40">
              <span>0% Khởi đầu</span>
              <span>Độ sâu: {stage.depthZ}</span>
              <span>100% Hoàn chỉnh</span>
            </div>
          </div>
        </div>

        {/* 2.5D Expanding Holographic Stage & Narrative Split */}
        <div className="mt-16 grid items-start gap-12 lg:grid-cols-[1fr_420px]">
          {/* Left: The 2.5D Multi-Layer Camera Rig */}
          <div className="w-full">
            {/* Mobile Single Layer Tab Selector (Only on mobile when currentStage >= 2) */}
            {isMobile && currentStage >= 2 && (
              <div className="mb-4 flex items-center justify-center gap-2" role="tablist" aria-label="Chọn tầng dữ liệu hiển thị">
                {[
                  { id: "bars" as const, label: "Cột tuần" },
                  { id: "donut" as const, label: "Cơ cấu" },
                  { id: "summary" as const, label: "Tổng kết" },
                ].map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    role="tab"
                    aria-selected={activeLayer === l.id}
                    onClick={() => setActiveLayer(l.id)}
                    className={`min-h-11 cursor-pointer rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-wider transition-all ${
                      activeLayer === l.id
                        ? "border-vermilion bg-vermilion text-paper shadow-md shadow-vermilion/30"
                        : "border-paper/20 bg-paper/5 text-paper/60 hover:text-paper"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            )}

            <div className="expansion-viewport w-full overflow-hidden rounded-3xl md:overflow-visible md:rounded-none select-none">
              <div className="expansion-camera-rig">
                {/* Layer 0: Ambient Vermilion Contact Glow */}
                <div
                  className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-vermilion/20 blur-[90px] transition-all duration-700"
                  style={{
                    opacity: currentStage === 0 ? 0.25 : currentStage === 2 ? 0.85 : 0.6,
                    transform: `translate(-50%, -50%) scale(${1 + currentStage * 0.15})`,
                  }}
                  aria-hidden
                />

                {/* Layer 1: Base Phone Chassis (Moves backward along Z-axis as data expands) */}
                <div
                  onClick={() => setActiveLayer("phone")}
                  className="expansion-phone-chassis cursor-pointer"
                  title="Nhấn để xem cấu trúc thân máy"
                  style={{
                    transform:
                      currentStage === 0
                        ? "translate(-50%, -50%) translateZ(0px) scale(1) rotateX(0deg) rotateY(0deg)"
                        : currentStage === 1
                        ? "translate(-50%, -50%) translateZ(-30px) scale(0.96) rotateX(6deg) rotateY(-8deg)"
                        : currentStage === 2
                        ? "translate(-50%, -50%) translateZ(-80px) scale(0.88) rotateX(8deg) rotateY(-14deg)"
                        : "translate(-50%, -50%) translateZ(0px) scale(1) rotateX(2deg) rotateY(-4deg)",
                    filter:
                      currentStage === 0
                        ? "brightness(1)"
                        : currentStage === 2
                        ? "brightness(0.75)"
                        : "brightness(0.92)",
                    opacity: currentStage === 0 ? 1 : currentStage === 2 ? 0.75 : 0.95,
                    zIndex: 10,
                  }}
                >
                  <Phone screen="thong-ke" alt="Màn hình thống kê Sổ Chi gốc" w="clamp(230px, 24vw, 285px)" />
                </div>

                {/* Layer 2: Volumetric 3D Data Bars (Lift directly off the glass +80px to +120px) */}
                <div
                  onClick={() => setActiveLayer("bars")}
                  className="expansion-layer-bars cursor-pointer"
                  title="Nhấn để xem biểu đồ thể tích"
                  style={{
                    opacity:
                      isMobile
                        ? currentStage === 0
                          ? 0
                          : currentStage === 1 || activeLayer === "bars"
                          ? 1
                          : 0
                        : currentStage === 0
                        ? 0
                        : 1,
                    pointerEvents: isMobile && currentStage >= 2 && activeLayer !== "bars" ? "none" : "auto",
                    transform: isMobile
                      ? currentStage === 0
                        ? "translate(-50%, calc(-50% - 20px)) translateZ(0px) scale(0.85)"
                        : currentStage === 1 || activeLayer === "bars"
                        ? "translate(-50%, calc(-50% - 25px)) translateZ(50px) scale(0.98)"
                        : "translate(-50%, calc(-50% - 25px)) translateZ(-20px) scale(0.85)"
                      : currentStage === 0
                      ? "translate(-50%, calc(-50% - 20px)) translateZ(0px) scale(0.85)"
                      : currentStage === 1
                      ? "translate(calc(-50% + 20px), calc(-50% - 40px)) translateZ(80px) scale(1.05) rotateX(6deg) rotateY(-8deg)"
                      : currentStage === 2
                      ? "translate(calc(-50% + 30px), calc(-50% - 70px)) translateZ(110px) scale(1.08) rotateX(8deg) rotateY(-12deg)"
                      : "translate(calc(-50% + 15px), calc(-50% - 35px)) translateZ(55px) scale(1.02) rotateX(2deg) rotateY(-4deg)",
                    zIndex: 25,
                  }}
                >
                  {/* 3D Glass Bar Stage with Real Shadow Projection */}
                  <div className="relative rounded-2xl border border-vermilion/50 bg-[#1e1513]/90 p-4 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-vermilion max-w-[320px]">
                    <div className="flex items-center justify-between border-b border-paper/10 pb-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-vermilion font-medium">
                        Biến động tuần · Tầng +80px
                      </span>
                      <span className="rounded-full bg-vermilion/20 px-2 py-0.5 text-[9px] text-vermilion font-semibold">
                        Live Volumetric
                      </span>
                    </div>

                    {/* 7 Extruded Volume Bars */}
                    <div className="mt-3 flex items-end justify-between gap-2 sm:gap-3">
                      {[
                        { day: "T2", height: currentStage >= 2 ? 45 : 35, val: "140k" },
                        { day: "T3", height: currentStage >= 2 ? 38 : 30, val: "110k" },
                        { day: "T4", height: currentStage >= 2 ? 72 : 55, val: "260k" },
                        { day: "T5", height: currentStage >= 2 ? 55 : 42, val: "190k" },
                        { day: "T6", height: currentStage >= 2 ? 105 : 88, isPeak: true, val: "380k" },
                        { day: "T7", height: currentStage >= 2 ? 80 : 64, val: "290k" },
                        { day: "CN", height: currentStage >= 2 ? 70 : 54, val: "270k" },
                      ].map((bar) => (
                        <div key={bar.day} className="flex flex-col items-center gap-1.5">
                          <span className={`text-[9px] ${bar.isPeak ? "font-bold text-vermilion" : "text-paper/50"}`}>
                            {bar.day}
                          </span>
                          <div
                            className={`w-3.5 sm:w-4.5 rounded-t-sm transition-all duration-700 ease-out ${
                              bar.isPeak
                                ? "bg-gradient-to-t from-vermilion via-vermilion to-vermilion-bright shadow-lg shadow-vermilion/60 ring-1 ring-vermilion/50"
                                : "bg-paper/25 hover:bg-paper/40"
                            }`}
                            style={{ height: `${bar.height}px` }}
                          />
                          <span className={`text-[8px] font-mono ${bar.isPeak ? "font-bold text-vermilion" : "text-paper/40"}`}>
                            {bar.val}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Peak Indicator Callout Pin */}
                    <div className="mt-2.5 flex items-center justify-between border-t border-paper/10 pt-2 text-[10px]">
                      <span className="text-paper/60">Đỉnh chi Thứ Sáu:</span>
                      <strong className="text-vermilion">380k (Gấp 2,2× T2)</strong>
                    </div>
                  </div>
                </div>

                {/* Layer 3: Detached Category Donut Ring (+140px in Stage 2 & 3) */}
                <div
                  onClick={() => setActiveLayer("donut")}
                  className="expansion-layer-donut cursor-pointer"
                  title="Nhấn để xem cơ cấu danh mục nổi"
                  style={{
                    opacity:
                      isMobile
                        ? currentStage >= 2 && activeLayer === "donut"
                          ? 1
                          : 0
                        : currentStage >= 2
                        ? 1
                        : 0,
                    pointerEvents: isMobile && (currentStage < 2 || activeLayer !== "donut") ? "none" : "auto",
                    transform: isMobile
                      ? activeLayer === "donut"
                        ? "translate(-50%, calc(-50% - 20px)) translateZ(50px) scale(0.98)"
                        : "translate(-50%, calc(-50% - 20px)) translateZ(-20px) scale(0.85)"
                      : currentStage === 2
                      ? "translate(calc(-50% - 135px), calc(-50% - 85px)) translateZ(140px) scale(0.96) rotateX(4deg) rotateY(-6deg)"
                      : currentStage === 3
                      ? "translate(calc(-50% - 120px), calc(-50% - 75px)) translateZ(70px) scale(0.94) rotateX(2deg) rotateY(-4deg)"
                      : "translate(-50%, -50%) translateZ(0px) scale(0.7)",
                    zIndex: 35,
                  }}
                >
                  <div className="rounded-2xl border border-paper/20 bg-[#16100e]/95 p-3.5 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-vermilion/60 max-w-[280px]">
                    <div className="flex items-center gap-3">
                      {/* Mini SVG Donut */}
                      <div className="relative size-12 shrink-0">
                        <svg className="size-full -rotate-90" viewBox="0 0 40 40">
                          <circle cx="20" cy="20" r="14" fill="none" stroke="currentColor" strokeOpacity="0.1" strokeWidth="5" />
                          <circle cx="20" cy="20" r="14" fill="none" stroke="#d23a22" strokeWidth="5" strokeDasharray="33 55" strokeDashoffset="0" />
                          <circle cx="20" cy="20" r="14" fill="none" stroke="#17120f" strokeWidth="5" strokeDasharray="24 64" strokeDashoffset="-33" />
                          <circle cx="20" cy="20" r="14" fill="none" stroke="#b8935a" strokeWidth="5" strokeDasharray="17 71" strokeDashoffset="-57" />
                        </svg>
                        <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[9px] font-bold text-vermilion">
                          38%
                        </span>
                      </div>

                      <div>
                        <span className="block text-[9px] uppercase tracking-wider text-paper/50">Cơ cấu tách tầng</span>
                        <strong className="block text-xs text-paper">Ăn uống · 2.370k</strong>
                        <span className="text-[10px] text-paper/60">Nhà ở 27% · Di chuyển 19%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Layer 4: Floating Executive Summary Card (+130px in Stage 2 & 3) */}
                <div
                  onClick={() => setActiveLayer("summary")}
                  className="expansion-layer-summary cursor-pointer"
                  title="Nhấn để xem tổng kết tài chính"
                  style={{
                    opacity:
                      isMobile
                        ? currentStage >= 2 && activeLayer === "summary"
                          ? 1
                          : 0
                        : currentStage >= 2
                        ? 1
                        : 0,
                    pointerEvents: isMobile && (currentStage < 2 || activeLayer !== "summary") ? "none" : "auto",
                    transform: isMobile
                      ? activeLayer === "summary"
                        ? "translate(-50%, calc(-50% - 20px)) translateZ(50px) scale(0.98)"
                        : "translate(-50%, calc(-50% - 20px)) translateZ(-20px) scale(0.85)"
                      : currentStage === 2
                      ? "translate(calc(-50% + 120px), calc(-50% + 120px)) translateZ(135px) scale(0.96) rotateX(4deg) rotateY(-6deg)"
                      : currentStage === 3
                      ? "translate(calc(-50% + 105px), calc(-50% + 110px)) translateZ(65px) scale(0.94) rotateX(2deg) rotateY(-4deg)"
                      : "translate(-50%, -50%) translateZ(0px) scale(0.7)",
                    zIndex: 35,
                  }}
                >
                  <div className="rounded-2xl border border-gold/40 bg-[#18120e]/95 p-3.5 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-gold max-w-[280px]">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <span className="block text-[9px] uppercase tracking-wider text-gold font-medium">Nhịp chi cuối tuần</span>
                        <strong className="mt-0.5 block text-xs font-semibold text-paper">T6 - CN chiếm 52%</strong>
                      </div>
                      <span className="rounded-full bg-emerald-950 px-2 py-0.5 text-[10px] text-emerald-400 font-medium">
                        ↓ 12% tháng
                      </span>
                    </div>
                    <p className="mt-1 text-[10px] text-paper/60">Đã tiết kiệm được 480k so với hạn mức</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Narrative Story & Engineering Insight Card */}
          <div className="flex min-h-[500px] flex-col justify-between rounded-3xl border border-paper/15 bg-gradient-to-b from-[#1c1411] to-[#0e0a09] p-8 shadow-2xl md:p-10">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.24em] text-vermilion font-medium">{stage.tag}</span>
                <span className="font-mono text-xs text-paper/40">GIAI ĐOẠN 0{stage.index + 1}/04</span>
              </div>

              <h3 className="mt-4 min-h-[76px] font-display text-3xl font-light text-paper md:text-4xl">
                {stage.title}
              </h3>

              <p className="mt-4 min-h-[64px] text-sm leading-relaxed text-paper/70">
                {stage.desc}
              </p>

              {/* Micro Feature Bullet Points */}
              <div className="mt-8 border-t border-paper/10 pt-6">
              <span className="text-[11px] uppercase tracking-[0.2em] text-paper/50">Chi tiết công nghệ & thị giác:</span>
              <ul className="mt-3 space-y-3">
                <li className="flex items-center gap-3 text-xs text-paper/85">
                  <span className="size-1.5 rounded-full bg-vermilion" />
                  <span>
                    {currentStage === 0 && "Render 1:1 theo chuẩn giao diện ứng dụng Sổ Chi phát hành."}
                    {currentStage === 1 && "Trục Z đẩy cột biểu đồ nổi +80px về phía mắt nhìn, phá vỡ khung viền."}
                    {currentStage === 2 && "Phân tách 3 tầng độc lập: Thân máy (-80px), Cột thể tích (+90px), Donut (+140px)."}
                    {currentStage === 3 && "Hội tụ thành bố cục bảng điều khiển HUD cân bằng hoàn hảo quanh máy."}
                  </span>
                </li>
                <li className="flex items-center gap-3 text-xs text-paper/85">
                  <span className="size-1.5 rounded-full bg-gold" />
                  <span>
                    {currentStage === 0 && "Tối ưu hóa thao tác nhập liệu chỉ 3 giây mỗi giao dịch."}
                    {currentStage === 1 && "Nhận diện tức thì cột cao nhất (Đỉnh chi Thứ Sáu: 380k)."}
                    {currentStage === 2 && "Tự động phân nhóm thông minh theo quy tắc tỷ lệ 50/30/20."}
                    {currentStage === 3 && "Sẵn sàng làm cơ sở dữ liệu xác thực cho kế hoạch ngân sách chu kỳ tới."}
                  </span>
                </li>
              </ul>
            </div>
            </div>

            {/* Quick Next/Prev Step Navigation */}
            <div className="mt-8 flex items-center justify-between border-t border-paper/10 pt-6">
              <button
                type="button"
                disabled={currentStage === 0}
                onClick={() => selectStage(Math.max(0, currentStage - 1) as ExpansionStage)}
                className="min-h-11 px-2 cursor-pointer text-xs uppercase tracking-wider text-paper/60 transition-colors hover:text-paper disabled:cursor-not-allowed disabled:opacity-30"
              >
                ← Giai đoạn trước
              </button>
              <div className="flex gap-1.5 py-3">
                {STAGES.map((s) => (
                  <span
                    key={s.index}
                    onClick={() => selectStage(s.index)}
                    className={`block size-2 cursor-pointer rounded-full transition-all duration-300 ${
                      currentStage === s.index ? "w-6 bg-vermilion" : "bg-paper/20 hover:bg-paper/40"
                    }`}
                  />
                ))}
              </div>
              <button
                type="button"
                disabled={currentStage === 3}
                onClick={() => selectStage(Math.min(3, currentStage + 1) as ExpansionStage)}
                className="min-h-11 px-2 cursor-pointer text-xs uppercase tracking-wider text-vermilion font-medium transition-colors hover:text-vermilion-bright disabled:cursor-not-allowed disabled:opacity-30"
              >
                Giai đoạn tiếp →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
