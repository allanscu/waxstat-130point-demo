import type { Metadata } from "next";
import Script from "next/script";
import DebugPanel from "@/components/DebugPanel";
import "./globals.css";

export const metadata: Metadata = {
  title: "Waxstat × 130point Demo",
  description: "Demo embed of the Waxstat releases widget on a card-sales lookup site.",
  icons: { icon: "/favicon.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <DebugPanel />
        {children}
        {/* Waxstat Web Widget loader. Override host with NEXT_PUBLIC_WAXSTAT_WIDGET_URL
            (e.g. http://localhost:3141/widget.js) when testing a local build of the widget. */}
        <Script
          id="waxstat-widget-loader"
          strategy="afterInteractive"
          src={process.env.NEXT_PUBLIC_WAXSTAT_WIDGET_URL || "https://waxstat-web-widget.vercel.app/widget.js"}
        />
      </body>
    </html>
  );
}
