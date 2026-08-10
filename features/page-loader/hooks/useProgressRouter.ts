"use client";

import { useRouter } from "next/navigation";
import NProgress from "nprogress";
import { useMemo } from "react";

export function useProgressRouter() {
  const router = useRouter();

  return useMemo(
    () => ({
      push: (href: string, options?: Parameters<typeof router.push>[1]) => {
        NProgress.start();
        router.push(href, options);
      },
      replace: (
        href: string,
        options?: Parameters<typeof router.replace>[1]
      ) => {
        NProgress.start();
        router.replace(href, options);
      },
      back: () => {
        NProgress.start();
        router.back();
      },
      forward: () => {
        NProgress.start();
        router.forward();
      },
      refresh: () => {
        NProgress.start();
        router.refresh();
        setTimeout(() => NProgress.done(), 500);
      },
    }),
    [router]
  );
}
