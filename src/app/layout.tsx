import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "人脈 AI 引擎 | 智慧商務媒合平台",
  description: "以 AI 精準媒合商務夥伴，打造你的跨界人脈戰略地圖",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body style={{ position: 'relative', zIndex: 1 }}>{children}</body>
    </html>
  );
}
