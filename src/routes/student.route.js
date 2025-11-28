import { Router } from "express";

import * as studentContrl from '../controllers/student.controller.js';
import * as evalStudents from '../middlewares/student.validation.middleware.js';
import * as auth from '../utils/auth.js';

const router = Router();

// Whole router protected: only authenticated Teachers can access
router.use(auth.authenticateToken, auth.requireTeacher);

router.get('/',studentContrl.getAllStudent);

router.post('/',[evalStudents.validateStudentData], studentContrl.createStudent);

router.get('/:id',[evalStudents.validateStudentID], studentContrl.getStudentById);

router.put('/:id', [evalStudents.validateStudentData, evalStudents.validateStudentID], studentContrl.updateStudent);

router.delete('/:id',[evalStudents.validateStudentID], studentContrl.deleteStudent);


export default router;