import ApiService from './ApiServices';

const AuthService = {
  login: async (username, password) => {
    try {
      const response = await ApiService.post('/login', { username, password });
      return response.data;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    }
  },
};

export default AuthService;
