import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { EstadoProyecto } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function daysUntil(date: string): number {
  const diff = new Date(date).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function estadoLabel(estado: EstadoProyecto): string {
  const map: Record<EstadoProyecto, string> = {
    "en-negociacion": "En negociación",
    "en-proceso":     "En proceso",
    "mantenimiento":  "Mantenimiento",
    "completado":     "Completado",
  };
  return map[estado];
}
