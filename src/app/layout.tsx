import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter-tight";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { ViewportTone } from "@/components/ViewportTone";

export const metadata: Metadata = {
  title: "Kiss Monitor",
  description: "Make kiss deals with your love and watch your total grow.",
  applicationName: "Kiss Monitor",
  appleWebApp: { capable: true, title: "Kiss Monitor", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#4a9df4",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <ViewportTone />
          <div className="relative mx-auto min-h-dvh w-full md:my-6 md:min-h-[calc(100dvh-3rem)] md:max-w-[430px] md:overflow-hidden md:rounded-[44px] md:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.35)]">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
