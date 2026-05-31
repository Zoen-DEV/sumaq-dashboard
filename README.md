# Sumaq Dashboard

Dashboard interno de **gestión de proyectos de clientes** de Sumaq Studios: estado, tiempos, presupuesto, links, diseños y tareas de cada proyecto, con un tablero Kanban para mover proyectos entre estados y gestionar tareas.

> Herramienta interna. No es un producto de cliente ni la web corporativa.

## Stack

| Tecnología | Versión | Rol |
|---|---|---|
| Next.js | 16 (App Router) | Framework — Server Components + data fetching en servidor |
| React | 19 | UI |
| MongoDB + Mongoose | 9 | Persistencia con modelos tipados |
| NextAuth | 5 (beta) | Autenticación · roles `admin` / `guest` (modo demo) |
| Base UI | 1 | Primitivas accesibles (Dialog, Select) |
| Tailwind CSS | 4 | Estilos utility-first + design tokens en `globals.css` |
| dnd-kit | 6 | Drag & drop del tablero y de tareas |
| TipTap | 3 | Editor de notas de tareas |
| Recharts | 3 | Gráficos del dashboard (donut, barras) |
| Zustand | 5 | Store del modo demo (guest) |
| TypeScript | 5 (estricto) | Tipado |

Tipografía **Geist / Geist Mono** self-hosted en `/public/fonts/`.

## Rutas

| Ruta | Descripción |
|---|---|
| `/` | Dashboard: resumen de métricas, distribución por estado, presupuesto, recientes y próximas entregas |
| `/proyectos` | Listado de proyectos |
| `/proyectos/nuevo` | Alta de proyecto |
| `/proyectos/[id]` | Detalle: resumen, stack, links y tablero de tareas |
| `/proyectos/[id]/editar` | Edición |
| `/tablero` | Kanban: estado de proyectos o tareas por proyecto |
| `/login` | Acceso (incluye entrada al modo demo / guest) |

## Desarrollo

Package manager: **pnpm 11+**.

```bash
# Instalación limpia: pnpm 10+ bloquea build scripts nativos por defecto
pnpm install
pnpm approve-builds esbuild sharp   # solo la primera vez

pnpm dev      # servidor de desarrollo
pnpm build    # build de producción
pnpm start    # servir el build
pnpm lint     # eslint
```

Variables de entorno necesarias (en `.env.local`): cadena de conexión a MongoDB y el secreto de NextAuth. El modo **guest/demo** funciona sin base de datos: los datos viven en un store de Zustand en el cliente.

## Diseño responsive

Adaptado a **mobile, tablet y desktop** (mobile-first). Breakpoints alineados a Tailwind:

- **Mobile** `< 768px` · **Tablet** `768–1023px` (`md`) · **Desktop** `≥ 1024px` (`lg`)

Comportamientos clave por viewport:

- **Navegación:** sidebar fija solo en desktop (`≥ lg`); en mobile/tablet se reemplaza por una **bottom tab bar** con los destinos principales. Cerrar sesión pasa a un botón en el header en ese rango.
- **Layouts:** los grids del dashboard, el strip de métricas (2 → 3 → 5 columnas) y el resumen del detalle colapsan a una columna en pantallas chicas.
- **Tableros:** el Kanban y el board de tareas usan scroll horizontal contenido en mobile/tablet.
- **Formularios:** campos a una columna y acciones apiladas a ancho completo en mobile.

Como gran parte de la estructura usa estilos inline (que no admiten media queries), los layouts que necesitan adaptarse viven como **clases semánticas con `@media` en `app/globals.css`** (`.page-pad`, `.dash-grid-2`, `.dash-grid-main`, `.resumen-strip`, `.kanban-grid`, `.detalle-resumen`).

## Despliegue

App Next.js estándar (SSR/Server Components). Desplegable en Vercel; requiere las variables de entorno de MongoDB y NextAuth.
