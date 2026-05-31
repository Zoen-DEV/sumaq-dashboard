"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ITarea } from "@/types";
import { GripVertical, Pencil, X } from "lucide-react";

interface Props {
  tarea: ITarea;
  onOpen: (tarea: ITarea) => void;
  onEdit: (tarea: ITarea) => void;
  onDelete: (id: string) => void;
}

/**
 * Versión presentacional para el DragOverlay. NO usa useSortable: el overlay ya
 * posiciona el elemento, así que un transform de sortable aquí se sumaría a esa
 * posición y descuadraría el item respecto al cursor.
 */
export function TareaCardOverlay({ tarea }: { tarea: ITarea }) {
  const completada = tarea.estado === "completada";
  return (
    <div
      style={{
        background: "var(--color-surface-elevated)",
        border: "1px solid var(--color-accent)",
        borderRadius: "var(--radius)",
        padding: "0.5rem 0.5rem 0.5rem 0.25rem",
        display: "flex",
        alignItems: "flex-start",
        gap: "0.25rem",
        transform: "scale(1.02)",
        boxShadow: "0 8px 24px oklch(0% 0 0 / 0.4)",
        cursor: "grabbing",
      }}
    >
      <span
        style={{
          color: "var(--color-muted)",
          padding: "2px 1px 0",
          display: "flex",
          alignItems: "flex-start",
          flexShrink: 0,
          opacity: 0.9,
        }}
      >
        <GripVertical size={14} />
      </span>
      <p
        style={{
          flex: 1,
          minWidth: 0,
          fontSize: "var(--text-sm)",
          lineHeight: 1.45,
          paddingTop: "1px",
          color: completada ? "var(--color-muted)" : "var(--color-foreground)",
          textDecoration: completada ? "line-through" : "none",
          wordBreak: "break-word",
        }}
      >
        {tarea.titulo}
      </p>
    </div>
  );
}

export function TareaCard({ tarea, onOpen, onEdit, onDelete }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: tarea.id });

  const [hover, setHover] = useState(false);

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const completada = tarea.estado === "completada";
  const lifted     = hover && !isDragging;

  return (
    <div ref={setNodeRef} style={style}>
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          background: "var(--color-surface-elevated)",
          border: `1px solid ${
            isDragging || lifted ? "var(--color-accent)" : "var(--color-border)"
          }`,
          borderRadius: "var(--radius)",
          padding: "0.5rem 0.5rem 0.5rem 0.25rem",
          display: "flex",
          alignItems: "flex-start",
          gap: "0.25rem",
          transform: isDragging
            ? "scale(1.02)"
            : lifted ? "translateY(-1px)" : "none",
          boxShadow: isDragging
            ? "0 8px 24px oklch(0% 0 0 / 0.4)"
            : lifted ? "0 2px 10px oklch(0% 0 0 / 0.28)" : "none",
          transition: `border-color var(--dur-fast), box-shadow var(--dur-fast), transform var(--dur-fast) var(--ease-out-quart)`,
        }}
      >
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          aria-label="Arrastrar tarea"
          style={{
            background: "transparent",
            border: "none",
            color: "var(--color-muted)",
            cursor: "grab",
            padding: "2px 1px 0",
            display: "flex",
            alignItems: "flex-start",
            flexShrink: 0,
            touchAction: "none",
            opacity: hover || isDragging ? 0.9 : 0.4,
            transition: `opacity var(--dur-fast)`,
          }}
        >
          <GripVertical size={14} />
        </button>

        {/* Title — click abre modal */}
        <p
          onClick={() => !isDragging && onOpen(tarea)}
          title="Clic para abrir"
          style={{
            flex: 1,
            minWidth: 0,
            fontSize: "var(--text-sm)",
            lineHeight: 1.45,
            paddingTop: "1px",
            color: completada ? "var(--color-muted)" : "var(--color-foreground)",
            textDecoration: completada ? "line-through" : "none",
            wordBreak: "break-word",
            cursor: "pointer",
          }}
        >
          {tarea.titulo}
        </p>

        {/* Edit — abre modal directo en modo edición */}
        <button
          onClick={e => { e.stopPropagation(); !isDragging && onEdit(tarea); }}
          aria-label="Editar tarea"
          style={{
            background: "transparent",
            border: "none",
            color: "var(--color-muted)",
            cursor: "pointer",
            padding: "2px",
            display: "flex",
            flexShrink: 0,
            opacity: hover ? 1 : 0.55,
            transition: `color var(--dur-fast), opacity var(--dur-fast)`,
          }}
          onMouseEnter={e => { e.currentTarget.style.color = "var(--color-accent)"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "var(--color-muted)"; }}
        >
          <Pencil size={12} />
        </button>

        {/* Delete — abre confirm dialog */}
        <button
          onClick={e => { e.stopPropagation(); onDelete(tarea.id); }}
          aria-label="Eliminar tarea"
          style={{
            background: "transparent",
            border: "none",
            color: "var(--color-muted)",
            cursor: "pointer",
            padding: "2px",
            display: "flex",
            flexShrink: 0,
            opacity: hover ? 1 : 0.55,
            transition: `color var(--dur-fast), opacity var(--dur-fast)`,
          }}
          onMouseEnter={e => { e.currentTarget.style.color = "var(--color-destructive)"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "var(--color-muted)"; }}
        >
          <X size={13} />
        </button>
      </div>
    </div>
  );
}
