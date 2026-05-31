"use client";

import { useDemoStore, useDemoHydrated } from "@/lib/demo/store";
import { TableroView } from "@/components/tablero/TableroView";
import { DemoCargando } from "./estados";

export function GuestTablero() {
  const hydrated = useDemoHydrated();
  const proyectos = useDemoStore((s) => s.proyectos);

  if (!hydrated) return <DemoCargando />;

  return <TableroView initialProyectos={proyectos} />;
}
