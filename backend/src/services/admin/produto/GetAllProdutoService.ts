import prismaClient from "../../../prisma";

class GetAllProdutosService {
  async execute() {
    // Recupera todos os produtos do banco de dados
    const produtos = await prismaClient.produto.findMany({
      // Aqui você pode adicionar mais opções de filtro, ordenação, ou paginação se necessário
    });

    return produtos;
  }
}

export { GetAllProdutosService };
