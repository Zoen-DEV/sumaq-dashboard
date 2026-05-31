"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { IProyecto, EstadoProyecto } from "@/types";
import { ESTADOS } from "@/types";
import { KanbanCard } from "./KanbanCard";

interface Props {
  estado: EstadoProyecto;
  proyectos: IProyecto[];
  isOver: boolean;
}

export function KanbanColumn({ estado, proyectos, isOver }: Props) {
  const { setNodeRef } = useDroppable({ id: estado });
  const info = ESTADOS.find(e => e.value === estado)!;
  const ids  = proyectos.map(p => p._id);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minWidth: "260px",
        flex: 1,
      }}
    >
      {/* Column header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 0.25rem",
          marginBottom: "0.875rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: info.color,
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: "var(--text-xs)",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "var(--color-muted)",
            }}
          >
            {info.label}
          </span>
        </div>
        <span
          style={{
            fontSize: "var(--text-xs)",
            color: "var(--color-muted)",
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "99px",
            padding: "0.1rem 0.5rem",
          }}
        >
          {proyectos.length}
        </span>
      </div>

      {/* Drop zone */}
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "0.625rem",
            padding: "0.75rem",
            borderRadius: "var(--radius-lg)",
            border: `1px solid ${isOver ? "var(--color-accent)" : "var(--color-border)"}`,
            background: isOver
              ? "var(--color-accent-subtle)"
              : "oklch(8.5% 0.012 285)",
            minHeight: "120px",
            transition: `border-color var(--dur-fast), background var(--dur-fast)`,
          }}
        >
          {proyectos.length === 0 && (
            <p
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--color-muted)",
                textAlign: "center",
                marginTop: "1rem",
                opacity: 0.6,
              }}
            >
              Sin proyectos
            </p>
          )}
          {proyectos.map(p => (
            <KanbanCard key={p._id} proyecto={p} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}
