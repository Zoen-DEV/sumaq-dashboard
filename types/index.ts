export type EstadoProyecto =
  | "en-negociacion"
  | "en-proceso"
  | "mantenimiento"
  | "completado";

export const ESTADOS: { value: EstadoProyecto; label: string; color: string }[] = [
  { value: "en-negociacion",  label: "En negociación",  color: "var(--color-status-negociacion)" },
  { value: "en-proceso",      label: "En proceso",      color: "var(--color-status-proceso)" },
  { value: "mantenimiento",   label: "Mantenimiento",   color: "var(--color-status-mantenimiento)" },
  { value: "completado",      label: "Completado",      color: "var(--color-status-completado)" },
];

export type EstadoTarea = "pendiente" | "en-curso" | "completada";

export const ESTADOS_TAREA: { value: EstadoTarea; label: string; color: string }[] = [
  { value: "pendiente",  label: "Pendientes",  color: "var(--color-status-negociacion)" },
  { value: "en-curso",   label: "En curso",    color: "var(--color-status-proceso)" },
  { value: "completada", label: "Completadas", color: "var(--color-status-mantenimiento)" },
];

export interface ITarea {
  id: string;
  titulo: string;
  descripcion?: string;
  estado: EstadoTarea;
  createdAt: string;
}

export interface ILink {
  etiqueta: string;
  url: string;
}

export interface IProyecto {
  _id: string;
  nombre: string;
  cliente: {
    nombre: string;
    empresa: string;
  };
  estado: EstadoProyecto;
  fechaInicio: string;
  fechaEntrega: string;
  presupuesto: number;
  links: ILink[];
  descripcion: string;
  tecnologias: string[];
  tareas: ITarea[];
  createdAt: string;
  updatedAt: string;
}

export type ProyectoInput = Omit<IProyecto, "_id" | "createdAt" | "updatedAt">;
