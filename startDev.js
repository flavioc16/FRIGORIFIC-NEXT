const concurrently = require('concurrently');

// Função para rodar o comando 'yarn dev' no backend e frontend
async function startDev() {
  try {
    console.log('Iniciando o servidor do backend e frontend...');

    await concurrently([
      { command: 'yarn dev', cwd: './backend', name: 'backend' },
      { command: 'yarn dev', cwd: './frontend', name: 'frontend' },
    ]);

    console.log('Servidores do backend e frontend iniciados.');
  } catch (error) {
    console.error('Erro ao iniciar os servidores:', error);
  }
}

// Executar a função
startDev();
