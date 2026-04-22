import mongoose, { Schema, Document } from 'mongoose';

export interface IMedico extends Document {
  nombre: string;
  especialidad: string;
  cedula?: string;
  usuarioId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const MedicoSchema = new Schema<IMedico>(
  {
    nombre: { type: String, required: true, trim: true },
    especialidad: { type: String, required: true, trim: true },
    cedula: { type: String, trim: true },
    usuarioId: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IMedico>('Medico', MedicoSchema);
