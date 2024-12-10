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

//Product Controllers
import { CreateProdutoController } from './controllers/admin/produto/CreateProdutoController';
import { UpdateProdutoController } from './controllers/admin/produto/UpdateProdutoController';
import { GetAllProdutosController } from './controllers/admin/produto/GetAllProdutosController';
import { GetProdutoByIdController } from './controllers/admin/produto/GetProdutoByIdController';
import { DeleteProdutoController } from './controllers/admin/produto/DeleteProdutoController';
import { GetTotalProdutosController } from './controllers/admin/produto/GetTotalProdutoController';

// Admin Compra Controllers
import { GetTotalComprasDoDiaController } from './controllers/admin/compra/GetTotalComprasDoDiaController';
import { GetAllComprasController } from './controllers/admin/compra/GetComprasController';
import { CreateCompraController } from './controllers/admin/compra/CreateCompraController';
import { GetCompraByIdController } from './controllers/admin/compra/GetCompraByIdController';
import { UpdateCompraController } from './controllers/admin/compra/UpdateCompraController';
import { DeleteCompraController } from './controllers/admin/compra/DeleteCompraController';




// Outros Controllers
import { GetComprasPorIdController } from './controllers/admin/GetComprasPorIdClientController';
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
router.get('/clients/:clienteId', isAuthenticated, authorizeRole('ADMIN'), new GetClienteByIdController().handle);
router.delete('/clients', isAuthenticated, authorizeRole('ADMIN'), new DeleteClienteController().handle);
router.get('/clients/purchases/:clienteId/compras', isAuthenticated, authorizeRole('ADMIN'), new GetComprasPorIdController().handle);

// Criar um novo produto
router.post('/produtos', isAuthenticated, authorizeRole('ADMIN'), new CreateProdutoController().handle);
router.put('/produtos/:id', isAuthenticated, authorizeRole('ADMIN'), new UpdateProdutoController().handle);
router.get('/produtos', isAuthenticated, authorizeRole('ADMIN'), new GetAllProdutosController().handle);
router.get('/produtos/:id', isAuthenticated, authorizeRole('ADMIN'), new GetProdutoByIdController().handle);
router.get('/produtos/total', isAuthenticated, authorizeRole('ADMIN'), new GetTotalProdutosController().handle);
router.delete('/produtos/:id', isAuthenticated, authorizeRole('ADMIN'), new DeleteProdutoController().handle);

// Admin Routes Compras
router.post('/compras', isAuthenticated, authorizeRole('ADMIN'), new CreateCompraController().handle);
router.put('/compras', isAuthenticated, authorizeRole('ADMIN'), new UpdateCompraController().handle);
router.get('/compras', isAuthenticated, authorizeRole('ADMIN'), new GetAllComprasController().handle);
router.get('/compras/total-do-dia', isAuthenticated, authorizeRole('ADMIN'), new GetTotalComprasDoDiaController().handle);
router.get('/compras/:compraId', isAuthenticated, authorizeRole('ADMIN'), new GetCompraByIdController().handle);
router.delete('/compras', isAuthenticated, authorizeRole('ADMIN'), new DeleteCompraController().handle);

// Admin Routes Pagamentos
router.post('/pagamentos', isAuthenticated, authorizeRole('ADMIN'), new CreatePagamentoController().handle);

export { router };
