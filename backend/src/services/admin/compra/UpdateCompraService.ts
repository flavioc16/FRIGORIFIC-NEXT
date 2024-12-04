import prismaClient from "../../../prisma";

interface CompraRequest {
  id: string;
  descricaoCompra?: string;
  dataDaCompra?: string;
  created_at?: string;
  totalCompra?: number;
  valorInicialCompra?: number;
  tipoCompra?: number;
  statusCompra?: number;
}

class UpdateCompraService {
  async execute({
    id,
    descricaoCompra,
    totalCompra,
    tipoCompra,
    statusCompra,
    dataDaCompra,
    created_at,
  }: CompraRequest) {
    // Verifica se a compra existe
    const compraExistente = await prismaClient.compra.findUnique({
      where: { id },
    });

    if (!compraExistente) {
      throw new Error("Compra não encontrada");
    }

    // Atualiza a compra com os novos dados
    const compraAtualizada = await prismaClient.compra.update({
      where: { id },
      data: {
        descricaoCompra: descricaoCompra ?? compraExistente.descricaoCompra,
        dataDaCompra: dataDaCompra ? new Date(dataDaCompra + 'T00:00:00Z') : compraExistente.dataDaCompra,
        created_at: created_at ? new Date(created_at) : compraExistente.created_at,
        totalCompra: totalCompra ?? compraExistente.totalCompra,
        tipoCompra: tipoCompra ?? compraExistente.tipoCompra,
        statusCompra: statusCompra ?? compraExistente.statusCompra,
      },
    });

    return compraAtualizada;
  }
}

export { UpdateCompraService };
