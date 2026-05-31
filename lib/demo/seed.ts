import type { IProyecto, ITarea } from "@/types";

// Datos ficticios del modo demo. Clientes deliberadamente inventados para que nunca
// se confundan con proyectos reales. Los `_id` son estables (`demo-1`…`demo-4`) para
// que las rutas /proyectos/demo-N funcionen de forma determinista.
//
// Las fechas se generan relativas a "hoy" para que el tablero y las "próximas
// entregas" sigan teniendo sentido sin importar cuándo se abra la demo.

const HOY = new Date();

function isoOffset(dias: number): string {
  const d = new Date(HOY);
  d.setDate(d.getDate() + dias);
  return d.toISOString().slice(0, 10);
}

function ts(dias: number): string {
  const d = new Date(HOY);
  d.setDate(d.getDate() + dias);
  return d.toISOString();
}

function tarea(
  titulo: string,
  estado: ITarea["estado"],
  descripcion = "",
  diasCreada = -3,
): ITarea {
  return {
    id: crypto.randomUUID(),
    titulo,
    descripcion,
    estado,
    createdAt: ts(diasCreada),
  };
}

// Factoría: cada llamada produce una copia fresca con `id` de tareas nuevos. Así el
// botón "Reiniciar demo" siempre parte de un estado limpio e independiente.
export function buildSeedProyectos(): IProyecto[] {
  return [
    {
      _id: "demo-1",
      nombre: "Rediseño web corporativa",
      cliente: { nombre: "María Restrepo", empresa: "Acme Labs" },
      estado: "en-negociacion",
      fechaInicio: isoOffset(7),
      fechaEntrega: isoOffset(52),
      presupuesto: 14_500_000,
      descripcion:
        "Sitio institucional con CMS headless, blog y migración de contenido. En fase de propuesta y alcance.",
      tecnologias: ["Next.js", "Tailwind", "Sanity"],
      links: [
        { etiqueta: "Propuesta", url: "https://example.com/propuesta-acme" },
        { etiqueta: "Figma", url: "https://figma.com/file/demo-acme" },
      ],
      tareas: [
        tarea("Reunión de descubrimiento", "completada", "Objetivos, públicos y referentes."),
        tarea("Propuesta económica", "en-curso", "Desglose por fases."),
        tarea("Definir arquitectura de información", "pendiente"),
        tarea("Moodboard de dirección de arte", "pendiente"),
      ],
      createdAt: ts(-12),
      updatedAt: ts(-1),
    },
    {
      _id: "demo-2",
      nombre: "App móvil de pedidos",
      cliente: { nombre: "Julián Cano", empresa: "Lumen Foods" },
      estado: "en-proceso",
      fechaInicio: isoOffset(-30),
      fechaEntrega: isoOffset(24),
      presupuesto: 38_000_000,
      descripcion:
        "App de pedidos con pagos in-app, seguimiento en tiempo real y panel de cocina.",
      tecnologias: ["React Native", "Expo", "Node.js", "PostgreSQL"],
      links: [
        { etiqueta: "Repo", url: "https://github.com/demo/lumen-app" },
        { etiqueta: "Tablero", url: "https://example.com/lumen-board" },
      ],
      tareas: [
        tarea("Setup del proyecto y CI", "completada"),
        tarea("Flujo de autenticación", "completada"),
        tarea("Carrito y checkout", "en-curso", "Integración con pasarela."),
        tarea("Notificaciones push", "en-curso"),
        tarea("Panel de cocina", "pendiente"),
        tarea("Pruebas en dispositivos reales", "pendiente"),
      ],
      createdAt: ts(-34),
      updatedAt: ts(-2),
    },
    {
      _id: "demo-3",
      nombre: "Soporte y evolutivos e-commerce",
      cliente: { nombre: "Paula Ñungo", empresa: "Norte Retail" },
      estado: "mantenimiento",
      fechaInicio: isoOffset(-180),
      fechaEntrega: isoOffset(15),
      presupuesto: 9_200_000,
      descripcion:
        "Contrato mensual de mantenimiento: correcciones, mejoras de performance y nuevas secciones.",
      tecnologias: ["Astro", "Shopify", "TypeScript"],
      links: [{ etiqueta: "Producción", url: "https://example.com/norte" }],
      tareas: [
        tarea("Auditoría de Core Web Vitals", "completada"),
        tarea("Optimizar imágenes del catálogo", "en-curso"),
        tarea("Banner de campaña temporada", "pendiente"),
      ],
      createdAt: ts(-185),
      updatedAt: ts(-5),
    },
    {
      _id: "demo-4",
      nombre: "Landing de lanzamiento",
      cliente: { nombre: "Andrés Vela", empresa: "Vela Studio" },
      estado: "completado",
      fechaInicio: isoOffset(-60),
      fechaEntrega: isoOffset(-8),
      presupuesto: 6_800_000,
      descripcion:
        "Landing de un solo scroll con animaciones GSAP, formulario de captación y analítica.",
      tecnologias: ["Astro", "GSAP", "Tailwind"],
      links: [
        { etiqueta: "Sitio", url: "https://example.com/vela" },
        { etiqueta: "Analítica", url: "https://example.com/vela-analytics" },
      ],
      tareas: [
        tarea("Maquetación", "completada"),
        tarea("Animaciones de scroll", "completada"),
        tarea("Integración de formulario", "completada"),
        tarea("Entrega y traspaso", "completada"),
      ],
      createdAt: ts(-62),
      updatedAt: ts(-8),
    },
  ];
}
