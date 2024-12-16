import prismaClient from "../../../prisma";

class GetJurosByCompraIdService {
  async execute(id: string) {
    // Usa findFirst para buscar os juros associados à compra
    const juros = await prismaClient.juros.findFirst({
      where: {
        compraId: id,  // Usa o campo compraId para buscar os juros
      },
    });

    if (!juros) {
      throw new Error("Juros não encontrados para esta compra.");
    }

    // Retorna o valor dos juros e o total com juros
    return {
      juros: juros.valor // Campo 'valor' na tabela de juros
    };
  }
}

export { GetJurosByCompraIdService };
