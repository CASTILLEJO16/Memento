import mongoose, { Schema, Document } from 'mongoose';

export interface IPaciente extends Document {
  nombre: string;
  edad: number;
  alergias: string[];
  medicoId: mongoose.Types.ObjectId;
  usuarioId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PacienteSchema = new Schema<IPaciente>(
  {
    nombre: { type: String, required: true, trim: true },
    edad: { type: Number, required: true, min: 0, max: 150 },
    alergias: { type: [String], default: [] },
    medicoId: { type: Schema.Types.ObjectId, ref: 'Medico', required: true },
    usuarioId: { type: Schema.Types.ObjectId, ref: 'Usuario', required: false },
  },
  { timestamps: true }
);

export default mongoose.model<IPaciente>('Paciente', PacienteSchema);
