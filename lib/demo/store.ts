import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  IProyecto,
  ITarea,
  ProyectoInput,
  EstadoProyecto,
} from "@/types";
import { buildSeedProyectos } from "./seed";

interface DemoState {
  proyectos: IProyecto[];
  createProyecto: (input: ProyectoInput) => IProyecto;
  updateProyecto: (id: string, input: Partial<ProyectoInput>) => IProyecto | null;
  deleteProyecto: (id: string) => void;
  saveTareas: (id: string, tareas: ITarea[]) => void;
  updateEstado: (id: string, estado: EstadoProyecto) => void;
  reset: () => void;
}

const nowIso = () => new Date().toISOString();

export const useDemoStore = create<DemoState>()(
  persist(
    (set, get) => ({
      proyectos: buildSeedProyectos(),

      createProyecto: (input) => {
        const ahora = nowIso();
        const nuevo: IProyecto = {
          ...input,
          _id: `demo-${crypto.randomUUID()}`,
          createdAt: ahora,
          updatedAt: ahora,
        };
        set({ proyectos: [nuevo, ...get().proyectos] });
        return nuevo;
      },

      updateProyecto: (id, input) => {
        let actualizado: IProyecto | null = null;
        set({
          proyectos: get().proyectos.map((p) => {
            if (p._id !== id) return p;
            actualizado = { ...p, ...input, updatedAt: nowIso() };
            return actualizado;
          }),
        });
        return actualizado;
      },

      deleteProyecto: (id) =>
        set({ proyectos: get().proyectos.filter((p) => p._id !== id) }),

      saveTareas: (id, tareas) =>
        set({
          proyectos: get().proyectos.map((p) =>
            p._id === id ? { ...p, tareas, updatedAt: nowIso() } : p,
          ),
        }),

      updateEstado: (id, estado) =>
        set({
          proyectos: get().proyectos.map((p) =>
            p._id === id ? { ...p, estado, updatedAt: nowIso() } : p,
          ),
        }),

      reset: () => set({ proyectos: buildSeedProyectos() }),
    }),
    {
      name: "sumaq-demo",
      // Vive solo en la pestaña: al cerrarla se borra y la demo vuelve al seed.
      storage: createJSONStorage(() => sessionStorage),
      // No hidratar en la creación del store (el servidor no tiene sessionStorage).
      // Las islas guest llaman a la rehidratación tras montar; ver useDemoHydrated.
      skipHydration: true,
      partialize: (s) => ({ proyectos: s.proyectos }),
    },
  ),
);

/**
 * Rehidrata el store desde sessionStorage una vez montado en el cliente y avisa
 * cuándo terminó. Las islas guest renderizan un estado de carga hasta que es `true`
 * para evitar el desajuste de hidratación entre el HTML del servidor (sin store) y
 * el estado del cliente.
 */
export function useDemoHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    Promise.resolve(useDemoStore.persist.rehydrate()).then(() =>
      setHydrated(true),
    );
  }, []);
  return hydrated;
}
