import { Router } from 'express';
import { createPaciente, getPacientes, getPacienteById, getPerfilPaciente, updateAlergias } from '../controllers/paciente.controller';
import { authenticate, authorizeRole } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, authorizeRole('medico'), createPaciente);
router.get('/', authenticate, authorizeRole('medico'), getPacientes);
router.get('/perfil', authenticate, authorizeRole('paciente'), getPerfilPaciente);
router.get('/:id', authenticate, getPacienteById);
router.put('/:id/alergias', authenticate, authorizeRole('medico'), updateAlergias);

export default router;
