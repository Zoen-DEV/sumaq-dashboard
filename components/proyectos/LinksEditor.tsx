"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import type { ProyectoInput } from "@/types";

export function LinksEditor() {
  const { register, control } = useFormContext<ProyectoInput>();
  const { fields, append, remove } = useFieldArray({ control, name: "links" });

  return (
    <div className="flex flex-col gap-2">
      {fields.map((field, i) => (
        <div key={field.id} className="flex flex-col gap-2 sm:flex-row">
          <input
            {...register(`links.${i}.etiqueta`)}
            placeholder="Etiqueta (ej: Figma)"
            style={inputStyle}
          />
          <div className="flex gap-2" style={{ flex: 2 }}>
            <input
              {...register(`links.${i}.url`)}
              placeholder="URL"
              type="url"
              style={inputStyle}
            />
            <button
              type="button"
              onClick={() => remove(i)}
              style={iconBtnStyle}
              aria-label="Eliminar link"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => append({ etiqueta: "", url: "" })}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.375rem",
          fontSize: "var(--text-xs)",
          color: "var(--color-accent)",
          background: "transparent",
          border: "1px dashed var(--color-border)",
          borderRadius: "var(--radius)",
          padding: "0.5rem 0.75rem",
          cursor: "pointer",
          width: "fit-content",
          transition: `border-color var(--dur-fast)`,
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.borderColor = "var(--color-accent)";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)";
        }}
      >
        <Plus size={13} />
        Agregar link
      </button>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  flex: 1,
  background: "var(--color-background)",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius)",
  color: "var(--color-foreground)",
  fontSize: "var(--text-sm)",
  padding: "0.5rem 0.75rem",
  outline: "none",
};

const iconBtnStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "36px",
  height: "36px",
  background: "transparent",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius)",
  color: "var(--color-muted)",
  cursor: "pointer",
  flexShrink: 0,
};
