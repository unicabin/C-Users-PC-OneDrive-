import type { ReactNode } from "react";

import "./globals.css";

import { AppShell } from "@/components/layout/app-shell";
import { AuthProvider } from "@/components/providers/auth-provider";
import { ProjectProvider } from "@/components/providers/project-provider";

export const metadata = {
  title: "UNITOP AI",
  description: "RAG/ML 기반 스마트 제품개발 플랫폼",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="bg-gray-50 text-gray-900">
        <AuthProvider>
          <ProjectProvider>
            <AppShell>{children}</AppShell>
          </ProjectProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
