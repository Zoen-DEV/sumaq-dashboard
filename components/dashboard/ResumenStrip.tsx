import type { IProyecto } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface Props {
  proyectos: IProyecto[];
}

interface Stat {
  label: string;
  value: string | number;
  sub?: string;
  large?: boolean;
}

export function ResumenStrip({ proyectos }: Props) {
  const total       = proyectos.length;
  const activos     = proyectos.filter(p => p.estado === "en-proceso").length;
  const negociacion = proyectos.filter(p => p.estado === "en-negociacion").length;
  const completados = proyectos.filter(p => p.estado === "completado").length;
  const facturado   = proyectos
    .filter(p => p.estado === "completado")
    .reduce((acc, p) => acc + p.presupuesto, 0);

  const stats: Stat[] = [
    { label: "Total proyectos",   value: total,                    large: true },
    { label: "En proceso",        value: activos,                  sub: "activos ahora" },
    { label: "En negociación",    value: negociacion },
    { label: "Completados",       value: completados },
    { label: "Facturado total",   value: formatCurrency(facturado), large: true },
  ];

  return (
    <div
      className="animate-fade-up"
      style={{
        display: "grid",
        gridTemplateColumns: "1.6fr 1fr 1fr 1fr 1.6fr",
        gap: "1px",
        background: "var(--color-border)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        border: "1px solid var(--color-border)",
        marginBottom: "2rem",
      }}
    >
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className={i === 0 ? "stagger-1" : i === 4 ? "stagger-5" : `stagger-${i + 1}`}
          style={{
            background: "var(--color-surface)",
            padding: "1.25rem 1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.25rem",
          }}
        >
          <span
            style={{
              fontSize: "var(--text-xs)",
              color: "var(--color-muted)",
              letterSpacing: "0.03em",
              textTransform: "uppercase",
            }}
          >
            {stat.label}
          </span>
          <span
            style={{
              fontSize: stat.large ? "var(--text-3xl)" : "var(--text-2xl)",
              fontWeight: stat.large ? 700 : 600,
              color: stat.large ? "var(--color-accent)" : "var(--color-foreground)",
              lineHeight: 1.1,
            }}
          >
            {stat.value}
          </span>
          {stat.sub && (
            <span style={{ fontSize: "var(--text-xs)", color: "var(--color-muted)" }}>
              {stat.sub}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
