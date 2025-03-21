-- CreateIndex
CREATE INDEX "Earthquake_date_idx" ON "Earthquake"("date");

-- CreateIndex
CREATE INDEX "Earthquake_magnitude_idx" ON "Earthquake"("magnitude");

-- CreateIndex
CREATE INDEX "Earthquake_location_idx" ON "Earthquake"("location");
