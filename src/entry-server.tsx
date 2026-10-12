import { renderToString } from "react-dom/server";
import App from "./App";
import {
  getRoute,
  getPageMeta,
  getCanonicalPath,
  getStructuredData,
  ROUTE_PATHS,
} from "./pages";
import { APP } from "./config";

export function render(path: string, origin: string) {
  const page = getRoute(path);
  const isNotFound = path === "/404" || (path !== "/" && !page);
  const meta = isNotFound
    ? {
        title: `404: Không tìm thấy trang | ${APP.name}`,
        description:
          "Trang bạn tìm kiếm không tồn tại hoặc đã được thay đổi đường dẫn.",
      }
    : getPageMeta(page);

  const canonicalPath = getCanonicalPath(page, path);
  const canonicalUrl = `${origin}${canonicalPath === "/" ? "/" : canonicalPath}`;
  const structuredData = !isNotFound ? getStructuredData(page, origin) : null;

  const appHtml = renderToString(<App initialPath={path} />);

  return {
    appHtml,
    meta,
    canonicalUrl,
    structuredData,
    isNotFound,
  };
}

export { ROUTE_PATHS };
