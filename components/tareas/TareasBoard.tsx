"use client";

import { useRef, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { toast } from "sonner";
import type { ITarea, EstadoTarea } from "@/types";
import { ESTADOS_TAREA } from "@/types";
import { useIsGuest } from "@/lib/demo/useIsGuest";
import { saveTareas } from "@/lib/proyectos-client";
import { TareaColumn } from "./TareaColumn";
import { TareaCardOverlay } from "./TareaCard";
import { TareaModal } from "./TareaModal";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";

interface Props {
  proyectoId: string;
  initialTareas: ITarea[];
}

type Columns = Record<EstadoTarea, ITarea[]>;

function buildColumns(tareas: ITarea[]): Columns {
  const cols: Columns = { pendiente: [], "en-curso": [], completada: [] };
  for (const t of tareas) (cols[t.estado] ?? cols.pendiente).push(t);
  return cols;
}

function flatten(cols: Columns): ITarea[] {
  return [...cols.pendiente, ...cols["en-curso"], ...cols.completada];
}

function serialize(cols: Columns): string {
  return flatten(cols).map(t => `${t.id}:${t.estado}`).join("|");
}

export function TareasBoard({ proyectoId, initialTareas }: Props) {
  const isGuest = useIsGuest();
  const [columns, setColumns]       = useState(() => buildColumns(initialTareas));
  const [activeId, setActiveId]     = useState<string | null>(null);
  const [overColumn, setOverColumn] = useState<EstadoTarea | null>(null);
  const beforeDrag = useRef<Columns | null>(null);

  const [modalTarea, setModalTarea]         = useState<ITarea | null>(null);
  const [modalMode, setModalMode]           = useState<"preview" | "edit">("preview");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  function handleOpen(tarea: ITarea) { setModalMode("preview"); setModalTarea(tarea); }
  function handleEdit(tarea: ITarea) { setModalMode("edit");    setModalTarea(tarea); }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const activeTarea = activeId
    ? flatten(columns).find(t => t.id === activeId) ?? null
    : null;

  const confirmTarea = confirmDeleteId
    ? flatten(columns).find(t => t.id === confirmDeleteId) ?? null
    : null;

  function findColumn(id: string): EstadoTarea | null {
    if (id in columns) return id as EstadoTarea;
    for (const [col, items] of Object.entries(columns)) {
      if (items.find(t => t.id === id)) return col as EstadoTarea;
    }
    return null;
  }

  async function persist(next: Columns, prev: Columns) {
    const result = await saveTareas(isGuest, proyectoId, flatten(next));
    if (!result.ok) {
      toast.error(result.error);
      setColumns(prev);
    }
  }

  function handleAdd(estado: EstadoTarea, titulo: string) {
    const prev = columns;
    const nueva: ITarea = {
      id: crypto.randomUUID(),
      titulo,
      descripcion: "",
      estado,
      createdAt: new Date().toISOString(),
    };
    const next = { ...columns, [estado]: [...columns[estado], nueva] };
    setColumns(next);
    persist(next, prev);
  }

  function handleDeleteRequest(id: string) {
    setConfirmDeleteId(id);
  }

  function handleDeleteConfirmed() {
    if (!confirmDeleteId) return;
    const id = confirmDeleteId;
    setConfirmDeleteId(null);
    setModalTarea(null);
    const col = findColumn(id);
    if (!col) return;
    const prev = columns;
    const next = { ...columns, [col]: columns[col].filter(t => t.id !== id) };
    setColumns(next);
    persist(next, prev);
    toast.success("Tarea eliminada");
  }

  function handleSaveModal(id: string, updates: { titulo: string; descripcion: string; estado: EstadoTarea }) {
    const col = findColumn(id);
    if (!col) return;
    const prev = columns;

    if (col === updates.estado) {
      const next = {
        ...columns,
        [col]: columns[col].map(t => t.id === id ? { ...t, ...updates } : t),
      };
      setColumns(next);
      persist(next, prev);
    } else {
      // Cambió de columna: mover al final de la nueva columna
      const fromItems = columns[col].filter(t => t.id !== id);
      const moved     = { ...columns[col].find(t => t.id === id)!, ...updates };
      const next = {
        ...columns,
        [col]:             fromItems,
        [updates.estado]:  [...columns[updates.estado], moved],
      };
      setColumns(next);
      persist(next, prev);
    }

    setModalTarea(null);
    toast.success("Tarea guardada");
  }

  function handleDragStart({ active }: DragStartEvent) {
    beforeDrag.current = columns;
    setActiveId(active.id as string);
  }

  function handleDragOver({ active, over }: DragOverEvent) {
    if (!over) return;
    const activeCol = findColumn(active.id as string);
    const overCol   = findColumn(over.id as string);
    if (!activeCol || !overCol) return;

    setOverColumn(overCol);
    if (activeCol === overCol) return;

    setColumns(prev => {
      const activeItems = [...prev[activeCol]];
      const overItems   = [...prev[overCol]];
      const idx = activeItems.findIndex(t => t.id === active.id);
      if (idx === -1) return prev;
      const [item] = activeItems.splice(idx, 1);
      return {
        ...prev,
        [activeCol]: activeItems,
        [overCol]:   [...overItems, { ...item, estado: overCol }],
      };
    });
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveId(null);
    setOverColumn(null);

    const prev = beforeDrag.current ?? columns;
    beforeDrag.current = null;
    if (!over) { setColumns(prev); return; }

    const activeCol = findColumn(active.id as string);
    const overCol   = findColumn(over.id as string);
    if (!activeCol || !overCol) { setColumns(prev); return; }

    let next = columns;
    if (activeCol === overCol) {
      const items     = [...columns[activeCol]];
      const activeIdx = items.findIndex(t => t.id === active.id);
      const overIdx   = items.findIndex(t => t.id === over.id);
      if (activeIdx !== -1 && overIdx !== -1 && activeIdx !== overIdx) {
        next = { ...columns, [activeCol]: arrayMove(items, activeIdx, overIdx) };
        setColumns(next);
      }
    }

    if (serialize(prev) !== serialize(next)) persist(next, prev);
  }

  return (
    <>
      <DndContext
        id="tareas-board"
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div style={{ overflowX: "auto", paddingBottom: "0.5rem" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(260px, 1fr))",
              gap: "1rem",
              alignItems: "start",
            }}
          >
            {ESTADOS_TAREA.map(e => (
              <TareaColumn
                key={e.value}
                estado={e.value}
                tareas={columns[e.value]}
                isOver={overColumn === e.value}
                onAddTarea={handleAdd}
                onOpen={handleOpen}
                onEdit={handleEdit}
                onDelete={handleDeleteRequest}
              />
            ))}
          </div>
        </div>

        <DragOverlay>
          {activeTarea && (
            <div style={{ opacity: 0.9, transform: "rotate(1.5deg)" }}>
              <TareaCardOverlay tarea={activeTarea} />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      <TareaModal
        open={modalTarea !== null}
        tarea={modalTarea}
        initialMode={modalMode}
        onSave={handleSaveModal}
        onClose={() => setModalTarea(null)}
        onDeleteRequest={handleDeleteRequest}
      />

      <ConfirmDeleteDialog
        open={confirmDeleteId !== null}
        titulo={confirmTarea?.titulo ?? ""}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </>
  );
}
