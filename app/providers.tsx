"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          classNames: {
            error: "!border !border-[2.5px] !border-red-500 !bg-error-100",
            success:
              "!border !border-[2.5px] !border-green-500 !bg-success-100",
          },
        }}
      />
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </>
  );
}
