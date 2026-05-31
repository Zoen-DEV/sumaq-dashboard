export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Proyecto } from "@/models/Proyecto";
import type { IProyecto } from "@/types";
import { ProyectoDetalle } from "@/components/proyectos/ProyectoDetalle";
import { GuestProyectoDetalle } from "@/components/demo/GuestProyectoDetalle";

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

export default async function ProyectoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const session = await auth();
  if (session?.user?.role === "guest") return <GuestProyectoDetalle id={id} />;

  const p = await getProyecto(id);
  if (!p) notFound();

  return <ProyectoDetalle proyecto={p} />;
}
