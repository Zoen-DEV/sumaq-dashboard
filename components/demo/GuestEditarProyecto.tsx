"use client";

import { useDemoStore, useDemoHydrated } from "@/lib/demo/store";
import { ProyectoForm } from "@/components/proyectos/ProyectoForm";
import { DemoCargando, DemoNoEncontrado } from "./estados";

export function GuestEditarProyecto({ id }: { id: string }) {
  const hydrated = useDemoHydrated();
  const proyecto = useDemoStore((s) => s.proyectos.find((p) => p._id === id));

  if (!hydrated) return <DemoCargando />;
  if (!proyecto) return <DemoNoEncontrado />;

  return <ProyectoForm proyecto={proyecto} />;
}
