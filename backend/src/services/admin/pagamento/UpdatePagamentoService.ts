import prismaClient from "../../../prisma";


interface UpdatePagamentoDTO {
    valorPagamento: number;
}

class UpdatePagamentoService {
    async execute(id: string, { valorPagamento}: UpdatePagamentoDTO) {
        const pagamento = await prismaClient.pagamento.update({
            where: { id },
            data: {
                valorPagamento,
            },
        });

        return pagamento;
    }
}

export { UpdatePagamentoService };
