"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export default function OfflineBanner() {
  useEffect(() => {
    const handleOffline = () => {
      console.log(
        "HERE WE FUCKING GOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO"
      );
      toast.error("Offline mode", {
        duration: Infinity,
        id: "offline-toast",
        position: "bottom-right",
      });
    };

    const handleOnline = () => {
      toast.dismiss("offline-toast");
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    if (!navigator.onLine) {
      handleOffline();
    }

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  return null;
}
