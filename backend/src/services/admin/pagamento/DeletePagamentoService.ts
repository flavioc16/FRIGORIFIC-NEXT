import prismaClient from "../../../prisma";

class DeletePagamentoService {
    async execute(id: string) {
        const pagamento = await prismaClient.pagamento.delete({
            where: { id },
        });

        return pagamento;
    }
}

export { DeletePagamentoService };