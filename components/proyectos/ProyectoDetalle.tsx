import Link from "next/link";
import type { IProyecto } from "@/types";
import { ESTADOS } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ExternalLink, Pencil } from "lucide-react";
import { DeleteButton } from "@/app/(dashboard)/proyectos/[id]/DeleteButton";
import { TareasBoard } from "@/components/tareas/TareasBoard";
import { ProyectoTabs } from "@/components/proyectos/ProyectoTabs";

/**
 * Vista de detalle de un proyecto. Presentacional: recibe el proyecto ya resuelto
 * y no sabe de dónde viene. La usa tanto la página server (datos de Mongo) como la
 * isla del modo demo (datos del store). Así no duplicamos el layout del detalle.
 */
export function ProyectoDetalle({ proyecto: p }: { proyecto: IProyecto }) {
  const estado = ESTADOS.find((e) => e.value === p.estado);

  return (
    <div className="animate-fade-in mx-auto w-full max-w-[1180px]">
      {/* Header */}
      <div
        className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3"
        style={{ marginBottom: "1.75rem" }}
      >
        <div className="min-w-0">
          <h2 style={{ fontSize: "var(--text-2xl)", fontWeight: 700, marginBottom: "0.25rem" }}>
            {p.nombre}
          </h2>
          <p style={{ fontSize: "var(--text-sm)", color: "var(--color-muted)" }}>
            {p.cliente.nombre} · {p.cliente.empresa}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span
            style={{
              fontSize: "var(--text-xs)",
              color: estado?.color,
              background: `color-mix(in oklch, ${estado?.color} 15%, transparent)`,
              padding: "0.3rem 0.875rem",
              borderRadius: "99px",
              whiteSpace: "nowrap",
            }}
          >
            {estado?.label}
          </span>
          <Link
            href={`/proyectos/${p._id}/editar`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.375rem",
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius)",
              color: "var(--color-foreground)",
              fontSize: "var(--text-sm)",
              padding: "0.5rem 0.875rem",
              textDecoration: "none",
            }}
          >
            <Pencil size={13} />
            Editar
          </Link>
          <DeleteButton id={p._id} />
        </div>
      </div>

      <ProyectoTabs
        detalles={
          <div className="flex flex-col gap-4 max-w-3xl">
            {/* Finanzas y fechas */}
            <Card title="Resumen">
              <div className="detalle-resumen">
                <Dato label="Presupuesto" value={formatCurrency(p.presupuesto)} large />
                <Dato label="Inicio" value={formatDate(p.fechaInicio)} />
                <Dato label="Entrega" value={formatDate(p.fechaEntrega)} />
              </div>
            </Card>

            {/* Descripción */}
            {p.descripcion && (
              <Card title="Descripción / notas">
                <p style={{ fontSize: "var(--text-sm)", color: "var(--color-muted)", lineHeight: 1.7 }}>
                  {p.descripcion}
                </p>
              </Card>
            )}

            {/* Tecnologías */}
            {p.tecnologias.length > 0 && (
              <Card title="Stack tecnológico">
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {p.tecnologias.map((t) => (
                    <span
                      key={t}
                      style={{
                        fontSize: "var(--text-xs)",
                        background: "var(--color-accent-subtle)",
                        color: "var(--color-accent)",
                        padding: "0.25rem 0.75rem",
                        borderRadius: "99px",
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </Card>
            )}

            {/* Links */}
            {p.links.length > 0 && (
              <Card title="Links">
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {p.links.map((link, i) => (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        fontSize: "var(--text-sm)",
                        color: "var(--color-accent)",
                        textDecoration: "none",
                      }}
                    >
                      <ExternalLink size={13} />
                      {link.etiqueta || link.url}
                    </a>
                  ))}
                </div>
              </Card>
            )}
          </div>
        }
        tareas={<TareasBoard proyectoId={p._id} initialTareas={p.tareas ?? []} />}
      />
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
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
          marginBottom: "1rem",
          paddingBottom: "0.75rem",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}

function Dato({ label, value, large }: { label: string; value: string; large?: boolean }) {
  return (
    <div>
      <p style={{ fontSize: "var(--text-xs)", color: "var(--color-muted)", marginBottom: "0.25rem" }}>
        {label}
      </p>
      <p
        style={{
          fontSize: large ? "var(--text-xl)" : "var(--text-base)",
          fontWeight: large ? 700 : 500,
          color: "var(--color-foreground)",
        }}
      >
        {value}
      </p>
    </div>
  );
}
