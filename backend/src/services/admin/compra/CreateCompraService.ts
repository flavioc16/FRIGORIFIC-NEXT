import prismaClient from '../../../prisma'; // Certifique-se que este caminho está correto

interface CompraRequest {
  descricaoCompra: string;
  totalCompra: number;
  tipoCompra: number;
  statusCompra: number;
  clienteId: string;
  userId: string;
  dataDaCompra?: string; // Torne opcional
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
    const currentDate = new Date().toISOString().split('T')[0];
    const isDifferentDate =
      dataDaCompra && dataDaCompra.split('T')[0] !== currentDate;

    let parsedDate: Date | null = null;

    if (dataDaCompra) {
      // Cria um objeto Date com a data fornecida
      parsedDate = new Date(dataDaCompra);
      
      // Define as horas, minutos, segundos e milissegundos para as horas atuais
      const now = new Date(); // Pega a data e hora atuais
      parsedDate.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
    }
    

    const compra = await prismaClient.compra.create({
      data: {
        descricaoCompra,
        totalCompra,
        tipoCompra,
        statusCompra,
        cliente: { connect: { id: clienteId } },
        user: { connect: { id: userId } },
        dataDaCompra: parsedDate ?? new Date(),
      },
    });

    if (isDifferentDate) {
      await prismaClient.compra.update({
        where: { id: compra.id },
        data: { created_at: parsedDate ?? new Date() },
      });
    }

    return compra;
  }
}

export { CreateCompraService };
