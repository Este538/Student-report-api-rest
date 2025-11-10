// seed.js

import { prisma } from "../src/utils/prisma.js";

async function main() {
  console.log('Iniciando siembra de datos de Grados...');

  // Datos de ejemplo para la tabla Grade
  const grades = [
    { gradeNumber: 1 },
    { gradeNumber: 2 },
    { gradeNumber: 3 },
    { gradeNumber: 4 },
    { gradeNumber: 5 }
  ];

  for (const grade of grades) {
    // Usamos 'upsert' para crear el grado si no existe (basado en gradeNumber que es @unique)
    // Esto evita errores si ejecutas el seeder varias veces.
    const newGrade = await prisma.grade.upsert({
      where: { gradeNumber: grade.gradeNumber },
      update: {}, // No actualizar si ya existe
      create: grade,
    });
    console.log(`Creado/Encontrado grado con idGrade: ${newGrade.idGrade} y gradeNumber: ${newGrade.gradeNumber}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });