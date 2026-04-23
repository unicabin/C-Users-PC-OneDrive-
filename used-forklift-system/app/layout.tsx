import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "중고지게차 관리 시스템",
  description: "재고, 고객, 상담, 출고 흐름을 통합 관리하는 중고지게차 관리 시스템",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
