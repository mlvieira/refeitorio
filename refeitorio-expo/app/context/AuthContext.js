import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from 'react';
import { Alert } from 'react-native';
import axios from 'axios';
import { login as loginUsuario, setAuthToken } from '../services/ApiServices';
import { getData, saveData, removeData } from '../storage/AsyncStorageService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const storedUser = await getData('user');
        const storedToken = await getData('token');

        if (storedUser && storedToken) {
          setUser(storedUser);
          setAuthToken(storedToken);
        }
      } catch (error) {
        console.error('Erro ao restaurar sessão:', error);
      }
    };
    restoreSession();

    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (
          error.response &&
          (error.response.status === 401 || error.response.status === 403)
        ) {
          const errorMessage =
            error.response.data?.error || error.response.statusText;

          if (errorMessage !== 'Acesso negado.') {
            logout();
          }
        }
        return Promise.reject(error);
      },
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  const login = async (username, password) => {
    try {
      const response = await loginUsuario(username, password);

      if (response.token && response.user) {
        await saveData('token', response.token);
        await saveData('user', response.user);

        setAuthToken(response.token);
        setUser(response.user);
      } else {
        throw new Error('Credenciais inválidas.');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await removeData('user');
      await removeData('token');
      setUser(null);
      delete axios.defaults.headers.common['Authorization'];
      Alert.alert(
        'Sessão Expirada',
        'Sua sessão expirou. Faça login novamente.',
      );
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const authContextValue = useMemo(
    () => ({ user, login, logout, setUser }),
    [user],
  );

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
