export const dynamic = "force-dynamic";

import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Proyecto } from "@/models/Proyecto";
import type { IProyecto } from "@/types";
import { GuestDashboard } from "@/components/demo/GuestDashboard";
import { ResumenStrip } from "@/components/dashboard/ResumenStrip";
import { DonutEstados } from "@/components/dashboard/DonutEstados";
import { BarPresupuesto } from "@/components/dashboard/BarPresupuesto";
import { ProyectosRecientes } from "@/components/dashboard/ProyectosRecientes";
import { ProximasEntregas } from "@/components/dashboard/ProximasEntregas";

async function getProyectos(): Promise<IProyecto[]> {
  await connectDB();
  const docs = await Proyecto.find({}).sort({ updatedAt: -1 }).lean();
  return JSON.parse(JSON.stringify(docs));
}

export default async function DashboardPage() {
  const session = await auth();
  if (session?.user?.role === "guest") return <GuestDashboard />;

  const proyectos = await getProyectos();

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
