import {prisma} from '../utils/prisma.js';

import * as encrypt from '../utils/encrypt.js'; 
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const generateToken = async(id_param, key_secret) => {
    const token = jwt.sign(id_param, key_secret, {
        expiresIn: 86400, // 24 horas
    });
    return token;
}

export const signUp = async (req, res) => {
    
    const { nameUser, email, password } = req.body;
    const roleIdToAssign = req.roleIdToAssign; 

    try {
        
        const hashedPassword = await encrypt.encryptPassword(password);

        const newUser = await prisma.user.create({
            data: {
                nameUser: nameUser,
                email: email,
                password: hashedPassword, 
                roleId: roleIdToAssign,   
            },
            include: {
                userRole: {
                    select: {roleName: true},
                },
            },
        });

        const token = await generateToken({ id: newUser.id }, process.env.KEY_SECRET );

        res.status(200).json({ 
            token, 
            message: "Usuario registrado con éxito",
            user: {
                id: newUser.id,
                email: newUser.email,
                nameUser: newUser.nameUser,
                role: newUser.userRole.roleName
            }
        });

    } catch (error) {
        if (error.code === 'P2002' && error.meta?.target.includes('email')) {
            return res.status(400).json({ message: "Email already exists." });
        }
        console.error("Error in signUp:", error);
        res.status(500).json({ message: "Intern error on server." });
    }
};

export const login = async (req, res) => {
    const { email } = req.body;
    
    try {
        const userFound = await prisma.user.findUnique({
            where: { email: email },
            include: {
                userRole: {
                    select: { roleName: true }, 
                },
            },
        });

        if (!userFound) {
            return res.status(400).json({ message: "User not found" }); 
        }

        const token = await generateToken({ id: userFound.id }, process.env.KEY_SECRET );
            
        res.json({ token, userRole: userFound.userRole.roleName });
        
    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).json({ message: "Intern error on server." });
    }
};