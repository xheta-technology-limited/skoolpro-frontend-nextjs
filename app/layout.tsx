import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Poppins,
  Lora,
  JetBrains_Mono,
  Inter,
} from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { cn } from "@/lib/utils";
import { Suspense } from "react";
import { PageLoader, PageLoaderListener } from "@/features/page-loader";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-lora",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Skoolpro",
  description: "Skoolpro",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        "scroll-smooth",
        geistSans.variable,
        geistMono.variable,
        poppins.variable,
        lora.variable,
        inter.variable,
        "font-mono",
        jetbrainsMono.variable
      )}
    >
      <body className="h-full overflow-hidden">
        <Suspense fallback={null}>
          <PageLoader />
        </Suspense>
        <PageLoaderListener />
        <Providers>
          <div className="mx-auto flex h-full flex-col overflow-hidden">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}