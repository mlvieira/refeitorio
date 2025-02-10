import AuthService from '../services/FuncionarioService';
import AsyncStorageService from '../services/AsyncStorageService';
import FuncionarioModel from '../models/FuncionarioModel';
import { setAuthToken } from '../services/ApiServices';
import axios from 'axios';

class AuthController {
  async login(username, password, setUser) {
    try {
      const response = await AuthService.login(username, password);

      if (response.token && response.user) {
        const funcionario = FuncionarioModel.fromJson(response.user);

        await AsyncStorageService.saveData('token', response.token);
        await AsyncStorageService.saveData('user', funcionario);

        setAuthToken(response.token);
        setUser(funcionario);

        return funcionario;
      } else {
        throw new Error('Credenciais inválidas.');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      throw new Error(error.response?.data?.error || 'Falha na autenticação.');
    }
  }

  async restoreSession(setUser) {
    try {
      const storedUser = await AsyncStorageService.getData('user');
      const storedToken = await AsyncStorageService.getData('token');

      if (storedUser && storedToken) {
        const funcionario = FuncionarioModel.fromJson(storedUser);
        setAuthToken(storedToken);
        setUser(funcionario);
      }
    } catch (error) {
      console.error('Erro ao restaurar sessão:', error);
    }
  }

  async logout(setUser) {
    try {
      await AsyncStorageService.removeData('user');
      await AsyncStorageService.removeData('token');
      setUser(null);
      delete axios.defaults.headers.common['Authorization'];
      return true;
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      return false;
    }
  }
}

export default new AuthController();
