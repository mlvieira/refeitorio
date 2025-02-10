import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from 'react';
import { Alert } from 'react-native';
import axios from 'axios';
import AuthController from '../controllers/AuthController';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    AuthController.restoreSession(setUser);

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
      return await AuthController.login(username, password, setUser);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    const success = await AuthController.logout(setUser);
    if (success) {
      Alert.alert(
        'Sessão Expirada',
        'Sua sessão expirou. Faça login novamente.',
      );
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
