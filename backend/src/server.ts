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
commitAutomatico();

cron.schedule('0 0 * * *', async () => {
  console.log('Executando script de juros...');
  await aplicarJuros();
});

cron.schedule('0 0 * * *', async () => {
  console.log('Executando backup completo...');
  await criarBackupSQL();
});

cron.schedule('0 0 * * *', async () => {
  console.log('Chamando a função de commit');
  await commitAutomatico(); // Chama a função de criar backup
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
