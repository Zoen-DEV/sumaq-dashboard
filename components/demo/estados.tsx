"use client";

import Link from "next/link";
import { FolderOpen } from "lucide-react";

/** Placeholder breve mientras el store del modo demo se rehidrata desde sessionStorage. */
export function DemoCargando() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "4rem 0",
        color: "var(--color-muted)",
        fontSize: "var(--text-sm)",
      }}
    >
      Cargando demo…
    </div>
  );
}

/** El proyecto demo solicitado no existe en el store (id inválido o ya eliminado). */
export function DemoNoEncontrado() {
  return (
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
      <p style={{ fontSize: "var(--text-sm)" }}>Este proyecto demo ya no existe.</p>
      <Link
        href="/proyectos"
        style={{
          fontSize: "var(--text-sm)",
          color: "var(--color-accent)",
          textDecoration: "none",
        }}
      >
        Volver a proyectos
      </Link>
    </div>
  );
}
