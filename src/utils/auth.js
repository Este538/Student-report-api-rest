import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { prisma } from './prisma.js';



/**
 * Authenticate JWT token from request headers
 *
 * @async
 * @param {object} req it must contain headers with x-access-token
 * @param {object} res object to send response
 * @param {()=>} next function to continue to next middleware
 * @returns {json | void} calls next() or returns json with error (403, 404, 401)
 */
export const authenticateToken = async (req, res, next) => {
    try {
        const token = req.headers["x-access-token"];

        if (!token) {
            return res.status(403).json({ message: "Token not provided" });
        }

        // Token verification
        const decoded = jwt.verify(token, process.env.KEY_SECRET);
        req.userId = decoded.id;

        // Fetch user from database
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

        // Save user info in request
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


/**
 * Validate that user is a Teacher
 *
 * @param {object} req contains -user- info from previous middleware
 * @param {object} res object to send response
 * @param {object} next calls next middleware
 * @returns {json | void} returns json with error (401, 403) or calls next()
 */

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
