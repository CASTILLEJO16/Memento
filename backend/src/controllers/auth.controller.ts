import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import Usuario from '../models/Usuario';
import Paciente from '../models/Paciente';
import Medico from '../models/Medico';
import { generateToken } from '../middleware/auth';
import { registerSchema, loginSchema } from '../validations/auth.validation';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = registerSchema.parse(req.body);

    const existingUser = await Usuario.findOne({ email: data.email });
    if (existingUser) {
      res.status(400).json({ error: 'El email ya está registrado' });
      return;
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const usuario = await Usuario.create({
      email: data.email,
      password: hashedPassword,
      rol: data.rol,
    });

    // Solo médicos pueden registrarse directamente
    // Los pacientes son registrados por el médico desde el panel
    if (data.rol === 'paciente') {
      res.status(403).json({ error: 'Los pacientes son registrados por el médico desde el sistema' });
      return;
    }

    if (!data.especialidad) {
      res.status(400).json({ error: 'La especialidad es requerida para médicos' });
      return;
    }
    await Medico.create({
      nombre: data.nombre,
      especialidad: data.especialidad,
      usuarioId: usuario._id,
    });

    const token = generateToken({ userId: usuario._id.toString(), rol: data.rol });

    res.status(201).json({
      token,
      usuario: { id: usuario._id, email: usuario.email, rol: usuario.rol },
    });
  } catch (error: any) {
    if (error.errors) {
      res.status(400).json({ error: 'Datos inválidos', detalles: error.errors });
      return;
    }
    res.status(500).json({ error: 'Error del servidor' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = loginSchema.parse(req.body);

    const usuario = await Usuario.findOne({ email: data.email });
    if (!usuario) {
      res.status(401).json({ error: 'Credenciales inválidas' });
      return;
    }

    const isMatch = await bcrypt.compare(data.password, usuario.password);
    if (!isMatch) {
      res.status(401).json({ error: 'Credenciales inválidas' });
      return;
    }

    const token = generateToken({ userId: usuario._id.toString(), rol: usuario.rol });

    // Obtener perfil según rol
    let perfil;
    if (usuario.rol === 'paciente') {
      perfil = await Paciente.findOne({ usuarioId: usuario._id });
    } else {
      perfil = await Medico.findOne({ usuarioId: usuario._id });
    }

    res.json({
      token,
      usuario: { id: usuario._id, email: usuario.email, rol: usuario.rol },
      perfil,
    });
  } catch (error: any) {
    if (error.errors) {
      res.status(400).json({ error: 'Datos inválidos', detalles: error.errors });
      return;
    }
    res.status(500).json({ error: 'Error del servidor' });
  }
};

export const me = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'No autenticado' });
      return;
    }

    const usuario = await Usuario.findById(req.user.userId).select('-password');
    if (!usuario) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }

    let perfil;
    if (usuario.rol === 'paciente') {
      perfil = await Paciente.findOne({ usuarioId: usuario._id });
    } else {
      perfil = await Medico.findOne({ usuarioId: usuario._id });
    }

    res.json({ usuario, perfil });
  } catch {
    res.status(500).json({ error: 'Error del servidor' });
  }
};
