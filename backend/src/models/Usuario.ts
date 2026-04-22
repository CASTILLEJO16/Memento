import mongoose, { Schema, Document } from 'mongoose';

export type RolUsuario = 'medico' | 'paciente';

export interface IUsuario extends Document {
  email: string;
  password: string;
  rol: RolUsuario;
  createdAt: Date;
  updatedAt: Date;
}

const UsuarioSchema = new Schema<IUsuario>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    rol: { type: String, enum: ['medico', 'paciente'], required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IUsuario>('Usuario', UsuarioSchema);
