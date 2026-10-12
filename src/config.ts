// PLACEHOLDER CONTENT: replace with verified product data before launch.
export const APP = {
  name: "Sổ Chi", // placeholder brand name
  siteUrl: "https://sochi.app", // canonical origin
};

// Only non-empty URLs render a store button.
export const STORES = {
  appStore: "", // official App Store listing URL
  googlePlay: "", // official Google Play listing URL
};

// Screenshots go in /public/media/screenshots/. Until present, detailed product mockups show.
// Feature copy is generic and must be confirmed against the real app.
export const FEATURES = [
  {
    id: "thu-chi",
    short: "Thu chi",
    title: "Theo dõi thu chi",
    desc: "Ghi lại từng khoản thu và chi, để biết tiền của bạn đang đi đâu.",
    shot: "/media/screenshots/theo-doi-thu-chi.png",
  },
  {
    id: "thong-ke",
    short: "Thống kê",
    title: "Thống kê tài chính",
    desc: "Biểu đồ trực quan giúp nhìn ra thói quen chi tiêu theo từng giai đoạn.",
    shot: "/media/screenshots/thong-ke.png",
  },
  {
    id: "ngan-sach",
    short: "Ngân sách",
    title: "Quản lý ngân sách",
    desc: "Đặt hạn mức cho từng nhóm chi tiêu và theo dõi mức đã dùng.",
    shot: "/media/screenshots/ngan-sach.png",
  },
] as const;

export const CATEGORIES = [
  { name: "Ăn uống", pct: 38, color: "#d23a22" },
  { name: "Nhà ở", pct: 27, color: "#17120f" },
  { name: "Di chuyển", pct: 19, color: "#b8935a" },
  { name: "Khác", pct: 16, color: "#9a9183" },
];
export const TREND = [42, 55, 48, 63, 58, 71, 66]; // illustrative
export const MONTHS = ["T1", "T2", "T3", "T4", "T5", "T6", "T7"];
