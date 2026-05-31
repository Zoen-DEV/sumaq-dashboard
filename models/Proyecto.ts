import mongoose, { Schema, models, model } from "mongoose";
import type { IProyecto, ITarea } from "@/types";

const LinkSchema = new Schema(
  { etiqueta: { type: String, required: true }, url: { type: String, required: true } },
  { _id: false }
);

const TareaSchema = new Schema<ITarea>(
  {
    id:          { type: String, required: true },
    titulo:      { type: String, required: true, trim: true },
    descripcion: { type: String, default: "" },
    estado:      {
      type: String,
      enum: ["pendiente", "en-curso", "completada"],
      default: "pendiente",
    },
    createdAt:   { type: String, required: true },
  },
  { _id: false }
);

const ProyectoSchema = new Schema<IProyecto>(
  {
    nombre: { type: String, required: true, trim: true },
    cliente: {
      nombre:  { type: String, required: true, trim: true },
      empresa: { type: String, required: true, trim: true },
    },
    estado: {
      type: String,
      enum: ["en-negociacion", "en-proceso", "mantenimiento", "completado"],
      default: "en-negociacion",
    },
    fechaInicio:  { type: String, required: true },
    fechaEntrega: { type: String, required: true },
    presupuesto:  { type: Number, required: true, min: 0 },
    links:        { type: [LinkSchema], default: [] },
    descripcion:  { type: String, default: "" },
    tecnologias:  { type: [String], default: [] },
    tareas:       { type: [TareaSchema], default: [] },
  },
  { timestamps: true }
);

// En desarrollo, Next conserva el registro de modelos de Mongoose entre recargas
// HMR. Si el schema cambia, el modelo cacheado queda obsoleto y `strict` descarta
// silenciosamente los paths nuevos (p. ej. `tareas`) en cada update. Lo borramos
// para forzar su reconstrucción con el schema vigente.
if (process.env.NODE_ENV !== "production" && models.Proyecto) {
  mongoose.deleteModel("Proyecto");
}

export const Proyecto =
  (mongoose.models.Proyecto as mongoose.Model<IProyecto>) ||
  model<IProyecto>("Proyecto", ProyectoSchema);
