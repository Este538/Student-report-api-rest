import { Router } from "express";

import * as userContrl from '../controllers/user.controller.js';
import * as userMidlw from '../middlewares/user.validation.middleware.js'; 

const router = Router();

router.post('/login',
    [
        userMidlw.verifyUser,     
        userMidlw.matchPassword 
    ],
    userContrl.login
);

router.post('/signUp',
    [
        userMidlw.verifyUser,      
        userMidlw.verifyRoleExist,  
        userMidlw.checkDuplicateEmail,
        userMidlw.checkDuplicateName
    ],
    userContrl.signUp
);

export default router;