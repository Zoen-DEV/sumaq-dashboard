"use client";

import { useDemoStore, useDemoHydrated } from "@/lib/demo/store";
import { ResumenStrip } from "@/components/dashboard/ResumenStrip";
import { DonutEstados } from "@/components/dashboard/DonutEstados";
import { BarPresupuesto } from "@/components/dashboard/BarPresupuesto";
import { ProyectosRecientes } from "@/components/dashboard/ProyectosRecientes";
import { ProximasEntregas } from "@/components/dashboard/ProximasEntregas";
import { DemoCargando } from "./estados";

export function GuestDashboard() {
  const hydrated = useDemoHydrated();
  const proyectos = useDemoStore((s) => s.proyectos);

  if (!hydrated) return <DemoCargando />;

  return (
    <div className="animate-fade-in">
      <ResumenStrip proyectos={proyectos} />

      <div className="dash-grid-2">
        <div className="animate-fade-up stagger-2">
          <DonutEstados proyectos={proyectos} />
        </div>
        <div className="animate-fade-up stagger-3">
          <BarPresupuesto proyectos={proyectos} />
        </div>
      </div>

      <div className="dash-grid-main">
        <div className="animate-fade-up stagger-3">
          <ProyectosRecientes proyectos={proyectos} />
        </div>
        <div className="animate-fade-up stagger-4">
          <ProximasEntregas proyectos={proyectos} />
        </div>
      </div>
    </div>
  );
}
