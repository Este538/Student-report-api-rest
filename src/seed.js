import { prisma } from "../src/utils/prisma.js";

async function main() {
 console.log('Starting data seeding...');

 // --- 1. Seeding data (Grades) ---
 console.log('Starting data seeding...');

 // data example for Grade table
 const grades = [
   { gradeNumber: 1 },
   { gradeNumber: 2 },
   { gradeNumber: 3 },
   { gradeNumber: 4 },
   { gradeNumber: 5 }
];

   for (const grade of grades) {
     // Use 'upsert' to create a grade doesn't exist (based in gradeNumber @unique)
     const newGrade = await prisma.grade.upsert({
        where: { gradeNumber: grade.gradeNumber },
          update: {}, // Update nothing if already exists
          create: grade,
    });
    console.log(`Created/Founded grade with idGrade: ${newGrade.idGrade} & gradeNumber: ${newGrade.gradeNumber}`);
  }

  console.log('Completed data seeding...');
  console.log('---------------------------------');

  // --- 2. Seeding data (Roles) ---
  console.log('Starting data seeding Roles...');

  // Data example in table Role (admin y teacher)
  const roles = [
   { roleName: "admin" },
   { roleName: "teacher" }
  ];

  for (const role of roles) {
   // Use 'upsert' if not exist (based in roleName @unique)
   const newRole = await prisma.role.upsert({
       where: { roleName: role.roleName },
          update: {}, // No actualizar si ya existe
          create: role,
    });
    console.log(`Created/Founded rol with id: ${newRole.id} & roleName: ${newRole.roleName}`);
  }

  console.log('Seeding Roles completed.');
  console.log('---------------------------------');

  const incidents = [
   { nameIncdnt: 'Observation'},
   { nameIncdnt: 'Positive'},
   { nameIncdnt: 'Negative'},
   { nameIncdnt: 'Terrible'},
   { nameIncdnt: 'Abomination'},
   { nameIncdnt: 'Real dangerous'}
  ];

  for (const incident of incidents) {
   // Use 'upsert' to create rol if not exist (based in roleName @unique)
   const newIncident = await prisma.incident.upsert({
       where: { nameIncdnt: incident.nameIncdnt },
          update: {}, // No update if already exists
          create: incident,
    });
    console.log(`Created/Founded Incident with id: ${newIncident.idIncident} & roleName: ${newIncident.nameIncdnt}`);
  }

  console.log('Completed data seeding.');
}

main()
  .catch((e) => {
     console.error(e);
     process.exit(1);
  })
  .finally(async () => {
     await prisma.$disconnect();
  });