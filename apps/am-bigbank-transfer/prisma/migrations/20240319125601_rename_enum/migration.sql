/*
  Warnings:

  - The `status` column on the `transfer` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ETransferStatus" AS ENUM ('PROCESSING', 'DONE', 'ERROR');

-- AlterTable
ALTER TABLE "transfer" DROP COLUMN "status",
ADD COLUMN     "status" "ETransferStatus" NOT NULL DEFAULT 'PROCESSING';

-- DropEnum
DROP TYPE "TransferStatus";
