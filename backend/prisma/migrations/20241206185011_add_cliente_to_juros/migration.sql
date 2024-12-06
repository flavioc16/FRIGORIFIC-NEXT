-- CreateTable
CREATE TABLE "juros" (
    "id" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "descricao" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "compraId" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,

    CONSTRAINT "juros_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "juros" ADD CONSTRAINT "juros_compraId_fkey" FOREIGN KEY ("compraId") REFERENCES "compras"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "juros" ADD CONSTRAINT "juros_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
