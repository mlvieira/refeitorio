import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import PresencaController from '../controllers/PresencaController';

export default function CozinhaScreen() {
  const [presencas, setPresencas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    PresencaController.listarPresencas(setPresencas)
      .catch(() => setError('Erro ao carregar a lista de presenças.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text className="mt-2 text-gray-500">Carregando presenças...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500">{error}</Text>
      </View>
    );
  }

  return (
    <View className="p-4 bg-white flex-1">
      <FlatList
        data={presencas}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View className="p-2 border-b border-gray-200">
            <Text className="text-lg font-semibold">{item.nome}</Text>
            {item.alergias && (
              <Text className="text-red-500">Alergias: {item.alergias}</Text>
            )}
          </View>
        )}
        ListEmptyComponent={
          <Text className="text-center text-gray-500">
            Nenhum funcionário confirmado para hoje.
          </Text>
        }
      />
    </View>
  );
}
