import { Router } from 'express';
import { register, login } from '../controllers/auth.controller.js';

const router = Router();

// Ruta para crear un nuevo usuario (Secretaría, Administración, etc.)
// URL: http://localhost:PORT/api/auth/register
router.post('/register', register);

// Ruta para ingresar al sistema
// URL: http://localhost:PORT/api/auth/login
router.post('/login', login);

export default router;