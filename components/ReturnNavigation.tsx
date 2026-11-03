"use client";

import { useEffect, type ComponentProps, type MouseEvent } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const RETURN_KEY = "jutaku:pending-return";
const RETURN_SCROLL_KEY = "jutaku:return-scroll";

type PendingReturn = { from: string; to: string; scrollY: number };
type ReturnScroll = { to: string; y: number };

export function rememberReturnNavigation(destination: string) {
  try {
    const to = new URL(destination, window.location.href);
    if (to.origin !== window.location.origin || to.pathname === window.location.pathname) return;
    const pending: PendingReturn = {
      from: window.location.pathname + window.location.search + window.location.hash,
      to: to.pathname,
      scrollY: window.scrollY,
    };
    window.sessionStorage.setItem(RETURN_KEY, JSON.stringify(pending));
  } catch { /* The links still navigate when session storage is unavailable. */ }
}

export function ReturnNavigationTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const capture = (event: globalThis.MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest<HTMLAnchorElement>("a[href]");
      if (!link || link.hasAttribute("data-return-link") || link.target && link.target !== "_self" || link.hasAttribute("download")) return;
      rememberReturnNavigation(link.href);
    };
    document.addEventListener("click", capture, true);
    return () => document.removeEventListener("click", capture, true);
  }, []);

  useEffect(() => {
    if (pathname === "/") return;
    const y = takeReturnScroll(pathname);
    if (y === null) return;
    const timer = window.setTimeout(() => window.scrollTo({ top: y, behavior: "instant" }), 50);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  return null;
}

export function takeReturnScroll(pathname: string): number | null {
  try {
    const stored = window.sessionStorage.getItem(RETURN_SCROLL_KEY);
    if (!stored) return null;
    const pending = JSON.parse(stored) as ReturnScroll;
    if (pending.to !== pathname) return null;
    window.sessionStorage.removeItem(RETURN_SCROLL_KEY);
    return Number.isFinite(pending.y) ? pending.y : null;
  } catch { return null; }
}

type ReturnLinkProps = ComponentProps<typeof Link>;

export function ReturnLink({ onClick, ...props }: ReturnLinkProps) {
  const router = useRouter();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    try {
      const stored = window.sessionStorage.getItem(RETURN_KEY);
      if (!stored) return;
      const pending = JSON.parse(stored) as PendingReturn;
      if (pending.to !== window.location.pathname || pending.from === window.location.pathname) return;
      window.sessionStorage.removeItem(RETURN_KEY);
      const from = new URL(pending.from, window.location.href);
      if (from.origin !== window.location.origin) return;
      window.sessionStorage.setItem(RETURN_SCROLL_KEY, JSON.stringify({ to: from.pathname, y: pending.scrollY } satisfies ReturnScroll));
      event.preventDefault();
      router.replace(pending.from);
    } catch { /* The link's fallback destination remains available. */ }
  };

  return <Link data-return-link aria-label="Close page" title="Close page" {...props} onClick={handleClick} />;
}
