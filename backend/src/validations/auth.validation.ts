import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

export const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  rol: z.enum(['medico', 'paciente'], { errorMap: () => ({ message: 'Rol debe ser medico o paciente' }) }),
  nombre: z.string().min(2, 'Nombre requerido (mínimo 2 caracteres)'),
  // Campos específicos por rol
  edad: z.number().min(0).max(150).optional(),
  alergias: z.array(z.string()).optional(),
  especialidad: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
