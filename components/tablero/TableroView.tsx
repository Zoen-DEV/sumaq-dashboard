"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Select } from "@base-ui/react/select";
import { ChevronDown, Check, LayoutGrid, ListTodo } from "lucide-react";
import type { IProyecto } from "@/types";
import { KanbanBoard } from "./KanbanBoard";
import { TareasBoard } from "@/components/tareas/TareasBoard";

interface Props {
  initialProyectos: IProyecto[];
}

type View = "estado" | "tareas";

const VIEWS: { id: View; label: string; icon: typeof LayoutGrid }[] = [
  { id: "estado", label: "Estado de proyectos", icon: LayoutGrid },
  { id: "tareas", label: "Tareas por proyecto",  icon: ListTodo },
];

export function TableroView({ initialProyectos }: Props) {
  const router      = useRouter();
  const pathname    = usePathname();
  const searchParams = useSearchParams();

  const rawView  = searchParams.get("view");
  const view: View = rawView === "tareas" ? "tareas" : "estado";
  const proyectoId  = searchParams.get("proyecto") ?? initialProyectos[0]?._id ?? "";

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [k, v] of Object.entries(updates)) params.set(k, v);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  const setView       = (v: View)  => updateParams({ view: v });
  const setProyectoId = (id: string) => updateParams({ proyecto: id });

  const proyecto = initialProyectos.find(p => p._id === proyectoId) ?? null;

  return (
    <div>
      {/* Selector de vista + selector de proyecto */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          flexWrap: "wrap",
          marginBottom: "1.5rem",
        }}
      >
        <div
          role="tablist"
          aria-label="Vista del tablero"
          style={{
            display: "inline-flex",
            gap: "0.25rem",
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-lg)",
            padding: "0.25rem",
          }}
        >
          {VIEWS.map(v => {
            const isActive = view === v.id;
            const Icon = v.icon;
            return (
              <button
                key={v.id}
                role="tab"
                type="button"
                aria-selected={isActive}
                onClick={() => setView(v.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: isActive ? "var(--color-surface-elevated)" : "transparent",
                  border: `1px solid ${isActive ? "var(--color-border)" : "transparent"}`,
                  color: isActive ? "var(--color-foreground)" : "var(--color-muted)",
                  fontSize: "var(--text-sm)",
                  fontWeight: 500,
                  padding: "0.45rem 0.875rem",
                  borderRadius: "var(--radius)",
                  cursor: "pointer",
                  transition: `color var(--dur-fast), background var(--dur-fast)`,
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = "var(--color-foreground)"; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = "var(--color-muted)"; }}
              >
                <Icon size={15} />
                {v.label}
              </button>
            );
          })}
        </div>

        {view === "tareas" && initialProyectos.length > 0 && (
          <ProyectoSelect
            proyectos={initialProyectos}
            value={proyectoId}
            onChange={setProyectoId}
          />
        )}
      </div>

      {/* Contenido */}
      {view === "estado" ? (
        <KanbanBoard initialProyectos={initialProyectos} />
      ) : proyecto ? (
        <TareasBoard
          key={proyecto._id}
          proyectoId={proyecto._id}
          initialTareas={proyecto.tareas ?? []}
        />
      ) : (
        <p
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--color-muted)",
            textAlign: "center",
            marginTop: "3rem",
          }}
        >
          No hay proyectos todavía.
        </p>
      )}
    </div>
  );
}

function ProyectoSelect({
  proyectos,
  value,
  onChange,
}: {
  proyectos: IProyecto[];
  value: string;
  onChange: (id: string) => void;
}) {
  const nombreSeleccionado = proyectos.find(p => p._id === value)?.nombre ?? "Seleccionar proyecto";

  return (
    <Select.Root value={value} onValueChange={(v) => v && onChange(v as string)}>
      <Select.Trigger style={triggerStyle}>
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
          {nombreSeleccionado}
        </span>
        <Select.Icon style={{ color: "var(--color-muted)", flexShrink: 0, display: "flex" }}>
          <ChevronDown size={14} />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Positioner sideOffset={4} align="end">
          <Select.Popup style={popupStyle}>
            <Select.List style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
              {proyectos.map(p => (
                <Select.Item key={p._id} value={p._id} className="select-item">
                  <Select.ItemText
                    style={{ fontSize: "var(--text-sm)", color: "var(--color-foreground)", flex: 1 }}
                  >
                    {p.nombre}
                  </Select.ItemText>
                  <Select.ItemIndicator style={{ color: "var(--color-accent)", display: "flex" }}>
                    <Check size={12} />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
}

const triggerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "0.5rem",
  minWidth: "220px",
  maxWidth: "320px",
  background: "var(--color-background)",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius)",
  color: "var(--color-foreground)",
  fontSize: "var(--text-sm)",
  padding: "0.5rem 0.875rem",
  cursor: "pointer",
  outline: "none",
  textAlign: "left",
};

const popupStyle: React.CSSProperties = {
  background: "var(--color-surface-elevated)",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius)",
  boxShadow: "0 8px 24px oklch(0% 0 0 / 0.4)",
  padding: "0.25rem",
  minWidth: "var(--anchor-width)",
  maxHeight: "320px",
  overflowY: "auto",
  zIndex: 50,
};
