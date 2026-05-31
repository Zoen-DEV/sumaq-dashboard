"use client";

import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { ITarea, EstadoTarea } from "@/types";
import { ESTADOS_TAREA } from "@/types";
import { TareaCard } from "./TareaCard";
import { Plus } from "lucide-react";

interface Props {
  estado: EstadoTarea;
  tareas: ITarea[];
  isOver: boolean;
  onAddTarea: (estado: EstadoTarea, titulo: string) => void;
  onOpen: (tarea: ITarea) => void;
  onEdit: (tarea: ITarea) => void;
  onDelete: (id: string) => void;
}

export function TareaColumn({ estado, tareas, isOver, onAddTarea, onOpen, onEdit, onDelete }: Props) {
  const { setNodeRef } = useDroppable({ id: estado });
  const info = ESTADOS_TAREA.find(e => e.value === estado)!;
  const ids  = tareas.map(t => t.id);

  const [adding, setAdding] = useState(false);
  const [value, setValue]   = useState("");

  function submit() {
    const titulo = value.trim();
    if (titulo) onAddTarea(estado, titulo);
    setValue("");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {/* Column header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 0.25rem",
          marginBottom: "0.75rem",
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
          {tareas.length}
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
            gap: "0.5rem",
            padding: "0.75rem",
            borderRadius: "var(--radius-lg)",
            border: `1px solid ${isOver ? "var(--color-accent)" : "var(--color-border)"}`,
            background: isOver
              ? "var(--color-accent-subtle)"
              : "color-mix(in oklch, var(--color-foreground) 2.5%, transparent)",
            minHeight: "220px",
            boxShadow: isOver ? "inset 0 0 0 1px var(--color-accent)" : "none",
            transition: `border-color var(--dur-fast), background var(--dur-fast), box-shadow var(--dur-fast)`,
          }}
        >
          {tareas.length === 0 && !adding && (
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.625rem",
                padding: "1rem 0",
                color: "var(--color-muted)",
              }}
            >
              <span
                aria-hidden
                style={{
                  width: "26px",
                  height: "26px",
                  borderRadius: "50%",
                  border: `1.5px dashed ${info.color}`,
                  opacity: 0.45,
                }}
              />
              <span style={{ fontSize: "var(--text-xs)", opacity: 0.7 }}>Sin tareas</span>
            </div>
          )}

          {tareas.map(t => (
            <TareaCard key={t.id} tarea={t} onOpen={onOpen} onEdit={onEdit} onDelete={onDelete} />
          ))}

          {/* Composer */}
          {adding ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <textarea
                autoFocus
                rows={2}
                value={value}
                onChange={e => setValue(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); }
                  if (e.key === "Escape") { setValue(""); setAdding(false); }
                }}
                placeholder="Escribe una tarea…"
                style={{
                  width: "100%",
                  background: "var(--color-surface-elevated)",
                  border: "1px solid var(--color-accent)",
                  borderRadius: "var(--radius)",
                  color: "var(--color-foreground)",
                  fontSize: "var(--text-sm)",
                  padding: "0.5rem 0.625rem",
                  outline: "none",
                  resize: "none",
                  fontFamily: "inherit",
                }}
              />
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  onClick={submit}
                  style={{
                    background: "var(--color-accent)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "var(--radius)",
                    fontSize: "var(--text-xs)",
                    fontWeight: 500,
                    padding: "0.375rem 0.75rem",
                    cursor: "pointer",
                  }}
                >
                  Agregar
                </button>
                <button
                  onClick={() => { setValue(""); setAdding(false); }}
                  style={{
                    background: "transparent",
                    color: "var(--color-muted)",
                    border: "none",
                    fontSize: "var(--text-xs)",
                    padding: "0.375rem 0.5rem",
                    cursor: "pointer",
                  }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setAdding(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.375rem",
                background: "transparent",
                border: "1px dashed var(--color-border)",
                borderRadius: "var(--radius)",
                color: "var(--color-muted)",
                fontSize: "var(--text-xs)",
                padding: "0.5rem",
                cursor: "pointer",
                width: "100%",
                justifyContent: "center",
                transition: `color var(--dur-fast), border-color var(--dur-fast)`,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = "var(--color-foreground)";
                e.currentTarget.style.borderColor = "var(--color-accent)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = "var(--color-muted)";
                e.currentTarget.style.borderColor = "var(--color-border)";
              }}
            >
              <Plus size={13} />
              Agregar tarea
            </button>
          )}
        </div>
      </SortableContext>
    </div>
  );
}
