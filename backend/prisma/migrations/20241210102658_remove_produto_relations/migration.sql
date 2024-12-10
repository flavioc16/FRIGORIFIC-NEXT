/*
  Warnings:

  - You are about to drop the column `produtoId` on the `compras` table. All the data in the column will be lost.
  - You are about to drop the column `estoque` on the `produtos` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "compras" DROP CONSTRAINT "compras_produtoId_fkey";

-- AlterTable
ALTER TABLE "compras" DROP COLUMN "produtoId";

-- AlterTable
ALTER TABLE "produtos" DROP COLUMN "estoque";
