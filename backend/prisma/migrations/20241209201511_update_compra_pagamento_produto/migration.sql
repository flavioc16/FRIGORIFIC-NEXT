-- DropForeignKey
ALTER TABLE "compras" DROP CONSTRAINT "compras_pagamentoId_fkey";

-- AlterTable
ALTER TABLE "pagamentos" ADD COLUMN     "compraId" TEXT;

-- AddForeignKey
ALTER TABLE "pagamentos" ADD CONSTRAINT "pagamentos_compraId_fkey" FOREIGN KEY ("compraId") REFERENCES "compras"("id") ON DELETE SET NULL ON UPDATE CASCADE;
