export interface MedicineSugerencia {
  nombre: string;
  dosisTípica: string;
  unidad: string;
  frecuenciaSugerida?: number;
}

export const MEDICAMENTOS_COMUNES: MedicineSugerencia[] = [
  { nombre: 'Paracetamol', dosisTípica: '500', unidad: 'mg', frecuenciaSugerida: 8 },
  { nombre: 'Ibuprofeno', dosisTípica: '400', unidad: 'mg', frecuenciaSugerida: 8 },
  { nombre: 'Amoxicilina', dosisTípica: '500', unidad: 'mg', frecuenciaSugerida: 12 },
  { nombre: 'Omeprazol', dosisTípica: '20', unidad: 'mg', frecuenciaSugerida: 24 },
  { nombre: 'Metformina', dosisTípica: '850', unidad: 'mg', frecuenciaSugerida: 12 },
  { nombre: 'Loratadina', dosisTípica: '10', unidad: 'mg', frecuenciaSugerida: 24 },
  { nombre: 'Salbutamol', dosisTípica: '100', unidad: 'mcg', frecuenciaSugerida: 6 },
  { nombre: 'Enalapril', dosisTípica: '10', unidad: 'mg', frecuenciaSugerida: 12 },
  { nombre: 'Sertralina', dosisTípica: '50', unidad: 'mg', frecuenciaSugerida: 24 },
  { nombre: 'Diclofenaco', dosisTípica: '75', unidad: 'mg', frecuenciaSugerida: 12 },
  { nombre: 'Losartán', dosisTípica: '50', unidad: 'mg', frecuenciaSugerida: 24 },
  { nombre: 'Atorvastatina', dosisTípica: '20', unidad: 'mg', frecuenciaSugerida: 24 },
  { nombre: 'Levotiroxina', dosisTípica: '50', unidad: 'mcg', frecuenciaSugerida: 24 },
  { nombre: 'Amoxicilina + Ácido Clavulánico', dosisTípica: '875', unidad: 'mg', frecuenciaSugerida: 12 },
  { nombre: 'Ketorolaco', dosisTípica: '10', unidad: 'mg', frecuenciaSugerida: 8 },
  { nombre: 'Ciprofloxacino', dosisTípica: '500', unidad: 'mg', frecuenciaSugerida: 12 },
  { nombre: 'Naproxeno', dosisTípica: '500', unidad: 'mg', frecuenciaSugerida: 12 },
  { nombre: 'Clonazepam', dosisTípica: '0.5', unidad: 'mg', frecuenciaSugerida: 24 },
  { nombre: 'Escitalopram', dosisTípica: '10', unidad: 'mg', frecuenciaSugerida: 24 },
  { nombre: 'Metronidazol', dosisTípica: '500', unidad: 'mg', frecuenciaSugerida: 8 },
];

export const UNIDADES_DOSIS = [
  'mg',
  'g',
  'ml',
  'mcg',
  'UI',
  'gotas',
  'tabletas',
  'cápsulas',
  'inhalaciones',
  'sobres',
];

export const CLINIC_INFO = {
  doctor: 'Médico Responsable',
  especialidad: 'Especialista en Medicina Familiar',
  cedula: '8273645-A',
  clinica: 'Clínica Dr. Memento',
  direccion: 'Av. Salud Pública #404, Col. Bienestar',
  telefono: '+52 (55) 1234-5678',
  email: 'contacto@memento.salud',
  logoText: 'Dr. MEMENTO'
};
