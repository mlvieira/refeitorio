import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import CadastroScreen from '../screens/CadastroScreen';
import EditarCadastro from '../screens/EditarCadastroScreen';
import ConfirmarScreen from '../screens/ConfirmarScreen';
import CozinhaScreen from '../screens/CozinhaScreen';
import LoginScreen from '../screens/LoginScreen';
import { useAuth } from '../context/AuthContext';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={user ? 'Home' : 'Login'}>
        {user ? (
          <>
            <Stack.Screen
              name="homepage"
              component={HomeScreen}
              options={{ title: 'Página Inicial' }}
            />
            <Stack.Screen
              name="cadastro"
              component={CadastroScreen}
              options={{ title: 'Cadastro de Funcionários' }}
            />
            <Stack.Screen
              name="editarCadastro"
              component={EditarCadastro}
              options={{ title: 'Editar Cadastro' }}
            />
            <Stack.Screen
              name="confirmar"
              component={ConfirmarScreen}
              options={{ title: 'Confirmar Refeição' }}
            />
            <Stack.Screen
              name="cozinha"
              component={CozinhaScreen}
              options={{ title: 'Controle da Cozinha' }}
            />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
