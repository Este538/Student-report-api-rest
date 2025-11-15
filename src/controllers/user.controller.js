import {prisma} from '../utils/prisma.js';
// <-- IMPORTACIÓN CORREGIDA: Apunta a encrypt.js según tu indicación
import * as encrypt from '../utils/encrypt.js'; 
import jwt from 'jsonwebtoken';
import 'dotenv/config';

// Función auxiliar para generar el token (mantenida por el usuario)
const generateToken = async(id_param, key_secret) => {
    const token = jwt.sign(id_param, key_secret, {
        expiresIn: 86400, // 24 horas
    });
    return token;
}

export const signUp = async (req, res) => {
    // 1. Desestructurar variables. roleIdToAssign se asume que viene del middleware
    const { nameUser, email, password } = req.body;
    const roleIdToAssign = req.roleIdToAssign; // <--- Asumimos que el middleware lo ha establecido

    try {
        // 2. Hashear la contraseña (CRÍTICO: Faltaba esta línea)
        // Ahora llama a la función desde el alias 'encrypt' (que apunta a utils/encrypt.js)
        const hashedPassword = await encrypt.encryptPassword(password);

        // 3. Crear el nuevo usuario
        const newUser = await prisma.user.create({
            data: {
                nameUser: nameUser,
                email: email,
                password: hashedPassword, // Usamos la variable hasheada
                roleId: roleIdToAssign,   // Usamos la variable asignada por el middleware
            },
            include: {
                userRole: {
                    select: {roleName: true},
                },
            },
        });

        // 4. Generar el Token JWT (CRÍTICO: Usar newUser.id)
        const token = await generateToken({ id: newUser.id }, process.env.KEY_SECRET );

        // 5. Enviar UNA SOLA RESPUESTA (CRÍTICO: Se enviaban dos)
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
         // Manejar error de email duplicado (unique constraint violation)
        if (error.code === 'P2002' && error.meta?.target.includes('email')) {
            return res.status(400).json({ message: "El email ya está registrado." });
        }
        console.error("Error en signUp:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
};

export const login = async (req, res) => {
    const { email } = req.body;
    // Se asume que el password ya fue comparado en el middleware matchPassword
    
    try {
        const userFound = await prisma.user.findUnique({
            where: { email: email },
            include: {
                userRole: {
                    select: { roleName: true }, 
                },
            },
        });

        // La verificación de password ya debería haber ocurrido en el middleware
        if (!userFound) {
            return res.status(400).json({ message: "User not found" }); // Error de lógica/middleware, pero lo mantenemos por seguridad
        }

        const token = await generateToken({ id: userFound.id }, process.env.KEY_SECRET );
            
        res.json({ token, userRole: userFound.userRole.roleName });
        
    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
};