import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Proyecto } from "@/models/Proyecto";
import { guestForbidden } from "@/lib/auth-guards";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const blocked = await guestForbidden();
    if (blocked) return blocked;

    await connectDB();
    const { id } = await params;
    const proyecto = await Proyecto.findById(id).lean();
    if (!proyecto) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    return NextResponse.json(proyecto);
  } catch (err) {
    console.error("[GET /api/proyectos/:id]", err);
    return NextResponse.json({ error: "Error al obtener proyecto" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const blocked = await guestForbidden();
    if (blocked) return blocked;

    await connectDB();
    const { id } = await params;
    const body = await req.json();
    const proyecto = await Proyecto.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).lean();
    if (!proyecto) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    return NextResponse.json(proyecto);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    console.error("[PUT /api/proyectos/:id]", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const blocked = await guestForbidden();
    if (blocked) return blocked;

    await connectDB();
    const { id } = await params;
    await Proyecto.findByIdAndDelete(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[DELETE /api/proyectos/:id]", err);
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
  }
}
