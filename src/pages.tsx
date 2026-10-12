import { useMemo, useState } from "react";
import Phone, { type PhoneScreen } from "./Phone";
import { APP, CATEGORIES, FEATURES, STORES } from "./config";
import { Link } from "./router";
import DeviceMockup from "./components/DeviceMockup";
import StatisticsShowcase from "./components/StatisticsShowcase";
import AnalyticsPerspectiveStage from "./components/AnalyticsPerspectiveStage";
import TransactionFlowShowcase from "./components/TransactionFlowShowcase";
import BudgetShowcase from "./components/BudgetShowcase";
import FeatureEcosystemShowcase from "./components/FeatureEcosystemShowcase";
import DataExpansionSequence from "./components/DataExpansionSequence";
import StatisticsVisualStories from "./components/StatisticsVisualStories";
import { openPrelaunchSheet } from "./lib";

type FeatureId = (typeof FEATURES)[number]["id"];
const HAS_STORE_LINKS = Boolean(STORES.appStore || STORES.googlePlay);
const PRODUCT_CTA_LABEL = HAS_STORE_LINKS ? "Xem phần tải ứng dụng" : "Nhận thông báo khi ra mắt";

/* ---------- Data Types ---------- */

export type FaqItem = { q: string; a: string };

export type ProductPageDef = {
  kind: "product";
  path: string;
  nav: string;
  title: string;
  description: string;
  eyebrow: string;
  h1: string;
  intro: string;
  screen: PhoneScreen;
  featureId?: FeatureId;
  metrics: string[];
  sections: { h: string; p: string[]; list?: string[] }[];
  benefits: string[];
  faq?: FaqItem[];
  related: string[];
};

export type ArticleDef = {
  kind: "article";
  path: string;
  slug: string;
  nav: string;
  title: string;
  description: string;
  category: string;
  date: string;
  updatedAt?: string;
  author: string;
  readingMinutes: number;
  intro: string;
  sections: { h: string; p: string[]; h3?: { h: string; p: string }[]; list?: string[] }[];
  related: string[];
};

export type BlogIndexDef = {
  kind: "blog";
  path: "/blog";
  nav: "Blog";
  title: string;
  description: string;
};

export type RouteDef = ProductPageDef | ArticleDef | BlogIndexDef;

const featureById = Object.fromEntries(FEATURES.map((feature) => [feature.id, feature])) as Record<FeatureId, (typeof FEATURES)[number]>;

/* ---------- Product Pages ---------- */

export const PRODUCT_PAGES: ProductPageDef[] = [
  {
    kind: "product",
    path: "/tinh-nang",
    nav: "Tính năng",
    title: `Tính năng của ${APP.name}: theo dõi thu chi, thống kê và ngân sách`,
    description: `${APP.name} tập trung vào các nhu cầu cốt lõi: ghi thu chi, xem thống kê tài chính và quản lý ngân sách cá nhân trong một trải nghiệm rõ ràng.`,
    eyebrow: "Tổng quan sản phẩm",
    h1: "Một ứng dụng cho dòng tiền hằng ngày",
    intro: "Các tính năng của Sổ Chi được trình bày quanh những việc người dùng cần làm thường xuyên: ghi lại khoản phát sinh, hiểu xu hướng và giữ ngân sách trong tầm kiểm soát.",
    screen: "thu-chi",
    metrics: ["Ghi chép nhanh", "Biểu đồ dễ đọc", "Ngân sách theo nhóm"],
    sections: FEATURES.map((feature) => ({
      h: feature.title,
      p: [feature.desc, "Mỗi màn hình được thiết kế để giữ thông tin chính ở phía trước, hạn chế thao tác thừa và giúp người dùng quay lại thói quen quản lý chi tiêu đều đặn hơn."],
    })),
    benefits: ["Nhìn lại chi tiêu mà không cần bảng tính phức tạp.", "Tạo thói quen ghi chép nhẹ hơn sau mỗi giao dịch.", "Có nền tảng dữ liệu để lập ngân sách thực tế hơn."],
    faq: [
      { q: "Sổ Chi có miễn phí không?", a: "Thông tin về giá và gói dùng thử sẽ được công bố khi ứng dụng chính thức ra mắt." },
      { q: "Dữ liệu tôi ghi có được lưu trên đám mây không?", a: "Chính sách lưu trữ và đồng bộ dữ liệu sẽ được mô tả đầy đủ trong điều khoản sử dụng trước khi phát hành." },
      { q: "Ứng dụng hỗ trợ ngoại tệ không?", a: "Tính năng hỗ trợ đa tiền tệ đang trong quá trình cân nhắc và sẽ được thông báo khi có quyết định chính thức." },
    ],
    related: ["/quan-ly-thu-chi", "/thong-ke-tai-chinh", "/lap-ngan-sach"],
  },
  {
    kind: "product",
    path: "/quan-ly-thu-chi",
    nav: "Quản lý thu chi",
    title: "Quản lý thu chi cá nhân: ghi lại dòng tiền mỗi ngày",
    description: "Trang giới thiệu cách Sổ Chi hỗ trợ quản lý thu chi cá nhân: ghi khoản thu, khoản chi, phân loại và xem lại giao dịch gần đây.",
    eyebrow: "Tính năng",
    h1: "Quản lý thu chi rõ ràng hơn",
    intro: "Quản lý thu chi bắt đầu từ việc ghi lại đúng lúc. Sổ Chi ưu tiên thao tác ngắn, thông tin dễ quét và phân loại đủ rõ để bạn biết tiền đi đâu.",
    screen: "thu-chi",
    featureId: "thu-chi",
    metrics: ["Khoản thu", "Khoản chi", "Giao dịch gần đây"],
    sections: [
      {
        h: "Ghi nhận khoản phát sinh ngay khi nhớ rõ",
        p: ["Một khoản nhỏ như bữa trưa, gửi xe hay cà phê sẽ dễ bị quên nếu để đến cuối tuần. Màn hình thu chi giúp bạn ghi lại khoản phát sinh ngay khi nó xảy ra."],
        list: ["Tên khoản thu hoặc chi", "Nhóm chi tiêu", "Số tiền và thời điểm", "Ghi chú ngắn khi cần"],
      },
      {
        h: "Xem lại lịch sử mà không bị rối",
        p: ["Danh sách giao dịch nên đủ gọn để đọc nhanh, nhưng vẫn đủ thông tin để bạn nhận ra thói quen lặp lại. Đây là nền tảng cho phần thống kê và ngân sách phía sau."],
      },
      {
        h: "Phân loại chi tiêu đúng nhóm",
        p: ["Khi mỗi khoản chi được gán đúng nhóm, phần thống kê mới phản ánh thực tế. Bắt đầu với vài nhóm quen thuộc, thêm dần khi cần thiết."],
        list: ["Ăn uống", "Nhà ở và sinh hoạt", "Di chuyển", "Học tập và phát triển", "Giải trí và cá nhân"],
      },
    ],
    benefits: ["Giảm bỏ sót các khoản nhỏ lặp lại.", "Dễ đối chiếu lại chi tiêu cuối ngày.", "Tạo dữ liệu đầu vào cho báo cáo và ngân sách."],
    faq: [
      { q: "Tôi có thể ghi khoản thu bằng tiền mặt không?", a: "Có. Sổ Chi ghi nhận cả thu và chi, cho dù bạn dùng tiền mặt, chuyển khoản hay thẻ." },
      { q: "Có giới hạn số lượng giao dịch không?", a: "Thông tin về giới hạn sẽ được công bố khi ứng dụng phát hành chính thức." },
      { q: "Tôi có thể xuất dữ liệu ra bảng tính không?", a: "Tính năng xuất dữ liệu đang trong quá trình phát triển và sẽ được thông báo trước khi ra mắt." },
    ],
    related: ["/thong-ke-tai-chinh", "/lap-ngan-sach", "/blog/ghi-chep-chi-tieu-hang-ngay"],
  },
  {
    kind: "product",
    path: "/thong-ke-tai-chinh",
    nav: "Thống kê tài chính",
    title: "Thống kê tài chính cá nhân: hiểu xu hướng chi tiêu",
    description: "Sổ Chi dùng biểu đồ và phân nhóm để giúp người dùng đọc lại xu hướng chi tiêu cá nhân theo thời gian.",
    eyebrow: "Tính năng",
    h1: "Biến con số thành tín hiệu dễ hiểu",
    intro: "Thống kê tài chính không cần phức tạp. Điều quan trọng là nhìn ra nhóm nào đang tăng, khoản nào lặp lại và tháng này khác tháng trước ra sao.",
    screen: "thong-ke",
    featureId: "thong-ke",
    metrics: ["Tổng chi", "Theo nhóm", "Theo thời gian"],
    sections: [
      {
        h: "Nhìn tổng chi theo kỳ",
        p: ["Một con số tổng quan giúp bạn biết tháng này đang đi theo hướng nào. Từ đó, các biểu đồ chi tiết mới có ý nghĩa hơn thay vì chỉ là trang trí."],
      },
      {
        h: "Đọc cơ cấu chi tiêu theo nhóm",
        p: ["Nhóm ăn uống, nhà ở, di chuyển hoặc các nhóm tự định nghĩa giúp bạn thấy phần nào đang chiếm nhiều nhất trong ngân sách."],
        list: CATEGORIES.map((category) => `${category.name}: dữ liệu minh họa ${category.pct}%`),
      },
      {
        h: "So sánh giữa các tháng",
        p: ["Khi dữ liệu tích lũy qua vài tháng, bạn bắt đầu thấy xu hướng dài hạn: nhóm nào tăng vào mùa nào, khoản nào lặp lại đều, nhóm nào cần điều chỉnh trong tháng tới."],
      },
    ],
    benefits: ["Tìm ra xu hướng mà danh sách giao dịch khó cho thấy.", "Biết nhóm nào cần theo dõi sát hơn.", "Có dữ liệu để điều chỉnh ngân sách tháng sau."],
    faq: [
      { q: "Biểu đồ trong ứng dụng cập nhật theo thời gian thực không?", a: "Biểu đồ phản ánh dữ liệu bạn đã ghi. Khi thêm giao dịch mới, số liệu sẽ tự động điều chỉnh." },
      { q: "Tôi có thể xem thống kê theo tuần hoặc quý không?", a: "Tính năng lọc theo khoảng thời gian sẽ được mô tả đầy đủ khi ứng dụng phát hành chính thức." },
      { q: "Dữ liệu trên website có phải dữ liệu thật không?", a: "Không. Tất cả số liệu hiển thị trên website đang là minh họa để thể hiện cách biểu đồ hoạt động. Dữ liệu thật của bạn đến từ các khoản bạn tự ghi." },
    ],
    related: ["/quan-ly-thu-chi", "/lap-ngan-sach", "/blog/doc-bieu-do-chi-tieu"],
  },
  {
    kind: "product",
    path: "/lap-ngan-sach",
    nav: "Lập ngân sách",
    title: "Lập ngân sách cá nhân dựa trên chi tiêu thực tế",
    description: "Trang giới thiệu cách lập ngân sách cá nhân bằng Sổ Chi: đặt hạn mức theo nhóm, theo dõi mức đã dùng và điều chỉnh theo thói quen thật.",
    eyebrow: "Tính năng",
    h1: "Ngân sách bám sát đời sống thật",
    intro: "Ngân sách hiệu quả không bắt đầu từ một con số lý tưởng. Nó bắt đầu từ dữ liệu bạn đã ghi, sau đó đặt hạn mức đủ rõ để theo dõi trong tháng.",
    screen: "ngan-sach",
    featureId: "ngan-sach",
    metrics: ["Hạn mức nhóm", "Mức đã dùng", "Cảnh báo minh họa"],
    sections: [
      {
        h: "Đặt hạn mức theo nhóm chi tiêu",
        p: ["Thay vì chỉ nhìn tổng tiền còn lại, ngân sách theo nhóm giúp bạn biết nhóm nào đang gần chạm giới hạn và nhóm nào vẫn còn dư địa."],
      },
      {
        h: "Theo dõi tiến độ giữa tháng",
        p: ["Không cần đợi đến cuối tháng mới xem lại. Nhìn tiến độ mỗi tuần giúp bạn điều chỉnh kịp thời trước khi vượt hạn mức."],
        list: ["Bắt đầu với vài nhóm quan trọng.", "Theo dõi giữa tháng, không chờ đến cuối tháng.", "Điều chỉnh theo thu nhập và ưu tiên cá nhân."],
      },
      {
        h: "Điều chỉnh sau mỗi chu kỳ",
        p: ["Sau một tháng ghi chép, bạn có thể tăng hoặc giảm hạn mức dựa trên thói quen thật. Cách này thường bền hơn việc đặt mục tiêu quá chặt từ đầu."],
      },
    ],
    benefits: ["Biết sớm khi một nhóm sắp vượt hạn mức.", "Giảm cảm giác mơ hồ khi ra quyết định chi tiêu.", "Biến thống kê thành hành động cụ thể."],
    faq: [
      { q: "Tôi có thể đặt ngân sách cho từng khoản chi cụ thể không?", a: "Sổ Chi hướng đến ngân sách theo nhóm, giúp việc theo dõi đơn giản hơn thay vì kiểm soát từng khoản riêng lẻ." },
      { q: "Ngân sách có tự động chuyển sang tháng sau không?", a: "Cách xử lý ngân sách qua tháng sẽ được mô tả đầy đủ khi ứng dụng phát hành chính thức." },
      { q: "Tôi có thể dùng phương pháp 50/30/20 với Sổ Chi không?", a: "Có. Bạn có thể áp dụng bất kỳ phương pháp ngân sách nào bằng cách tự đặt nhóm và hạn mức tương ứng." },
    ],
    related: ["/quan-ly-thu-chi", "/thong-ke-tai-chinh", "/blog/lap-ngan-sach-ca-nhan"],
  },
  {
    kind: "product",
    path: "/ung-dung-quan-ly-chi-tieu",
    nav: "Ứng dụng quản lý chi tiêu",
    title: "Ứng dụng quản lý chi tiêu cá nhân cho người dùng Việt",
    description: "Cách chọn và sử dụng ứng dụng quản lý chi tiêu cá nhân: ghi chép đều, đọc thống kê đúng cách và lập ngân sách thực tế.",
    eyebrow: "SEO landing page",
    h1: "Ứng dụng quản lý chi tiêu nên bắt đầu từ thói quen",
    intro: "Một ứng dụng quản lý chi tiêu tốt không chỉ có nhiều màn hình. Nó cần giúp việc ghi chép nhẹ hơn, dữ liệu dễ hiểu hơn và quyết định tài chính hằng ngày rõ ràng hơn.",
    screen: "thu-chi",
    metrics: ["Thu chi", "Thống kê", "Ngân sách"],
    sections: [
      {
        h: "Vì sao nên dùng ứng dụng thay cho sổ tay",
        p: ["Sổ tay và bảng tính đều dùng được, nhưng chúng đòi hỏi nhiều bước hơn mỗi lần ghi. Ứng dụng trên điện thoại giúp bạn ghi ngay khi chi tiêu, lúc còn nhớ chính xác con số."],
      },
      {
        h: "Những tiêu chí nên cân nhắc",
        p: ["Trước khi cài đặt, hãy ưu tiên các yếu tố giúp bạn dùng đều đặn chứ không chỉ nhìn đẹp trong vài ngày đầu."],
        list: ["Ghi thu chi nhanh.", "Phân loại rõ ràng.", "Thống kê dễ đọc.", "Có thể lập ngân sách.", "Chính sách dữ liệu minh bạch khi phát hành."],
      },
    ],
    benefits: ["Giảm phụ thuộc vào trí nhớ.", "Dễ tổng hợp cuối tuần hoặc cuối tháng.", "Có cơ sở để tiết kiệm và điều chỉnh thói quen."],
    faq: [
      { q: "Sổ Chi khác ứng dụng quản lý chi tiêu khác ở điểm nào?", a: "Sổ Chi tập trung vào sự đơn giản và rõ ràng: ghi chép nhanh, biểu đồ dễ đọc, và lập ngân sách theo nhóm. Không có tính năng thừa gây mất tập trung." },
      { q: "Tôi cần điện thoại gì để dùng Sổ Chi?", a: "Thông tin về yêu cầu hệ điều hành sẽ được công bố khi ứng dụng phát hành trên App Store và Google Play." },
    ],
    related: ["/tinh-nang", "/quan-ly-thu-chi", "/blog"],
  },
  {
    kind: "product",
    path: "/cau-hoi-thuong-gap",
    nav: "Câu hỏi thường gặp",
    title: "Câu hỏi thường gặp về quản lý chi tiêu cá nhân",
    description: "Giải đáp các câu hỏi phổ biến khi bắt đầu quản lý chi tiêu cá nhân: ghi chép, phân loại, lập ngân sách và đọc số liệu.",
    eyebrow: "Hỗ trợ",
    h1: "Câu hỏi thường gặp",
    intro: "Một số câu hỏi cơ bản trước khi bắt đầu ghi chép thu chi và xây dựng thói quen quản lý tiền cá nhân.",
    screen: "thu-chi",
    metrics: ["Ghi đều", "Phân loại", "Rà soát"],
    sections: [
      { h: "Tôi nên ghi chép chi tiêu bao lâu một lần?", p: ["Tốt nhất là ngay khi chi tiêu. Nếu không tiện, hãy ghi vào cuối mỗi ngày để không bỏ sót."] },
      { h: "Có cần ghi cả những khoản rất nhỏ không?", p: ["Nên có, vì các khoản nhỏ lặp lại thường chiếm phần đáng kể trong tổng chi tiêu mà ta không để ý."] },
      { h: "Nên chia bao nhiêu nhóm chi tiêu?", p: ["Từ năm đến tám nhóm là hợp lý với đa số người mới bắt đầu. Quá nhiều nhóm sẽ khiến việc ghi chép nặng nề."] },
    ],
    benefits: ["Bắt đầu đơn giản.", "Giảm áp lực phải ghi hoàn hảo.", "Dễ duy trì trong nhiều tuần."],
    faq: [
      { q: "Tôi quên ghi một ngày thì phải làm gì?", a: "Ghi bổ sung khi nhớ lại là hoàn toàn bình thường. Quan trọng hơn là tiếp tục thói quen, không phải ghi hoàn hảo mọi ngày." },
      { q: "Sổ Chi có nhắc tôi ghi chép không?", a: "Tính năng nhắc nhở sẽ được mô tả đầy đủ khi ứng dụng phát hành chính thức." },
      { q: "Làm thế nào để bắt đầu lập ngân sách lần đầu?", a: "Hãy ghi chép ít nhất vài tuần trước. Khi đã có dữ liệu thực tế, bạn sẽ dễ đặt hạn mức phù hợp hơn nhiều so với ước lượng ban đầu." },
    ],
    related: ["/quan-ly-thu-chi", "/lap-ngan-sach", "/blog"],
  },
  {
    kind: "product",
    path: "/gioi-thieu",
    nav: "Giới thiệu",
    title: `Giới thiệu ${APP.name}`,
    description: `${APP.name} là website giới thiệu ứng dụng quản lý chi tiêu cá nhân, tập trung vào ghi chép thu chi, thống kê và lập ngân sách.`,
    eyebrow: "Về sản phẩm",
    h1: `Về ${APP.name}`,
    intro: `${APP.name} được trình bày như một sản phẩm di động giúp người dùng theo dõi thu chi, xem thống kê và lập ngân sách cá nhân trong một trải nghiệm đơn giản.`,
    screen: "thu-chi",
    metrics: ["Rõ ràng", "Tối giản", "Dễ duy trì"],
    sections: [
      { h: "Mục tiêu", p: ["Giúp việc quản lý chi tiêu trở nên đơn giản và rõ ràng, để người dùng chủ động hơn với tiền của mình."] },
      { h: "Giai đoạn hiện tại", p: ["Một số hình ảnh và dữ liệu trên website đang là minh họa trong giai đoạn chuẩn bị phát hành. Khi có ảnh chụp thật và liên kết cửa hàng chính thức, các thành phần này sẽ được thay thế."] },
    ],
    benefits: ["Không thêm claim chưa xác thực.", "Giữ nội dung sản phẩm dễ đọc.", "Chuẩn bị nền tảng SEO trước khi phát hành."],
    related: ["/tinh-nang", "/ung-dung-quan-ly-chi-tieu", "/blog"],
  },
  {
    kind: "product",
    path: "/chinh-sach-bao-mat",
    nav: "Chính sách bảo mật",
    title: `Chính sách bảo mật thông tin | ${APP.name}`,
    description: `Chính sách bảo mật của ${APP.name}: cam kết bảo vệ dữ liệu tài chính cá nhân, quyền riêng tư và minh bạch khi thu thập email nhận thông báo ra mắt.`,
    eyebrow: "Pháp lý & Quyền riêng tư",
    h1: "Chính sách bảo mật thông tin",
    intro: "Dữ liệu thu chi là thông tin nhạy cảm. Sổ Chi coi quyền riêng tư và sự an toàn dữ liệu của bạn là ưu tiên hàng đầu ngay từ giai đoạn chuẩn bị phát hành.",
    screen: "thu-chi",
    metrics: ["Riêng tư", "Minh bạch", "Chủ động"],
    sections: [
      {
        h: "Thu thập thông tin trong giai đoạn tiền phát hành",
        p: [
          "Website Sổ Chi hiện chỉ thu thập địa chỉ email khi bạn chủ động đăng ký nhận thông báo phát hành. Chúng tôi không thu thập thông tin tài khoản ngân hàng, mật khẩu hay danh bạ của bạn qua website.",
          "Email của bạn chỉ được dùng cho mục đích thông báo tiến độ và phát hành ứng dụng. Không gửi thư rác, không chia sẻ hay kinh doanh dữ liệu cho bên thứ ba.",
        ],
      },
      {
        h: "Định hướng bảo vệ quyền riêng tư người dùng",
        p: [
          "Mục tiêu thiết kế của Sổ Chi là tôn trọng tối đa quyền kiểm soát dữ liệu tài chính cá nhân của người dùng, không công khai và không bán dữ liệu dòng tiền.",
          "Các cơ chế kỹ thuật cụ thể về lưu trữ và bảo mật dữ liệu sẽ được công bố chi tiết cùng tài liệu kỹ thuật khi ứng dụng phát hành chính thức trên các kho ứng dụng.",
        ],
        list: [
          "Không yêu cầu liên kết trực tiếp tài khoản ngân hàng trên website.",
          "Tôn trọng quyền sở hữu dữ liệu tài chính của người dùng.",
          "Người dùng có thể yêu cầu hủy thông tin email đã đăng ký bất kỳ lúc nào.",
        ],
      },
      {
        h: "Quyền của người dùng và tiếp nhận phản hồi",
        p: [
          "Bạn có quyền yêu cầu tra cứu, điều chỉnh hoặc hủy thông tin email đã đăng ký bất kỳ lúc nào bằng cách phản hồi trực tiếp thư thông báo nhận được từ chúng tôi.",
        ],
      },
    ],
    benefits: [
      "Không chia sẻ dữ liệu cho đối tác quảng cáo.",
      "Tôn trọng tối đa tính riêng tư của dòng tiền cá nhân.",
      "Thông tin rõ ràng trước khi người dùng cài đặt ứng dụng.",
    ],
    faq: [
      { q: "Sổ Chi có đọc tin nhắn biến động số dư ngân hàng không?", a: "Sổ Chi là ứng dụng ghi chép thu chi thủ công và chủ động. Website và ứng dụng không tự ý truy cập trái phép tin nhắn SMS ngân hàng của người dùng." },
      { q: "Làm thế nào để hủy nhận email thông báo ra mắt?", a: "Khi nhận email thông báo từ Sổ Chi, bạn có thể nhấn liên kết hủy nhận bản tin ở chân trang hoặc phản hồi trực tiếp để được xử lý thủ công." },
    ],
    related: ["/dieu-khoan-su-dung", "/cau-hoi-thuong-gap", "/gioi-thieu"],
  },
  {
    kind: "product",
    path: "/dieu-khoan-su-dung",
    nav: "Điều khoản sử dụng",
    title: `Điều khoản sử dụng dịch vụ | ${APP.name}`,
    description: `Điều khoản sử dụng website và ứng dụng ${APP.name}: quy định về quyền sở hữu trí tuệ, bản quyền nội dung và giới hạn trách nhiệm.`,
    eyebrow: "Pháp lý & Thỏa thuận",
    h1: "Điều khoản sử dụng dịch vụ",
    intro: "Các điều khoản điều chỉnh việc bạn truy cập website giới thiệu sản phẩm và sử dụng ứng dụng Sổ Chi sau khi chính thức phát hành.",
    screen: "thu-chi",
    metrics: ["Bản quyền", "Trách nhiệm", "Minh bạch"],
    sections: [
      {
        h: "Phạm vi áp dụng và đối tượng phục vụ",
        p: [
          "Website này được phát triển nhằm mục đích giới thiệu sản phẩm, cung cấp kiến thức quản lý tài chính cá nhân và tiếp nhận đăng ký nhận thông báo ra mắt cho ứng dụng Sổ Chi.",
          "Bằng việc truy cập website, bạn đồng ý với các điều khoản được quy định tại đây.",
        ],
      },
      {
        h: "Tính chất thông tin và số liệu minh họa",
        p: [
          "Mọi con số, biểu đồ thống kê và màn hình minh họa trên website là tài liệu giới thiệu giao diện sản phẩm trong giai đoạn chuẩn bị phát hành. Chúng không cấu thành lời khuyên đầu tư tài chính chuyên nghiệp hay cam kết lợi nhuận.",
          "Người dùng tự chịu trách nhiệm về các quyết định chi tiêu và quản lý ngân sách cá nhân của mình.",
        ],
      },
      {
        h: "Sở hữu trí tuệ và bản quyền",
        p: [
          "Toàn bộ nhãn hiệu, logo Sổ Chi, thiết kế giao diện, hoạt họa 2.5D và các bài viết trên blog thuộc bản quyền của đội ngũ phát triển Sổ Chi.",
          "Mọi hành vi sao chép, trích dẫn nội dung vì mục đích thương mại mà không có sự đồng ý bằng văn bản đều bị nghiêm cấm.",
        ],
      },
    ],
    benefits: [
      "Quy định rõ ràng quyền lợi và nghĩa vụ hai bên.",
      "Bảo vệ người dùng trước các thông tin sai lệch.",
      "Minh bạch hóa các giới hạn pháp lý và bản quyền.",
    ],
    faq: [
      { q: "Sổ Chi có cung cấp dịch vụ cho vay hay tín dụng không?", a: "Không. Sổ Chi là công cụ quản lý chi tiêu và ngân sách cá nhân, hoàn toàn không cung cấp dịch vụ tín dụng, cho vay hay huy động vốn." },
      { q: "Điều khoản này có thể thay đổi không?", a: "Chúng tôi có thể cập nhật điều khoản khi ứng dụng có tính năng mới. Mọi thay đổi sẽ được công bố công khai trên trang này." },
    ],
    related: ["/chinh-sach-bao-mat", "/cau-hoi-thuong-gap", "/gioi-thieu"],
  },
];

/* ---------- Articles ---------- */

export const ARTICLES: ArticleDef[] = [
  {
    kind: "article",
    path: "/blog/ghi-chep-chi-tieu-hang-ngay",
    slug: "ghi-chep-chi-tieu-hang-ngay",
    nav: "Ghi chép chi tiêu hằng ngày",
    title: "Cách ghi chép chi tiêu hằng ngày mà không bỏ cuộc sau một tuần",
    description: "Hướng dẫn xây dựng thói quen ghi chép chi tiêu hằng ngày: chọn nhóm đơn giản, ghi đúng thời điểm và rà soát cuối tuần.",
    category: "Thói quen tài chính",
    date: "2026-10-12",
    author: "Biên tập Sổ Chi",
    readingMinutes: 5,
    intro: "Ghi chép chi tiêu không cần hoàn hảo. Điều quan trọng là đủ đều để bạn nhìn thấy dòng tiền thật của mình.",
    sections: [
      {
        h: "Bắt đầu với ít nhóm hơn bạn nghĩ",
        p: ["Người mới thường tạo quá nhiều nhóm ngay từ đầu. Việc đó khiến mỗi lần ghi phải suy nghĩ lâu hơn và dễ bỏ cuộc.", "Hãy bắt đầu với vài nhóm lớn như ăn uống, nhà ở, di chuyển, học tập, giải trí và khoản khác."],
      },
      {
        h: "Ghi ngay sau khi phát sinh",
        p: ["Khoảnh khắc tốt nhất để ghi là ngay sau khi thanh toán. Nếu không tiện, hãy đặt một mốc cố định cuối ngày để rà lại ví, tài khoản và trí nhớ."],
        h3: [
          { h: "Không cần ghi quá chi tiết", p: "Tên khoản chi nên đủ để bạn hiểu lại sau này, không cần biến mỗi dòng thành một ghi chú dài." },
          { h: "Giữ số tiền chính xác", p: "Số tiền là dữ liệu quan trọng nhất. Phần mô tả có thể ngắn, nhưng số tiền nên được ghi đúng." },
        ],
      },
      {
        h: "Rà soát vào cuối tuần",
        p: ["Mỗi tuần, hãy xem nhóm nào xuất hiện nhiều nhất. Việc rà soát ngắn giúp bạn điều chỉnh sớm thay vì chờ đến cuối tháng."],
      },
      {
        h: "Đừng tự phạt khi bỏ lỡ một ngày",
        p: ["Thói quen bền vững không đến từ sự hoàn hảo. Nếu quên ghi một ngày, ghi bù khi nhớ lại và tiếp tục. Tính liên tục quan trọng hơn tính chính xác tuyệt đối."],
      },
    ],
    related: ["/blog/lap-ngan-sach-ca-nhan", "/blog/cuoi-thang-tien-di-dau"],
  },
  {
    kind: "article",
    path: "/blog/lap-ngan-sach-ca-nhan",
    slug: "lap-ngan-sach-ca-nhan",
    nav: "Lập ngân sách cá nhân",
    title: "Lập ngân sách cá nhân từ dữ liệu chi tiêu thực tế",
    description: "Cách lập ngân sách cá nhân theo tháng dựa trên dữ liệu đã ghi, thay vì đặt mục tiêu quá lý tưởng và khó duy trì.",
    category: "Ngân sách",
    date: "2026-10-12",
    author: "Biên tập Sổ Chi",
    readingMinutes: 6,
    intro: "Ngân sách tốt không phải là cắt giảm mọi thứ. Nó là cách quyết định trước tiền nên đi đâu và theo dõi khi thực tế thay đổi.",
    sections: [
      {
        h: "Đừng lập ngân sách khi chưa có dữ liệu",
        p: ["Nếu chưa biết tháng trước mình chi bao nhiêu cho ăn uống, di chuyển hoặc mua sắm, ngân sách mới rất dễ chỉ là phỏng đoán.", "Hãy ghi ít nhất vài tuần trước khi đặt hạn mức đầu tiên."],
      },
      {
        h: "Chọn nhóm cần kiểm soát trước",
        p: ["Không phải nhóm nào cũng cần quản lý chặt như nhau. Hãy bắt đầu với nhóm thường vượt dự kiến hoặc nhóm bạn muốn điều chỉnh rõ nhất."],
        list: ["Ăn uống bên ngoài", "Mua sắm cá nhân", "Di chuyển", "Giải trí", "Khoản phát sinh"],
      },
      {
        h: "Điều chỉnh sau mỗi tháng",
        p: ["Một ngân sách quá chặt sẽ khó duy trì. Sau mỗi tháng, hãy điều chỉnh hạn mức dựa trên dữ liệu thật và ưu tiên sống của bạn."],
      },
      {
        h: "Ngân sách không phải là bản án",
        p: ["Nếu vượt hạn mức một nhóm, đó là dữ liệu để suy nghĩ, không phải lý do để bỏ cuộc. Tháng sau có thể tăng hạn mức hoặc điều chỉnh thói quen."],
      },
    ],
    related: ["/blog/ghi-chep-chi-tieu-hang-ngay", "/blog/phuong-phap-50-30-20"],
  },
  {
    kind: "article",
    path: "/blog/doc-bieu-do-chi-tieu",
    slug: "doc-bieu-do-chi-tieu",
    nav: "Đọc biểu đồ chi tiêu",
    title: "Đọc biểu đồ chi tiêu cá nhân như thế nào cho dễ hiểu",
    description: "Hướng dẫn đọc biểu đồ chi tiêu cá nhân: xem tổng quan, so sánh nhóm chi, phát hiện xu hướng và tránh hiểu sai dữ liệu minh họa.",
    category: "Thống kê",
    date: "2026-10-12",
    author: "Biên tập Sổ Chi",
    readingMinutes: 4,
    intro: "Biểu đồ chỉ hữu ích khi nó trả lời một câu hỏi cụ thể: mình đang chi nhiều ở đâu và xu hướng đang thay đổi như thế nào?",
    sections: [
      {
        h: "Xem tổng quan trước chi tiết",
        p: ["Hãy bắt đầu bằng tổng chi trong kỳ. Nếu tổng chi tăng mạnh, biểu đồ nhóm sẽ giúp bạn biết phần tăng đến từ đâu."],
      },
      {
        h: "So sánh tỷ trọng giữa các nhóm",
        p: ["Một nhóm chiếm tỷ trọng lớn không nhất thiết là xấu. Điều cần xem là nhóm đó có phù hợp với ưu tiên hiện tại của bạn hay không."],
      },
      {
        h: "Tìm điểm bất thường",
        p: ["Nếu một nhóm bất ngờ tăng nhiều so với tháng trước, đó là tín hiệu để bạn xem lại giao dịch cụ thể. Đôi khi là khoản phát sinh một lần, đôi khi là thói quen mới hình thành."],
      },
      {
        h: "Dữ liệu minh họa không phải lời khuyên tài chính",
        p: ["Các biểu đồ mẫu trên website chỉ dùng để mô tả cách trình bày dữ liệu. Khi phát hành, dữ liệu thật sẽ đến từ các khoản bạn tự ghi trong ứng dụng."],
      },
    ],
    related: ["/blog/lap-ngan-sach-ca-nhan", "/blog/ghi-chep-chi-tieu-hang-ngay"],
  },
  {
    kind: "article",
    path: "/blog/quan-ly-chi-tieu-sinh-vien",
    slug: "quan-ly-chi-tieu-sinh-vien",
    nav: "Quản lý chi tiêu sinh viên",
    title: "Quản lý chi tiêu cho sinh viên: bắt đầu từ đâu?",
    description: "Gợi ý quản lý chi tiêu cho sinh viên: chia nhóm đơn giản, theo dõi khoản nhỏ và giữ một khoản dự phòng.",
    category: "Tài chính sinh viên",
    date: "2026-10-12",
    author: "Biên tập Sổ Chi",
    readingMinutes: 5,
    intro: "Với sinh viên, quản lý chi tiêu nên nhẹ và dễ làm. Một hệ thống quá phức tạp thường không sống sót qua lịch học và sinh hoạt thật.",
    sections: [
      {
        h: "Chia nhóm theo đời sống hằng ngày",
        p: ["Những nhóm cơ bản như tiền nhà, ăn uống, học tập, di chuyển và giải trí thường đã đủ để thấy bức tranh chung."],
      },
      {
        h: "Theo dõi khoản nhỏ lặp lại",
        p: ["Cà phê, đồ ăn vặt, gửi xe hoặc phí giao hàng có thể nhỏ từng lần nhưng đáng kể khi cộng lại. Những khoản này thường là nơi đầu tiên để tối ưu khi ngân sách eo hẹp."],
      },
      {
        h: "Giữ một khoản dự phòng",
        p: ["Dù ngân sách nhỏ, một khoản dự phòng giúp bạn ít bị động hơn trước chi phí phát sinh như tài liệu, sửa xe hoặc thuốc men."],
      },
      {
        h: "Ghi vào cuối mỗi ngày nếu không ghi được ngay",
        p: ["Với lịch học dày, ghi ngay sau mỗi giao dịch không phải lúc nào cũng tiện. Hãy chọn một mốc cố định cuối ngày để rà soát lại, trước khi đi ngủ chẳng hạn."],
      },
    ],
    related: ["/blog/ghi-chep-chi-tieu-hang-ngay", "/blog/lap-ngan-sach-ca-nhan"],
  },
  {
    kind: "article",
    path: "/blog/phuong-phap-50-30-20",
    slug: "phuong-phap-50-30-20",
    nav: "Phương pháp 50/30/20",
    title: "Phương pháp 50/30/20 là gì và có phù hợp với bạn không?",
    description: "Giới thiệu phương pháp ngân sách 50/30/20: chia thu nhập thành nhu cầu thiết yếu, mong muốn và tiết kiệm. Cách áp dụng đơn giản và khi nào nên điều chỉnh tỷ lệ.",
    category: "Ngân sách",
    date: "2026-10-12",
    author: "Biên tập Sổ Chi",
    readingMinutes: 5,
    intro: "Phương pháp 50/30/20 là một trong những khung ngân sách dễ nhớ nhất. Nhưng nó không phải công thức cứng — điều quan trọng hơn là hiểu ý nghĩa của từng phần.",
    sections: [
      {
        h: "Ba phần của phương pháp 50/30/20",
        p: ["50% cho nhu cầu thiết yếu: tiền thuê nhà, ăn uống cơ bản, đi lại, hóa đơn định kỳ.", "30% cho mong muốn: ăn ngoài, giải trí, mua sắm không thiết yếu.", "20% để tiết kiệm, trả nợ hoặc đầu tư."],
      },
      {
        h: "Khi nào tỷ lệ này không phù hợp",
        p: ["Với người thu nhập thấp hoặc ở thành phố lớn, tiền thuê nhà và sinh hoạt phí có thể chiếm hơn 50% thu nhập. Trong trường hợp đó, việc điều chỉnh tỷ lệ cho thực tế của bạn là bình thường."],
        h3: [
          { h: "Ưu tiên linh hoạt", p: "Tỷ lệ 50/30/20 là điểm xuất phát, không phải quy tắc cố định. Miễn là bạn có ý thức về ba phần này, bạn đã có nền tảng tốt." },
          { h: "Bắt đầu từ dữ liệu thật", p: "Trước khi áp dụng bất kỳ công thức nào, hãy ghi chép thực chi vài tuần để biết tỷ lệ hiện tại của mình đang ở đâu." },
        ],
      },
      {
        h: "Cách áp dụng bằng Sổ Chi",
        p: ["Bạn có thể tạo nhóm chi tiêu tương ứng với ba phần: nhóm thiết yếu, nhóm mong muốn và nhóm tiết kiệm. Sau đó theo dõi hàng tháng để xem tỷ trọng thực tế của mình."],
      },
    ],
    related: ["/blog/lap-ngan-sach-ca-nhan", "/blog/ghi-chep-chi-tieu-hang-ngay"],
  },
  {
    kind: "article",
    path: "/blog/cuoi-thang-tien-di-dau",
    slug: "cuoi-thang-tien-di-dau",
    nav: "Vì sao cuối tháng không biết tiền đi đâu?",
    title: "Vì sao cuối tháng bạn thường không biết tiền đã đi đâu?",
    description: "Phân tích các nguyên nhân phổ biến khiến bạn không biết tiền đi đâu vào cuối tháng, và cách ghi chép thu chi giúp lấy lại bức tranh toàn cảnh.",
    category: "Quản lý chi tiêu",
    date: "2026-10-12",
    author: "Biên tập Sổ Chi",
    readingMinutes: 4,
    intro: "Không phải vì bạn chi tiêu vô trách nhiệm. Thường là vì các khoản nhỏ tích lại trong khi bạn không để ý — và trí nhớ của chúng ta không được tạo ra để theo dõi con số.",
    sections: [
      {
        h: "Những khoản nhỏ tích lại",
        p: ["Một ly cà phê, một chuyến xe, một gói đồ ăn nhỏ — mỗi thứ đều dưới ngưỡng để bạn để ý. Nhưng mỗi tháng, tổng cộng của chúng có thể đáng ngạc nhiên.", "Đây không phải vấn đề của ý chí, mà là vấn đề của tầm nhìn. Khi không ghi, bạn không có dữ liệu để nhìn lại."],
      },
      {
        h: "Chi tiêu cảm xúc không để lại dấu vết rõ ràng",
        p: ["Mua đồ vì stress, mua đồ vì buồn, mua đồ vì thấy giảm giá — những khoản này thường không nằm trong kế hoạch và dễ bị hợp lý hóa ngay lúc đó.", "Khi ghi chép đều, bạn bắt đầu thấy các mẫu hình này xuất hiện rõ hơn."],
      },
      {
        h: "Không có mốc so sánh",
        p: ["Nếu không biết tháng trước mình chi bao nhiêu, rất khó để biết tháng này có bình thường hay không. Ghi chép tạo ra điểm tham chiếu để bạn tự so sánh."],
      },
      {
        h: "Bắt đầu từ bước nhỏ nhất",
        p: ["Không cần ghi mọi thứ từ ngày đầu. Hãy bắt đầu bằng cách ghi những khoản bạn vẫn nhớ cuối ngày. Một tuần đủ để thấy sự khác biệt."],
      },
    ],
    related: ["/blog/ghi-chep-chi-tieu-hang-ngay", "/blog/phuong-phap-50-30-20"],
  },
];

/* ---------- Blog index ---------- */

export const BLOG_INDEX: BlogIndexDef = {
  kind: "blog",
  path: "/blog",
  nav: "Blog",
  title: `Blog quản lý chi tiêu cá nhân — ${APP.name}`,
  description: `Các bài viết hướng dẫn quản lý chi tiêu cá nhân, ghi chép thu chi, đọc thống kê và lập ngân sách thực tế từ ${APP.name}.`,
};

/* ---------- Route helpers ---------- */

export const ALL_PAGES = [...PRODUCT_PAGES, BLOG_INDEX, ...ARTICLES];
export const ROUTE_PATHS = ["/", ...ALL_PAGES.map((page) => page.path)];

export function getRoute(path: string): RouteDef | undefined {
  if (path === BLOG_INDEX.path) return BLOG_INDEX;
  return [...PRODUCT_PAGES, ...ARTICLES].find((page) => page.path === path);
}

export function getPageMeta(route: RouteDef | undefined) {
  return route
    ? { title: `${route.title} | ${APP.name}`, description: route.description }
    : {
        title: `${APP.name} — Ứng dụng quản lý chi tiêu cá nhân`,
        description: "Ứng dụng quản lý chi tiêu cá nhân: theo dõi thu chi, xem thống kê tài chính và lập ngân sách trong một trải nghiệm đơn giản.",
      };
}

export function getCanonicalPath(route: RouteDef | undefined, path: string) {
  return route?.path ?? path;
}

export function getStructuredData(route: RouteDef | undefined, origin: string) {
  if (!route) {
    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          "@id": `${origin}/#website`,
          name: APP.name,
          url: origin,
          inLanguage: "vi-VN",
          description: "Ứng dụng quản lý chi tiêu cá nhân tối giản: ghi chép thu chi nhanh gọn trong 3 giây, xem thống kê trực quan và quản lý ngân sách chủ động.",
        },
        {
          "@type": "Organization",
          "@id": `${origin}/#organization`,
          name: APP.name,
          url: origin,
          logo: {
            "@type": "ImageObject",
            url: `${origin}/favicon.svg`,
          },
        },
        {
          "@type": "SoftwareApplication",
          "@id": `${origin}/#software`,
          name: APP.name,
          applicationCategory: "FinanceApplication",
          description: "Ghi chép thu chi 3 giây, biểu đồ thống kê trực quan và quản lý ngân sách cá nhân rõ ràng.",
          url: origin,
        },
      ],
    };
  }

  const breadcrumb = {
    "@type": "BreadcrumbList",
    "@id": `${origin}${route.path}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Trang chủ", item: `${origin}/` },
      { "@type": "ListItem", position: 2, name: route.kind === "article" ? "Blog" : route.nav, item: `${origin}${route.kind === "article" ? "/blog" : route.path}` },
      ...(route.kind === "article" ? [{ "@type": "ListItem", position: 3, name: route.nav, item: `${origin}${route.path}` }] : []),
    ],
  };

  if (route.kind === "blog") {
    return {
      "@context": "https://schema.org",
      "@graph": [
        breadcrumb,
        {
          "@type": "CollectionPage",
          "@id": `${origin}/blog#collection`,
          name: route.title,
          description: route.description,
          url: `${origin}/blog`,
          inLanguage: "vi-VN",
        },
      ],
    };
  }

  if (route.kind === "article") {
    return {
      "@context": "https://schema.org",
      "@graph": [
        breadcrumb,
        {
          "@type": "Article",
          "@id": `${origin}${route.path}#article`,
          headline: route.title,
          description: route.description,
          image: `${origin}/og-image.jpg`,
          datePublished: route.date,
          dateModified: route.updatedAt ?? route.date,
          inLanguage: "vi-VN",
          author: {
            "@type": "Person",
            name: route.author,
          },
          publisher: {
            "@type": "Organization",
            name: APP.name,
            logo: {
              "@type": "ImageObject",
              url: `${origin}/favicon.svg`,
            },
          },
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `${origin}${route.path}`,
          },
        },
      ],
    };
  }

  // Product / Legal page — breadcrumb + optional FAQPage
  const schemas: object[] = [breadcrumb];
  if (route.faq && route.faq.length > 0) {
    schemas.push({
      "@type": "FAQPage",
      "@id": `${origin}${route.path}#faq`,
      mainEntity: route.faq.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    });
  }
  return {
    "@context": "https://schema.org",
    "@graph": schemas,
  };
}

/* ---------- Shared components ---------- */

function ReadingMeta({ article }: { article: ArticleDef }) {
  return (
    <div className="page-meta-strip">
      <p><span>Tác giả</span>{article.author}</p>
      <p><span>Ngày đăng</span><time dateTime={article.date}>{formatDate(article.date)}</time></p>
      {article.updatedAt && article.updatedAt !== article.date && (
        <p><span>Cập nhật</span><time dateTime={article.updatedAt}>{formatDate(article.updatedAt)}</time></p>
      )}
      <p><span>Thời lượng</span>{article.readingMinutes} phút đọc</p>
      <p><span>Chuyên mục</span>{article.category}</p>
    </div>
  );
}

function FaqSection({ items }: { items: FaqItem[] }) {
  return (
    <section className="faq-section scroll-mt-28" id="faq">
      <span className="section-kicker">Câu hỏi thường gặp</span>
      <h2>Bạn có thắc mắc?</h2>
      <dl className="faq-list">
        {items.map((item) => (
          <div key={item.q} className="faq-item">
            <dt>{item.q}</dt>
            <dd>{item.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/* ---------- Product page ---------- */

/* ---------- Product Pages: Specialized 2.5D Visual Implementations ---------- */

function ProductHero({ page, screen, perspective }: { page: ProductPageDef; screen: PhoneScreen; perspective: "hero" | "perspective-left" | "perspective-right" }) {
  const feature = page.featureId ? featureById[page.featureId] : featureById[screen === "thong-ke" ? "thong-ke" : screen === "ngan-sach" ? "ngan-sach" : "thu-chi"];

  return (
    <header className="product-page-hero relative isolate overflow-hidden bg-ink px-6 pb-20 pt-32 text-paper md:px-10 md:pb-28">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_75%_35%,#2a211c_0%,#0c0a09_62%)]" />
      <div className="absolute right-[-18vw] top-20 -z-10 size-[min(90vw,680px)] rounded-full border border-paper/10" aria-hidden>
        <span className="absolute inset-[18%] rounded-full border border-vermilion/25" />
        <span className="absolute inset-[36%] rounded-full bg-vermilion/80 blur-[1px]" />
      </div>
      <div className="mx-auto grid max-w-[1300px] items-center gap-14 lg:grid-cols-[1.1fr_auto]">
        <div>
          <nav aria-label="Đường dẫn" className="breadcrumb">
            <Link href="/">Trang chủ</Link>
            <span aria-hidden />
            <span>{page.nav}</span>
          </nav>
          <p className="mt-12 text-[11px] uppercase tracking-[0.28em] text-paper/55">{page.eyebrow}</p>
          <h1 className="mt-5 max-w-4xl font-display text-[clamp(2.15rem,6.2vw,5.5rem)] font-light leading-[1.08] [text-wrap:balance]">{page.h1}</h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-paper/70">{page.intro}</p>
          <div className="mt-9 flex flex-wrap gap-3 text-xs uppercase tracking-[0.18em] text-paper/65">
            {page.metrics.map((metric) => <span key={metric} className="rounded-full border border-paper/20 px-4 py-2">{metric}</span>)}
          </div>
        </div>
        <figure className="product-hero-phone justify-self-center">
          <DeviceMockup
            screen={screen}
            src={feature.shot}
            alt={`${page.nav} trong ${APP.name}`}
            perspective={perspective}
            w="clamp(220px, 25vw, 320px)"
          />
          <figcaption className="mt-5 text-center text-xs text-paper/45">Màn hình minh họa trong giai đoạn chuẩn bị phát hành.</figcaption>
        </figure>
      </div>
    </header>
  );
}

function ProductContentBody({ page }: { page: ProductPageDef }) {
  const related = page.related.map((path) => ALL_PAGES.find((item) => item.path === path)).filter(Boolean) as RouteDef[];
  const tocItems = [
    { href: "#mo-phong", label: "00 Trực quan" },
    ...page.sections.map((s, i) => ({ href: `#muc-${i + 1}`, label: `0${i + 1} ${s.h}` })),
    { href: "#loi-ich", label: "Lợi ích" },
    ...(page.faq && page.faq.length > 0 ? [{ href: "#faq", label: "Câu hỏi thường gặp" }] : []),
  ];

  return (
    <section className="washi px-6 py-20 md:px-10 md:py-28">
      <div className="mx-auto grid max-w-[1200px] gap-8 lg:gap-14 lg:grid-cols-[260px_minmax(0,780px)] lg:justify-between">
        {/* Mobile Collapsible TOC */}
        <details className="block lg:hidden rounded-2xl border border-ink/15 bg-paper/60 p-4 shadow-sm group">
          <summary className="flex cursor-pointer items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-ink/70 select-none">
            <span className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-vermilion" />
              Mục lục nội dung ({tocItems.length} mục)
            </span>
            <span className="text-xs transition-transform duration-200 group-open:rotate-180">▼</span>
          </summary>
          <nav aria-label="Mục lục (di động)" className="mt-3 divide-y divide-ink/10 border-t border-ink/10 pt-2 text-sm">
            {tocItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="flex min-h-11 items-center py-2 text-ink/80 transition-colors hover:text-vermilion"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </details>

        {/* Desktop Sticky TOC */}
        <aside className="secondary-toc hidden lg:block">
          <p>Trong trang</p>
          <nav aria-label="Mục lục">
            {tocItems.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
          </nav>
        </aside>
        <article className="secondary-article">
          {page.sections.map((section, index) => (
            <section id={`muc-${index + 1}`} key={section.h} className="scroll-mt-28">
              <span className="section-kicker">0{index + 1}</span>
              <h2>{section.h}</h2>
              {section.p.map((text) => <p key={text}>{text}</p>)}
              {section.list && (
                <ul>
                  {section.list.map((item) => <li key={item}>{item}</li>)}
                </ul>
              )}
            </section>
          ))}

          <section id="loi-ich" className="scroll-mt-28">
            <span className="section-kicker">Lợi ích</span>
            <h2>Khi dùng đều đặn, dữ liệu trở nên hữu ích hơn</h2>
            <div className="benefit-grid">
              {page.benefits.map((benefit, index) => (
                <p key={benefit}><span>0{index + 1}</span>{benefit}</p>
              ))}
            </div>
          </section>

          {page.faq && page.faq.length > 0 && <FaqSection items={page.faq} />}

          <aside className="cta-panel">
            <p>Áp dụng với {APP.name}</p>
            <h2>Hiểu rõ tiền của bạn. Bắt đầu từ những khoản nhỏ nhất.</h2>
            <Link
              href="/#tai-ung-dung"
              onClick={(e) => {
                if (window.innerWidth < 768) {
                  e.preventDefault();
                  openPrelaunchSheet("product_page_cta");
                }
              }}
            >
              {PRODUCT_CTA_LABEL} <span aria-hidden>→</span>
            </Link>
          </aside>
        </article>
      </div>

      <RelatedLinks title="Liên kết liên quan" items={related} />
    </section>
  );
}

function StatisticsProductPage({ page }: { page: ProductPageDef }) {
  return (
    <main className="min-h-svh bg-paper text-ink overflow-x-hidden">
      <ProductHero page={page} screen="thong-ke" perspective="perspective-right" />
      <div id="mo-phong" className="scroll-mt-20">
        <StatisticsShowcase />
        <AnalyticsPerspectiveStage />
      </div>
      <DataExpansionSequence />
      <StatisticsVisualStories page={page} />
    </main>
  );
}

function TransactionProductPage({ page }: { page: ProductPageDef }) {
  return (
    <main className="min-h-svh bg-paper text-ink">
      <ProductHero page={page} screen="thu-chi" perspective="perspective-left" />
      <div id="mo-phong" className="scroll-mt-20">
        <TransactionFlowShowcase />
      </div>
      <ProductContentBody page={page} />
    </main>
  );
}

function BudgetProductPage({ page }: { page: ProductPageDef }) {
  return (
    <main className="min-h-svh bg-paper text-ink">
      <ProductHero page={page} screen="ngan-sach" perspective="perspective-right" />
      <div id="mo-phong" className="scroll-mt-20">
        <BudgetShowcase />
      </div>
      <ProductContentBody page={page} />
    </main>
  );
}

function FeaturesProductPage({ page }: { page: ProductPageDef }) {
  return (
    <main className="min-h-svh bg-paper text-ink">
      <ProductHero page={page} screen="thu-chi" perspective="hero" />
      <div id="mo-phong" className="scroll-mt-20">
        <FeatureEcosystemShowcase />
      </div>
      <ProductContentBody page={page} />
    </main>
  );
}

function GenericProductPage({ page }: { page: ProductPageDef }) {
  return (
    <main className="min-h-svh bg-paper text-ink">
      <ProductHero page={page} screen={page.screen} perspective="hero" />
      <ProductContentBody page={page} />
    </main>
  );
}

function ProductPage({ page }: { page: ProductPageDef }) {
  if (page.path === "/thong-ke-tai-chinh") return <StatisticsProductPage page={page} />;
  if (page.path === "/quan-ly-thu-chi") return <TransactionProductPage page={page} />;
  if (page.path === "/lap-ngan-sach") return <BudgetProductPage page={page} />;
  if (page.path === "/tinh-nang") return <FeaturesProductPage page={page} />;
  return <GenericProductPage page={page} />;
}


/* ---------- Blog index ---------- */

const TOPIC_DESCRIPTIONS: Record<string, string> = {
  "Thói quen tài chính": "Xây dựng thói quen ghi chép và quản lý tiền bền vững qua từng ngày.",
  "Ngân sách": "Cách lập và duy trì ngân sách cá nhân thực tế theo tháng.",
  "Thống kê": "Đọc và hiểu dữ liệu chi tiêu từ biểu đồ một cách rõ ràng.",
  "Tài chính sinh viên": "Quản lý tài chính cá nhân trong giai đoạn sinh viên, ngân sách nhỏ.",
  "Quản lý chi tiêu": "Tổng quan về theo dõi và kiểm soát dòng tiền hằng ngày.",
};

function BlogIndex() {
  const topics = ["Tất cả", ...Array.from(new Set(ARTICLES.map((article) => article.category)))];
  const [topic, setTopic] = useState("Tất cả");
  const visible = useMemo(() => topic === "Tất cả" ? ARTICLES : ARTICLES.filter((article) => article.category === topic), [topic]);
  const featured = ARTICLES[0];

  return (
    <main className="min-h-svh bg-paper text-ink">
      <header className="blog-hero bg-ink px-6 pb-20 pt-32 text-paper md:px-10 md:pb-28">
        <div className="mx-auto max-w-[1300px]">
          <nav aria-label="Đường dẫn" className="breadcrumb">
            <Link href="/">Trang chủ</Link>
            <span aria-hidden />
            <span>Blog</span>
          </nav>
          <p className="mt-12 text-[11px] uppercase tracking-[0.28em] text-paper/55">Góc kiến thức</p>
          <h1 className="mt-5 max-w-4xl font-display text-[clamp(3rem,8vw,7rem)] font-light leading-[1.02]">Blog quản lý chi tiêu</h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-paper/70">Các bài viết ngắn, thực tế và có thể áp dụng ngay cho việc ghi chép thu chi, đọc số liệu và lập ngân sách.</p>
          <div className="blog-topic-pills" aria-label="Chủ đề bài viết">
            {topics.slice(1).map((t) => (
              <span key={t} className="blog-topic-pill">{t}</span>
            ))}
          </div>
        </div>
      </header>

      <section className="washi px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-[1200px]">
          {/* Featured article */}
          <article className="featured-article">
            <div>
              <p className="section-kicker">Bài nổi bật</p>
              <h2>{featured.title}</h2>
              <p>{featured.description}</p>
              <div className="blog-article-meta">
                <span>{featured.category}</span>
                <span aria-hidden>·</span>
                <span>{featured.readingMinutes} phút đọc</span>
              </div>
            </div>
            <Link href={featured.path}>Đọc bài viết <span aria-hidden>→</span></Link>
          </article>

          {/* Topic filter */}
          <div className="topic-filter" role="tablist" aria-label="Lọc chủ đề blog">
            {topics.map((item) => (
              <button key={item} type="button" role="tab" aria-selected={topic === item} onClick={() => setTopic(item)}>
                {item}
              </button>
            ))}
          </div>

          {/* Topic description */}
          {topic !== "Tất cả" && TOPIC_DESCRIPTIONS[topic] && (
            <p className="blog-topic-desc">{TOPIC_DESCRIPTIONS[topic]}</p>
          )}

          {/* Article list */}
          <div className="article-list" role="feed" aria-label={`Bài viết về ${topic}`}>
            {visible.map((article) => (
              <Link key={article.path} href={article.path} className="article-row">
                <span>{article.category}</span>
                <strong>{article.title}</strong>
                <small>{article.readingMinutes} phút đọc · <time dateTime={article.date}>{formatDate(article.date)}</time></small>
              </Link>
            ))}
          </div>

          {/* Feature CTA */}
          <aside className="blog-feature-cta">
            <div>
              <p className="section-kicker">Áp dụng ngay</p>
              <h2>Đưa kiến thức vào thực hành với {APP.name}</h2>
            </div>
            <Link href="/tinh-nang">Khám phá tính năng <span aria-hidden>→</span></Link>
          </aside>
        </div>
      </section>
    </main>
  );
}

/* ---------- Article page ---------- */

function ArticlePage({ article }: { article: ArticleDef }) {
  const related = article.related.map((path) => ARTICLES.find((item) => item.path === path)).filter(Boolean) as ArticleDef[];

  // Find contextual product links not already in related
  const contextualProductPaths = ["/quan-ly-thu-chi", "/thong-ke-tai-chinh", "/lap-ngan-sach", "/tinh-nang"];
  const contextualProductLinks = contextualProductPaths
    .filter((p) => !article.related.includes(p))
    .map((p) => PRODUCT_PAGES.find((pp) => pp.path === p))
    .filter(Boolean)
    .slice(0, 2) as ProductPageDef[];

  return (
    <main className="min-h-svh bg-paper text-ink">
      <header className="article-hero bg-ink px-6 pb-20 pt-32 text-paper md:px-10 md:pb-28">
        <div className="mx-auto max-w-[1100px]">
          <nav aria-label="Đường dẫn" className="breadcrumb">
            <Link href="/">Trang chủ</Link>
            <span aria-hidden />
            <Link href="/blog">Blog</Link>
            <span aria-hidden />
            <span>{article.nav}</span>
          </nav>
          <p className="mt-12 text-[11px] uppercase tracking-[0.28em] text-paper/55">{article.category}</p>
          <h1 className="mt-5 font-display text-[clamp(2.15rem,6.2vw,5.5rem)] font-light leading-[1.08] [text-wrap:balance]">{article.title}</h1>
          <p className="mt-8 max-w-3xl text-lg leading-relaxed text-paper/70">{article.intro}</p>
          <ReadingMeta article={article} />
        </div>
      </header>

      <div className="washi px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto grid max-w-[1200px] gap-8 lg:gap-14 lg:grid-cols-[260px_minmax(0,760px)] lg:justify-between">
          {/* Mobile Collapsible TOC */}
          <details className="block lg:hidden rounded-2xl border border-ink/15 bg-paper/60 p-4 shadow-sm group">
            <summary className="flex cursor-pointer items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-ink/70 select-none">
              <span className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-vermilion" />
                Mục lục bài viết ({article.sections.length} phần)
              </span>
              <span className="text-xs transition-transform duration-200 group-open:rotate-180">▼</span>
            </summary>
            <nav aria-label="Mục lục bài viết (di động)" className="mt-3 divide-y divide-ink/10 border-t border-ink/10 pt-2 text-sm">
              {article.sections.map((section, index) => (
                <a
                  key={section.h}
                  href={`#muc-${index + 1}`}
                  className="flex min-h-11 items-center py-2 text-ink/80 transition-colors hover:text-vermilion"
                >
                  <span className="font-mono text-xs text-ink/40 mr-2.5">0{index + 1}</span>
                  <span>{section.h}</span>
                </a>
              ))}
            </nav>
            {contextualProductLinks.length > 0 && (
              <div className="mt-3 border-t border-ink/10 pt-3">
                <p className="text-[10px] uppercase tracking-wider text-ink/50 font-medium">Tính năng liên quan</p>
                <nav aria-label="Tính năng liên quan" className="mt-1 flex flex-wrap gap-2">
                  {contextualProductLinks.map((p) => (
                    <Link
                      key={p.path}
                      href={p.path}
                      className="min-h-11 inline-flex items-center rounded-full border border-ink/15 px-3.5 py-1.5 text-xs text-ink/80 hover:border-vermilion hover:text-vermilion"
                    >
                      {p.nav} →
                    </Link>
                  ))}
                </nav>
              </div>
            )}
          </details>

          {/* Desktop Sticky TOC */}
          <aside className="secondary-toc hidden lg:block">
            <p>Trong bài viết</p>
            <nav aria-label="Mục lục bài viết">
              {article.sections.map((section, index) => <a key={section.h} href={`#muc-${index + 1}`}>0{index + 1} {section.h}</a>)}
            </nav>
            {contextualProductLinks.length > 0 && (
              <div className="toc-feature-links">
                <p>Tính năng liên quan</p>
                <nav aria-label="Tính năng liên quan">
                  {contextualProductLinks.map((p) => (
                    <Link key={p.path} href={p.path}>{p.nav} <span aria-hidden>→</span></Link>
                  ))}
                </nav>
              </div>
            )}
          </aside>

          <article className="secondary-article article-body">
            <p className="article-lede">{article.intro}</p>
            {article.sections.map((section, index) => (
              <section id={`muc-${index + 1}`} key={section.h} className="scroll-mt-28">
                <h2>{section.h}</h2>
                {section.p.map((text) => <p key={text}>{text}</p>)}
                {section.h3?.map((item) => (
                  <div key={item.h}>
                    <h3>{item.h}</h3>
                    <p>{item.p}</p>
                  </div>
                ))}
                {section.list && <ul>{section.list.map((item) => <li key={item}>{item}</li>)}</ul>}
              </section>
            ))}

            <aside className="cta-panel">
              <p>Áp dụng với {APP.name}</p>
              <h2>Biến bài học thành thói quen quản lý chi tiêu hằng ngày.</h2>
              <Link href="/tinh-nang">Xem tính năng phù hợp <span aria-hidden>→</span></Link>
            </aside>
          </article>
        </div>

        <RelatedLinks title="Bài viết liên quan" items={related} />
      </div>
    </main>
  );
}

/* ---------- Shared ---------- */

function RelatedLinks({ title, items }: { title: string; items: RouteDef[] }) {
  if (!items.length) return null;
  return (
    <nav aria-label={title} className="related-links mx-auto mt-24 max-w-[1200px]">
      <div>
        <p className="section-kicker">Khám phá thêm</p>
        <h2>{title}</h2>
      </div>
      <ul>
        {items.map((item, index) => (
          <li key={item.path}>
            <Link href={item.path}>
              <span>0{index + 1}</span>
              {item.nav}
              <i aria-hidden>→</i>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(date));
}

export function NotFoundPage({ path }: { path: string }) {
  return (
    <main className="min-h-svh bg-ink text-paper flex items-center justify-center px-6 py-32">
      <div className="mx-auto max-w-xl text-center">
        <p className="flex items-center justify-center gap-3 text-[11px] font-medium uppercase tracking-[0.28em] text-paper/60">
          <span className="font-display text-base text-vermilion">404</span>
          <span className="h-px w-8 bg-current opacity-40" />
          Lỗi điều hướng
        </p>
        <h1 className="mt-6 font-display text-[clamp(2.5rem,6vw,4.5rem)] font-light leading-[1.08]">
          Không tìm thấy trang
        </h1>
        <p className="mt-5 text-base leading-relaxed text-paper/70">
          Đường dẫn <code className="rounded bg-paper/10 px-2 py-0.5 text-vermilion text-sm">{path}</code> không tồn tại hoặc đã được thay đổi.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex min-h-12 items-center rounded-full bg-vermilion px-7 py-3 text-xs uppercase tracking-[0.16em] font-medium text-paper shadow-lg shadow-vermilion/30 transition-transform active:scale-95"
          >
            ← Về trang chủ
          </Link>
          <Link
            href="/tinh-nang"
            className="inline-flex min-h-12 items-center rounded-full border border-paper/20 px-7 py-3 text-xs uppercase tracking-[0.16em] text-paper/80 transition-colors hover:border-paper hover:text-paper"
          >
            Xem tính năng
          </Link>
          <Link
            href="/blog"
            className="inline-flex min-h-12 items-center rounded-full border border-paper/20 px-7 py-3 text-xs uppercase tracking-[0.16em] text-paper/80 transition-colors hover:border-paper hover:text-paper"
          >
            Đọc Blog
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function ContentPage({ page }: { page: RouteDef }) {
  if (page.kind === "blog") return <BlogIndex />;
  if (page.kind === "article") return <ArticlePage article={page} />;
  return <ProductPage page={page} />;
}

