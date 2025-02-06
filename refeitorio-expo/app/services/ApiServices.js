import axios from 'axios';
import Constants from 'expo-constants';

export const API_URL = Constants.expoConfig.extra.API_URL;

export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

export const login = async (username, password) => {
  const response = await axios.post(`${API_URL}/login`, { username, password });
  return response.data;
};

export const getFuncionarios = async () => {
  try {
    const response = await axios.get(`${API_URL}/funcionarios`);
    return response.data;
  } catch (error) {
    console.error('Erro ao listar funcionários: ', error);
    return [];
  }
};

export const addFuncionario = async (funcionario) => {
  try {
    const response = await axios.post(`${API_URL}/funcionarios`, funcionario);
    return response.data;
  } catch (error) {
    console.error('Erro ao adicionar funcionário:', error);
    throw error;
  }
};

export const updateFuncionario = async (id, funcionario) => {
  try {
    const response = await axios.put(
      `${API_URL}/funcionarios/${id}`,
      funcionario,
    );
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar funcionário:', error);
    throw error;
  }
};

export const confirmarAlmoco = async (id, status) => {
  try {
    const response = await axios.post(`${API_URL}/presenca/confirmar/${id}`, {
      presenca: status,
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao confirmar presença:', error);
    throw error;
  }
};

export const listarAlmoco = async () => {
  try {
    const response = await axios.get(`${API_URL}/presenca/listar-almoco`);
    return response.data;
  } catch (error) {
    console.error('Erro ao listar o almoço: ', error);
    return [];
  }
};

export const getPresenca = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/presenca/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao puxar confirmação atual ', error);
    throw error;
  }
};

export default {
  API_URL,
  setAuthToken,
  login,
  getFuncionarios,
  addFuncionario,
  confirmarAlmoco,
  listarAlmoco,
  getPresenca,
};
