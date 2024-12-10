import prismaClient from "../../../prisma";

class GetTotalProdutosService {
  async execute() {
    // Conta o total de produtos na tabela "produtos"
    const totalProdutos = await prismaClient.produto.count();

    return { total: totalProdutos };
  }
}

export { GetTotalProdutosService };
