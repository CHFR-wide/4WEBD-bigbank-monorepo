/*
  Warnings:

  - The `status` column on the `transfer` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `error` column on the `transfer` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "transfer" DROP COLUMN "status",
ADD COLUMN     "status" TEXT,
DROP COLUMN "error",
ADD COLUMN     "error" TEXT;

-- DropEnum
DROP TYPE "ETransferError";

-- DropEnum
DROP TYPE "ETransferStatus";
