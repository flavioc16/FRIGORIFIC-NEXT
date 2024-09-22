import { Router } from 'express';

// Controllers
// Auth Controllers
import { AuthUserController } from './controllers/AuthUserController';
import { DetailUserControle } from './controllers/DetailUserControle';

// Admin User Controllers
import { CreateUserController } from './controllers/admin/CreateUserController';

// Admin Client Controllers
import { GetAllClientesController } from './controllers/admin/client/GetAllClientesController';
import { CreateClienteController } from './controllers/admin/client/CreateClienteController';
import { GetClienteByIdController } from './controllers/admin/client/GetClienteByIdController';
import { UpdateClienteController } from './controllers/admin/client/UpdateClienteController';
import { DeleteClienteController } from './controllers/admin/client/DeleteClienteController';

// Admin Compra Controllers
import { GetTotalComprasDoDiaController } from './controllers/admin/compra/GetTotalComprasDoDiaController';
import { GetAllComprasController } from './controllers/admin/compra/GetComprasController';
import { CreateCompraController } from './controllers/admin/compra/CreateCompraController';
import { GetCompraByIdController } from './controllers/admin/compra/GetCompraByIdController';
import { UpdateCompraController } from './controllers/admin/compra/UpdateCompraController';

import { GetComprasPorIdController } from './controllers/admin/GetComprasPorIdClientController';

// Admin Pagamento Controllers
import { CreatePagamentoController } from './controllers/admin/pagamento/CreatePagamentoController';

// Middlewares
import { isAuthenticated } from './middlewares/isAuthenticated';
import { authorizeRole } from './middlewares/authorizeRole';

const router = Router();

// Auth Routes
router.post('/session', new AuthUserController().handle);
router.get('/me', isAuthenticated, new DetailUserControle().handle);

// Admin Routes new user (login)
router.post('/users', new CreateUserController().handle);

// Admin Routes Clients
router.post('/clients', isAuthenticated, authorizeRole('ADMIN'), new CreateClienteController().handle);
router.put('/clients', isAuthenticated, authorizeRole('ADMIN'), new UpdateClienteController().handle);
router.get('/clients', isAuthenticated, authorizeRole('ADMIN'), new GetAllClientesController().handle);
router.get('/clients/:clientId', isAuthenticated, authorizeRole('ADMIN'), new GetClienteByIdController().handle);
router.delete('/clients', isAuthenticated, authorizeRole('ADMIN'), new DeleteClienteController().handle);

router.get('/clients/purchases/:clienteId/compras', isAuthenticated, authorizeRole('ADMIN'), new GetComprasPorIdController().handle);


//  Admin Routes Compras
router.post('/compras', isAuthenticated, authorizeRole('ADMIN'), new CreateCompraController().handle);
router.put('/compra/:id', isAuthenticated, authorizeRole('ADMIN'), new UpdateCompraController().handle);
router.get('/compras', isAuthenticated, authorizeRole('ADMIN'), new GetAllComprasController().handle);
router.get('/compras/total-do-dia', isAuthenticated, authorizeRole('ADMIN'), new GetTotalComprasDoDiaController().handle);
router.get('/compras/:compraId', isAuthenticated, authorizeRole('ADMIN'), new GetCompraByIdController().handle);

//  Admin Routes Pagamentos
router.post('/pagamentos', isAuthenticated, authorizeRole('ADMIN'), new CreatePagamentoController().handle);

// Client Routes
//router.get('/comprasuserloged', isAuthenticated, authorizeRole('USER'), new GetComprasController().handle);


export { router };
