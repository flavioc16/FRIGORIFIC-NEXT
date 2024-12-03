import prismaClient from "../../../prisma";

class DeleteCompraService {
  async execute(id: string) {
    if (!id) {
      throw new Error("ID da compra não fornecido.");
    }
    
    // Verifica se a compra realmente existe
    const compraExistente = await prismaClient.compra.findUnique({
      where: { id: id },
    });

    if (!compraExistente) {
      throw new Error("Compra não encontrada.");
    }

    // Exclui a compra
    await prismaClient.compra.delete({
      where: { id: id },
    });

    return { message: "Compra excluída com sucesso." };
  }
}

export { DeleteCompraService };

