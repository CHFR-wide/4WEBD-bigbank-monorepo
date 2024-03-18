-- CreateTable
CREATE TABLE "transfer" (
    "id" SERIAL NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "from_account_id" INTEGER NOT NULL,
    "to_account_id" INTEGER NOT NULL,

    CONSTRAINT "transfer_pkey" PRIMARY KEY ("id")
);
