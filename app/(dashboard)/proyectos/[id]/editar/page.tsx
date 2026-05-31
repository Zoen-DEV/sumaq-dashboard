export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Proyecto } from "@/models/Proyecto";
import type { IProyecto } from "@/types";
import { ProyectoForm } from "@/components/proyectos/ProyectoForm";
import { GuestEditarProyecto } from "@/components/demo/GuestEditarProyecto";

async function getProyecto(id: string): Promise<IProyecto | null> {
  try {
    await connectDB();
    const doc = await Proyecto.findById(id).lean();
    if (!doc) return null;
    return JSON.parse(JSON.stringify(doc));
  } catch {
    return null;
  }
}

export default async function EditarProyectoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const session = await auth();
  if (session?.user?.role === "guest") {
    return (
      <div className="animate-fade-up">
        <GuestEditarProyecto id={id} />
      </div>
    );
  }

  const proyecto = await getProyecto(id);
  if (!proyecto) notFound();

  return (
    <div className="animate-fade-up">
      <ProyectoForm proyecto={proyecto} />
    </div>
  );
}
