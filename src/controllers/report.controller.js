import { prisma } from "../utils/prisma.js";

export const createReport = async (req, res) => {
  try {
    
    const teacherId = req.user.id;
    const { description, incidentId, studentId } = req.body;

    const student = await prisma.student.findUnique({
      where: { id: parseInt(studentId) }
    });

    if (!student) {
      return res.status(404).json({ message: 'Student Not Found' });
    }

    const incident = await prisma.incident.findUnique({
      where: { idIncident: parseInt(incidentId) }
    });

    if (!incident) {
      return res.status(404).json({ message: 'Incident Type not found' });
    }

    const report = await prisma.report.create({
      data: {
        description,
        incidentId: parseInt(incidentId),
        userId: teacherId, 
        studentId: parseInt(studentId)
      },
      include: {
        incident: {
          select: {
            idIncident: true,
            nameIncdnt: true
          }
        },
        user: {
          select: {
            id: true,
            nameUser: true,
            email: true
          }
        },
        student: {
          select: {
            id: true,
            studentName: true,
            matricula: true,
          }
        }
      }
    });

    res.status(201).json({
      message: 'Report success',
      report
    });
  } catch (error) {
    console.error('Error report:', error);
    res.status(400).json({ error: error.message });
  }
};

export const getAllReports = async (req, res) => {
  try {
    const teacherId = req.user.id;
    
    const reports = await prisma.report.findMany({
      where: {
        userId: teacherId 
      },
      include: {
        incident: {
          select: {
            nameIncdnt: true
          }
        },
        student: {
          select: {
            studentName: true,
            matricula: true
          }
        }
      },
      orderBy: {
        dateIncdnt: 'desc'
      }
    });
    
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getIncidentTypes = async (req, res) => {
  try {
    const incidents = await prisma.incident.findMany({
      select: {
        idIncident: true,
        nameIncdnt: true
      },
      orderBy: {
        nameIncdnt: 'asc'
      }
    });
    
    res.status(200).json(incidents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};