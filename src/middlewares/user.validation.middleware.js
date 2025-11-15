import { prisma } from "../utils/prisma.js";
// Necesitamos importar las funciones de hasheo/comparación desde el archivo que definiste
import * as encrypt from "../utils/encrypt.js"; 

/**
 * Middleware para la ruta /login: 
 * 1. Busca el usuario por email.
 * 2. Compara el password proporcionado con el hasheado en la DB.
 * Si falla, detiene la ejecución. Si tiene éxito, continúa al controlador.
 */
export const matchPassword = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        // 1. Buscar usuario (se asume que el email es único)
        const userFound = await prisma.user.findUnique({
            where: { email: email },
            // Solo necesitamos el password hasheado para comparar
            select: { id: true, password: true, email: true } 
        });

        if (!userFound) {
            // Usamos 400 o 401 para evitar enumeración de usuarios
            return res.status(400).json({ message: "User incorrect" });
        }
        
        // 2. Comparar password usando la función de tu archivo encrypt.js
        const matchedPassword = await encrypt.comparePassword(password, userFound.password);
        
        if (!matchedPassword) {
            return res.status(401).json({ message: "Password Incorrect" });
        }

        // Si la contraseña coincide, guardamos el ID del usuario en el request 
        // para que el controlador 'login' lo use si lo necesita.
        req.userId = userFound.id; 
        
        next();
        
    } catch (error) {
        console.error("Error in matchPassword:", error);
        return res.status(500).json({ message: "Intern Error in password validation." });
    }
};

/**
 * Middleware para validar que los campos CRÍTICOS (email, password y opcionalmente nameUser) estén presentes.
 */
export const verifyUser = (req, res, next) => {
    const { nameUser, email, password } = req.body; 

    // Validación base para cualquier petición de autenticación
    if (!email || !password) {
        return res.status(400).json({
            message: 'Email and password are required.'
        });
    }

    // Validación específica para la ruta de registro (/signUp)
    if(req.originalUrl.includes('/signUp') && !nameUser) {
        return res.status(400).json({
            message: 'Incomplete information: Need User name to Sign Up.'
        });
    }

    next();
};

/**
 * Middleware que verifica si el rol proporcionado existe y asigna el roleId al request.
 */
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
            // Asignar el rol por defecto: "teacher"
            const defaultRole = await prisma.role.findUnique({
                where: { roleName: "teacher" },
                select: { id: true },
            });
            
            if (!defaultRole) {
                return res.status(500).json({ message: "Role by defect 'teacher' not exist." });
            }
            roleIdToAssign = defaultRole.id;
        }

        // Guarda el roleId para usarlo en el controlador de signUp
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
