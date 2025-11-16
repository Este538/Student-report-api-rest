import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { prisma } from './prisma.js';

export const authenticateToken = async (req, res, next) => {
    try {
        const token = req.headers["x-access-token"];

        if (!token) {
            return res.status(403).json({ message: "Token not provided" });
        }

        // Verificar token
        const decoded = jwt.verify(token, process.env.KEY_SECRET);
        req.userId = decoded.id;

        // Buscar usuario y rol
        const user = await prisma.user.findUnique({
            where: { id: req.userId },
            select: {
                id: true,
                email: true,
                nameUser: true,
                userRole: {
                    select: {
                        roleName: true
                    }
                }
            }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Guardar el usuario dentro de req para middlewares posteriores
        req.user = user;
        next();

    } catch (error) {
        console.error("Token verification error:", error);
        return res.status(401).json({
            message: "Unauthorized",
            details: error.message
        });
    }
};


export const requireTeacher = (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        if (!req.user.userRole || req.user.userRole.roleName !== "teacher") {
            return res.status(403).json({ message: "Teacher role required" });
        }

        next();

    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};
