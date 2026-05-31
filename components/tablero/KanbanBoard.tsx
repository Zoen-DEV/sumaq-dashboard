"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { toast } from "sonner";
import type { IProyecto, EstadoProyecto } from "@/types";
import { ESTADOS } from "@/types";
import { useIsGuest } from "@/lib/demo/useIsGuest";
import { updateEstado } from "@/lib/proyectos-client";
import { KanbanColumn } from "./KanbanColumn";
import { KanbanCard } from "./KanbanCard";

interface Props {
  initialProyectos: IProyecto[];
}

type Columns = Record<EstadoProyecto, IProyecto[]>;

function buildColumns(proyectos: IProyecto[]): Columns {
  const cols: Columns = {
    "en-negociacion": [],
    "en-proceso":     [],
    "mantenimiento":  [],
    "completado":     [],
  };
  for (const p of proyectos) {
    cols[p.estado].push(p);
  }
  return cols;
}

export function KanbanBoard({ initialProyectos }: Props) {
  const isGuest = useIsGuest();
  const [columns, setColumns]         = useState(() => buildColumns(initialProyectos));
  const [activeId, setActiveId]       = useState<string | null>(null);
  const [overColumn, setOverColumn]   = useState<EstadoProyecto | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const activeProyecto = activeId
    ? Object.values(columns).flat().find(p => p._id === activeId)
    : null;

  function findColumn(id: string): EstadoProyecto | null {
    for (const [col, items] of Object.entries(columns)) {
      if (items.find(p => p._id === id)) return col as EstadoProyecto;
      if (col === id) return id as EstadoProyecto;
    }
    return null;
  }

  function handleDragStart({ active }: DragStartEvent) {
    setActiveId(active.id as string);
  }

  function handleDragOver({ active, over }: DragOverEvent) {
    if (!over) return;

    const activeCol = findColumn(active.id as string);
    const overCol   = findColumn(over.id as string);

    if (!activeCol || !overCol || activeCol === overCol) {
      setOverColumn(overCol);
      return;
    }

    setOverColumn(overCol);
    setColumns(prev => {
      const activeItems = [...prev[activeCol]];
      const overItems   = [...prev[overCol]];
      const activeIndex = activeItems.findIndex(p => p._id === active.id);
      const item = activeItems.splice(activeIndex, 1)[0];

      return {
        ...prev,
        [activeCol]: activeItems,
        [overCol]:   [...overItems, { ...item, estado: overCol }],
      };
    });
  }

  async function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveId(null);
    setOverColumn(null);

    if (!over) return;

    const activeCol = findColumn(active.id as string);
    const overCol   = findColumn(over.id as string);

    if (!activeCol || !overCol) return;

    if (activeCol === overCol) {
      setColumns(prev => {
        const items      = [...prev[activeCol]];
        const activeIdx  = items.findIndex(p => p._id === active.id);
        const overIdx    = items.findIndex(p => p._id === over.id);
        if (activeIdx === -1 || overIdx === -1) return prev;
        return { ...prev, [activeCol]: arrayMove(items, activeIdx, overIdx) };
      });
      return;
    }

    const proyecto = Object.values(columns).flat().find(p => p._id === active.id);
    if (!proyecto) return;

    const result = await updateEstado(isGuest, active.id as string, overCol);

    if (!result.ok) {
      toast.error(result.error);
      setColumns(prev => buildColumns(Object.values(prev).flat()));
    } else {
      toast.success("Estado actualizado");
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "1rem",
          alignItems: "start",
        }}
      >
        {ESTADOS.map(e => (
          <KanbanColumn
            key={e.value}
            estado={e.value}
            proyectos={columns[e.value]}
            isOver={overColumn === e.value}
          />
        ))}
      </div>

      <DragOverlay>
        {activeProyecto && (
          <div style={{ opacity: 0.9, transform: "rotate(1.5deg)" }}>
            <KanbanCard proyecto={activeProyecto} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
