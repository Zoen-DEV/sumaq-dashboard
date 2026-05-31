"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { NAV, isNavActive } from "./nav-items";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="hidden lg:flex"
      style={{
        width: "var(--sidebar-width)",
        flexShrink: 0,
        background: "var(--color-surface)",
        borderRight: "1px solid var(--color-border)",
        flexDirection: "column",
        height: "100dvh",
        position: "sticky",
        top: 0,
      }}
    >
      {/* Brand */}
      <div
        style={{
          padding: "1.5rem 1.25rem 1.25rem",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <span
          style={{
            fontSize: "var(--text-xs)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--color-muted)",
            display: "block",
            marginBottom: "0.125rem",
          }}
        >
          Sumaq Studios
        </span>
        <span
          style={{
            fontSize: "var(--text-sm)",
            fontWeight: 600,
            color: "var(--color-foreground)",
          }}
        >
          Dashboard
        </span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 p-3 flex-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const isActive = isNavActive(href, pathname);

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all",
                isActive
                  ? "text-white font-medium"
                  : "text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
              )}
              style={{
                background: isActive ? "var(--color-accent-subtle)" : "transparent",
                color: isActive ? "var(--color-accent)" : undefined,
                transitionDuration: "var(--dur-fast)",
                transitionTimingFunction: "var(--ease-out-quart)",
              }}
            >
              <Icon size={16} strokeWidth={isActive ? 2 : 1.5} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: "0.75rem", borderTop: "1px solid var(--color-border)" }}>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors"
          style={{
            color: "var(--color-muted)",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            transitionDuration: "var(--dur-fast)",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.color = "var(--color-destructive)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.color = "var(--color-muted)";
          }}
        >
          <LogOut size={16} strokeWidth={1.5} />
          Salir
        </button>
      </div>
    </aside>
  );
}
