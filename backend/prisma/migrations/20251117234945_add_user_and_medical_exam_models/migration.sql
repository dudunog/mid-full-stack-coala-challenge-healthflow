-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ATTENDANT', 'DOCTOR');

-- CreateEnum
CREATE TYPE "ExamStatus" AS ENUM ('PENDING', 'PROCESSING', 'DONE', 'ERROR', 'REPORTED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicalExam" (
    "id" TEXT NOT NULL,
    "status" "ExamStatus" NOT NULL DEFAULT 'PENDING',
    "processingResult" TEXT,
    "report" TEXT,
    "attendantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MedicalExam_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "MedicalExam" ADD CONSTRAINT "MedicalExam_attendantId_fkey" FOREIGN KEY ("attendantId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
