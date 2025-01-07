/*
  Warnings:

  - You are about to alter the column `descricaoCompra` on the `compras` table. The data in that column could be lost. The data in that column will be cast from `VarChar(500)` to `VarChar(255)`.

*/
-- AlterTable
ALTER TABLE "compras" ALTER COLUMN "descricaoCompra" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "juros" ADD COLUMN     "notification" BOOLEAN NOT NULL DEFAULT false;
