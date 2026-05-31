import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Proyecto } from "@/models/Proyecto";
import { guestForbidden } from "@/lib/auth-guards";
import type { EstadoProyecto } from "@/types";

export async function GET(req: NextRequest) {
  try {
    const blocked = await guestForbidden();
    if (blocked) return blocked;

    await connectDB();

    const { searchParams } = new URL(req.url);
    const estado  = searchParams.get("estado") as EstadoProyecto | null;
    const buscar  = searchParams.get("q");

    const filter: Record<string, unknown> = {};
    if (estado)  filter.estado = estado;
    if (buscar)  filter.$or = [
      { nombre:          { $regex: buscar, $options: "i" } },
      { "cliente.nombre":  { $regex: buscar, $options: "i" } },
      { "cliente.empresa": { $regex: buscar, $options: "i" } },
    ];

    const proyectos = await Proyecto.find(filter).sort({ updatedAt: -1 }).lean();

    return NextResponse.json(proyectos);
  } catch (err) {
    console.error("[GET /api/proyectos]", err);
    return NextResponse.json({ error: "Error al obtener proyectos" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const blocked = await guestForbidden();
    if (blocked) return blocked;

    await connectDB();
    const body = await req.json();
    const proyecto = await Proyecto.create(body);
    return NextResponse.json(proyecto, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    console.error("[POST /api/proyectos]", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
