-- CreateEnum
CREATE TYPE "TransferStatus" AS ENUM ('PROCESSING', 'DONE', 'ERROR');

-- AlterTable
ALTER TABLE "transfer" ADD COLUMN     "status" "TransferStatus" NOT NULL DEFAULT 'PROCESSING';
