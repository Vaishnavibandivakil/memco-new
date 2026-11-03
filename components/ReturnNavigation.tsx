"use client";

import { useEffect, useRef, type ComponentProps, type MouseEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const RETURN_KEY = "jutaku:pending-return";

type PendingReturn = { from: string; to: string };

export function rememberReturnNavigation(destination: string) {
  try {
    const to = new URL(destination, window.location.href);
    if (to.origin !== window.location.origin || to.pathname === window.location.pathname) return;
    const pending: PendingReturn = {
      from: window.location.pathname + window.location.search + window.location.hash,
      to: to.pathname,
    };
    window.sessionStorage.setItem(RETURN_KEY, JSON.stringify(pending));
  } catch { /* The links still navigate when session storage is unavailable. */ }
}

export function ReturnNavigationTracker() {
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
  return null;
}

type ReturnLinkProps = ComponentProps<typeof Link>;

export function ReturnLink({ onClick, ...props }: ReturnLinkProps) {
  const router = useRouter();
  const canReturn = useRef(false);

  useEffect(() => {
    try {
      const stored = window.sessionStorage.getItem(RETURN_KEY);
      if (!stored) return;
      window.sessionStorage.removeItem(RETURN_KEY);
      const pending = JSON.parse(stored) as PendingReturn;
      canReturn.current = pending.to === window.location.pathname && pending.from !== window.location.pathname;
    } catch { /* The fallback destination remains available. */ }
  }, []);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || !canReturn.current || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    canReturn.current = false;
    router.back();
  };

  return <Link data-return-link aria-label="Close page" title="Close page" {...props} onClick={handleClick} />;
}
