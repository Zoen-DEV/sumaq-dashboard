import type { ITarea, ProyectoInput, EstadoProyecto } from "@/types";
import { useDemoStore } from "@/lib/demo/store";

// Capa de acceso a datos del cliente. Centraliza el único `if (guest)` de las
// mutaciones: en modo demo escribe en el store (sessionStorage); en modo real hace
// el `fetch` a la API como siempre. Los componentes llaman estas funciones y no
// vuelven a saber de `fetch` ni del store.

export type Resultado = { ok: true } | { ok: false; error: string };

// El formulario no gestiona tareas (se crean/mueven en el tablero), por eso el
// payload de alta/edición es ProyectoInput sin `tareas`.
export type ProyectoPayload = Omit<ProyectoInput, "tareas">;

const JSON_HEADERS = { "Content-Type": "application/json" } as const;

async function errorDe(res: Response, fallback: string): Promise<string> {
  const data = await res.json().catch(() => ({}));
  return (data as { error?: string }).error ?? fallback;
}

export async function createProyecto(
  guest: boolean,
  payload: ProyectoPayload,
): Promise<Resultado> {
  if (guest) {
    useDemoStore.getState().createProyecto({ ...payload, tareas: [] });
    return { ok: true };
  }
  const res = await fetch("/api/proyectos", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(payload),
  });
  return res.ok
    ? { ok: true }
    : { ok: false, error: await errorDe(res, "Error al guardar el proyecto") };
}

export async function updateProyecto(
  guest: boolean,
  id: string,
  payload: ProyectoPayload,
): Promise<Resultado> {
  if (guest) {
    useDemoStore.getState().updateProyecto(id, payload);
    return { ok: true };
  }
  const res = await fetch(`/api/proyectos/${id}`, {
    method: "PUT",
    headers: JSON_HEADERS,
    body: JSON.stringify(payload),
  });
  return res.ok
    ? { ok: true }
    : { ok: false, error: await errorDe(res, "Error al guardar el proyecto") };
}

export async function deleteProyecto(
  guest: boolean,
  id: string,
): Promise<Resultado> {
  if (guest) {
    useDemoStore.getState().deleteProyecto(id);
    return { ok: true };
  }
  const res = await fetch(`/api/proyectos/${id}`, { method: "DELETE" });
  return res.ok
    ? { ok: true }
    : { ok: false, error: await errorDe(res, "Error al eliminar") };
}

export async function saveTareas(
  guest: boolean,
  id: string,
  tareas: ITarea[],
): Promise<Resultado> {
  if (guest) {
    useDemoStore.getState().saveTareas(id, tareas);
    return { ok: true };
  }
  const res = await fetch(`/api/proyectos/${id}`, {
    method: "PUT",
    headers: JSON_HEADERS,
    body: JSON.stringify({ tareas }),
  });
  return res.ok
    ? { ok: true }
    : { ok: false, error: await errorDe(res, "No se pudieron guardar las tareas") };
}

export async function updateEstado(
  guest: boolean,
  id: string,
  estado: EstadoProyecto,
): Promise<Resultado> {
  if (guest) {
    useDemoStore.getState().updateEstado(id, estado);
    return { ok: true };
  }
  const res = await fetch(`/api/proyectos/${id}`, {
    method: "PUT",
    headers: JSON_HEADERS,
    body: JSON.stringify({ estado }),
  });
  return res.ok
    ? { ok: true }
    : { ok: false, error: await errorDe(res, "Error al actualizar estado") };
}
