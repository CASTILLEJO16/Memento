import mongoose, { Schema, Document } from 'mongoose';

export type HorarioTipo = 6 | 8 | 12 | 24;
export type ViaAdministracion = 'oral' | 'intravenosa' | 'intramuscular' | 'subcutanea' | 'topica' | 'inhalatoria' | 'sublingual' | 'rectal';

export interface IPrescripcion extends Document {
  medicamento: string;
  horario: HorarioTipo;
  tiempoTratamiento: number; // días
  dosis: string;
  viaAdministracion: ViaAdministracion;
  medicoId: mongoose.Types.ObjectId;
  pacienteId: mongoose.Types.ObjectId;
  prescripcionAnteriorId?: mongoose.Types.ObjectId | null;
  motivoCambio?: string | null;
  activa: boolean;
  fechaCreacion: Date;
}

/**
 * PATRÓN MEMENTO: La prescripción es un snapshot INMUTABLE.
 * - No existe endpoint PUT/PATCH para modificarla
 * - Solo se crean nuevas prescripciones (POST)
 * - Si se necesita cambio, se crea una nueva prescripción vinculada a la anterior
 * - prescripcionAnteriorId y motivoCambio registran la razón del cambio
 */
const PrescripcionSchema = new Schema<IPrescripcion>(
  {
    medicamento: { type: String, required: true, trim: true },
    horario: { type: Number, enum: [6, 8, 12, 24], required: true },
    tiempoTratamiento: { type: Number, required: true, min: 1 },
    dosis: { type: String, required: true, trim: true },
    viaAdministracion: {
      type: String,
      enum: ['oral', 'intravenosa', 'intramuscular', 'subcutanea', 'topica', 'inhalatoria', 'sublingual', 'rectal'],
      required: true,
    },
    medicoId: { type: Schema.Types.ObjectId, ref: 'Medico', required: true },
    pacienteId: { type: Schema.Types.ObjectId, ref: 'Paciente', required: true },
    prescripcionAnteriorId: { type: Schema.Types.ObjectId, ref: 'Prescripcion', default: null },
    motivoCambio: { type: String, default: null, trim: true },
    activa: { type: Boolean, default: true },
    fechaCreacion: { type: Date, default: Date.now, immutable: true },
  },
  { timestamps: true }
);

// Índices para consultas frecuentes
PrescripcionSchema.index({ pacienteId: 1, fechaCreacion: -1 });
PrescripcionSchema.index({ pacienteId: 1, activa: 1 });

export default mongoose.model<IPrescripcion>('Prescripcion', PrescripcionSchema);
