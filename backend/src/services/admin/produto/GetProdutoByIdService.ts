import prismaClient from "../../../prisma";

class GetProdutoByIdService {
  async execute(id: string) {
    // Recupera o produto por ID
    const produto = await prismaClient.produto.findUnique({
      where: {
        id: id,
      },
    });

    if (!produto) {
      throw new Error("Produto não encontrado.");
    }

    return produto;
  }
}

export { GetProdutoByIdService };

