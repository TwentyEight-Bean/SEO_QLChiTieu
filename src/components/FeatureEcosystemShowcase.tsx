import { useState } from "react";
import DeviceMockup from "./DeviceMockup";
import { type PhoneScreen } from "../Phone";

interface LayerItem {
  id: PhoneScreen;
  label: string;
  tag: string;
  title: string;
  desc: string;
  highlights: string[];
}

const LAYERS: LayerItem[] = [
  {
    id: "thu-chi",
    label: "01. Thu & Chi",
    tag: "Nhập liệu tinh gọn",
    title: "Ghi chép giao dịch trong tích tắc",
    desc: "Mọi khoản phát sinh được lưu lại ngay lập tức với số tiền và phân loại rõ ràng, loại bỏ cảm giác ngại mở sổ cuối ngày.",
    highlights: ["Chỉ 3 giây cho mỗi giao dịch", "Tự động phân nhóm thông minh", "Không bắt buộc nhập ghi chú dài dòng"],
  },
  {
    id: "thong-ke",
    label: "02. Thống kê",
    tag: "Trực quan hóa dòng tiền",
    title: "Biểu đồ tự động phân tích hành vi",
    desc: "Biến những con số khô khan thành tín hiệu thị giác dễ hiểu. Nhận ra ngay nhóm nào đang chiếm tỷ trọng lớn và có xu hướng tăng.",
    highlights: ["Biểu đồ biến động tuần và tháng", "Phân bổ phần trăm danh mục trực quan", "So sánh chênh lệch giữa các kỳ"],
  },
  {
    id: "ngan-sach",
    label: "03. Ngân sách",
    tag: "Kiểm soát chủ động",
    title: "Đặt hạn mức an toàn cho từng nhóm",
    desc: "Ngân sách đóng vai trò la bàn định hướng chi tiêu. Cảnh báo điềm đạm trước khi bạn vượt ngưỡng để luôn giữ dòng tiền dương.",
    highlights: ["Hạn mức linh hoạt theo từng nhóm", "Vòng tròn tiến độ thời gian thực", "Tính toán ngân sách an toàn mỗi ngày"],
  },
];

export default function FeatureEcosystemShowcase() {
  const [activeLayer, setActiveLayer] = useState<PhoneScreen>("thu-chi");

  const current = LAYERS.find((l) => l.id === activeLayer) || LAYERS[0];

  return (
    <section className="feature-ecosystem-section relative overflow-hidden bg-ink py-20 text-paper md:py-32" aria-labelledby="eco-title">
      {/* Background radial geometry */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_40%,#261912_0%,#0c0a09_75%)]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-[min(80vw,750px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-paper/10" aria-hidden>
        <span className="absolute inset-[20%] rounded-full border border-vermilion/20" />
      </div>

      <div className="mx-auto max-w-[1300px] px-6 md:px-10">
        {/* Title */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="flex items-center justify-center gap-3 text-[11px] font-medium uppercase tracking-[0.28em] text-paper/60">
            <span className="font-display text-base text-vermilion">Hệ sinh thái</span>
            <span className="h-px w-8 bg-current opacity-40" />
            Tất cả trong một
          </p>
          <h2 id="eco-title" className="mt-4 font-display text-[clamp(2.3rem,5vw,4.5rem)] font-light leading-[1.08]">
            Ba tầng năng lực cốt lõi <br />
            <span className="italic text-paper/80">tách lớp trong một ứng dụng duy nhất</span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-paper/70">
            Khám phá kiến trúc các tầng màn hình của Sổ Chi. Chạm vào từng tính năng để kéo tầng đó lên tiền cảnh và quan sát chi tiết.
          </p>
        </div>

        {/* Layer Selector Tabs */}
        <div className="relative z-30 mt-10 flex flex-wrap justify-center gap-2.5 md:gap-3">
          {LAYERS.map((layer) => (
            <button
              key={layer.id}
              type="button"
              onClick={() => setActiveLayer(layer.id)}
              className={`flex min-h-11 cursor-pointer items-center rounded-full px-5 py-2.5 text-xs uppercase tracking-[0.16em] transition-all duration-300 ${
                activeLayer === layer.id
                  ? "bg-vermilion text-paper font-medium shadow-lg shadow-vermilion/40 scale-105"
                  : "border border-paper/15 text-paper/60 hover:border-paper/30 hover:text-paper"
              }`}
            >
              {layer.label}
            </button>
          ))}
        </div>

        {/* 2.5D Exploded Screens Stage */}
        <div className="mt-12 grid items-center gap-10 lg:grid-cols-[1fr_420px]">
          {/* Left: Strictly Ordered 3-Phone 3D Stage (Phone 1 -> 2 -> 3) */}
          <div className="ecosystem-stage w-full overflow-hidden md:overflow-visible select-none" data-active={activeLayer}>
            {LAYERS.map((layer, idx) => {
              const slot = idx + 1; // strictly 1: Thu Chi, 2: Thống Kê, 3: Ngân Sách
              const isActive = activeLayer === layer.id;

              return (
                <div
                  key={layer.id}
                  data-slot={slot}
                  onClick={() => setActiveLayer(layer.id)}
                  className="ecosystem-card select-none"
                  title={isActive ? undefined : `Xem ${layer.label}`}
                >
                  <DeviceMockup
                    screen={layer.id}
                    alt={`Màn hình ${layer.title}`}
                    perspective="flat"
                    w="clamp(220px, 24vw, 280px)"
                    ambientGlow={isActive ? "vermilion" : "none"}
                  />
                </div>
              );
            })}
          </div>

          {/* Right: Focused Layer Detail Card */}
          <div className="rounded-3xl border border-paper/15 bg-gradient-to-b from-[#1c1613] to-[#0f0c0b] p-6 shadow-2xl md:p-8">
            <span className="text-xs uppercase tracking-[0.24em] text-vermilion font-medium">{current.tag}</span>
            <h3 className="mt-3 font-display text-3xl font-light text-paper md:text-4xl">
              {current.title}
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-paper/70">{current.desc}</p>

            <div className="mt-8 border-t border-paper/10 pt-6">
              <span className="text-[11px] uppercase tracking-[0.2em] text-paper/50">Điểm nổi bật:</span>
              <ul className="mt-3 space-y-2.5">
                {current.highlights.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-xs text-paper/85">
                    <span className="size-1.5 rounded-full bg-vermilion" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
