import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export async function criarBackupSQL() {
  try {
    // Lista de tabelas no banco de dados
    const modelos = ['user', 'cliente', 'compra', 'pagamento', 'juros', 'produto'];
    let sqlDump = '';

    // Obtém a data atual no formato YYYY-MM-DD
    const dataAtual = new Date().toISOString().split('T')[0];

    // Define o diretório de backups
    const diretorioBackup = path.join(__dirname, 'backups');

    // Define o nome e o caminho do arquivo de backup
    const nomeArquivo = `backup-sql-${dataAtual}.sql`;
    const caminhoArquivo = path.join(diretorioBackup, nomeArquivo);

    // Verifica se o diretório de backups existe, se não, cria
    if (!fs.existsSync(diretorioBackup)) {
      fs.mkdirSync(diretorioBackup, { recursive: true });
    }

    // Verifica se já existe um arquivo de backup para a data atual
    if (fs.existsSync(caminhoArquivo)) {
      // Apaga o arquivo de backup existente
      fs.unlinkSync(caminhoArquivo);
      console.log(`Backup anterior para a data ${dataAtual} foi apagado.`);
    }

    // Itera sobre os modelos e extrai os dados de cada um
    for (const modelo of modelos) {
      const registros = await prisma[modelo].findMany();

      if (registros.length > 0) {
        // Gera comandos SQL acumulados para cada modelo
        const colunas = Object.keys(registros[0]).join(', ');
        const valores = registros
          .map((registro) => {
            const valoresLinha = Object.values(registro)
              .map((valor) => {
                if (valor instanceof Date) {
                  // Formata o valor de data para 'YYYY-MM-DD HH:mm:ss'
                  return `'${valor.toISOString().replace('T', ' ').slice(0, 19)}'`;
                } else if (typeof valor === 'string') {
                  return `'${valor.replace(/'/g, "''")}'`; // Escapar aspas simples
                } else if (valor === null) {
                  return 'NULL'; // Tratar valores nulos
                } else {
                  return `'${valor}'`; // Tratar outros tipos
                }
              })
              .join(', ');
            return `(${valoresLinha})`;
          })
          .join(',\n');

        // Adiciona o comando `INSERT INTO` no dump
        sqlDump += `INSERT INTO ${modelo} (${colunas}) VALUES\n${valores};\n\n`;
      }
    }

    // Salva os comandos SQL no arquivo de backup
    fs.writeFileSync(caminhoArquivo, sqlDump);
    console.log(`Backup criado com sucesso: ${caminhoArquivo}`);
  } catch (error) {
    console.error('Erro ao criar backup completo:', error);
  } finally {
    // Fecha a conexão com o banco de dados
    await prisma.$disconnect();
  }
}
