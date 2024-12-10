import cron from 'node-cron';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { router } from './routes';

//functions
import { aplicarJuros } from './jobs/aplicarJuros'; // Importando a função
import { criarBackupJSON } from './jobs/criarBackupJSON';
import { commitAutomatico } from './jobs/autoCommit';
import { criarBackupSQL } from './jobs/criarBackupSQL';

aplicarJuros();
criarBackupSQL();
//commitAutomatico();

// Função de juros
cron.schedule('0 0 * * *', async () => {
  console.log('Executando script de juros...');
  await aplicarJuros();
});

// Função de backup SQL
cron.schedule('50 11 * * *', async () => {
  console.log('Executando backup completo...');
  await criarBackupSQL();
});


// Função de commit (agendado para todos os dias, por exemplo)
cron.schedule('55 11 * * *', async () => {
  console.log('Chamando a função de commit');
  await commitAutomatico(); // Chama a função de commit
});

cron.schedule('0 16 * * *', async () => {
  console.log('Executando backup completo...');
  await criarBackupSQL();
});

// Função de commit (agendado para todos os dias, por exemplo)
cron.schedule('5 16 * * *', async () => {  // Agendado para 3:00 AM todos os dias
  console.log('Chamando a função de commit');
  await commitAutomatico(); // Chama a função de commit
});

// cron.schedule('* * * * *', async () => {
//   console.log('Executando backup completo...');
//   await criarBackupJSON(); // Chama a função de criar backup
// });

const app = express();

app.use(express.json());
app.use(cors());

app.use(router);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof Error) {
    return res.status(400).json({
      error: err.message
    });
  }

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error.'
  });
});

app.listen(3333, () => {
  console.log('Servidor Online!!!');
});
