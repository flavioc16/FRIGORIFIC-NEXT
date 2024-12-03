import prismaClient from '../../../prisma'; // Certifique-se de que este caminho está correto

interface CompraRequest {
  descricaoCompra: string;
  totalCompra: number;
  tipoCompra: number;
  statusCompra: number;
  clienteId: string;
  userId: string;
  dataDaCompra?: string; // Opcional
}

class CreateCompraService {
  async execute({
    descricaoCompra,
    totalCompra,
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

    // Crie a compra definindo ambos os campos com parsedDate
    const compra = await prismaClient.compra.create({
      data: {
        descricaoCompra,
        totalCompra,
        tipoCompra,
        statusCompra,
        cliente: { connect: { id: clienteId } },
        user: { connect: { id: userId } },
        dataDaCompra: parsedDate,  // Salva como UTC
        created_at: parsedDate,    // Salva como UTC
      },
    });

    return compra;
  }
}

export { CreateCompraService };
