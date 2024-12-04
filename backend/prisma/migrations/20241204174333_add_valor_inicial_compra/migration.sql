-- Adiciona a coluna com valor NULL inicialmente
ALTER TABLE "compras" ADD COLUMN "valorInicialCompra" DOUBLE PRECISION;

-- Preenche a coluna com os valores de "totalCompra"
UPDATE "compras" SET "valorInicialCompra" = "totalCompra";

-- Define a coluna como NOT NULL depois de preencher
ALTER TABLE "compras" ALTER COLUMN "valorInicialCompra" SET NOT NULL;
