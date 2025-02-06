import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function UserForm({
  initialData = {},
  onSubmit,
  isEditing = false,
  showRole = true,
}) {
  const [nome, setNome] = useState(initialData.nome || '');
  const [username, setUsername] = useState(initialData.username || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [alergias, setAlergias] = useState(initialData.alergias || '');
  const [role, setRole] = useState(initialData.role || 1);

  const handleSubmit = async () => {
    if (!nome || (!isEditing && !password)) {
      Alert.alert('Erro', 'Nome, Usuário e Senha são obrigatórios.');
      return;
    }

    const formData = { nome, username, alergias, role };
    if (password) formData.password = password;

    onSubmit(formData);
  };

  return (
    <View className="space-y-4">
      <View>
        <Text className="text-lg font-semibold text-gray-700">Nome:</Text>
        <TextInput
          className="border border-gray-300 p-3 rounded-md mt-1 bg-white"
          value={nome}
          onChangeText={setNome}
          placeholder="Digite o nome"
        />
      </View>

      <View>
        <Text className="text-lg font-semibold text-gray-700">Usuário:</Text>
        <TextInput
          className={`border border-gray-300 p-3 rounded-md mt-1 ${showRole ? 'bg-white' : 'bg-gray-200'}`}
          value={username}
          onChangeText={setUsername}
          editable={showRole}
          placeholder="Digite o usuário"
        />
      </View>

      <View>
        <Text className="text-lg font-semibold text-gray-700">Senha:</Text>
        <View className="relative">
          <TextInput
            className="border border-gray-300 p-3 rounded-md mt-1 bg-white pr-16"
            value={password}
            onChangeText={setPassword}
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
          value={alergias}
          onChangeText={setAlergias}
          placeholder="Ex: Glúten, Lactose"
        />
      </View>

      {showRole && (
        <View>
          <Text className="text-lg font-semibold text-gray-700">Função:</Text>
          <View className="border border-gray-300 rounded-md mt-1 bg-white">
            <Picker
              selectedValue={role}
              onValueChange={(itemValue) => setRole(itemValue)}
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
