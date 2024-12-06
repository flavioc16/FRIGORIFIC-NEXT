import prismaClient from '../../../prisma';  // Importando o cliente do Prisma para interagir com o banco de dados

class JurosService {
  // Método que aplica os juros nas compras vencidas
  async aplicarJuros() {
    try {
      // Obtendo as compras vencidas (supondo que a data de vencimento está em `dataVencimento`)
      const comprasVencidas = await prismaClient.compra.findMany({
        where: {
          dataVencimento: {
            lt: new Date(),  // Filtrando compras vencidas (dataVencimento menor que a data atual)
          },
          statusCompra: 0,  // Considerando apenas compras com status "pendente"
        },
      });

      // Aplicando os juros nas compras vencidas
      const comprasAtualizadas = [];
      for (const compra of comprasVencidas) {
        // Calculando o juros, aqui é um exemplo com 5% de juros (ajustar conforme sua lógica)
        const juros = compra.tipoCompra * 0.05;  // 5% de juros
        const valorComJuros = compra.tipoCompra + juros;

        // Atualizando a compra no banco de dados com o novo valor
        const compraAtualizada = await prismaClient.compra.update({
          where: {
            id: compra.id,
          },
          data: {
            tipoCompra: valorComJuros,  // Atualizando o valor total da compra com os juros
          },
        });

        comprasAtualizadas.push(compraAtualizada);  // Adicionando a compra atualizada à lista
      }

      return comprasAtualizadas;  // Retornando as compras com os juros aplicados
    } catch (error) {
      console.error('Erro ao aplicar juros:', error);
      throw new Error('Erro ao aplicar juros');
    }
  }
}

export { JurosService };
