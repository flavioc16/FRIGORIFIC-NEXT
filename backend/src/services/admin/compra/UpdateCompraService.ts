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
  dataVencimento?: string;
}

class UpdateCompraService {
  async execute({
    id,
    descricaoCompra,
    totalCompra,
    tipoCompra,
    statusCompra,
    valorInicialCompra,
    dataDaCompra,
    dataVencimento, // Esse campo será sobrescrito automaticamente se `dataDaCompra` for alterada
  }: CompraRequest) {
    // Verifica se a compra existe
    const compraExistente = await prismaClient.compra.findUnique({
      where: { id },
    });

    if (!compraExistente) {
      throw new Error("Compra não encontrada");
    }

    // Calcula nova data de vencimento, se necessário
    let novaDataVencimento: Date | undefined = undefined;

    if (dataDaCompra) {
      const dataCompraConvertida = new Date(dataDaCompra);
      novaDataVencimento = new Date(dataCompraConvertida);
      novaDataVencimento.setDate(novaDataVencimento.getDate() + 30);
    }

    // Atualiza a compra com os novos dados
    const compraAtualizada = await prismaClient.compra.update({
      where: { id },
      data: {
        descricaoCompra: descricaoCompra ?? compraExistente.descricaoCompra,
        dataDaCompra: dataDaCompra 
          ? new Date(dataDaCompra) 
          : compraExistente.dataDaCompra,
        totalCompra: totalCompra ?? compraExistente.totalCompra,
        valorInicialCompra: valorInicialCompra ?? compraExistente.valorInicialCompra,
        tipoCompra: tipoCompra ?? compraExistente.tipoCompra,
        statusCompra: statusCompra ?? compraExistente.statusCompra,
        dataVencimento: novaDataVencimento 
          ? novaDataVencimento 
          : compraExistente.dataVencimento, // Mantém a existente, se não for alterada
      },
    });

    return compraAtualizada;
  }
}

export { UpdateCompraService };
