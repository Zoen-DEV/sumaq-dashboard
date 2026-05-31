"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Plus, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

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
        height: "var(--header-height)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "0.75rem",
        padding: "0 1rem",
        borderBottom: "1px solid var(--color-border)",
        background: "var(--color-surface)",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <div className="flex min-w-0 items-baseline gap-2">
        {/* Marca corta: la sidebar (con el logo) no existe en mobile. */}
        <span
          className="lg:hidden"
          style={{
            fontSize: "var(--text-xs)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--color-muted)",
            flexShrink: 0,
          }}
        >
          Sumaq
        </span>
        <h1
          className="truncate"
          style={{
            fontSize: "var(--text-sm)",
            fontWeight: 600,
            color: "var(--color-foreground)",
          }}
        >
          {title}
        </h1>
      </div>

      <div className="flex flex-shrink-0 items-center gap-2">
        {showNew && (
          <Link
            href="/proyectos/nuevo"
            aria-label="Nuevo proyecto"
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
              minHeight: "40px",
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
            <span className="hidden sm:inline">Nuevo proyecto</span>
          </Link>
        )}

        {/* Salir: en desktop vive en la sidebar; aquí solo para < lg. */}
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/login" })}
          aria-label="Cerrar sesión"
          className="lg:hidden"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "40px",
            height: "40px",
            color: "var(--color-muted)",
            background: "transparent",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius)",
            cursor: "pointer",
            transition: `color var(--dur-fast), border-color var(--dur-fast)`,
          }}
        >
          <LogOut size={16} strokeWidth={1.5} />
        </button>
      </div>
    </header>
  );
}
