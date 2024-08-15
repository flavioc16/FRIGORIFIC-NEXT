/*
  Warnings:

  - You are about to drop the column `dataCompra` on the `compras` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "compras" DROP COLUMN "dataCompra",
ADD COLUMN     "pagamentoId" TEXT;

-- AddForeignKey
ALTER TABLE "compras" ADD CONSTRAINT "compras_pagamentoId_fkey" FOREIGN KEY ("pagamentoId") REFERENCES "pagamentos"("id") ON DELETE SET NULL ON UPDATE CASCADE;
