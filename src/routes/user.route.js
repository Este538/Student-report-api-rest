import { Router } from "express";

import * as userContrl from '../controllers/user.controller.js';
import * as userMidlw from '../middlewares/user.validation.middleware.js'; // <-- Asegúrate que este sea el nombre

const router = Router();

router.post('/login',
    [
        userMidlw.verifyUser,     // Primero verifica que los campos existan (email/password)
        userMidlw.matchPassword   // Luego verifica que el password coincida
    ],
    userContrl.login
);

router.post('/signUp',
    [
        userMidlw.verifyUser,      // Primero verifica todos los campos de registro (incluyendo nameUser)
        userMidlw.verifyRoleExist  // Luego verifica el rol y asigna el roleId
    ],
    userContrl.signUp
);

export default router;