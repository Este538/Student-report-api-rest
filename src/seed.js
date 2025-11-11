import { prisma } from "../src/utils/prisma.js";

async function main() {
 console.log('Iniciando siembra de datos...');

 // --- 1. Siembra de datos de Grados (Grades) ---
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
     const newGrade = await prisma.grade.upsert({
        where: { gradeNumber: grade.gradeNumber },
          update: {}, // No actualizar si ya existe
          create: grade,
    });
    console.log(`Creado/Encontrado grado con idGrade: ${newGrade.idGrade} y gradeNumber: ${newGrade.gradeNumber}`);
  }

  console.log('Siembra de Grados completada.');
  console.log('---------------------------------');

  // --- 2. Siembra de datos de Roles (Roles) ---
  console.log('Iniciando siembra de datos de Roles...');

  // Datos de ejemplo para la tabla Role (admin y teacher)
  const roles = [
   { roleName: "admin" },
   { roleName: "teacher" }
  ];

  for (const role of roles) {
   // Usamos 'upsert' para crear el rol si no existe (basado en roleName que es @unique)
   const newRole = await prisma.role.upsert({
       where: { roleName: role.roleName },
          update: {}, // No actualizar si ya existe
          create: role,
    });
    console.log(`Creado/Encontrado rol con id: ${newRole.id} y roleName: ${newRole.roleName}`);
  }

  console.log('Siembra de Roles completada.');
  console.log('---------------------------------');
  console.log('Siembra de datos finalizada.');
}

main()
  .catch((e) => {
     console.error(e);
     process.exit(1);
  })
  .finally(async () => {
     await prisma.$disconnect();
  });