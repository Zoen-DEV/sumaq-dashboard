export const dynamic = "force-dynamic";

import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Proyecto } from "@/models/Proyecto";
import type { IProyecto } from "@/types";
import { GuestProyectosList } from "@/components/demo/GuestProyectosList";
import { ProyectoCard } from "@/components/proyectos/ProyectoCard";
import { FolderOpen } from "lucide-react";

async function getProyectos(): Promise<IProyecto[]> {
  await connectDB();
  const docs = await Proyecto.find({}).sort({ updatedAt: -1 }).lean();
  return JSON.parse(JSON.stringify(docs));
}

export default async function ProyectosPage() {
  const session = await auth();
  if (session?.user?.role === "guest") return <GuestProyectosList />;

  const proyectos = await getProyectos();

  return (
    <div>
      {proyectos.length === 0 ? (
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
      ) : (
        <div className="flex flex-col gap-3">
          {proyectos.map((p, i) => (
            <ProyectoCard key={p._id} proyecto={p} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
