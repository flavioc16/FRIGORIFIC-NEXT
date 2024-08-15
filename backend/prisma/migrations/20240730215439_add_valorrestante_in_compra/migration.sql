/*
  Warnings:

  - Added the required column `valorRestante` to the `compras` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "compras" ADD COLUMN     "valorRestante" DOUBLE PRECISION NOT NULL;
