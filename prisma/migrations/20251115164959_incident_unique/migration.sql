/*
  Warnings:

  - A unique constraint covering the columns `[nameIncdnt]` on the table `Incident` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Incident_nameIncdnt_key" ON "Incident"("nameIncdnt");
