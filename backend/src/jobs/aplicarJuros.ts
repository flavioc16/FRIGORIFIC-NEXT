import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function aplicarJuros() {
  try {
    const comprasVencidas = await prisma.compra.findMany({
      where: {
        dataVencimento: {
          lte: new Date(), // Compras com vencimento menor ou igual à data atual
        },
        statusCompra: 0, // Status pendente
      },
    });

    let totalJurosAplicados = 0;

    for (const compra of comprasVencidas) {
      // Verificar se já existem juros aplicados para esta compra
      const jurosExistentes = await prisma.juros.findFirst({
        where: {
          compraId: compra.id,
        },
        orderBy: {
          created_at: 'desc', // Pega o juros mais recente
        },
      });

      const umMesAtras = new Date();
      umMesAtras.setMonth(umMesAtras.getMonth() - 1); // Data de um mês atrás

      // Se não houver juros aplicados ou os juros foram aplicados há mais de 30 dias
      if (!jurosExistentes || new Date(jurosExistentes.created_at) < umMesAtras) {
        const valorJuros = compra.totalCompra * 0.05; // 5% de juros
        const novoTotal = compra.totalCompra + valorJuros;

        // Formatar a data do mês atual para referência na descrição
        const mesAtual = new Date();
        const mesNome = mesAtual.toLocaleString('pt-BR', { month: 'long' });
        const ano = mesAtual.getFullYear();

        // Atualiza o total da compra e marca como vencida
        await prisma.compra.update({
          where: { id: compra.id },
          data: {
            totalCompra: novoTotal,
            isVencida: 1, // Marca como vencida
          },
        });

        // Cria um registro de juros
        await prisma.juros.create({
          data: {
            valor: valorJuros,
            descricao: `Juros referente ao mês de: ${mesNome} ${ano}`,
            compraId: compra.id,
            clienteId: compra.clienteId,
          },
        });

        totalJurosAplicados += valorJuros;
      }
    }

    console.log(`${comprasVencidas.length} compras processadas. Juros aplicados: R$${totalJurosAplicados.toFixed(2)}`);
  } catch (error) {
    console.error('Erro ao aplicar juros:', error);
  } finally {
    await prisma.$disconnect();
  }
}
