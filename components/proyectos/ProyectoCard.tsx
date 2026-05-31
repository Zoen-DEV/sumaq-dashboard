"use client";

import Link from "next/link";
import type { IProyecto } from "@/types";
import { ESTADOS } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

interface Props {
  proyecto: IProyecto;
  index: number;
}

export function ProyectoCard({ proyecto: p, index }: Props) {
  const estado = ESTADOS.find(e => e.value === p.estado);

  return (
    <Link
      href={`/proyectos/${p._id}`}
      className={`animate-fade-up stagger-${Math.min(index + 1, 5)}`}
      style={{
        display: "block",
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-lg)",
        padding: "1.25rem 1.5rem",
        textDecoration: "none",
        transition: `border-color var(--dur-fast) var(--ease-out-quart), background var(--dur-fast)`,
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "var(--color-accent)";
        el.style.background = "var(--color-surface-elevated)";
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "var(--color-border)";
        el.style.background = "var(--color-surface)";
      }}
    >
      {/* Header row */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "1rem",
          marginBottom: "0.75rem",
        }}
      >
        <div>
          <h3
            style={{
              fontSize: "var(--text-base)",
              fontWeight: 600,
              color: "var(--color-foreground)",
              marginBottom: "0.125rem",
            }}
          >
            {p.nombre}
          </h3>
          <p style={{ fontSize: "var(--text-sm)", color: "var(--color-muted)" }}>
            {p.cliente.nombre} · {p.cliente.empresa}
          </p>
        </div>
        <span
          style={{
            flexShrink: 0,
            fontSize: "var(--text-xs)",
            color: estado?.color,
            background: `color-mix(in oklch, ${estado?.color} 15%, transparent)`,
            padding: "0.25rem 0.75rem",
            borderRadius: "99px",
            whiteSpace: "nowrap",
          }}
        >
          {estado?.label}
        </span>
      </div>

      {/* Meta row */}
      <div
        style={{
          display: "flex",
          gap: "1.5rem",
          flexWrap: "wrap",
        }}
      >
        <Meta label="Presupuesto" value={formatCurrency(p.presupuesto)} accent />
        <Meta label="Entrega" value={formatDate(p.fechaEntrega)} />
        {p.tecnologias.length > 0 && (
          <Meta label="Stack" value={p.tecnologias.slice(0, 3).join(", ")} />
        )}
        {p.links.length > 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
              color: "var(--color-muted)",
              fontSize: "var(--text-xs)",
            }}
          >
            <ExternalLink size={12} />
            <span>{p.links.length} link{p.links.length !== 1 ? "s" : ""}</span>
          </div>
        )}
      </div>
    </Link>
  );
}

function Meta({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <p style={{ fontSize: "var(--text-xs)", color: "var(--color-muted)" }}>{label}</p>
      <p
        style={{
          fontSize: "var(--text-sm)",
          fontWeight: accent ? 600 : 400,
          color: accent ? "var(--color-foreground)" : "var(--color-muted)",
        }}
      >
        {value}
      </p>
    </div>
  );
}
