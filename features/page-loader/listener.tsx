"use client";

import { useEffect } from "react";
import NProgress from "nprogress";

export function PageLoaderListener() {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (e.defaultPrevented) return;
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor || !anchor.href) return;
      if (anchor.hasAttribute("download")) return;
      if (anchor.target !== "" && anchor.target !== "_self") return;
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
      if (anchor.origin !== window.location.origin) return;
      if (
        anchor.pathname === window.location.pathname &&
        anchor.search === window.location.search
      ) {
        return;
      }
      NProgress.start();
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
