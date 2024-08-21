-- AlterTable
ALTER TABLE "clientes" ADD COLUMN     "endereco" TEXT NOT NULL DEFAULT 'Não informado',
ADD COLUMN     "referencia" TEXT NOT NULL DEFAULT 'Não informado';
