import prismaClient from '../../../prisma'; // Certifique-se de que este caminho está correto

interface CompraRequest {
  descricaoCompra: string;
  totalCompra: number;
  tipoCompra: number;
  statusCompra: number;
  valorInicialCompra: number;
  clienteId: string;
  userId: string;
  dataDaCompra?: string; // Opcional
}

class CreateCompraService {
  async execute({
    descricaoCompra,
    totalCompra,
    valorInicialCompra,
    tipoCompra,
    statusCompra,
    clienteId,
    userId,
    dataDaCompra,
  }: CompraRequest) {
    // Use a data atual ou a fornecida
    const currentDate = new Date();
    let parsedDate = dataDaCompra ? new Date(dataDaCompra) : currentDate;

    // Certifique-se de que parsedDate tenha o mesmo horário em UTC que a data atual
    parsedDate.setUTCHours(
      currentDate.getUTCHours(),
      currentDate.getUTCMinutes(),
      currentDate.getUTCSeconds(),
      currentDate.getUTCMilliseconds()
    );

    // Calcule a data de vencimento (30 dias após a data da compra, por exemplo)
    const vencimentoDate = new Date(parsedDate);
    vencimentoDate.setDate(parsedDate.getDate() + 30); // Adiciona 30 dias

    vencimentoDate.setUTCHours(0, 0, 0, 0);

    // Crie a compra definindo ambos os campos com parsedDate
    const compra = await prismaClient.compra.create({
      data: {
        descricaoCompra,
        totalCompra,
        valorInicialCompra,
        tipoCompra,
        statusCompra,
        cliente: { connect: { id: clienteId } },
        user: { connect: { id: userId } },
        dataDaCompra: parsedDate,  // Salva como UTC
        created_at: parsedDate,    // Salva como UTC
        dataVencimento: vencimentoDate, // Preenche a data de vencimento
      },
    });

    return compra;
  }
}

export { CreateCompraService };
