"use client";

import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import { FlaskConical, RotateCcw, LogOut } from "lucide-react";
import { useIsGuest } from "@/lib/demo/useIsGuest";
import { useDemoStore } from "@/lib/demo/store";

export function DemoBanner() {
  const isGuest = useIsGuest();
  const router = useRouter();

  if (!isGuest) return null;

  function reiniciar() {
    useDemoStore.getState().reset();
    toast.success("Demo reiniciada");
    router.refresh();
  }

  return (
    <div
      role="status"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
        flexWrap: "wrap",
        padding: "0.5rem 1.5rem",
        background: "var(--color-accent-subtle)",
        borderBottom: "1px solid var(--color-border)",
        color: "var(--color-foreground)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", minWidth: 0 }}>
        <FlaskConical size={14} style={{ color: "var(--color-accent)", flexShrink: 0 }} />
        <p style={{ fontSize: "var(--text-xs)", color: "var(--color-muted)", margin: 0 }}>
          <strong style={{ color: "var(--color-accent)", fontWeight: 600 }}>Modo demo</strong>
          {" · "}
          los datos son temporales: no se guardan y se borran al cerrar la pestaña.
        </p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
        <button type="button" onClick={reiniciar} style={btnStyle}>
          <RotateCcw size={13} />
          Reiniciar demo
        </button>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/login" })}
          style={btnStyle}
        >
          <LogOut size={13} />
          Salir
        </button>
      </div>
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.375rem",
  background: "transparent",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius)",
  color: "var(--color-muted)",
  fontSize: "var(--text-xs)",
  padding: "0.3rem 0.625rem",
  cursor: "pointer",
};
