-- CreateEnum
CREATE TYPE "Status" AS ENUM ('APPROVED', 'PENDING');

-- CreateTable
CREATE TABLE "note" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "status" "Status" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "note_pkey" PRIMARY KEY ("id")
);
