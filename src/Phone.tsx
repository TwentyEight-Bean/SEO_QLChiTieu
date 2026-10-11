import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

export type PhoneScreen = "thu-chi" | "thong-ke" | "ngan-sach";

type Props = {
  src: string;
  screen: PhoneScreen;
  alt: string;
  w: string;
  className?: string;
  children?: ReactNode;
};

type ScreenLayer = {
  key: number;
  src: string;
  screen: PhoneScreen;
  alt: string;
  exiting?: boolean;
};

const transactions = [
  { icon: "Ă", name: "Bữa trưa", meta: "Ăn uống · Hôm nay", value: "−85.000 ₫", tone: "red" },
  { icon: "L", name: "Lương tháng", meta: "Thu nhập · Hôm qua", value: "+18.500.000 ₫", tone: "green" },
  { icon: "X", name: "Xăng xe", meta: "Di chuyển · 12 Thg 7", value: "−120.000 ₫", tone: "gold" },
] as const;

function AppHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mock-header">
      <div>
        <span className="mock-eyebrow">{eyebrow}</span>
        <strong className="mock-title">{title}</strong>
      </div>
      <span className="mock-avatar">SC</span>
    </div>
  );
}

function StatusBar() {
  return (
    <div className="mock-status" aria-hidden>
      <span>09:41</span>
      <span className="mock-status-icons">
        <i className="mock-signal"><b /><b /><b /></i>
        <i className="mock-wifi" />
        <i className="mock-battery"><b /></i>
      </span>
    </div>
  );
}

function BottomNav({ active }: { active: "home" | "chart" | "budget" }) {
  return (
    <div className="mock-nav">
      {[
        ["home", "Tổng quan"],
        ["chart", "Thống kê"],
        ["budget", "Ngân sách"],
      ].map(([id, label]) => (
        <span key={id} className={`mock-nav-item ${active === id ? "is-active" : ""}`}>
          <i aria-hidden />
          {label}
        </span>
      ))}
    </div>
  );
}

function OverviewScreen() {
  return (
    <div className="mock-app">
      <AppHeader eyebrow="Xin chào," title="Minh Anh" />
      <div className="balance-card">
        <span>Số dư hiện tại</span>
        <strong>24.680.000 ₫</strong>
        <div className="balance-stats">
          <span><i className="up">↑</i><small>Thu nhập</small><b>18,5 tr</b></span>
          <span><i className="down">↓</i><small>Chi tiêu</small><b>6,2 tr</b></span>
        </div>
      </div>
      <div className="mock-section-title">
        <strong>Giao dịch gần đây</strong>
        <span>Xem tất cả</span>
      </div>
      <div className="transaction-list">
        {transactions.map((item) => (
          <div className="transaction" key={item.name}>
            <span className={`transaction-icon ${item.tone}`}>{item.icon}</span>
            <span className="transaction-copy"><b>{item.name}</b><small>{item.meta}</small></span>
            <strong className={item.tone === "green" ? "positive" : ""}>{item.value}</strong>
          </div>
        ))}
      </div>
      <span className="quick-add"><i /> Ghi giao dịch</span>
      <BottomNav active="home" />
    </div>
  );
}

function StatisticsScreen() {
  const bars = [42, 61, 48, 76, 58, 88, 68];
  return (
    <div className="mock-app">
      <AppHeader eyebrow="Báo cáo" title="Tháng 7, 2025" />
      <div className="period-switch"><span>Tuần</span><span className="is-active">Tháng</span><span>Năm</span></div>
      <div className="stat-summary">
        <span>Tổng chi tiêu</span>
        <strong>6.240.000 ₫</strong>
        <small><i>↓ 12%</i> so với tháng trước</small>
      </div>
      <div className="bar-chart" aria-hidden>
        {bars.map((height, index) => (
          <span key={index}><i style={{ height: `${height}%` }} className={index === 5 ? "is-hot" : ""} /><small>{index + 1}</small></span>
        ))}
      </div>
      <div className="mock-section-title">
        <strong>Chi tiêu theo nhóm</strong>
        <span>100%</span>
      </div>
      <div className="category-card">
        <div className="donut" />
        <div className="category-legend">
          <span><i className="food" /><small>Ăn uống</small><b>38%</b></span>
          <span><i className="home" /><small>Nhà ở</small><b>27%</b></span>
          <span><i className="move" /><small>Di chuyển</small><b>19%</b></span>
        </div>
      </div>
      <BottomNav active="chart" />
    </div>
  );
}

function BudgetScreen() {
  const budgets = [
    { icon: "Ă", name: "Ăn uống", used: "1,9 / 3,0 tr", pct: 63, tone: "red" },
    { icon: "X", name: "Di chuyển", used: "680 N / 1,2 tr", pct: 56, tone: "gold" },
    { icon: "M", name: "Mua sắm", used: "1,4 / 1,5 tr", pct: 91, tone: "ink" },
  ] as const;
  return (
    <div className="mock-app">
      <AppHeader eyebrow="Kế hoạch" title="Ngân sách tháng 7" />
      <div className="budget-hero">
        <div className="budget-ring"><span><small>Còn lại</small><b>3,8 tr</b></span></div>
        <div><span>Tổng ngân sách</span><strong>10.000.000 ₫</strong><small>Đã dùng 62%</small></div>
      </div>
      <div className="mock-section-title">
        <strong>Hạn mức theo nhóm</strong>
        <span>Điều chỉnh</span>
      </div>
      <div className="budget-list">
        {budgets.map((item) => (
          <div className="budget-item" key={item.name}>
            <div className="budget-row">
              <span className={`transaction-icon ${item.tone}`}>{item.icon}</span>
              <span><b>{item.name}</b><small>{item.used}</small></span>
              <strong>{item.pct}%</strong>
            </div>
            <span className="budget-track"><i style={{ width: `${item.pct}%` }} className={item.pct > 85 ? "is-alert" : ""} /></span>
          </div>
        ))}
      </div>
      <div className="budget-note"><i>!</i><span><b>Sắp chạm hạn mức</b><small>Ngân sách Mua sắm còn 100.000 ₫</small></span></div>
      <BottomNav active="budget" />
    </div>
  );
}

function ProductScreen({ screen, alt }: { screen: PhoneScreen; alt: string }) {
  return (
    <div role="img" aria-label={`${alt}. Dữ liệu minh họa.`} className="h-full" data-screen={screen}>
      <div aria-hidden className="h-full">
        <StatusBar />
        <div className="mock-screen-content">
          {screen === "thu-chi" && <OverviewScreen />}
          {screen === "thong-ke" && <StatisticsScreen />}
          {screen === "ngan-sach" && <BudgetScreen />}
        </div>
      </div>
    </div>
  );
}

function PhoneScreenLayer({ layer, initial }: { layer: ScreenLayer; initial: boolean }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
  }, [layer.src]);

  return (
    <div className={`phone-layer ${initial ? "" : layer.exiting ? "is-exiting" : "is-entering"}`}>
      <ProductScreen screen={layer.screen} alt={layer.alt} />
      <img
        src={layer.src}
        alt={layer.alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`absolute inset-0 z-[2] h-full w-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}

export default function Phone({ src, screen, alt, w, className = "", children }: Props) {
  const nextLayerKey = useRef(0);
  const [layers, setLayers] = useState<ScreenLayer[]>(() => [{ key: 0, src, screen, alt }]);

  useEffect(() => {
    const key = ++nextLayerKey.current;
    const cleanupMs = window.matchMedia("(max-width: 767px)").matches ? 420 : 720;

    setLayers((currentLayers) => {
      const active = currentLayers[currentLayers.length - 1];
      if (active?.src === src && active.screen === screen && active.alt === alt) return currentLayers;

      return [
        ...(active ? [{ ...active, exiting: true }] : []),
        { key, src, screen, alt },
      ];
    });

    const timeout = window.setTimeout(() => {
      setLayers((currentLayers) => currentLayers.filter((layer) => !layer.exiting));
    }, cleanupMs);

    return () => window.clearTimeout(timeout);
  }, [alt, screen, src]);

  return (
    <div className={`phone ${className}`} style={{ "--w": w } as CSSProperties}>
      <div className="phone-screen">
        {layers.map((layer) => (
          <PhoneScreenLayer key={layer.key} layer={layer} initial={layer.key === 0 && layers.length === 1} />
        ))}
        <span className="phone-island" />
        <span className="phone-glass" aria-hidden />
        <span className="phone-dim" />
        {children}
      </div>
      <span className="phone-rim" />
    </div>
  );
}
