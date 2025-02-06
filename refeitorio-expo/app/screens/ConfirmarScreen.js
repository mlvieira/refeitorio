import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import Constants from 'expo-constants';
import { confirmarAlmoco, getPresenca } from '../services/ApiServices';
import { useAuth } from '../context/AuthContext';

const DEADLINE_HOURS = Constants.expoConfig.extra.DEADLINE_HOURS;
const DEADLINE_MINUTES = Constants.expoConfig.extra.DEADLINE_MINUTES;

export default function ConfirmarScreen() {
  const [presenca, setPresenca] = useState(null);
  const [isTimeRestricted, setIsTimeRestricted] = useState(false);
  const { user } = useAuth();

  const checkTimeRestriction = useCallback(() => {
    const now = new Date();
    const isPastDeadline =
      now.getHours() > DEADLINE_HOURS ||
      (now.getHours() === DEADLINE_HOURS &&
        now.getMinutes() >= DEADLINE_MINUTES);
    setIsTimeRestricted(isPastDeadline);
  }, []);

  const getConfirmacao = useCallback(async () => {
    try {
      const response = await getPresenca(user.id);
      if (response && Object.keys(response).length > 0) {
        setPresenca(true);
      }
    } catch (_error) {
      setPresenca(null);
    }
  }, [user.id]);

  useEffect(() => {
    checkTimeRestriction();
    getConfirmacao();
  }, [getConfirmacao, checkTimeRestriction]);

  const handleConfirmacao = async (status) => {
    if (isTimeRestricted) {
      Alert.alert(
        'Aviso',
        'O horário limite para confirmar o almoço já passou (09:30).',
      );
      return;
    }

    try {
      await confirmarAlmoco(user.id, status);
      setPresenca(status);
      Alert.alert(
        'Sucesso',
        status ? 'Presença confirmada!' : 'Ausência confirmada!',
      );
    } catch (error) {
      console.error('Erro ao confirmar presença:', error);
      Alert.alert('Erro', 'Não foi possível confirmar sua presença.');
    }
  };

  return (
    <View className="p-4 bg-white flex-1 justify-center">
      <TouchableOpacity
        className={`py-3 rounded-lg mb-4 shadow-md items-center ${
          presenca ? 'bg-gray-400' : 'bg-green-500'
        }`}
        onPress={() => handleConfirmacao(true)}
        disabled={presenca === true}
      >
        <Text
          className={`text-white text-lg font-semibold ${presenca ? 'opacity-50' : ''}`}
        >
          Confirmação de almoço
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className={`py-3 rounded-lg mb-4 shadow-md items-center ${
          !presenca ? 'bg-gray-400' : 'bg-red-500'
        }`}
        onPress={() => handleConfirmacao(false)}
        disabled={presenca === false}
      >
        <Text
          className={`text-white text-lg font-semibold ${!presenca ? 'opacity-50' : ''}`}
        >
          Cancelamento de almoço
        </Text>
      </TouchableOpacity>

      {presenca !== null && (
        <View className="mt-6 p-4 bg-gray-100 rounded-lg shadow-sm items-center">
          <Text className="text-lg font-bold text-gray-800 mb-2">
            Status da Confirmação:
          </Text>
          <Text
            className={`text-xl font-semibold ${presenca ? 'text-green-600' : 'text-red-600'}`}
          >
            {presenca ? '✅ Irá Almoçar' : '❌ Não Irá Almoçar'}
          </Text>
        </View>
      )}
    </View>
  );
}
