import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export async function criarBackupSQL() {
  try {
    // Lista de tabelas no banco de dados
    const modelos = ['user', 'cliente', 'compra', 'pagamento', 'juros'];
    let sqlDump = '';

    // Obtém a data atual no formato YYYY-MM-DD
    const dataAtual = new Date().toISOString().split('T')[0];

    // Define o diretório de backups
    const diretorioBackup = path.join(__dirname, 'backups');

    // Verifica se já existe um arquivo de backup para a data atual
    if (fs.existsSync(diretorioBackup)) {
      const arquivos = fs.readdirSync(diretorioBackup);
      const jaExisteBackup = arquivos.some((arquivo) => arquivo.includes(dataAtual));

      if (jaExisteBackup) {
        console.log(`Já existe um backup para a data ${dataAtual}. Nenhuma ação foi tomada.`);
        return;
      }
    }
    // Itera sobre os modelos e extrai os dados de cada um
    for (const modelo of modelos) {
      const registros = await prisma[modelo].findMany();

      if (registros.length > 0) {
        // Gera comandos SQL para cada registro
        const colunas = Object.keys(registros[0]).join(', ');
        registros.forEach((registro) => {
          const valores = Object.values(registro)
            .map((valor) =>
              typeof valor === 'string'
                ? `'${valor.replace(/'/g, "''")}'` // Escapar aspas simples
                : valor === null
                ? 'NULL' // Tratar valores nulos
                : `'${valor}'` // Tratar outros tipos
            )
            .join(', ');

          sqlDump += `INSERT INTO ${modelo} (${colunas}) VALUES (${valores});\n`;
        });
      }
    }

    // Define o nome e o caminho do arquivo de backup
    const nomeArquivo = `backup-sql-${dataAtual}.sql`;
    const caminhoArquivo = path.join(diretorioBackup, nomeArquivo);

    // Cria o diretório de backups se ele não existir
    if (!fs.existsSync(diretorioBackup)) {
      fs.mkdirSync(diretorioBackup, { recursive: true });
    }

    // Salva os comandos SQL no arquivo
    fs.writeFileSync(caminhoArquivo, sqlDump);
    console.log(`Backup criado com sucesso: ${caminhoArquivo}`);
  } catch (error) {
    console.error('Erro ao criar backup completo:', error);
  } finally {
    // Fecha a conexão com o banco de dados
    await prisma.$disconnect();
  }
}
