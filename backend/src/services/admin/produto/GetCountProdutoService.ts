import prismaClient from "../../../prisma";

class GetCountProdutoService {
    async execute() {
        // Contando o número de registros na tabela "produto"
        const count = await prismaClient.produto.count();
        return count;
    }
}

export { GetCountProdutoService };
