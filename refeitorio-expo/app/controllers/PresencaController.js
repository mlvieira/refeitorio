import PresencaService from '../services/PresencaService';
import PresencaModel from '../models/PresencaModel';

class PresencaController {
  async getConfirmacao(userId) {
    try {
      const response = await PresencaService.getPresenca(userId);
      if (response && response.id) {
        return PresencaModel.fromJson(response);
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar presença:', error);
      return null;
    }
  }

  async handleConfirmacao(userId, status, setPresenca) {
    try {
      await PresencaService.confirmarAlmoco(userId, status);
      setPresenca(status);
    } catch (error) {
      console.error('Erro ao confirmar presença:', error);
      throw new Error('Falha ao confirmar presença.');
    }
  }

  async listarPresencas(setPresencas) {
    try {
      const data = await PresencaService.listarAlmoco();
      const presencas = data.map(PresencaModel.fromJson);
      setPresencas(presencas);
    } catch (error) {
      console.error('Erro ao listar presenças:', error);
      setPresencas([]);
    }
  }
}

export default new PresencaController();
