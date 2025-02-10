import React from 'react';
import { View, Alert } from 'react-native';
import FuncionarioController from '../controllers/FuncionarioController';
import UserForm from '../components/UserForm';
import { useAuth } from '../context/AuthContext';

export default function EditarCadastro({ route, navigation }) {
  const { user, canEditRole } = route.params;
  const { setUser, user: currentUser } = useAuth();

  const editarFuncionario = async (formData) => {
    try {
      await FuncionarioController.editarFuncionario(
        user.id,
        formData,
        currentUser,
        setUser,
      );
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');

      setTimeout(() => {
        navigation.goBack();
      }, 1500);
    } catch (error) {
      Alert.alert('Erro', error.message);
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
