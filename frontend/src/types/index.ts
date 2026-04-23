export type RolUsuario = 'medico' | 'paciente';

export interface Usuario {
  id: string;
  email: string;
  rol: RolUsuario;
}

export interface Paciente {
  _id: string;
  nombre: string;
  edad: number;
  alergias: string[];
  usuarioId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Medico {
  _id: string;
  nombre: string;
  especialidad: string;
  cedula?: string;
  usuarioId: string;
  createdAt: string;
  updatedAt: string;
}

export type HorarioTipo = 6 | 8 | 12 | 24;
export type ViaAdministracion = 'oral' | 'intravenosa' | 'intramuscular' | 'subcutanea' | 'topica' | 'inhalatoria' | 'sublingual' | 'rectal';

export interface Prescripcion {
  _id: string;
  medicamento: string;
  horario: HorarioTipo;
  tiempoTratamiento: number;
  dosis: string;
  viaAdministracion: ViaAdministracion;
  medicoId: Medico | string;
  pacienteId: Paciente | string;
  prescripcionAnteriorId?: Prescripcion | string | null;
  motivoCambio?: string | null;
  indicaciones?: string | null;
  activa: boolean;
  fechaCreacion: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProximaToma {
  prescripcion: Prescripcion;
  estado: 'activo' | 'finalizado';
  proximaToma: string | null;
  tomasRestantes?: number;
}

export interface PerfilPacienteResponse {
  paciente: Paciente;
  prescripcionesActivas: Prescripcion[];
  proximasTomos: ProximaToma[];
}

export interface Diferencia {
  campo: string;
  anterior: any;
  nuevo: any;
}

export interface ComparacionResponse {
  prescripcionAnterior: Prescripcion;
  prescripcionNueva: Prescripcion;
  motivoCambio: string | null;
  diferencias: Diferencia[];
  sonIguales: boolean;
}

export interface HistorialResponse {
  paciente: Paciente;
  historial: Prescripcion[];
}

export interface AuthResponse {
  token: string;
  usuario: Usuario;
  perfil?: Paciente | Medico;
}

export interface RegisterData {
  email: string;
  password: string;
  rol: RolUsuario;
  nombre: string;
  edad?: number;
  alergias?: string[];
  especialidad?: string;
}

export interface CrearPrescripcionData {
  medicamento: string;
  horario: HorarioTipo;
  tiempoTratamiento: number;
  dosis: string;
  viaAdministracion: ViaAdministracion;
  pacienteId: string;
  prescripcionAnteriorId?: string | null;
  motivoCambio?: string | null;
  indicaciones?: string | null;
}

export interface NuevaPrescripcionAlergiaData extends CrearPrescripcionData {
  prescripcionAnteriorId: string;
  motivoCambio: string;
}
