import { Request, Response } from 'express';
import { JurosService } from '../../../services/admin/juros/jurosService';  // Certifique-se de que o caminho está correto

class JurosController {
  private jurosService: JurosService;

  constructor() {
    // Inicializa o serviço
    this.jurosService = new JurosService();
  }

  // Rota para aplicar juros nas compras vencidas
  async aplicarJuros(req: Request, res: Response) {
    try {
      // Chama o método do serviço para aplicar os juros
      const comprasVencidas = await this.jurosService.aplicarJuros();

      // Retorna as compras com juros aplicados
      return res.status(200).json({
        message: 'Juros aplicados com sucesso nas compras vencidas!',
        compras: comprasVencidas,
      });
    } catch (error) {
      // Em caso de erro
      console.error('Erro ao aplicar juros:', error);
      return res.status(500).json({
        message: 'Erro ao aplicar juros',
        error: error.message || error,
      });
    }
  }
}

export { JurosController };
