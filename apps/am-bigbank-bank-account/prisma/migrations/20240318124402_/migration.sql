-- CreateTable
CREATE TABLE "bank_account" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "balance" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "bank_account_pkey" PRIMARY KEY ("id")
);
