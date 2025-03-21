/*
  Warnings:

  - A unique constraint covering the columns `[location,magnitude,date]` on the table `Earthquake` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Earthquake_location_magnitude_date_key" ON "Earthquake"("location", "magnitude", "date");
