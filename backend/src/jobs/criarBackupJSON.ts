import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export async function criarBackupJSON() {
  try {
    console.log('Iniciando backup completo do banco de dados...');

    // Lista de tabelas no banco de dados
    const modelos = ['user', 'cliente', 'compra', 'pagamento', 'juros'];

    // Objeto para armazenar os dados do backup
    const backupData = {
      timestamp: new Date().toISOString(),
      dados: {},
    };

    // Itera sobre os modelos e extrai os dados de cada um
    for (const modelo of modelos) {
      backupData.dados[modelo] = await prisma[modelo].findMany();
    }

    // Define o nome e o caminho do arquivo de backup
    const nomeArquivo = `backup-json-${new Date().toISOString().replace(/:/g, '-')}.json`;
    const caminhoArquivo = path.join(__dirname, 'backups', nomeArquivo);

    // Cria o diretório de backups se ele não existir
    if (!fs.existsSync(path.dirname(caminhoArquivo))) {
      fs.mkdirSync(path.dirname(caminhoArquivo), { recursive: true });
    }

    // Salva os dados em um arquivo JSON
    fs.writeFileSync(caminhoArquivo, JSON.stringify(backupData, null, 2));
  } catch (error) {
    console.error('Erro ao criar backup completo:', error);
  } finally {
    // Fecha a conexão com o banco de dados
    await prisma.$disconnect();
  }
}
