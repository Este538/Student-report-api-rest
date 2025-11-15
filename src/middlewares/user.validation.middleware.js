import { prisma } from "../utils/prisma.js";

import * as encrypt from "../utils/encrypt.js"; 


export const matchPassword = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const userFound = await prisma.user.findUnique({
            where: { email: email },
            
            select: { id: true, password: true, email: true } 
        });

        if (!userFound) {
            return res.status(400).json({ message: "User incorrect" });
        }
        
        const matchedPassword = await encrypt.comparePassword(password, userFound.password);
        
        if (!matchedPassword) {
            return res.status(401).json({ message: "Password Incorrect" });
        }

        req.userId = userFound.id; 
        
        next();
        
    } catch (error) {
        console.error("Error in matchPassword:", error);
        return res.status(500).json({ message: "Intern Error in password validation." });
    }
};

export const verifyUser = (req, res, next) => {
    const { nameUser, email, password } = req.body; 

    if (!email || !password) {
        return res.status(400).json({
            message: 'Email and password are required.'
        });
    }

    if(req.originalUrl.includes('/signUp') && !nameUser) {
        return res.status(400).json({
            message: 'Incomplete information: Need User name to Sign Up.'
        });
    }

    next();
};


export const verifyRoleExist = async (req, res, next) => {
    const { roleName } = req.body;
    
    try {
        let roleIdToAssign;

        if (roleName) {
            const roles = Array.isArray(roleName) ? roleName : [roleName];

            const foundRoles = await prisma.role.findMany({
                where: {
                    roleName: {
                        in: roles,
                    },
                },
                select: { id: true },
            });

            if (foundRoles.length === 0) {
                return res.status(400).json({ message: "Rol(es) not found." });
            }

            roleIdToAssign = foundRoles[0].id;

        } else {
        
            const defaultRole = await prisma.role.findUnique({
                where: { roleName: "teacher" },
                select: { id: true },
            });
            
            if (!defaultRole) {
                return res.status(500).json({ message: "Role by defect 'teacher' not exist." });
            }
            roleIdToAssign = defaultRole.id;
        }

        req.roleIdToAssign = roleIdToAssign;

        next();

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error in validate existence role." });
    }
};

export const checkDuplicateEmail = async (req,res, next)=> {
    const {email} = req.body;

    const duplicateEmail = await prisma.user.findFirst({
        where:  {email: email},
        select: {id: true},
    });

    if(duplicateEmail) return res.status(409).json({message: "Email has been registered in another User"});
    next();
};

export const checkDuplicateName = async (req,res, next)=> {
    const {nameUser} = req.body;

    const duplicateName = await prisma.user.findFirst({
        where:  {nameUser: nameUser},
        select: {id: true},
    });

    if(duplicateName) return res.status(409).json({message: "Name has been registered in another User"});
    next();
};
