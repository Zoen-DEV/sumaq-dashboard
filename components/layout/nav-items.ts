import { LayoutDashboard, FolderKanban, KanbanSquare, type LucideIcon } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const NAV: NavItem[] = [
  { href: "/",          label: "Dashboard", icon: LayoutDashboard },
  { href: "/proyectos", label: "Proyectos", icon: FolderKanban },
  { href: "/tablero",   label: "Tablero",   icon: KanbanSquare },
];

/** Activo: la raíz solo en exacto, el resto por prefijo de ruta. */
export function isNavActive(href: string, pathname: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}
