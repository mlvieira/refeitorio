import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import HomeController from '../controllers/HomeController';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen({ navigation }) {
  const { user, logout } = useAuth();

  useEffect(() => {
    HomeController.requestNotificationPermissions();
    HomeController.scheduleNotification(user);
  }, [user]);

  return (
    <View className="flex-1 justify-center items-center bg-gray-50 p-4">
      <Text className="text-3xl font-bold text-center mb-6">
        Olá, {user?.nome}
      </Text>
      <Text className="text-3xl font-bold mb-6">️Bem-vindo ao Refeitório!</Text>

      <View className="w-full space-y-4">
        <TouchableOpacity
          className="bg-blue-500 py-3 px-6 mb-5 rounded-xl shadow-md items-center"
          onPress={() =>
            HomeController.handleSecureNavigation(
              navigation,
              'editarCadastro',
              user,
              1,
              {
                user,
                canEditRole: user.role === 3,
              },
            )
          }
        >
          <Text className="text-white text-lg font-semibold">
            Editar Minhas Informações
          </Text>
        </TouchableOpacity>

        {user?.role >= 3 && (
          <TouchableOpacity
            className="bg-orange-500 py-3 px-6 mb-5 rounded-xl shadow-md items-center"
            onPress={() =>
              HomeController.handleSecureNavigation(
                navigation,
                'cadastro',
                user,
                3,
              )
            }
          >
            <Text className="text-white text-lg font-semibold">
              Cadastro de Funcionários
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          className="bg-green-500 py-3 px-6 mb-5 rounded-xl shadow-md items-center"
          onPress={() =>
            HomeController.handleSecureNavigation(
              navigation,
              'confirmar',
              user,
              1,
            )
          }
        >
          <Text className="text-white text-lg font-semibold">
            Confirmar Refeição
          </Text>
        </TouchableOpacity>

        {user?.role >= 2 && (
          <TouchableOpacity
            className="bg-yellow-500 py-3 px-6 mb-5 rounded-xl shadow-md items-center"
            onPress={() =>
              HomeController.handleSecureNavigation(
                navigation,
                'cozinha',
                user,
                2,
              )
            }
          >
            <Text className="text-white text-lg font-semibold">
              Controle da Cozinha
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          className="bg-red-500 py-3 px-6 rounded-xl shadow-md items-center"
          onPress={logout}
        >
          <Text className="text-white text-lg font-semibold">Sair</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
