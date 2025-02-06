import React, { useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import { DateTime } from 'luxon';
import Constants from 'expo-constants';
import { useAuth } from '../context/AuthContext';

const DEADLINE_HOURS = Constants.expoConfig.extra.DEADLINE_HOURS;
const DEADLINE_MINUTES = Constants.expoConfig.extra.DEADLINE_MINUTES;

export default function HomeScreen({ navigation }) {
  const { user, logout } = useAuth();

  const requestNotificationPermissions = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      await Notifications.requestPermissionsAsync();
    }
  };

  const scheduleNotification = useCallback(async () => {
    if (user) return;

    const now = DateTime.now().setZone('America/Sao_Paulo');
    const scheduledTime = now.set({
      hour: DEADLINE_HOURS,
      minute: DEADLINE_MINUTES - 30,
      second: 0,
      millisecond: 0,
    });

    if (now < scheduledTime) {
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: false,
          shouldSetBadge: false,
        }),
      });
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Lembrete de Confirmação',
          body: `Não se esqueça de confirmar seu almoço antes das ${DEADLINE_HOURS}:${DEADLINE_MINUTES}!`,
          sound: 'default',
        },
        trigger: { seconds: scheduledTime.toSeconds() - now.toSeconds() },
      });
    }
  }, [user]);

  const handleSecureNavigation = (
    navigation,
    screen,
    user,
    requiredRole,
    params = {},
  ) => {
    if (user?.role < requiredRole) {
      Alert.alert(
        'Acesso Negado',
        'Você não tem permissão para acessar esta seção.',
      );
      return;
    }
    navigation.navigate(screen, params);
  };

  useEffect(() => {
    requestNotificationPermissions();
    scheduleNotification();
  }, [scheduleNotification]);

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
            handleSecureNavigation(navigation, 'editarCadastro', user, 1, {
              user,
              canEditRole: user.role === 3,
            })
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
              handleSecureNavigation(navigation, 'cadastro', user, 3)
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
            handleSecureNavigation(navigation, 'confirmar', user, 1)
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
              handleSecureNavigation(navigation, 'cozinha', user, 2)
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
