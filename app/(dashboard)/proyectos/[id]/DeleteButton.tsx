"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { useIsGuest } from "@/lib/demo/useIsGuest";
import { deleteProyecto } from "@/lib/proyectos-client";

export function DeleteButton({ id }: { id: string }) {
  const router = useRouter();
  const isGuest = useIsGuest();

  async function handleDelete() {
    if (!confirm("¿Eliminar este proyecto? Esta acción es irreversible.")) return;

    const result = await deleteProyecto(isGuest, id);
    if (result.ok) {
      toast.success("Proyecto eliminado");
      router.push("/proyectos");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  return (
    <button
      onClick={handleDelete}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.375rem",
        background: "transparent",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius)",
        color: "var(--color-muted)",
        fontSize: "var(--text-sm)",
        padding: "0.5rem 0.875rem",
        cursor: "pointer",
        transition: `color var(--dur-fast), border-color var(--dur-fast)`,
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.color = "var(--color-destructive)";
        el.style.borderColor = "var(--color-destructive)";
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.color = "var(--color-muted)";
        el.style.borderColor = "var(--color-border)";
      }}
    >
      <Trash2 size={13} />
      Eliminar
    </button>
  );
}
