"use client";

import { useState, useEffect } from "react";
import { useEditor, useEditorState, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import { Dialog } from "@base-ui/react/dialog";
import {
  Bold, Italic, List, ListOrdered, Heading2,
  X, Trash2, ChevronDown, Check, Pencil,
} from "lucide-react";
import type { ITarea, EstadoTarea } from "@/types";
import { ESTADOS_TAREA } from "@/types";

interface Props {
  open: boolean;
  tarea: ITarea | null;
  initialMode?: "preview" | "edit";
  onSave: (id: string, updates: { titulo: string; descripcion: string; estado: EstadoTarea }) => void;
  onClose: () => void;
  onDeleteRequest: (id: string) => void;
}

export function TareaModal({ open, tarea, initialMode = "preview", onSave, onClose, onDeleteRequest }: Props) {
  const [mode, setMode] = useState<"preview" | "edit">("preview");
  const [titulo, setTitulo] = useState("");
  const [estado, setEstado] = useState<EstadoTarea>("pendiente");
  const [selectOpen, setSelectOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: false }),
      Heading.configure({ levels: [2, 3] }),
    ],
    content: "",
    editorProps: {
      attributes: { class: "tiptap-editor-content" },
    },
  });

  const marks = useEditorState({
    editor,
    selector: ({ editor }) => ({
      bold:    editor?.isActive("bold") ?? false,
      italic:  editor?.isActive("italic") ?? false,
      h2:      editor?.isActive("heading", { level: 2 }) ?? false,
      bullet:  editor?.isActive("bulletList") ?? false,
      ordered: editor?.isActive("orderedList") ?? false,
    }),
  });

  useEffect(() => {
    if (!tarea || !editor || !open) return;
    setMode(initialMode);
    setTitulo(tarea.titulo);
    setEstado(tarea.estado);
    editor.commands.setContent(tarea.descripcion ?? "");
  }, [tarea?.id, editor, open, initialMode]);

  function handleSave() {
    if (!tarea) return;
    const html = editor?.getHTML() ?? "";
    const isEmpty = html === "<p></p>" || html === "";
    onSave(tarea.id, {
      titulo: titulo.trim() || tarea.titulo,
      descripcion: isEmpty ? "" : html,
      estado,
    });
    setMode("preview");
  }

  function handleCancel() {
    if (!tarea) return;
    setTitulo(tarea.titulo);
    setEstado(tarea.estado);
    editor?.commands.setContent(tarea.descripcion ?? "");
    setMode("preview");
  }

  function handleEstadoChange(newEstado: EstadoTarea) {
    setEstado(newEstado);
    setSelectOpen(false);
    if (mode === "preview" && tarea) {
      onSave(tarea.id, {
        titulo: tarea.titulo,
        descripcion: tarea.descripcion ?? "",
        estado: newEstado,
      });
    }
  }

  const estadoInfo = ESTADOS_TAREA.find(e => e.value === estado);
  const descripcionHtml = tarea?.descripcion ?? "";
  const hasDescripcion = descripcionHtml && descripcionHtml !== "<p></p>" && descripcionHtml !== "";

  const EstadoSelect = (
    <div
      style={{ position: "relative", display: "inline-block" }}
      onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) setSelectOpen(false); }}
    >
      <button
        type="button"
        onClick={() => setSelectOpen(o => !o)}
        style={selectTriggerStyle}
      >
        <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{
            width: 7, height: 7, borderRadius: "50%",
            background: estadoInfo?.color, flexShrink: 0, display: "inline-block",
          }} />
          <span style={{ fontSize: "var(--text-sm)" }}>{estadoInfo?.label}</span>
        </span>
        <ChevronDown
          size={14}
          style={{
            color: "var(--color-muted)",
            transition: "transform var(--dur-fast)",
            transform: selectOpen ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>
      {selectOpen && (
        <div style={{
          position: "absolute",
          top: "calc(100% + 4px)",
          left: 0,
          background: "var(--color-surface-elevated)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius)",
          boxShadow: "0 8px 24px oklch(0% 0 0 / 0.4)",
          padding: "0.25rem",
          minWidth: "180px",
          zIndex: 110,
          display: "flex",
          flexDirection: "column",
          gap: "1px",
        }}>
          {ESTADOS_TAREA.map(e => (
            <button
              key={e.value}
              type="button"
              className="select-item"
              onClick={() => handleEstadoChange(e.value as EstadoTarea)}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", flex: 1 }}>
                <span style={{
                  width: 7, height: 7, borderRadius: "50%",
                  background: e.color, flexShrink: 0, display: "inline-block",
                }} />
                <span style={{ fontSize: "var(--text-sm)", color: "var(--color-foreground)" }}>
                  {e.label}
                </span>
              </span>
              {estado === e.value && (
                <Check size={12} style={{ color: "var(--color-accent)", flexShrink: 0 }} />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <Dialog.Root open={open} onOpenChange={o => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Backdrop style={{
          position: "fixed",
          inset: 0,
          background: "oklch(0% 0 0 / 0.5)",
          zIndex: 100,
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
          width: "min(560px, calc(100vw - 2rem))",
          maxHeight: "calc(100dvh - 4rem)",
          overflowY: "auto",
          zIndex: 101,
          boxShadow: "0 24px 64px oklch(0% 0 0 / 0.55)",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}>

          {mode === "preview" ? (
            <>
              {/* Preview header */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                <p style={{
                  flex: 1,
                  margin: 0,
                  color: "var(--color-foreground)",
                  fontSize: "var(--text-lg)",
                  fontWeight: 600,
                  lineHeight: "var(--leading-snug)",
                  paddingBottom: "0.25rem",
                }}>
                  {tarea?.titulo}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", flexShrink: 0 }}>
                  <button
                    onClick={() => setMode("edit")}
                    aria-label="Editar tarea"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.375rem",
                      background: "transparent",
                      border: "1px solid var(--color-border)",
                      borderRadius: "var(--radius)",
                      color: "var(--color-muted)",
                      cursor: "pointer",
                      fontSize: "var(--text-xs)",
                      fontWeight: 500,
                      padding: "0.3rem 0.6rem",
                      transition: "color var(--dur-fast), border-color var(--dur-fast)",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.color = "var(--color-foreground)";
                      e.currentTarget.style.borderColor = "var(--color-foreground)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.color = "var(--color-muted)";
                      e.currentTarget.style.borderColor = "var(--color-border)";
                    }}
                  >
                    <Pencil size={12} />
                    Editar
                  </button>
                  <button
                    onClick={onClose}
                    aria-label="Cerrar"
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "var(--color-muted)",
                      cursor: "pointer",
                      padding: "0.25rem",
                      display: "flex",
                      transition: "color var(--dur-fast)",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = "var(--color-foreground)"; }}
                    onMouseLeave={e => { e.currentTarget.style.color = "var(--color-muted)"; }}
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Estado (editable en preview) */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                <span style={labelStyle}>Estado</span>
                {EstadoSelect}
              </div>

              {/* Descripción (solo lectura) */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                <span style={labelStyle}>Descripción</span>
                {hasDescripcion ? (
                  <div
                    className="tiptap-editor-content"
                    dangerouslySetInnerHTML={{ __html: descripcionHtml }}
                    style={{
                      border: "1px solid var(--color-border)",
                      borderRadius: "var(--radius)",
                      background: "color-mix(in oklch, var(--color-foreground) 2%, transparent)",
                      minHeight: "80px",
                      padding: "0.625rem 0.75rem",
                      color: "var(--color-foreground)",
                    }}
                  />
                ) : (
                  <p style={{
                    margin: 0,
                    fontSize: "var(--text-sm)",
                    color: "var(--color-muted)",
                    fontStyle: "italic",
                  }}>
                    Sin descripción
                  </p>
                )}
              </div>

              {/* Footer preview */}
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <button
                  onClick={() => tarea && onDeleteRequest(tarea.id)}
                  style={deleteBtnStyle}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = "oklch(from var(--color-destructive) l c h / 0.1)";
                    e.currentTarget.style.color = "var(--color-destructive)";
                    e.currentTarget.style.borderColor = "oklch(from var(--color-destructive) l c h / 0.4)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "var(--color-muted)";
                    e.currentTarget.style.borderColor = "var(--color-border)";
                  }}
                >
                  <Trash2 size={13} />
                  Eliminar tarea
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Edit header */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                <input
                  value={titulo}
                  onChange={e => setTitulo(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") e.preventDefault(); }}
                  placeholder="Título de la tarea"
                  style={{
                    flex: 1,
                    background: "transparent",
                    border: "none",
                    borderBottom: "1px solid var(--color-border)",
                    borderRadius: 0,
                    color: "var(--color-foreground)",
                    fontSize: "var(--text-lg)",
                    fontWeight: 600,
                    padding: "0.25rem 0",
                    outline: "none",
                    fontFamily: "inherit",
                    transition: "border-color var(--dur-fast)",
                  }}
                  onFocus={e => { e.currentTarget.style.borderBottomColor = "var(--color-accent)"; }}
                  onBlur={e => { e.currentTarget.style.borderBottomColor = "var(--color-border)"; }}
                />
                <button
                  onClick={onClose}
                  aria-label="Cerrar"
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "var(--color-muted)",
                    cursor: "pointer",
                    padding: "0.25rem",
                    display: "flex",
                    flexShrink: 0,
                    transition: "color var(--dur-fast)",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = "var(--color-foreground)"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = "var(--color-muted)"; }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Estado */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                <span style={labelStyle}>Estado</span>
                {EstadoSelect}
              </div>

              {/* Descripción */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                <span style={labelStyle}>Descripción</span>

                {/* Toolbar */}
                {editor && (
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "2px",
                    padding: "0.25rem",
                    background: "color-mix(in oklch, var(--color-foreground) 4%, transparent)",
                    borderRadius: "var(--radius) var(--radius) 0 0",
                    border: "1px solid var(--color-border)",
                    borderBottom: "none",
                  }}>
                    <ToolbarBtn
                      active={marks?.bold ?? false}
                      onClick={() => editor.chain().focus().toggleBold().run()}
                      title="Negrita"
                    >
                      <Bold size={13} />
                    </ToolbarBtn>
                    <ToolbarBtn
                      active={marks?.italic ?? false}
                      onClick={() => editor.chain().focus().toggleItalic().run()}
                      title="Cursiva"
                    >
                      <Italic size={13} />
                    </ToolbarBtn>
                    <ToolbarDivider />
                    <ToolbarBtn
                      active={marks?.h2 ?? false}
                      onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                      title="Título"
                    >
                      <Heading2 size={13} />
                    </ToolbarBtn>
                    <ToolbarDivider />
                    <ToolbarBtn
                      active={marks?.bullet ?? false}
                      onClick={() => editor.chain().focus().toggleBulletList().run()}
                      title="Lista con viñetas"
                    >
                      <List size={13} />
                    </ToolbarBtn>
                    <ToolbarBtn
                      active={marks?.ordered ?? false}
                      onClick={() => editor.chain().focus().toggleOrderedList().run()}
                      title="Lista numerada"
                    >
                      <ListOrdered size={13} />
                    </ToolbarBtn>
                  </div>
                )}

                {/* Editor area */}
                <div
                  style={{
                    border: "1px solid var(--color-border)",
                    borderRadius: editor ? "0 0 var(--radius) var(--radius)" : "var(--radius)",
                    background: "color-mix(in oklch, var(--color-foreground) 2%, transparent)",
                    minHeight: "140px",
                    maxHeight: "320px",
                    overflowY: "auto",
                    resize: "vertical",
                    cursor: "text",
                  }}
                  onClick={() => editor?.commands.focus()}
                >
                  <EditorContent editor={editor} />
                </div>
              </div>

              {/* Footer edit */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <button
                  onClick={() => tarea && onDeleteRequest(tarea.id)}
                  style={deleteBtnStyle}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = "oklch(from var(--color-destructive) l c h / 0.1)";
                    e.currentTarget.style.color = "var(--color-destructive)";
                    e.currentTarget.style.borderColor = "oklch(from var(--color-destructive) l c h / 0.4)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "var(--color-muted)";
                    e.currentTarget.style.borderColor = "var(--color-border)";
                  }}
                >
                  <Trash2 size={13} />
                  Eliminar tarea
                </button>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    onClick={handleCancel}
                    style={cancelBtnStyle}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--color-foreground)"; e.currentTarget.style.color = "var(--color-foreground)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--color-border)"; e.currentTarget.style.color = "var(--color-muted)"; }}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    style={saveBtnStyle}
                    onMouseEnter={e => { e.currentTarget.style.opacity = "0.85"; }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
                  >
                    Guardar
                  </button>
                </div>
              </div>
            </>
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function ToolbarBtn({
  children, active, onClick, title,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  title: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      type="button"
      className={`toolbar-btn${active ? " toolbar-btn--active" : ""}`}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return (
    <span style={{
      width: "1px",
      height: "16px",
      background: "var(--color-border)",
      margin: "0 0.25rem",
      flexShrink: 0,
    }} />
  );
}

const labelStyle: React.CSSProperties = {
  fontSize: "var(--text-xs)",
  fontWeight: 500,
  color: "var(--color-muted)",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const selectTriggerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "0.5rem",
  background: "var(--color-background)",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius)",
  color: "var(--color-foreground)",
  fontSize: "var(--text-sm)",
  padding: "0.5rem 0.75rem",
  cursor: "pointer",
  outline: "none",
  width: "200px",
};

const deleteBtnStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.375rem",
  background: "transparent",
  color: "var(--color-muted)",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius)",
  fontSize: "var(--text-xs)",
  fontWeight: 500,
  padding: "0.5rem 0.75rem",
  cursor: "pointer",
  transition: "background var(--dur-fast), color var(--dur-fast), border-color var(--dur-fast)",
};

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

const saveBtnStyle: React.CSSProperties = {
  background: "var(--color-accent)",
  color: "#fff",
  border: "none",
  borderRadius: "var(--radius)",
  fontSize: "var(--text-sm)",
  fontWeight: 500,
  padding: "0.5rem 1rem",
  cursor: "pointer",
  transition: "opacity var(--dur-fast)",
};
