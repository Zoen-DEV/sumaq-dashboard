"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { IProyecto } from "@/types";

interface Props {
  proyectos: IProyecto[];
}

function agruparPorMes(proyectos: IProyecto[]) {
  const meses: Record<string, number> = {};

  for (const p of proyectos) {
    const fecha = new Date(p.fechaInicio);
    const key = fecha.toLocaleDateString("es-AR", { month: "short", year: "2-digit" });
    meses[key] = (meses[key] ?? 0) + p.presupuesto;
  }

  return Object.entries(meses)
    .slice(-8)
    .map(([mes, total]) => ({ mes, total }));
}

export function BarPresupuesto({ proyectos }: Props) {
  const data = agruparPorMes(proyectos);

  if (data.length === 0) {
    return (
      <div
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-lg)",
          padding: "1.25rem 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "280px",
        }}
      >
        <p style={{ color: "var(--color-muted)", fontSize: "var(--text-sm)" }}>
          Sin datos de presupuesto
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-lg)",
        padding: "1.25rem 1.5rem",
      }}
    >
      <h3
        style={{
          fontSize: "var(--text-sm)",
          fontWeight: 600,
          color: "var(--color-foreground)",
          marginBottom: "1rem",
        }}
      >
        Presupuesto por mes (COP)
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} barSize={20}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--color-border)"
            vertical={false}
          />
          <XAxis
            dataKey="mes"
            tick={{ fill: "var(--color-muted)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "var(--color-muted)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={v => v === 0 ? "$0" : `$${(v / 1_000_000).toFixed(1)}M`}
          />
          <Tooltip
            contentStyle={{
              background: "var(--color-surface-elevated)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius)",
              color: "var(--color-foreground)",
              fontSize: "13px",
            }}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(v: any) => [`$${Number(v ?? 0).toLocaleString("es-CO")}`, "Total"]}
            cursor={{ fill: "oklch(20% 0.05 285 / 0.3)" }}
          />
          <Bar
            dataKey="total"
            fill="var(--color-accent)"
            radius={[4, 4, 0, 0]}
            animationDuration={600}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
