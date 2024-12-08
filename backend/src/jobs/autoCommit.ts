import { exec } from 'child_process';

// Função para executar comandos no terminal
function runCommand(command: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(`Erro ao executar comando: ${stderr}`);
      } else {
        resolve(stdout);
      }
    });
  });
}

// Função principal para fazer commit e push
export async function commitAutomatico() {
  try {
   
    const addOutput = await runCommand('git add .');
    console.log(addOutput);

    // Verificar se há alterações antes de fazer o commit
    const statusOutput = await runCommand('git status --porcelain');
    if (statusOutput.trim() === '') {
      console.log('Não há alterações para comitar.');
      return;  // Se não houver alterações, sai da função sem fazer o commit
    }
    await runCommand('git commit -m "Commit automático para backup"');  // Faz o commit com uma mensagem
   
    await runCommand('git push origin main');  // Envia para o repositório remoto no GitHub
    console.log('Arquivos enviados para o GitHub!');
  } catch (error) {
    console.error('Erro durante o processo Git:', error);  // Caso ocorra algum erro
  }
}

