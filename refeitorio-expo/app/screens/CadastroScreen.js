import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import XXH from 'xxhashjs';
import { getFuncionarios, addFuncionario } from '../services/ApiServices';
import { saveData, getData } from '../storage/AsyncStorageService';
import UserForm from '../components/UserForm';

export default function CadastroScreen() {
  const [funcionarios, setFuncionarios] = useState([]);
  const navigation = useNavigation();
  let debounceTimer;

  const hashData = (data) => XXH.h32(JSON.stringify(data), 0xabcd).toString(16);

  const fetchFuncionarios = useCallback(async () => {
    try {
      const data = await getFuncionarios();

      const currentHash = hashData(funcionarios);
      const newHash = hashData(data);

      if (currentHash !== newHash) {
        setFuncionarios(data);
        await saveData('funcionarios', data);
      }
    } catch (_error) {
      const cachedData = await getData('funcionarios');
      if (cachedData) setFuncionarios(cachedData);
    }
  }, [funcionarios]);

  const adicionarFuncionario = async (formData) => {
    try {
      const response = await addFuncionario(formData);
      Alert.alert('Sucesso', response.message);

      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        fetchFuncionarios();
      }, 300);
    } catch (error) {
      Alert.alert(
        'Erro',
        error.response?.data?.error || 'Não foi possível criar o usuário.',
      );
    }
  };

  const getRoleName = (role) => {
    switch (role) {
      case 1:
        return 'Funcionário';
      case 2:
        return 'Cozinheiro';
      default:
        return 'RH';
    }
  };

  useEffect(() => {
    fetchFuncionarios();
  }, [fetchFuncionarios]);

  return (
    <View className="p-4 bg-gray-50 flex-1">
      <UserForm onSubmit={adicionarFuncionario} showRole={true} />
      <Text className="text-xl font-bold text-gray-800 mt-6 mb-2">
        Lista de Funcionários:
      </Text>

      <FlatList
        data={funcionarios}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="p-4 bg-white rounded-lg shadow-sm mb-2 border border-gray-200 flex-row justify-between items-center"
            activeOpacity={0.7}
            onPress={() =>
              navigation.navigate('editarCadastro', {
                user: item,
                canEditRole: true,
              })
            }
          >
            <View className="flex-1 pr-4">
              <Text className="text-lg font-semibold text-gray-900">
                {item.nome}
              </Text>
              <Text className="text-gray-600 italic">@{item.username}</Text>
              <Text className="text-gray-700 mt-1">
                Alergias:{' '}
                <Text className="font-medium">
                  {item.alergias || 'Nenhuma'}
                </Text>
              </Text>
              <Text className="text-gray-700 mt-1">
                Função:{' '}
                <Text className="font-medium">{getRoleName(item.role)}</Text>
              </Text>
            </View>
            <Text className="text-2xl text-blue-400">➔</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text className="text-center text-gray-500 mt-4">
            Nenhum funcionário cadastrado.
          </Text>
        }
      />
    </View>
  );
}
