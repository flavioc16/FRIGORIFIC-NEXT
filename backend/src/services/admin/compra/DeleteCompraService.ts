import prismaClient from "../../../prisma";

class DeleteCompraService {
  async execute(id: string) {
    if (!id) {
      throw new Error("ID da compra não fornecido.");
    }

    // Verifica se a compra existe
    const compraExistente = await prismaClient.compra.findUnique({
      where: { id: id },
    });

    if (!compraExistente) {
      throw new Error("Compra não encontrada.");
    }

    // Verifica se há juros associados a essa compra
    const jurosAssociados = await prismaClient.juros.findFirst({
      where: { compraId: id },
    });

    if (jurosAssociados) {
      throw new Error(
        "A compra possue juros e não pode ser excluída."
      );
    }

    // Exclui a compra
    await prismaClient.compra.delete({
      where: { id: id },
    });

    return { message: "Compra excluída com sucesso." };
  }
}

export { DeleteCompraService };
