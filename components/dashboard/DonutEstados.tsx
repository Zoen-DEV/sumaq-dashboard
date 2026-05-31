"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { IProyecto } from "@/types";
import { ESTADOS } from "@/types";

interface Props {
  proyectos: IProyecto[];
}

const COLORES = [
  "var(--color-status-negociacion)",
  "var(--color-status-proceso)",
  "var(--color-status-mantenimiento)",
  "var(--color-status-completado)",
];

export function DonutEstados({ proyectos }: Props) {
  const data = ESTADOS.map((e, i) => ({
    name: e.label,
    value: proyectos.filter(p => p.estado === e.value).length,
    color: COLORES[i],
  })).filter(d => d.value > 0);

  if (data.length === 0) {
    return (
      <EmptyChart title="Estados" />
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
        Distribución por estado
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
            animationDuration={600}
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "var(--color-surface-elevated)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius)",
              color: "var(--color-foreground)",
              fontSize: "13px",
            }}
            itemStyle={{ color: "var(--color-foreground)" }}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: "12px", color: "var(--color-muted)" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

function EmptyChart({ title }: { title: string }) {
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
        Sin datos para {title}
      </p>
    </div>
  );
}
