import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import Constants from 'expo-constants';
import PresencaController from '../controllers/PresencaController';
import { useAuth } from '../context/AuthContext';

const DEADLINE_HOURS = Constants.expoConfig.extra.DEADLINE_HOURS;
const DEADLINE_MINUTES = Constants.expoConfig.extra.DEADLINE_MINUTES;

export default function ConfirmarScreen() {
  const [presenca, setPresenca] = useState(null);
  const [isTimeRestricted, setIsTimeRestricted] = useState(false);
  const { user } = useAuth();

  const checkTimeRestriction = useCallback(() => {
    const now = new Date();
    setIsTimeRestricted(
      now.getHours() > DEADLINE_HOURS ||
        (now.getHours() === DEADLINE_HOURS &&
          now.getMinutes() >= DEADLINE_MINUTES),
    );
  }, []);

  useEffect(() => {
    checkTimeRestriction();
    PresencaController.getConfirmacao(user.id).then(setPresenca);
  }, [checkTimeRestriction, user.id]);

  const handleConfirmacao = async (status) => {
    if (isTimeRestricted) {
      Alert.alert(
        'Aviso',
        `O horário limite para confirmar o almoço já passou (${DEADLINE_HOURS}:${DEADLINE_MINUTES}).`,
      );
      return;
    }

    try {
      await PresencaController.handleConfirmacao(user.id, status, setPresenca);
      Alert.alert(
        'Sucesso',
        status ? 'Presença confirmada!' : 'Ausência confirmada!',
      );
    } catch (_) {
      Alert.alert('Erro', 'Não foi possível confirmar sua presença.');
    }
  };

  return (
    <View className="p-4 bg-white flex-1 justify-center">
      <TouchableOpacity
        className={`py-3 rounded-lg mb-4 shadow-md items-center ${presenca ? 'bg-gray-400' : 'bg-green-500'}`}
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
        className={`py-3 rounded-lg mb-4 shadow-md items-center ${presenca === false ? 'bg-gray-400' : 'bg-red-500'}`}
        onPress={() => handleConfirmacao(false)}
        disabled={presenca === false}
      >
        <Text
          className={`text-white text-lg font-semibold ${presenca === false ? 'opacity-50' : ''}`}
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
