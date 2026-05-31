"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV, isNavActive } from "./nav-items";

/**
 * Navegación inferior para mobile/tablet (< lg). En desktop la navegación vive
 * en la Sidebar; aquí solo se exponen los tres destinos principales. El cierre de
 * sesión está en el Header en este rango de viewport.
 */
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegación principal"
      className="lg:hidden"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 30,
        display: "grid",
        gridTemplateColumns: `repeat(${NAV.length}, 1fr)`,
        height: "var(--bottombar-height)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        background: "color-mix(in oklch, var(--color-surface) 92%, transparent)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderTop: "1px solid var(--color-border)",
      }}
    >
      {NAV.map(({ href, label, icon: Icon }) => {
        const active = isNavActive(href, pathname);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.2rem",
              textDecoration: "none",
              color: active ? "var(--color-accent)" : "var(--color-muted)",
              fontSize: "var(--text-xs)",
              fontWeight: active ? 600 : 400,
              transition: `color var(--dur-fast) var(--ease-out-quart)`,
            }}
          >
            <Icon size={20} strokeWidth={active ? 2.2 : 1.6} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
