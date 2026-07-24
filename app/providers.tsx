"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import OfflineBanner from "@/components/common/offline-banner";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <>
      <Toaster />
      <OfflineBanner />
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </>
  );
}
