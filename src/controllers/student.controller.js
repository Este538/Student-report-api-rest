
import {prisma} from "../utils/prisma.js";

export const createStudent = async(req,res) => {
    
    const{studentName, matricula, currentGrade} = req.body;

    const student = {studentName, matricula, gradeId: currentGrade};

    const studentGenerated = await prisma.student.create({data: student});

    res.status(201).json(studentGenerated);

};

export const getAllStudent = async(req, res) => {
    const students = await prisma.student.findMany();

    res.status(200).json(students);
};

export const getStudentById = async(req,res)=> {

    const searchedStudent = await prisma.student.findUnique({
        where:{
            id: req.params.id
        },
        select:{
            id: true,
            studentName: true,
            matricula: true
        }
    });

    if (!searchedStudent) {
        return res.status(404).json({ message: `student with ${studentID} ID not found.` });
    }

    res.status(200).json(searchedStudent);
};


export const updateStudent = async(req,res)=> {

    const{studentName, matricula, currentGrade} = req.body;
    
    const studenToUpdate = {studentName:studentName, 
                        matricula: matricula, 
                        gradeId: currentGrade
                    };

    const updatedStudent = await prisma.student.update({
        where:{
            id: req.params.id
        },
        data:studenToUpdate
    });

    res.status(204).json({updatedStudent});
};

export const deleteStudent = async(req, res) => {

    const studentID = req.studentID;
    
    const deletedStudent = await prisma.student.delete({
        where:{
            id: studentID
        },
    });

    res.status(204).send();
};