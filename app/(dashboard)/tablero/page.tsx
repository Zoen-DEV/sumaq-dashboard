export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Proyecto } from "@/models/Proyecto";
import type { IProyecto } from "@/types";
import { TableroView } from "@/components/tablero/TableroView";
import { GuestTablero } from "@/components/demo/GuestTablero";

async function getProyectos(): Promise<IProyecto[]> {
  await connectDB();
  const docs = await Proyecto.find({}).sort({ updatedAt: -1 }).lean();
  return JSON.parse(JSON.stringify(docs));
}

export default async function TableroPage() {
  const session = await auth();
  const isGuest = session?.user?.role === "guest";

  return (
    <div className="animate-fade-in">
      <Suspense>
        {isGuest ? (
          <GuestTablero />
        ) : (
          <TableroViewServer />
        )}
      </Suspense>
    </div>
  );
}

async function TableroViewServer() {
  const proyectos = await getProyectos();
  return <TableroView initialProyectos={proyectos} />;
}
