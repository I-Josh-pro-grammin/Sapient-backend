-- AlterTable
ALTER TABLE "users" ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tokenExpiration" TIMESTAMP(3),
ADD COLUMN     "verificationToken" TEXT;
