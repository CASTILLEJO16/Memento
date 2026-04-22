import { z } from 'zod';

export const crearPrescripcionSchema = z.object({
  medicamento: z.string().min(1, 'Medicamento requerido'),
  horario: z.union([z.literal(6), z.literal(8), z.literal(12), z.literal(24)], {
    errorMap: () => ({ message: 'Horario debe ser 6, 8, 12 o 24 horas' }),
  }),
  tiempoTratamiento: z.number().min(1, 'Mínimo 1 día de tratamiento'),
  dosis: z.string().min(1, 'Dosis requerida'),
  viaAdministracion: z.enum([
    'oral',
    'intravenosa',
    'intramuscular',
    'subcutanea',
    'topica',
    'inhalatoria',
    'sublingual',
    'rectal',
  ], { errorMap: () => ({ message: 'Vía de administración inválida' }) }),
  pacienteId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID de paciente inválido'),
  prescripcionAnteriorId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID de prescripción anterior inválido').optional().nullable(),
  motivoCambio: z.string().min(1, 'Motivo de cambio requerido').optional().nullable(),
});

export const nuevaPrescripcionPorAlergiaSchema = z.object({
  medicamento: z.string().min(1, 'Medicamento requerido'),
  horario: z.union([z.literal(6), z.literal(8), z.literal(12), z.literal(24)], {
    errorMap: () => ({ message: 'Horario debe ser 6, 8, 12 o 24 horas' }),
  }),
  tiempoTratamiento: z.number().min(1, 'Mínimo 1 día de tratamiento'),
  dosis: z.string().min(1, 'Dosis requerida'),
  viaAdministracion: z.enum([
    'oral',
    'intravenosa',
    'intramuscular',
    'subcutanea',
    'topica',
    'inhalatoria',
    'sublingual',
    'rectal',
  ], { errorMap: () => ({ message: 'Vía de administración inválida' }) }),
  pacienteId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID de paciente inválido'),
  prescripcionAnteriorId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID de prescripción anterior inválido'),
  motivoCambio: z.string().min(1, 'Motivo de cambio requerido (alergia u otro)'),
});

export type CrearPrescripcionInput = z.infer<typeof crearPrescripcionSchema>;
export type NuevaPrescripcionPorAlergiaInput = z.infer<typeof nuevaPrescripcionPorAlergiaSchema>;
