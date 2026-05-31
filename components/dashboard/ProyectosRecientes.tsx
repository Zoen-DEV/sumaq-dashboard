"use client";

import Link from "next/link";
import type { IProyecto } from "@/types";
import { ESTADOS } from "@/types";
import { formatDate } from "@/lib/utils";

interface Props {
  proyectos: IProyecto[];
}

export function ProyectosRecientes({ proyectos }: Props) {
  const recientes = proyectos.slice(0, 5);

  return (
    <div
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "1.25rem 1.5rem",
          borderBottom: "1px solid var(--color-border)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3 style={{ fontSize: "var(--text-sm)", fontWeight: 600 }}>Recientes</h3>
        <Link
          href="/proyectos"
          style={{ fontSize: "var(--text-xs)", color: "var(--color-accent)", textDecoration: "none" }}
        >
          Ver todos →
        </Link>
      </div>

      {recientes.length === 0 ? (
        <p style={{ padding: "1.5rem", color: "var(--color-muted)", fontSize: "var(--text-sm)" }}>
          Sin proyectos aún
        </p>
      ) : (
        <ul>
          {recientes.map((p, i) => {
            const estado = ESTADOS.find(e => e.value === p.estado);
            return (
              <li
                key={p._id}
                style={{
                  borderBottom: i < recientes.length - 1 ? "1px solid var(--color-border)" : "none",
                }}
              >
                <Link
                  href={`/proyectos/${p._id}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.875rem 1.5rem",
                    textDecoration: "none",
                    transition: `background var(--dur-fast)`,
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = "var(--color-surface-elevated)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                  }}
                >
                  <div>
                    <p style={{ fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--color-foreground)" }}>
                      {p.nombre}
                    </p>
                    <p style={{ fontSize: "var(--text-xs)", color: "var(--color-muted)" }}>
                      {p.cliente.empresa}
                    </p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <span
                      style={{
                        fontSize: "var(--text-xs)",
                        color: estado?.color,
                        background: `color-mix(in oklch, ${estado?.color} 15%, transparent)`,
                        padding: "0.2rem 0.6rem",
                        borderRadius: "99px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {estado?.label}
                    </span>
                    <span style={{ fontSize: "var(--text-xs)", color: "var(--color-muted)", whiteSpace: "nowrap" }}>
                      {formatDate(p.updatedAt)}
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
