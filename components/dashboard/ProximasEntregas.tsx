"use client";

import Link from "next/link";
import type { IProyecto } from "@/types";
import { formatDate, daysUntil } from "@/lib/utils";

interface Props {
  proyectos: IProyecto[];
}

export function ProximasEntregas({ proyectos }: Props) {
  const proximas = proyectos
    .filter(p => p.estado !== "completado" && p.estado !== "mantenimiento" && p.fechaEntrega)
    .sort((a, b) => new Date(a.fechaEntrega).getTime() - new Date(b.fechaEntrega).getTime())
    .slice(0, 5);

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
        }}
      >
        <h3 style={{ fontSize: "var(--text-sm)", fontWeight: 600 }}>Próximas entregas</h3>
      </div>

      {proximas.length === 0 ? (
        <p style={{ padding: "1.5rem", color: "var(--color-muted)", fontSize: "var(--text-sm)" }}>
          Sin entregas pendientes
        </p>
      ) : (
        <ul>
          {proximas.map((p, i) => {
            const dias = daysUntil(p.fechaEntrega);
            const urgente = dias <= 7;
            const vencido = dias < 0;

            return (
              <li
                key={p._id}
                style={{
                  borderBottom: i < proximas.length - 1 ? "1px solid var(--color-border)" : "none",
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
                      {formatDate(p.fechaEntrega)}
                    </p>
                  </div>
                  <span
                    style={{
                      fontSize: "var(--text-xs)",
                      fontWeight: 500,
                      color: vencido
                        ? "var(--color-destructive)"
                        : urgente
                        ? "oklch(75% 0.18 55)"
                        : "var(--color-muted)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {vencido
                      ? `Vencido hace ${Math.abs(dias)}d`
                      : dias === 0
                      ? "Hoy"
                      : `${dias}d restantes`}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
