import { Request, Response } from 'express';
import Paciente from '../models/Paciente';
import Prescripcion from '../models/Prescripcion';
import Medico from '../models/Medico';

export const createPaciente = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'No autenticado' });
      return;
    }

    const medico = await Medico.findOne({ usuarioId: req.user.userId });
    if (!medico) {
      res.status(404).json({ error: 'Médico no encontrado' });
      return;
    }

    const { nombre, edad, alergias } = req.body;
    if (!nombre || !edad) {
      res.status(400).json({ error: 'Nombre y edad son requeridos' });
      return;
    }

    const paciente = await Paciente.create({
      nombre,
      edad,
      alergias: alergias || [],
      medicoId: medico._id,
    });
    res.status(201).json(paciente);
  } catch (error) {
    console.error('Error creating paciente:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

export const getPacientes = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'No autenticado' });
      return;
    }

    const medico = await Medico.findOne({ usuarioId: req.user.userId });
    if (!medico) {
      res.status(404).json({ error: 'Médico no encontrado' });
      return;
    }

    const pacientes = await Paciente.find({ medicoId: medico._id }).sort({ createdAt: -1 });
    res.json(pacientes);
  } catch {
    res.status(500).json({ error: 'Error del servidor' });
  }
};

export const getPacienteById = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'No autenticado' });
      return;
    }

    const medico = await Medico.findOne({ usuarioId: req.user.userId });
    
    // Si es médico, solo puede ver sus pacientes
    // Si es paciente, puede ver su propio perfil (esto lo maneja getPerfilPaciente, pero por si acaso)
    
    const query: any = { _id: req.params.id };
    if (req.user.rol === 'medico' && medico) {
      query.medicoId = medico._id;
    }

    const paciente = await Paciente.findOne(query);
    if (!paciente) {
      res.status(404).json({ error: 'Paciente no encontrado o no autorizado' });
      return;
    }
    res.json(paciente);
  } catch {
    res.status(500).json({ error: 'Error del servidor' });
  }
};

export const getPerfilPaciente = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'No autenticado' });
      return;
    }

    const paciente = await Paciente.findOne({ usuarioId: req.user.userId });
    if (!paciente) {
      res.status(404).json({ error: 'Perfil de paciente no encontrado' });
      return;
    }

    // Obtener prescripciones activas
    const prescripcionesActivas = await Prescripcion.find({
      pacienteId: paciente._id,
      activa: true,
    }).populate('medicoId', 'nombre especialidad cedula').sort({ fechaCreacion: -1 });

    // Calcular próximas tomas
    const proximasTomos = prescripcionesActivas.map((p) => {
      const ahora = new Date();
      const inicio = new Date(p.fechaCreacion);
      const finTratamiento = new Date(inicio);
      finTratamiento.setDate(finTratamiento.getDate() + p.tiempoTratamiento);

      if (ahora > finTratamiento) {
        return { prescripcion: p, estado: 'finalizado', proximaToma: null };
      }

      const diffMs = ahora.getTime() - inicio.getTime();
      const intervaloMs = p.horario * 60 * 60 * 1000;
      const tomasTranscurridas = Math.floor(diffMs / intervaloMs);
      const proximaToma = new Date(inicio.getTime() + (tomasTranscurridas + 1) * intervaloMs);

      return {
        prescripcion: p,
        estado: 'activo',
        proximaToma: proximaToma.toISOString(),
        tomasRestantes: Math.ceil((finTratamiento.getTime() - ahora.getTime()) / intervaloMs),
      };
    });

    res.json({ paciente, prescripcionesActivas, proximasTomos });
  } catch {
    res.status(500).json({ error: 'Error del servidor' });
  }
};

export const updateAlergias = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user || req.user.rol !== 'medico') {
      res.status(403).json({ error: 'No autorizado' });
      return;
    }

    const medico = await Medico.findOne({ usuarioId: req.user.userId });
    if (!medico) {
      res.status(404).json({ error: 'Médico no encontrado' });
      return;
    }

    const { alergias } = req.body;
    if (!Array.isArray(alergias)) {
      res.status(400).json({ error: 'alergias debe ser un array' });
      return;
    }

    // Asegurar que el paciente sea del médico actual
    const paciente = await Paciente.findOneAndUpdate(
      { _id: req.params.id, medicoId: medico._id },
      { alergias },
      { new: true }
    );

    if (!paciente) {
      res.status(404).json({ error: 'Paciente no encontrado o no autorizado' });
      return;
    }
    res.json(paciente);
  } catch {
    res.status(500).json({ error: 'Error del servidor' });
  }
};
