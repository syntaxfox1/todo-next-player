import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "NOCTURNE — Музыка и кино",
  description: "Музыка, афиша концертов и будущие премьеры кино",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}
