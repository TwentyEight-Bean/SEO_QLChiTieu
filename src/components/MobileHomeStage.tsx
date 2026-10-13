import { useRef, useState, type PointerEvent } from "react";
import Phone from "../Phone";
import { FEATURES } from "../config";
import { track } from "../lib";

const MODES = [
  { id: "thu-chi", label: "Theo dõi", badge: "01 · THEO DÕI THU CHI", title: "Ghi chép tức thì, kiểm soát tức thì", desc: "Mỗi khoản chi được tự động phân loại và cập nhật vào dòng tiền hôm nay chỉ sau 3 giây." },
  { id: "thong-ke", label: "Thống kê", badge: "02 · PHÂN TÍCH TÀI CHÍNH", title: "Thấu hiểu dòng tiền từ biểu đồ", desc: "Nhận biết chính xác nhóm chi nhiều nhất và biến động chi tiêu qua từng tuần, từng tháng." },
  { id: "ngan-sach", label: "Ngân sách", badge: "03 · KIỂM SOÁT HẠN MỨC", title: "Chủ động chi tiêu, không lo hụt hẫng", desc: "Cảnh báo thông minh khi danh mục chi tiêu sắp chạm trần ngân sách bạn đã đặt trước." },
] as const;

export default function MobileHomeStage({ id = "mobile-home-product" }: { id?: string }) {
  const [active, setActive] = useState(0);
  const [input, setInput] = useState("pointer");
  const start = useRef<{ x: number; y: number } | null>(null);
  const current = MODES[active];
  const feature = FEATURES[active];
  const select = (index: number, source: "tab" | "swipe" | "button" | "keyboard") => {
    const next = (index + MODES.length) % MODES.length;
    setActive(next);
    setInput(source === "keyboard" ? "keyboard" : "pointer");
    track("product_demo_interaction", { stage: "home_mobile", feature: MODES[next].id, source });
  };
  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (!start.current) return;
    const dx = event.clientX - start.current.x;
    const dy = event.clientY - start.current.y;
    start.current = null;
    if (Math.abs(dx) > 42 && Math.abs(dx) > Math.abs(dy)) select(active + (dx < 0 ? 1 : -1), "swipe");
  };

  return (
    <section id={id} className="mobile-home-stage home-demo md:hidden" data-feature={current.id} data-input={input} aria-labelledby={`${id}-title`}>
      <header className="home-demo-heading">
        <p>Trải nghiệm sản phẩm <span aria-hidden>02 /</span></p>
        <h2 id={`${id}-title`}>Chỉ cần mở app. <br /><em>Mọi thứ rõ ràng.</em></h2>
      </header>
      <div className="home-demo-tabs" role="tablist" aria-label="Chọn tính năng trải nghiệm"
        onKeyDown={(event) => {
          if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
          event.preventDefault();
          const next = event.key === "Home" ? 0 : event.key === "End" ? 2 : (active + (event.key === "ArrowRight" ? 1 : 2)) % 3;
          select(next, "keyboard");
          event.currentTarget.querySelectorAll<HTMLButtonElement>("button")[next].focus();
        }}>
        {MODES.map((mode, index) => <button key={mode.id} id={`${id}-tab-${index}`} type="button" role="tab" aria-selected={index === active} aria-controls={`${id}-panel`} tabIndex={index === active ? 0 : -1} onClick={() => select(index, "tab")}>{mode.label}</button>)}
      </div>
      <div className="home-demo-canvas" tabIndex={0} aria-label="Vuốt ngang hoặc dùng phím mũi tên để đổi tính năng"
        onPointerDown={(event) => { start.current = { x: event.clientX, y: event.clientY }; event.currentTarget.setPointerCapture(event.pointerId); }}
        onPointerUp={onPointerUp} onPointerCancel={() => { start.current = null; }}
        onKeyDown={(event) => { if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); select(active + (event.key === "ArrowRight" ? 1 : -1), "keyboard"); } }}>
        <div className="home-demo-orbit" aria-hidden="true"><i /><span>SỔ CHI / {String(active + 1).padStart(2, "0")}</span></div>
        <div className="home-demo-device"><Phone src={feature.shot} screen={current.id} alt={`${current.label} trong ứng dụng Sổ Chi`} w="clamp(200px, 54vw, 210px)" /></div>
        <div className="home-preview home-preview-transaction" data-active={active === 0} aria-hidden="true">
          <span>Vừa ghi nhận</span><strong>−45.000 <small>₫</small></strong>
          <div><i>Ă</i><p>Cà phê sáng<small>Ăn uống · Hôm nay</small></p><b>↗</b></div>
        </div>
        <div className="home-preview home-preview-statistics" data-active={active === 1} aria-hidden="true">
          <span>Báo cáo kỳ này</span>
          <svg viewBox="0 0 210 120"><path d="M10 105H200" className="home-preview-baseline" />{[42,61,48,76,58,88,68].map((height,index) => <rect key={index} x={12 + index * 27} y={105-height} width="17" height={height} rx="2" className={index === 5 ? "is-peak" : ""} />)}</svg>
          <strong>6.240.000 <small>₫</small></strong><p>Giảm 12% so với tháng trước</p>
        </div>
        <div className="home-preview home-preview-budget" data-active={active === 2} aria-hidden="true">
          <svg viewBox="0 0 240 240"><circle className="home-budget-track" cx="120" cy="120" r="94" /><circle className="home-budget-used" cx="120" cy="120" r="94" pathLength="100" strokeDasharray="72.8 100" /></svg>
          <div><span>Mua sắm</span><strong>91<small>%</small></strong><p>Cảnh báo hạn mức</p></div>
        </div>
      </div>
      <div id={`${id}-panel`} className="home-demo-copy" role="tabpanel" aria-labelledby={`${id}-tab-${active}`} aria-live="polite">
        <span>{current.badge}</span><h3>{current.title}</h3><p>{current.desc}</p>
      </div>
      <nav className="home-demo-controls" aria-label="Điều khiển trải nghiệm">
        <button type="button" onClick={() => select(active - 1, "button")} aria-label="Tính năng trước">←</button>
        <div>{MODES.map((mode,index) => <button key={mode.id} type="button" aria-label={`Xem tính năng ${mode.label}`} aria-current={index === active ? "step" : undefined} onClick={() => select(index,"button")}><i /></button>)}<span>{active + 1} / 3</span></div>
        <button type="button" onClick={() => select(active + 1,"button")} aria-label="Tính năng tiếp theo">→</button>
      </nav>
    </section>
  );
}
