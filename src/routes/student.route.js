import { Router } from "express";

import * as studentContrl from '../controllers/student.controller.js';
import * as evalStudents from '../middlewares/student.validation.middleware.js';

const router = Router();

router.get('/',studentContrl.getAllStudent);

router.post('/',[evalStudents.validateStudentData], studentContrl.createStudent);

router.get('/:id',[evalStudents.validateStudentID], studentContrl.getStudentById);

router.put('/:id', [evalStudents.validateStudentData, evalStudents.validateStudentID], studentContrl.updateStudent);

router.delete('/:id',[evalStudents.validateStudentID], studentContrl.deleteStudent);


export default router;