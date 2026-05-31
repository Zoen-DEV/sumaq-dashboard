"use client";

import { useDemoStore, useDemoHydrated } from "@/lib/demo/store";
import { ProyectoDetalle } from "@/components/proyectos/ProyectoDetalle";
import { DemoCargando, DemoNoEncontrado } from "./estados";

export function GuestProyectoDetalle({ id }: { id: string }) {
  const hydrated = useDemoHydrated();
  const proyecto = useDemoStore((s) => s.proyectos.find((p) => p._id === id));

  if (!hydrated) return <DemoCargando />;
  if (!proyecto) return <DemoNoEncontrado />;

  // `key` fuerza el remontaje del subárbol (incl. TareasBoard, que mantiene estado
  // local) cuando se navega entre proyectos demo distintos.
  return <ProyectoDetalle key={proyecto._id} proyecto={proyecto} />;
}
