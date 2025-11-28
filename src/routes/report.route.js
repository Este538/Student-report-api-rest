import express from 'express';
import { 
  createReport, 
  getAllReports, 
  getIncidentTypes 
} from '../controllers/report.controller.js';
import { authenticateToken, requireTeacher } from '../utils/auth.js';

const router = express.Router();

// Whole router protected: only authenticated Teachers can access
router.use(authenticateToken, requireTeacher);

router.post('/', createReport);
router.get('/', getAllReports);
router.get('/incidents', getIncidentTypes); // Obtain incident types

export default router;