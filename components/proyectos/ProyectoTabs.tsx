"use client";

import { useState } from "react";

type TabId = "detalles" | "tareas";

interface Props {
  detalles: React.ReactNode;
  tareas: React.ReactNode;
}

const TABS: { id: TabId; label: string }[] = [
  { id: "detalles", label: "Detalles" },
  { id: "tareas",   label: "Tareas" },
];

export function ProyectoTabs({ detalles, tareas }: Props) {
  const [active, setActive] = useState<TabId>("detalles");

  return (
    <div>
      {/* Tab list */}
      <div
        role="tablist"
        aria-label="Secciones del proyecto"
        style={{
          display: "flex",
          gap: "0.25rem",
          borderBottom: "1px solid var(--color-border)",
          marginBottom: "1.5rem",
        }}
      >
        {TABS.map(t => {
          const isActive = active === t.id;
          return (
            <button
              key={t.id}
              role="tab"
              type="button"
              aria-selected={isActive}
              aria-controls={`panel-${t.id}`}
              onClick={() => setActive(t.id)}
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "transparent",
                border: "none",
                color: isActive ? "var(--color-foreground)" : "var(--color-muted)",
                fontSize: "var(--text-sm)",
                fontWeight: 500,
                padding: "0.625rem 0.875rem",
                cursor: "pointer",
                transition: `color var(--dur-fast)`,
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = "var(--color-foreground)"; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = "var(--color-muted)"; }}
            >
              {t.label}
              <span
                aria-hidden
                style={{
                  position: "absolute",
                  left: "0.875rem",
                  right: "0.875rem",
                  bottom: "-1px",
                  height: "2px",
                  borderRadius: "2px",
                  background: isActive ? "var(--color-accent)" : "transparent",
                  transition: `background var(--dur-fast)`,
                }}
              />
            </button>
          );
        })}
      </div>

      {/* Panels — both stay mounted to preserve state */}
      <div
        role="tabpanel"
        id="panel-detalles"
        hidden={active !== "detalles"}
      >
        {detalles}
      </div>
      <div
        role="tabpanel"
        id="panel-tareas"
        hidden={active !== "tareas"}
      >
        {tareas}
      </div>
    </div>
  );
}
