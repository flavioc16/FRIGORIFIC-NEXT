import prismaClient from "../../../prisma";

class GetAllProdutosService {
  async execute() {
    // Recupera todos os produtos do banco de dados, ordenados pelo nome
    const produtos = await prismaClient.produto.findMany({
      orderBy: {
        nome: 'asc',  // Ordena os produtos pelo campo 'nome' em ordem ascendente (A-Z)
      },
    });

    return produtos;
  }
}

export { GetAllProdutosService };
