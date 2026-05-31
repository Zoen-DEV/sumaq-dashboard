"use client";

import { Dialog } from "@base-ui/react/dialog";

interface Props {
  open: boolean;
  titulo: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDeleteDialog({ open, titulo, onConfirm, onCancel }: Props) {
  return (
    <Dialog.Root open={open} onOpenChange={o => !o && onCancel()}>
      <Dialog.Portal>
        <Dialog.Backdrop style={{
          position: "fixed",
          inset: 0,
          background: "oklch(0% 0 0 / 0.55)",
          zIndex: 200,
        }} />
        <Dialog.Popup style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "var(--color-surface-elevated)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-lg)",
          padding: "1.5rem",
          width: "min(400px, calc(100vw - 2rem))",
          zIndex: 201,
          boxShadow: "0 16px 48px oklch(0% 0 0 / 0.5)",
        }}>
          <Dialog.Title style={{
            fontSize: "var(--text-base)",
            fontWeight: 600,
            color: "var(--color-foreground)",
            marginBottom: "0.75rem",
          }}>
            Eliminar tarea
          </Dialog.Title>
          <Dialog.Description style={{
            fontSize: "var(--text-sm)",
            color: "var(--color-muted)",
            lineHeight: 1.6,
          }}>
            ¿Estás seguro que querés eliminar la tarea{" "}
            <strong style={{ color: "var(--color-foreground)", fontWeight: 500 }}>
              &ldquo;{titulo}&rdquo;
            </strong>
            ? Esta acción no se puede deshacer.
          </Dialog.Description>
          <div style={{
            display: "flex",
            gap: "0.5rem",
            justifyContent: "flex-end",
            marginTop: "1.5rem",
          }}>
            <button
              onClick={onCancel}
              style={cancelBtnStyle}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--color-foreground)"; e.currentTarget.style.color = "var(--color-foreground)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--color-border)"; e.currentTarget.style.color = "var(--color-muted)"; }}
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              style={deleteBtnStyle}
              onMouseEnter={e => { e.currentTarget.style.opacity = "0.85"; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
            >
              Eliminar
            </button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

const cancelBtnStyle: React.CSSProperties = {
  background: "transparent",
  color: "var(--color-muted)",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius)",
  fontSize: "var(--text-sm)",
  fontWeight: 500,
  padding: "0.5rem 1rem",
  cursor: "pointer",
  transition: "border-color var(--dur-fast), color var(--dur-fast)",
};

const deleteBtnStyle: React.CSSProperties = {
  background: "var(--color-destructive)",
  color: "#fff",
  border: "none",
  borderRadius: "var(--radius)",
  fontSize: "var(--text-sm)",
  fontWeight: 500,
  padding: "0.5rem 1rem",
  cursor: "pointer",
  transition: "opacity var(--dur-fast)",
};
