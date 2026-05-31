"use client";

import { useForm, FormProvider, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LinksEditor } from "./LinksEditor";
import { StatusSelect } from "@/components/ui/StatusSelect";
import { DatePicker } from "@/components/ui/DatePicker";
import { useIsGuest } from "@/lib/demo/useIsGuest";
import { createProyecto, updateProyecto } from "@/lib/proyectos-client";
import type { IProyecto } from "@/types";

const schema = z.object({
  nombre:       z.string().min(1, "Requerido"),
  cliente: z.object({
    nombre:  z.string().min(1, "Requerido"),
    empresa: z.string().min(1, "Requerido"),
  }),
  estado:       z.enum(["en-negociacion", "en-proceso", "mantenimiento", "completado"]),
  fechaInicio:  z.string().min(1, "Requerido"),
  fechaEntrega: z.string().min(1, "Requerido"),
  presupuesto:  z.coerce.number().min(1, "Debe ser mayor a 0"),
  descripcion:  z.string(),
  tecnologias:  z.string(),
  links: z.array(z.object({ etiqueta: z.string(), url: z.string() })),
});

type FormData = z.infer<typeof schema>;

interface Props {
  proyecto?: IProyecto;
}

function toFormValues(p?: IProyecto): FormData {
  if (!p) return {
    nombre: "", cliente: { nombre: "", empresa: "" },
    estado: "en-negociacion", fechaInicio: "", fechaEntrega: "",
    presupuesto: 0, descripcion: "", tecnologias: "", links: [],
  };
  return {
    nombre:       p.nombre,
    cliente:      p.cliente,
    estado:       p.estado,
    fechaInicio:  p.fechaInicio?.slice(0, 10) ?? "",
    fechaEntrega: p.fechaEntrega?.slice(0, 10) ?? "",
    presupuesto:  p.presupuesto,
    descripcion:  p.descripcion,
    tecnologias:  p.tecnologias.join(", "),
    links:        p.links,
  };
}

export function ProyectoForm({ proyecto }: Props) {
  const router  = useRouter();
  const isGuest = useIsGuest();
  const editing = !!proyecto;

  const methods = useForm<FormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema) as any,
    defaultValues: toFormValues(proyecto),
    mode: "onTouched",
  });

  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = methods;

  async function onSubmit(data: FormData) {
    const payload = {
      ...data,
      tecnologias: data.tecnologias
        ? data.tecnologias.split(",").map(t => t.trim()).filter(Boolean)
        : [],
    };

    const result = editing
      ? await updateProyecto(isGuest, proyecto._id, payload)
      : await createProyecto(isGuest, payload);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    toast.success(editing ? "Proyecto actualizado" : "Proyecto creado");
    router.push("/proyectos");
    router.refresh();
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 max-w-2xl">

        {/* Proyecto */}
        <Section title="Proyecto">
          <Field label="Nombre del proyecto" error={errors.nombre?.message}>
            <input {...register("nombre")} style={inputStyle} placeholder="ej: Web corporativa Acme" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Estado" error={errors.estado?.message}>
              <Controller
                control={control}
                name="estado"
                render={({ field }) => (
                  <StatusSelect value={field.value} onChange={field.onChange} />
                )}
              />
            </Field>
            <Field label="Presupuesto (COP)" error={errors.presupuesto?.message}>
              <input
                {...register("presupuesto")}
                type="number"
                min="0"
                step="any"
                style={inputStyle}
                placeholder="0"
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Fecha de inicio" error={errors.fechaInicio?.message}>
              <Controller
                control={control}
                name="fechaInicio"
                render={({ field }) => (
                  <DatePicker value={field.value} onChange={field.onChange} placeholder="Seleccionar fecha" />
                )}
              />
            </Field>
            <Field label="Fecha de entrega" error={errors.fechaEntrega?.message}>
              <Controller
                control={control}
                name="fechaEntrega"
                render={({ field }) => (
                  <DatePicker value={field.value} onChange={field.onChange} placeholder="Seleccionar fecha" />
                )}
              />
            </Field>
          </div>
        </Section>

        {/* Cliente */}
        <Section title="Cliente">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Nombre" error={errors.cliente?.nombre?.message}>
              <input {...register("cliente.nombre")} style={inputStyle} />
            </Field>
            <Field label="Empresa" error={errors.cliente?.empresa?.message}>
              <input {...register("cliente.empresa")} style={inputStyle} />
            </Field>
          </div>
        </Section>

        {/* Detalles */}
        <Section title="Detalles">
          <Field label="Tecnologías (separadas por coma)" hint="opcional">
            <input
              {...register("tecnologias")}
              style={inputStyle}
              placeholder="Next.js, Tailwind, Supabase"
            />
          </Field>
          <Field label="Descripción / notas" hint="opcional">
            <textarea
              {...register("descripcion")}
              rows={4}
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </Field>
        </Section>

        {/* Links */}
        <Section title="Links">
          <LinksEditor />
        </Section>

        {/* Actions */}
        <div className="flex gap-3">
          <button type="button" onClick={() => router.back()} style={cancelBtnStyle}>
            Cancelar
          </button>
          <button type="submit" disabled={isSubmitting} style={submitBtnStyle(isSubmitting)}>
            {isSubmitting ? "Guardando…" : editing ? "Guardar cambios" : "Crear proyecto"}
          </button>
        </div>
      </form>
    </FormProvider>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: "var(--color-surface)",
      border: "1px solid var(--color-border)",
      borderRadius: "var(--radius-lg)",
      padding: "1.5rem",
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
    }}>
      <h2 style={{
        fontSize: "var(--text-sm)",
        fontWeight: 600,
        color: "var(--color-foreground)",
        paddingBottom: "0.75rem",
        borderBottom: "1px solid var(--color-border)",
      }}>
        {title}
      </h2>
      {children}
    </div>
  );
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div style={{ display: "flex", alignItems: "baseline", gap: "0.375rem" }}>
        <label style={{ fontSize: "var(--text-sm)", color: "var(--color-muted)" }}>
          {label}
        </label>
        {hint && (
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-muted)", opacity: 0.6 }}>
            {hint}
          </span>
        )}
      </div>
      {children}
      {error && (
        <span style={{ fontSize: "var(--text-xs)", color: "var(--color-destructive)" }}>
          {error}
        </span>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "var(--color-background)",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius)",
  color: "var(--color-foreground)",
  fontSize: "var(--text-sm)",
  padding: "0.625rem 0.875rem",
  outline: "none",
};

const cancelBtnStyle: React.CSSProperties = {
  background: "transparent",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius)",
  color: "var(--color-muted)",
  fontSize: "var(--text-sm)",
  padding: "0.625rem 1.25rem",
  cursor: "pointer",
};

function submitBtnStyle(disabled: boolean): React.CSSProperties {
  return {
    background: disabled ? "var(--color-accent-subtle)" : "var(--color-accent)",
    color: "#fff",
    border: "none",
    borderRadius: "var(--radius)",
    fontSize: "var(--text-sm)",
    fontWeight: 500,
    padding: "0.625rem 1.5rem",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.7 : 1,
  };
}
