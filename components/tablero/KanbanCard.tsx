"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Link from "next/link";
import type { IProyecto } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { GripVertical } from "lucide-react";

interface Props {
  proyecto: IProyecto;
}

export function KanbanCard({ proyecto: p }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: p._id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div
        style={{
          background: "var(--color-surface-elevated)",
          border: `1px solid ${isDragging ? "var(--color-accent)" : "var(--color-border)"}`,
          borderRadius: "var(--radius-lg)",
          padding: "0.875rem 1rem",
          display: "flex",
          gap: "0.5rem",
          cursor: "default",
          transform: isDragging ? "scale(1.02)" : "none",
          boxShadow: isDragging ? "0 8px 24px oklch(0% 0 0 / 0.4)" : "none",
          transition: `border-color var(--dur-fast), box-shadow var(--dur-fast)`,
        }}
      >
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          style={{
            background: "transparent",
            border: "none",
            color: "var(--color-muted)",
            cursor: "grab",
            padding: "0 2px",
            display: "flex",
            alignItems: "flex-start",
            paddingTop: "2px",
            flexShrink: 0,
          }}
          aria-label="Arrastrar"
        >
          <GripVertical size={14} />
        </button>

        {/* Content */}
        <Link
          href={`/proyectos/${p._id}`}
          style={{ textDecoration: "none", flex: 1, minWidth: 0 }}
        >
          <p
            style={{
              fontSize: "var(--text-sm)",
              fontWeight: 600,
              color: "var(--color-foreground)",
              marginBottom: "0.25rem",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {p.nombre}
          </p>
          <p
            style={{
              fontSize: "var(--text-xs)",
              color: "var(--color-muted)",
              marginBottom: "0.625rem",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {p.cliente.empresa}
          </p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span
              style={{
                fontSize: "var(--text-xs)",
                fontWeight: 600,
                color: "var(--color-foreground)",
              }}
            >
              {formatCurrency(p.presupuesto)}
            </span>
            <span style={{ fontSize: "var(--text-xs)", color: "var(--color-muted)" }}>
              {formatDate(p.fechaEntrega)}
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}
