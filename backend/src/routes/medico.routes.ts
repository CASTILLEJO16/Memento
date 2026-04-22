import { Router } from 'express';
import { getMedicos, getMedicoById, getPerfilMedico } from '../controllers/medico.controller';
import { authenticate, authorizeRole } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getMedicos);
router.get('/perfil', authenticate, authorizeRole('medico'), getPerfilMedico);
router.get('/:id', authenticate, getMedicoById);

export default router;
