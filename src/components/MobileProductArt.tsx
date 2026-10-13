import type { CSSProperties } from "react";
import Phone from "../Phone";
import { FEATURES } from "../config";

export type ProductArtKind = "transactions" | "statistics" | "budget" | "features";

export function StatisticsArt({ mode = 0 }: { mode?: number }) {
  return (
    <div className="product-art statistics-art" data-mode={mode} aria-hidden="true">
      <div className="data-origin"><i /><i /><i /></div>
      <div className="data-plane data-bars" data-active={mode === 0}>
        <span className="art-caption">Chi tiêu trong tuần</span>
        <div className="expanded-bars">
          {[42, 61, 48, 76, 58, 88, 68].map((height, index) => (
            <i key={index} style={{ "--bar-height": `${height}%` } as CSSProperties} data-peak={index === 5}>
              <b>{index === 6 ? "CN" : `T${index + 2}`}</b>
            </i>
          ))}
        </div>
        <strong>6.240.000 <small>₫</small></strong>
        <span className="art-note">Tổng chi tháng này · ↓ 12%</span>
      </div>
      <div className="data-plane data-category" data-active={mode === 1}>
        <svg viewBox="0 0 200 200"><circle className="chart-track" cx="100" cy="100" r="72" /><circle className="chart-segment" cx="100" cy="100" r="72" pathLength="100" strokeDasharray="38 62" /><circle className="chart-secondary" cx="100" cy="100" r="72" pathLength="100" strokeDasharray="27 73" strokeDashoffset="-40" /></svg>
        <div className="donut-reading"><strong>38<small>%</small></strong><span>Ăn uống</span></div>
        <span className="category-anchor">Nhà ở <b>27%</b></span>
      </div>
      <div className="data-plane data-trend" data-active={mode === 2}>
        <span className="art-caption">Ba tháng, một xu hướng</span>
        <svg viewBox="0 0 280 140"><path className="trend-grid" d="M10 40H270M10 80H270M10 120H270" /><path className="trend-area" d="M15 60C60 60 70 30 135 32S205 107 265 105V130H15Z" /><path className="trend-line" d="M15 60C60 60 70 30 135 32S205 107 265 105" /><circle cx="265" cy="105" r="5" /></svg>
        <div className="trend-labels"><span>Tháng 5</span><span>Tháng 6</span><span>Tháng 7</span></div>
        <strong>−8<small>%</small></strong><span className="art-note">So với trung bình 3 tháng</span>
      </div>
    </div>
  );
}

export function TransactionArt({ step = 0 }: { step?: number }) {
  return (
    <div className="product-art transaction-art" data-step={step} aria-hidden="true">
      <div className="transaction-context"><span>HÔM NAY</span><i /><span>09:15</span><i /><span>Vào sổ</span></div>
      <div className="transaction-slip">
        <span className="art-caption">{step === 3 ? "Tổng chi hôm nay" : "Một khoản chi nhỏ"}</span>
        <strong>{step === 3 ? "180.000" : "−45.000"}<small> ₫</small></strong>
        <div><span className="transaction-monogram">Ă</span><span>Cà phê sáng<small>09:15 · Hôm nay</small></span><b>Đã ghi ↗</b></div>
      </div>
      <span className="transaction-category"><i />Ăn uống <b>Đúng nhóm ↗</b></span>
    </div>
  );
}

export function BudgetArt({ pct = 63, category = "Ăn uống", remaining = "1.110.000 ₫" }: { pct?: number; category?: string; remaining?: string }) {
  const style = { "--budget-fraction": pct / 100 } as CSSProperties;
  return (
    <div className="product-art budget-art" data-warning={pct >= 90} style={style} aria-hidden="true">
      <svg className="budget-arc budget-arc-back" viewBox="0 0 320 320"><circle cx="160" cy="160" r="136" pathLength="100" /><circle className="budget-arc-back-fill" cx="160" cy="160" r="136" pathLength="100" strokeDasharray={`${pct * .8} 100`} /></svg>
      <svg className="budget-arc budget-arc-front" viewBox="0 0 320 320"><circle cx="160" cy="160" r="136" pathLength="100" strokeDasharray={`${pct * .8} 100`} /></svg>
      <div className="budget-reading"><span>{category}</span><strong>{pct}<small>%</small></strong><span>{pct >= 90 ? "Sắp chạm hạn mức" : "Ngân sách đã dùng"}</span></div>
      <div className="budget-remaining"><span>{pct >= 90 ? "Còn trước hạn mức" : "Còn có thể chi"}</span><strong>{remaining}</strong><i /><span className="budget-headroom">{100 - pct}% hạn mức còn lại</span></div>
    </div>
  );
}

export default function MobileHeroArt({ kind }: { kind: ProductArtKind }) {
  return (
    <div className={`mobile-hero-art hero-art-${kind}`} aria-hidden="true">
      {kind === "statistics" && <StatisticsArt />}
      {kind === "transactions" && <TransactionArt />}
      {kind === "budget" && <BudgetArt />}
      {kind === "features" && FEATURES.slice(1).map((feature, index) => (
        <div className={`hero-ecosystem-layer hero-ecosystem-layer-${index}`} key={feature.id}>
          <Phone src={feature.shot} screen={feature.id} alt="" w="148px" />
          <span>{feature.title}</span>
        </div>
      ))}
    </div>
  );
}

export function ProductEditorialFigure({ kind }: { kind: ProductArtKind }) {
  return (
    <figure className={`product-editorial-figure editorial-${kind}`}>
      {kind === "transactions" && <><div className="editorial-flow" aria-hidden="true"><span>−45.000 ₫</span><i>→</i><span>Ăn uống</span><i>→</i><span>Hôm nay</span></div><figcaption>Một khoản ghi. Cả dòng tiền rõ hơn.</figcaption></>}
      {kind === "statistics" && <><div className="editorial-bars" aria-hidden="true">{[45, 68, 55, 86, 62, 48, 38].map((height, index) => <i key={index} style={{ "--bar-height": `${height}%` } as CSSProperties} />)}<strong>Nhìn ra<br />xu hướng.</strong></div><figcaption>Từ những khoản nhỏ đến bức tranh toàn cảnh.</figcaption></>}
      {kind === "budget" && <><div className="editorial-threshold" aria-hidden="true"><span>Đã dùng <b>63%</b></span><i /><span>Còn lại <b>37%</b></span></div><figcaption>Một hạn mức rõ ràng. Một khoảng dư để chủ động.</figcaption></>}
      {kind === "features" && <><div className="editorial-ecosystem" aria-hidden="true"><span>Ghi chép</span><span>Thấu hiểu</span><span>Chủ động</span></div><figcaption>Ba góc nhìn, cùng một dòng tiền.</figcaption></>}
    </figure>
  );
}
