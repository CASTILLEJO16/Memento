import { Request, Response } from 'express';
import Medico from '../models/Medico';

export const getMedicos = async (_req: Request, res: Response): Promise<void> => {
  try {
    const medicos = await Medico.find().sort({ createdAt: -1 });
    res.json(medicos);
  } catch {
    res.status(500).json({ error: 'Error del servidor' });
  }
};

export const getMedicoById = async (req: Request, res: Response): Promise<void> => {
  try {
    const medico = await Medico.findById(req.params.id);
    if (!medico) {
      res.status(404).json({ error: 'Médico no encontrado' });
      return;
    }
    res.json(medico);
  } catch {
    res.status(500).json({ error: 'Error del servidor' });
  }
};

export const getPerfilMedico = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'No autenticado' });
      return;
    }

    const medico = await Medico.findOne({ usuarioId: req.user.userId });
    if (!medico) {
      res.status(404).json({ error: 'Perfil de médico no encontrado' });
      return;
    }

    res.json(medico);
  } catch {
    res.status(500).json({ error: 'Error del servidor' });
  }
};
