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
            return res.status(400).json({ message: "Usuario o Contraseña inválida" });
        }
        
        // 2. Comparar password usando la función de tu archivo encrypt.js
        const matchedPassword = await encrypt.comparePassword(password, userFound.password);
        
        if (!matchedPassword) {
            return res.status(401).json({ message: "Usuario o Contraseña inválida" });
        }

        // Si la contraseña coincide, guardamos el ID del usuario en el request 
        // para que el controlador 'login' lo use si lo necesita.
        req.userId = userFound.id; 
        
        next();
        
    } catch (error) {
        console.error("Error en matchPassword:", error);
        return res.status(500).json({ message: "Error interno en la verificación de contraseña." });
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
            message: 'Email y contraseña son obligatorios.'
        });
    }

    // Validación específica para la ruta de registro (/signUp)
    if(req.originalUrl.includes('/signUp') && !nameUser) {
        return res.status(400).json({
            message: 'Información incompleta: Falta el nombre de usuario para el registro.'
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
                return res.status(400).json({ message: "Rol(es) proporcionados no encontrado(s)." });
            }

            roleIdToAssign = foundRoles[0].id;

        } else {
            // Asignar el rol por defecto: "teacher"
            const defaultRole = await prisma.role.findUnique({
                where: { roleName: "teacher" },
                select: { id: true },
            });
            
            if (!defaultRole) {
                return res.status(500).json({ message: "El rol por defecto 'teacher' no existe. ¡Ejecuta el seeder!" });
            }
            roleIdToAssign = defaultRole.id;
        }

        // Guarda el roleId para usarlo en el controlador de signUp
        req.roleIdToAssign = roleIdToAssign;

        next();

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al verificar la existencia del rol." });
    }
};