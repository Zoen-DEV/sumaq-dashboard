"use client";

import { FolderOpen } from "lucide-react";
import { useDemoStore, useDemoHydrated } from "@/lib/demo/store";
import { ProyectoCard } from "@/components/proyectos/ProyectoCard";
import { DemoCargando } from "./estados";

export function GuestProyectosList() {
  const hydrated = useDemoHydrated();
  const proyectos = useDemoStore((s) => s.proyectos);

  if (!hydrated) return <DemoCargando />;

  if (proyectos.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          padding: "4rem 0",
          color: "var(--color-muted)",
        }}
      >
        <FolderOpen size={40} strokeWidth={1} />
        <p style={{ fontSize: "var(--text-sm)" }}>
          No hay proyectos todavía. Crea el primero.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {proyectos.map((p, i) => (
        <ProyectoCard key={p._id} proyecto={p} index={i} />
      ))}
    </div>
  );
}
