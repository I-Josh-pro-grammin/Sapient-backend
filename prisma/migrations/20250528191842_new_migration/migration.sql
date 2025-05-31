/*
  Warnings:

  - You are about to drop the column `LastName` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `hashRt` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "LastName",
DROP COLUMN "firstName",
DROP COLUMN "hashRt",
ADD COLUMN     "username" TEXT NOT NULL DEFAULT 'user';
