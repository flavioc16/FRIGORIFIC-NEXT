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
    valorInicialCompra,
    dataDaCompra,
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
        
        // Se dataDaCompra for fornecida, usamos ela diretamente sem modificar.
        dataDaCompra: dataDaCompra 
          ? new Date(dataDaCompra) // Garantimos que a data é criada corretamente como Date
          : compraExistente.dataDaCompra, // Se não for fornecida, mantém a data existente
        totalCompra: totalCompra ?? compraExistente.totalCompra,
        valorInicialCompra: valorInicialCompra ?? compraExistente.valorInicialCompra,
        tipoCompra: tipoCompra ?? compraExistente.tipoCompra,
        statusCompra: statusCompra ?? compraExistente.statusCompra,
      },
    });

    return compraAtualizada;
  }
}

export { UpdateCompraService };
