import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

/**
 * Muro de seguridad del modo demo. El invitado nunca debe alcanzar la base de datos:
 * sus lecturas se sirven desde el store del cliente y sus escrituras se quedan ahí.
 * Si una petición llega a la API con un JWT de invitado (p. ej. manipulada a mano),
 * se rechaza con 403 antes de tocar Mongo.
 *
 * Uso en un handler:
 *   const blocked = await guestForbidden();
 *   if (blocked) return blocked;
 */
export async function guestForbidden(): Promise<NextResponse | null> {
  const session = await auth();
  if (session?.user?.role === "guest") {
    return NextResponse.json(
      { error: "El modo demo es de solo exploración: los cambios no se guardan." },
      { status: 403 },
    );
  }
  return null;
}
