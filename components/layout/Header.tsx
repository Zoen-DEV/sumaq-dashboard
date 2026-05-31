"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";

const TITLES: Record<string, string> = {
  "/":           "Dashboard",
  "/proyectos":  "Proyectos",
  "/tablero":    "Tablero",
};

function getTitle(pathname: string): string {
  if (pathname.endsWith("/editar")) return "Editar proyecto";
  if (pathname.endsWith("/nuevo")) return "Nuevo proyecto";
  if (pathname.startsWith("/proyectos/")) return "Detalle del proyecto";
  return TITLES[pathname] ?? "Dashboard";
}

export function Header() {
  const pathname = usePathname();
  const title    = getTitle(pathname);
  const showNew  = pathname === "/proyectos";

  return (
    <header
      style={{
        height: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 1.5rem",
        borderBottom: "1px solid var(--color-border)",
        background: "var(--color-surface)",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <h1
        style={{
          fontSize: "var(--text-sm)",
          fontWeight: 600,
          color: "var(--color-foreground)",
        }}
      >
        {title}
      </h1>

      {showNew && (
        <Link
          href="/proyectos/nuevo"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.375rem",
            background: "var(--color-accent)",
            color: "#fff",
            border: "none",
            borderRadius: "var(--radius)",
            fontSize: "var(--text-sm)",
            fontWeight: 500,
            padding: "0.5rem 0.875rem",
            textDecoration: "none",
            transition: `background var(--dur-fast) var(--ease-out-quart)`,
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = "var(--color-accent-hover)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = "var(--color-accent)";
          }}
        >
          <Plus size={15} strokeWidth={2} />
          Nuevo proyecto
        </Link>
      )}
    </header>
  );
}
