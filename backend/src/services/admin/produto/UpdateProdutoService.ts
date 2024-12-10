import prismaClient from "../../../prisma";

interface IRequest {
  id: string;
  nome?: string;
  descricao?: string;
  precoAVista?: number;
  precoAPrazo?: number;
}

class UpdateProdutoService {
  async execute({ id, nome, descricao, precoAVista, precoAPrazo}: IRequest) {
    // Verifica se o ID foi fornecido
    if (!id) {
      throw new Error("ID do produto não fornecido.");
    }

    // Verifica se o produto existe no banco de dados
    const produtoExistente = await prismaClient.produto.findUnique({
      where: { id: id },
    });

    if (!produtoExistente) {
      throw new Error("Produto não encontrado.");
    }

    // Atualiza o produto com os dados fornecidos
    const produtoAtualizado = await prismaClient.produto.update({
      where: { id: id },
      data: {
        nome: nome ?? produtoExistente.nome, // Se o nome não for fornecido, mantém o nome atual
        descricao: descricao ?? produtoExistente.descricao,
        precoAVista: precoAVista ?? produtoExistente.precoAVista,
        precoAPrazo: precoAPrazo ?? produtoExistente.precoAPrazo,
      },
    });

    return produtoAtualizado;
  }
}

export { UpdateProdutoService };
