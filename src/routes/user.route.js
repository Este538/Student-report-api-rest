import { Router } from "express";

import * as userContrl from '../controllers/user.controller.js';
import * as userMidlw from '../middlewares/user.validation.middleware.js'; 

const router = Router();

// Route for user login middlewares to verify data
router.post('/login',
    [
        userMidlw.verifyUser,     
        userMidlw.matchPassword 
    ],
    userContrl.login
);

// Route for user signUp with middlewares to verify data
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