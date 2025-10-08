/*
  Warnings:

  - You are about to drop the `Course` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CourseModule` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CourseRating` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StudentProfile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TeacherProfile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserCourseProgress` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CourseModule" DROP CONSTRAINT "CourseModule_courseId_fkey";

-- DropForeignKey
ALTER TABLE "CourseRating" DROP CONSTRAINT "CourseRating_courseId_fkey";

-- DropForeignKey
ALTER TABLE "CourseRating" DROP CONSTRAINT "CourseRating_userId_fkey";

-- DropForeignKey
ALTER TABLE "StudentProfile" DROP CONSTRAINT "StudentProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "TeacherProfile" DROP CONSTRAINT "TeacherProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserCourseProgress" DROP CONSTRAINT "UserCourseProgress_courseId_fkey";

-- DropForeignKey
ALTER TABLE "UserCourseProgress" DROP CONSTRAINT "UserCourseProgress_userId_fkey";

-- DropTable
DROP TABLE "Course";

-- DropTable
DROP TABLE "CourseModule";

-- DropTable
DROP TABLE "CourseRating";

-- DropTable
DROP TABLE "StudentProfile";

-- DropTable
DROP TABLE "TeacherProfile";

-- DropTable
DROP TABLE "UserCourseProgress";

-- DropEnum
DROP TYPE "Level";
