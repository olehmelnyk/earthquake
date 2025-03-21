-- CreateTable
CREATE TABLE "Earthquake" (
    "id" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "magnitude" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Earthquake_pkey" PRIMARY KEY ("id")
);
