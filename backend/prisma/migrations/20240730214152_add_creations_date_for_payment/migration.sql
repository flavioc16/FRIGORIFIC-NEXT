/*
  Warnings:

  - You are about to drop the column `dataPagamento` on the `pagamentos` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "pagamentos" DROP COLUMN "dataPagamento",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
