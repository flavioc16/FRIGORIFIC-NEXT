import prismaClient from "../../../prisma";

class CreateProdutoService {
    async execute({
        nome,
        descricao,
        precoAVista,
        precoAPrazo,
    }) {
        // Criação do produto no banco de dados
        const produto = await prismaClient.produto.create({
            data: {
                nome,
                descricao,
                precoAVista,
                precoAPrazo,
                created_at: new Date(),
                updated_at: new Date(),
            },
        });

        return produto;
    }
}

export { CreateProdutoService };
