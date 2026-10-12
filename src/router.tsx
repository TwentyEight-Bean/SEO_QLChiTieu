import { useEffect, useState, type AnchorHTMLAttributes } from "react";

let ssrPath: string | null = null;
export function setSSRPath(path: string | null) {
  ssrPath = path;
}

export function usePath(initialPath?: string) {
  const [path, setPath] = useState(() => {
    if (initialPath) return initialPath.replace(/\/$/, "") || "/";
    if (ssrPath) return ssrPath.replace(/\/$/, "") || "/";
    if (typeof window !== "undefined") {
      return window.location.pathname.replace(/\/$/, "") || "/";
    }
    return "/";
  });
  useEffect(() => {
    const on = () => setPath(window.location.pathname.replace(/\/$/, "") || "/");
    window.addEventListener("popstate", on);
    return () => window.removeEventListener("popstate", on);
  }, []);
  return path;
}

export function Link({ href, onClick, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return (
    <a
      href={href}
      {...rest}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        const next = new URL(href, window.location.href);
        window.history.pushState({}, "", `${next.pathname}${next.search}${next.hash}`);
        window.dispatchEvent(new PopStateEvent("popstate"));
        if (next.hash) {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              document.getElementById(next.hash.slice(1))?.scrollIntoView();
            });
          });
        } else {
          window.scrollTo(0, 0);
        }
      }}
    />
  );
}
