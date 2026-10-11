import { Link } from "./router";
import { APP, FEATURES } from "./config";

export type PageDef = {
  path: string;
  nav: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  sections: { h: string; p: string[]; list?: string[] }[];
  related: string[];
};

export const PAGES: PageDef[] = [
  {
    path: "/ung-dung-quan-ly-chi-tieu",
    nav: "Ứng dụng quản lý chi tiêu",
    title: "Ứng dụng quản lý chi tiêu cá nhân: chọn thế nào cho phù hợp",
    description: "Cách chọn ứng dụng quản lý chi tiêu cá nhân: những tiêu chí đáng cân nhắc và thói quen giúp bạn dùng đều đặn.",
    h1: "Ứng dụng quản lý chi tiêu cá nhân",
    intro: "Quản lý chi tiêu bắt đầu từ việc biết rõ tiền của mình đi đâu. Một ứng dụng tốt giúp việc ghi chép nhẹ nhàng đến mức bạn không còn muốn bỏ qua.",
    sections: [
      {
        h: "Vì sao nên dùng ứng dụng thay cho sổ tay",
        p: [
          "Sổ tay và bảng tính đều dùng được, nhưng chúng đòi hỏi nhiều bước hơn mỗi lần ghi. Khi việc ghi chép tốn công, người ta thường bỏ dở sau vài tuần.",
          "Ứng dụng trên điện thoại luôn ở trong túi, nên bạn có thể ghi ngay sau khi chi tiêu, lúc còn nhớ chính xác con số.",
        ],
      },
      {
        h: "Những tiêu chí nên cân nhắc",
        p: ["Trước khi cài đặt, hãy tự hỏi mình cần gì nhất ở một ứng dụng:"],
        list: [
          "Ghi một khoản thu hoặc chi nhanh, ít thao tác.",
          "Phân loại theo nhóm rõ ràng như ăn uống, nhà ở, di chuyển.",
          "Có thống kê dễ đọc để nhìn ra xu hướng theo tuần, theo tháng.",
          "Có thể đặt hạn mức cho từng nhóm chi tiêu.",
          "Chính sách quyền riêng tư minh bạch về dữ liệu của bạn.",
        ],
      },
      {
        h: "Giữ thói quen ghi chép lâu dài",
        p: [
          "Điều quan trọng không phải là ghi hoàn hảo mà là ghi đều. Hãy chọn một thời điểm cố định trong ngày, chẳng hạn trước khi đi ngủ, để rà lại các khoản đã chi.",
          "Sau vài tuần, bạn sẽ thấy rõ những khoản chi lặp lại và có cơ sở để điều chỉnh.",
        ],
      },
    ],
    related: ["/quan-ly-thu-chi", "/lap-ngan-sach"],
  },
  {
    path: "/quan-ly-thu-chi",
    nav: "Quản lý thu chi",
    title: "Quản lý thu chi hằng ngày: cách ghi chép đơn giản",
    description: "Hướng dẫn quản lý thu chi cá nhân hằng ngày: phân loại khoản thu, khoản chi và rà soát cuối tuần.",
    h1: "Quản lý thu chi hằng ngày",
    intro: "Quản lý thu chi là nền tảng của mọi kế hoạch tài chính cá nhân. Chỉ cần ba bước đơn giản là bạn đã có một bức tranh rõ ràng.",
    sections: [
      {
        h: "Bước 1: Ghi mọi khoản, dù nhỏ",
        p: ["Những khoản nhỏ như cà phê, gửi xe hay phí chuyển khoản thường bị quên, nhưng cộng lại có thể đáng kể. Hãy ghi chúng ngay khi phát sinh."],
      },
      {
        h: "Bước 2: Phân loại nhất quán",
        p: ["Dùng một bộ nhóm cố định và không quá nhiều. Với đa số người, từ năm đến tám nhóm là đủ để phản ánh thực tế mà vẫn dễ theo dõi."],
        list: ["Ăn uống", "Nhà ở và hóa đơn", "Di chuyển", "Học tập", "Giải trí", "Khoản khác"],
      },
      {
        h: "Bước 3: Rà soát mỗi tuần",
        p: [
          "Dành mười phút vào cuối tuần để xem lại các khoản chi. Hãy tự hỏi khoản nào thật sự cần thiết và khoản nào có thể cắt giảm.",
          "Thu nhập không cố định, như làm tự do hoặc làm thêm, cũng nên được ghi lại để bạn thấy mức dao động giữa các tháng.",
        ],
      },
    ],
    related: ["/ung-dung-quan-ly-chi-tieu", "/lap-ngan-sach"],
  },
  {
    path: "/lap-ngan-sach",
    nav: "Lập ngân sách",
    title: "Lập ngân sách cá nhân: từ con số thực tế đến kế hoạch",
    description: "Cách lập ngân sách cá nhân hằng tháng dựa trên chi tiêu thực tế, kèm phương pháp phân bổ thu nhập dễ áp dụng.",
    h1: "Lập ngân sách cá nhân",
    intro: "Ngân sách không phải là sự cắt giảm, mà là quyết định trước xem tiền của bạn nên đi đâu. Bắt đầu từ chính những con số bạn đã chi.",
    sections: [
      {
        h: "Bắt đầu từ dữ liệu thực tế",
        p: ["Hãy ghi chép chi tiêu ít nhất một tháng trước khi đặt hạn mức. Ngân sách dựa trên thói quen thật sẽ dễ theo hơn nhiều so với con số lý tưởng."],
      },
      {
        h: "Một cách phân bổ để tham khảo",
        p: [
          "Quy tắc 50/30/20 là một gợi ý phổ biến: khoảng một nửa thu nhập cho nhu cầu thiết yếu, một phần ba cho mong muốn cá nhân và phần còn lại để tiết kiệm. Đây chỉ là điểm xuất phát, hãy điều chỉnh theo hoàn cảnh của bạn.",
        ],
      },
      {
        h: "Theo dõi và điều chỉnh",
        p: [
          "Đặt hạn mức cho từng nhóm và xem mức đã dùng giữa tháng. Nếu một nhóm liên tục vượt, hãy xem lại hạn mức hoặc thói quen chi tiêu ở nhóm đó.",
          "Với sinh viên, ngân sách đơn giản gồm tiền nhà, ăn uống, học tập và một khoản nhỏ dự phòng đã là một khởi đầu tốt.",
        ],
      },
    ],
    related: ["/quan-ly-thu-chi", "/ung-dung-quan-ly-chi-tieu"],
  },
  {
    path: "/cau-hoi-thuong-gap",
    nav: "Câu hỏi thường gặp",
    title: "Câu hỏi thường gặp về quản lý chi tiêu cá nhân",
    description: "Giải đáp những câu hỏi phổ biến khi bắt đầu quản lý chi tiêu cá nhân: ghi chép, phân loại và lập ngân sách.",
    h1: "Câu hỏi thường gặp",
    intro: "Những thắc mắc phổ biến khi mới bắt đầu quản lý chi tiêu cá nhân.",
    sections: [
      { h: "Tôi nên ghi chép chi tiêu bao lâu một lần?", p: ["Tốt nhất là ngay khi chi tiêu. Nếu không tiện, hãy ghi vào cuối mỗi ngày để không bỏ sót."] },
      { h: "Có cần ghi cả những khoản rất nhỏ không?", p: ["Nên có, vì các khoản nhỏ lặp lại thường chiếm phần đáng kể trong tổng chi tiêu mà ta không để ý."] },
      { h: "Nên chia bao nhiêu nhóm chi tiêu?", p: ["Từ năm đến tám nhóm là hợp lý. Quá nhiều nhóm sẽ khiến việc ghi chép nặng nề."] },
      { h: "Bao lâu thì thấy hiệu quả?", p: ["Thường sau khoảng một tháng ghi chép đều, bạn đã có đủ dữ liệu để nhìn ra xu hướng và lập ngân sách thực tế."] },
    ],
    related: ["/quan-ly-thu-chi", "/lap-ngan-sach"],
  },
  {
    path: "/gioi-thieu",
    nav: "Giới thiệu",
    title: `Giới thiệu ${APP.name}`,
    description: `${APP.name} là ứng dụng quản lý chi tiêu cá nhân giúp ghi chép thu chi, xem thống kê và lập ngân sách.`,
    h1: `Về ${APP.name}`,
    intro: `${APP.name} là ứng dụng di động giúp bạn theo dõi thu chi, xem thống kê và lập ngân sách cá nhân.`,
    sections: [
      { h: "Mục tiêu", p: ["Giúp việc quản lý chi tiêu trở nên đơn giản và rõ ràng, để bạn chủ động hơn với tiền của mình."] },
    ],
    related: ["/tinh-nang", "/ung-dung-quan-ly-chi-tieu"],
  },
];

const FEATURES_PAGE: PageDef = {
  path: "/tinh-nang",
  nav: "Tính năng",
  title: `Tính năng của ${APP.name}`,
  description: `Các tính năng chính của ${APP.name}: theo dõi thu chi, thống kê tài chính và quản lý ngân sách.`,
  h1: "Tính năng",
  intro: "Một ứng dụng, ba khả năng chính cho việc quản lý chi tiêu hằng ngày.",
  sections: FEATURES.map((f) => ({ h: f.title, p: [f.desc] })),
  related: ["/quan-ly-thu-chi", "/lap-ngan-sach"],
};

export const ALL_PAGES = [FEATURES_PAGE, ...PAGES];

export default function ContentPage({ page }: { page: PageDef }) {
  const related = page.related.map((p) => ALL_PAGES.find((x) => x.path === p)).filter(Boolean) as PageDef[];
  const wordCount = [page.intro, ...page.sections.flatMap((section) => [section.h, ...section.p, ...(section.list ?? [])])]
    .join(" ")
    .trim()
    .split(/\s+/).length;
  const readingMinutes = Math.max(2, Math.ceil(wordCount / 180));

  return (
    <main className="min-h-svh bg-paper text-ink">
      <header className="relative isolate flex min-h-[72svh] items-end overflow-hidden bg-ink px-6 pb-20 pt-32 text-paper md:px-10 md:pb-24">
        <div className="absolute -right-[16vw] top-[8svh] -z-10 size-[min(90vw,720px)] rounded-full border border-paper/10" aria-hidden>
          <span className="absolute inset-[13%] rounded-full border border-vermilion/25" />
          <span className="absolute inset-[27%] rounded-full bg-[radial-gradient(circle_at_40%_35%,#d23a22,#65190e_75%)] opacity-65" />
        </div>
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_70%_35%,#2a211c_0%,#0c0a09_58%)]" />
        <div className="mx-auto w-full max-w-[1200px]">
          <nav aria-label="Đường dẫn" className="flex items-center gap-3 text-[10px] uppercase tracking-[0.24em] text-paper/50">
            <Link href="/" className="transition-colors hover:text-paper">Trang chủ</Link>
            <span className="h-px w-8 bg-vermilion" aria-hidden />
            <span>{page.nav}</span>
          </nav>
          <div className="mt-12 grid items-end gap-10 md:grid-cols-[1fr_auto]">
            <div className="max-w-4xl">
              <p className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-paper/55">
                <span className="font-display text-xl text-vermilion">01</span>
                Góc kiến thức
              </p>
              <h1 className="mt-5 font-display text-[clamp(2.7rem,6.5vw,6.2rem)] font-light leading-[1.02] tracking-[-0.015em]">{page.h1}</h1>
            </div>
            <div className="flex gap-7 border-l border-paper/15 pl-6 text-xs text-paper/55 md:mb-2 md:block md:space-y-3">
              <p><span className="block text-[9px] uppercase tracking-widest text-paper/35">Thời lượng</span>{readingMinutes} phút đọc</p>
              <p><span className="block text-[9px] uppercase tracking-widest text-paper/35">Chuyên mục</span>Quản lý chi tiêu</p>
            </div>
          </div>
        </div>
      </header>

      <div className="washi px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto grid max-w-[1200px] items-start gap-14 lg:grid-cols-[220px_minmax(0,760px)] lg:justify-between">
          <aside className="sticky top-28 hidden lg:block">
            <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-ink/45">Trong bài viết</p>
            <nav aria-label="Mục lục bài viết" className="mt-5 border-l border-ink/15">
              {page.sections.map((section, index) => (
                <a
                  key={section.h}
                  href={`#muc-${index + 1}`}
                  className="group flex gap-3 border-l border-transparent py-2.5 pl-4 text-sm leading-snug text-ink/55 transition-colors hover:border-vermilion hover:text-ink"
                >
                  <span className="font-display text-vermilion/70">0{index + 1}</span>
                  {section.h}
                </a>
              ))}
            </nav>
          </aside>

          <article>
            <p className="border-l-2 border-vermilion pl-6 font-display text-[clamp(1.4rem,2.6vw,2rem)] font-light leading-relaxed text-ink/80">
              {page.intro}
            </p>
            <div className="mt-16">
              {page.sections.map((section, index) => (
                <section id={`muc-${index + 1}`} key={section.h} className="scroll-mt-28 border-t border-ink/15 py-12 first:border-t-0 first:pt-0">
                  <div className="grid gap-5 sm:grid-cols-[3rem_1fr]">
                    <span className="font-display text-lg text-vermilion">0{index + 1}</span>
                    <div>
                      <h2 className="font-display text-[clamp(1.8rem,3.4vw,2.7rem)] font-light leading-tight">{section.h}</h2>
                      {section.p.map((text) => <p key={text} className="mt-5 text-[1.05rem] leading-[1.9] text-ink/75">{text}</p>)}
                      {section.list && (
                        <ul className="mt-6 grid gap-3 leading-relaxed text-ink/75">
                          {section.list.map((item) => (
                            <li key={item} className="flex gap-4 border-b border-ink/10 pb-3">
                              <span aria-hidden className="mt-[0.65em] size-1.5 shrink-0 rotate-45 bg-vermilion" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </section>
              ))}
            </div>

            <aside className="relative mt-8 overflow-hidden bg-ink p-8 text-paper sm:p-10">
              <span className="absolute -right-16 -top-16 size-48 rounded-full border border-vermilion/35" aria-hidden />
              <p className="relative font-display text-[clamp(1.7rem,4vw,2.5rem)] font-light leading-tight">
                Hiểu rõ tiền của bạn.<br /><em className="text-vermilion">Bắt đầu từ hôm nay.</em>
              </p>
              <Link href="/#tai-ung-dung" className="relative mt-8 flex min-h-12 w-fit items-center gap-8 rounded-full bg-vermilion px-7 text-sm font-medium">
                Tải ứng dụng <span aria-hidden>→</span>
              </Link>
            </aside>
          </article>
        </div>

        {related.length > 0 && (
          <nav aria-label="Bài liên quan" className="mx-auto mt-24 max-w-[1200px] border-t border-ink/15 pt-10">
            <div className="flex items-end justify-between gap-5">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-ink/45">Khám phá thêm</p>
                <h2 className="mt-2 font-display text-3xl font-light">Bài viết liên quan</h2>
              </div>
              <span className="hidden text-xs text-ink/45 sm:block">{related.length.toString().padStart(2, "0")} bài viết</span>
            </div>
            <ul className="mt-8 grid gap-px bg-ink/15 md:grid-cols-2">
              {related.map((item, index) => (
                <li key={item.path} className="bg-paper">
                  <Link href={item.path} className="group flex min-h-48 flex-col p-7 transition-colors duration-300 hover:bg-ink hover:text-paper">
                    <span className="text-xs text-vermilion">0{index + 1}</span>
                    <span className="mt-auto flex items-end justify-between gap-5 font-display text-2xl font-light">
                      {item.nav}
                      <i aria-hidden className="text-sm not-italic opacity-40 transition-transform duration-300 group-hover:translate-x-1">→</i>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </main>
  );
}
