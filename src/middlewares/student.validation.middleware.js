import { prisma } from "../utils/prisma.js";

export const validateStudentData = (req, res, next) => {
    
    const { studentName, matricula, currentGrade } = req.body;

    
    if (!studentName || !matricula || !currentGrade) {
        return res.status(400).json({ 
            message: "Data Incomplete. It requires 'studentName', 'matricula' y 'currentGrade'." 
        });
    }

    const gradeId = parseInt(currentGrade, 10);

    if (isNaN(gradeId) || gradeId <= 0) {
        return res.status(400).json({ 
            message: "The 'currentGrade' (ID from Grade) must be a natural Number." 
        });
    }

    if (typeof studentName !== 'string' || studentName.trim().length === 0 ||
        typeof matricula !== 'string' || matricula.trim().length === 0) {
        return res.status(400).json({
            message: "It must be a String"
        });
    }

    req.body.currentGrade = gradeId;

    next();
};

export const validateStudentID = async (req, res, next) => {
    
    const id = parseInt(req.params.id, 10);
    
    if (isNaN(id) || id <= 0) {
        return res.status(400).json({ 
            message: "ID must be a natural Number" 
        });
    }

    req.studentID = id;

    try {

        const student = await prisma.student.findUnique({
            where: { id: id },
            select: { id: true } 
        });

        if (!student) {
            return res.status(404).json({
                message: `Student with ID ${id} not found.`
            });
        }
        
        next();

    } catch (error) {
        console.error("Error on validateStudentID:", error);
        
        next(error); 
    }
};