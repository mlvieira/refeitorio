import ApiService from './ApiServices';

const PresencaService = {
  confirmarAlmoco: async (id, status) => {
    try {
      const response = await ApiService.post(`/presenca/confirmar/${id}`, {
        presenca: status,
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao confirmar presença:', error);
      throw error;
    }
  },

  listarAlmoco: async () => {
    try {
      const response = await ApiService.get('/presenca/listar-almoco');
      return response.data;
    } catch (error) {
      console.error('Erro ao listar o almoço:', error);
      return [];
    }
  },

  getPresenca: async (id) => {
    try {
      const response = await ApiService.get(`/presenca/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao puxar confirmação atual', error);
      throw error;
    }
  },
};

export default PresencaService;
