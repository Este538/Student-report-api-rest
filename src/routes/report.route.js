import express from 'express';
import { 
  createReport, 
  getAllReports, 
  getIncidentTypes 
} from '../controllers/report.controller.js';
import { authenticateToken, requireTeacher } from '../utils/auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación y rol de maestro
router.use(authenticateToken, requireTeacher);

router.post('/', createReport);
router.get('/', getAllReports);
router.get('/incidents', getIncidentTypes); // Para obtener tipos de incidente

export default router;