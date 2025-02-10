import ApiService from './ApiServices';

const FuncionarioService = {
  login: async (username, password) => {
    try {
      const response = await ApiService.post('/login', { username, password });
      return response.data;
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  },

  getFuncionarios: async (page, limit) => {
    try {
      const response = await ApiService.get(`/funcionarios/${page}/${limit}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao listar funcionários:', error);
      return [];
    }
  },

  addFuncionario: async (funcionario) => {
    try {
      const response = await ApiService.post('/funcionarios', funcionario);
      return response.data;
    } catch (error) {
      console.error('Erro ao adicionar funcionário:', error);
      throw error;
    }
  },

  updateFuncionario: async (id, funcionario) => {
    try {
      const response = await ApiService.put(`/funcionarios/${id}`, funcionario);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar funcionário:', error);
      throw error;
    }
  },
};

export default FuncionarioService;
