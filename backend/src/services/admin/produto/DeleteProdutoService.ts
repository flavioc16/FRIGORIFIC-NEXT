import prismaClient from "../../../prisma";

class DeleteProdutoService {
  async execute(id: string) {
    if (!id) {
      throw new Error("ID do produto não fornecido.");
    }
    
    // Verifica se o produto realmente existe
    const produtoExistente = await prismaClient.produto.findUnique({
      where: { id: id },
    });

    if (!produtoExistente) {
      throw new Error("Produto não encontrado.");
    }

    // Exclui o produto
    await prismaClient.produto.delete({
      where: { id: id },
    });

    return { message: "Produto excluído com sucesso." };
  }
}

export { DeleteProdutoService };
