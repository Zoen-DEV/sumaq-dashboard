"use client";

import { useSession } from "next-auth/react";

/** True cuando la sesión activa es de demostración (rol `guest`). */
export function useIsGuest(): boolean {
  const { data } = useSession();
  return data?.user?.role === "guest";
}
