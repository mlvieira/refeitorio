import React, { useState, useReducer } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const formReducer = (state, action) => ({
  ...state,
  [action.name]: action.value,
});

export default function UserForm({
  initialData = {},
  onSubmit,
  isEditing = false,
  showRole = true,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, dispatch] = useReducer(formReducer, {
    nome: initialData.nome || '',
    username: initialData.username || '',
    password: '',
    alergias: initialData.alergias || '',
    role: initialData.role || 1,
  });

  const handleSubmit = async () => {
    if (!formData.nome || (!isEditing && !formData.password)) {
      Alert.alert('Erro', 'Nome, Usuário e Senha são obrigatórios.');
      return;
    }

    onSubmit(formData);
  };

  return (
    <View className="space-y-4 p-4">
      <View>
        <Text className="text-lg font-semibold text-gray-700">Nome:</Text>
        <TextInput
          className="border border-gray-300 p-3 rounded-md mt-1 bg-white"
          value={formData.nome}
          onChangeText={(value) => dispatch({ name: 'nome', value })}
          placeholder="Digite o nome"
        />
      </View>

      <View>
        <Text className="text-lg font-semibold text-gray-700">Usuário:</Text>
        <TextInput
          className={`border border-gray-300 p-3 rounded-md mt-1 ${showRole ? 'bg-white' : 'bg-gray-200'}`}
          value={formData.username}
          onChangeText={(value) => dispatch({ name: 'username', value })}
          editable={showRole}
          placeholder="Digite o usuário"
        />
      </View>

      <View>
        <Text className="text-lg font-semibold text-gray-700">Senha:</Text>
        <View className="relative">
          <TextInput
            className="border border-gray-300 p-3 rounded-md mt-1 bg-white pr-16"
            value={formData.password}
            onChangeText={(value) => dispatch({ name: 'password', value })}
            placeholder={
              isEditing
                ? 'Deixe em branco para manter a atual'
                : 'Digite a senha'
            }
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-4"
          >
            <Text className="text-blue-500 font-semibold">
              {showPassword ? 'Ocultar' : 'Mostrar'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View>
        <Text className="text-lg font-semibold text-gray-700">Alergias:</Text>
        <TextInput
          className="border border-gray-300 p-3 rounded-md mt-1 bg-white"
          value={formData.alergias}
          onChangeText={(value) => dispatch({ name: 'alergias', value })}
          placeholder="Ex: Glúten, Lactose"
        />
      </View>

      {showRole && (
        <View>
          <Text className="text-lg font-semibold text-gray-700">Função:</Text>
          <View className="border border-gray-300 rounded-md mt-1 bg-white">
            <Picker
              selectedValue={formData.role}
              onValueChange={(value) => dispatch({ name: 'role', value })}
            >
              <Picker.Item label="Funcionário" value={1} />
              <Picker.Item label="Cozinheiro" value={2} />
              <Picker.Item label="RH" value={3} />
            </Picker>
          </View>
        </View>
      )}

      <TouchableOpacity
        className="bg-blue-500 py-3 rounded-lg shadow-md mt-3 items-center"
        onPress={handleSubmit}
      >
        <Text className="text-white text-lg font-semibold">
          {isEditing ? 'Salvar Alterações' : 'Adicionar Funcionário'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
