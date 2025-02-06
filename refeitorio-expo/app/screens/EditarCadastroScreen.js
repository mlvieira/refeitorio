import React from 'react';
import { View, Alert } from 'react-native';
import { updateFuncionario } from '../services/ApiServices';
import { saveData } from '../storage/AsyncStorageService';
import UserForm from '../components/UserForm';
import { useAuth } from '../context/AuthContext';

export default function EditarCadastro({ route, navigation }) {
  const { user, canEditRole } = route.params;
  const { setUser } = useAuth();

  const editarFuncionario = async (formData) => {
    try {
      const response = await updateFuncionario(user.id, formData);
      Alert.alert('Sucesso', response.message);

      const updatedUser = { ...user, ...formData };
      await saveData('user', updatedUser);
      setUser(updatedUser);

      setTimeout(() => {
        navigation.goBack();
      }, 1500);
    } catch (error) {
      Alert.alert(
        'Erro',
        error.response?.data?.error || 'Erro ao atualizar o perfil.',
      );
    }
  };

  return (
    <View className="p-4 bg-gray-50 flex-1">
      <UserForm
        initialData={user}
        onSubmit={editarFuncionario}
        isEditing={true}
        showRole={canEditRole}
      />
    </View>
  );
}
