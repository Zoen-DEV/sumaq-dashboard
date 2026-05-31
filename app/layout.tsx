import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sumaq Dashboard",
  description: "Panel de gestión de proyectos — Sumaq Studios",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark h-full">
      <body className="h-full">{children}</body>
    </html>
  );
}
