import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      await login(username, password);
    } catch (error) {
      Alert.alert(
        'Erro no Login',
        error.response?.data?.error || 'Credenciais inválidas.',
      );
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <View className="items-center mb-6">
        <Image
          source={require('../../assets/images/splash-icon.png')}
          className="w-72 h-16 mb-4"
          resizeMode="contain"
        />
        <Text className="text-2xl font-bold text-gray-800 mt-2">
          Refeitório
        </Text>
      </View>
      <View className="w-4/5 p-4 bg-gray-100 rounded-lg shadow-md">
        <Text className="text-lg font-semibold mb-2">Usuário:</Text>
        <TextInput
          className="border border-gray-400 p-2 rounded-md mt-1 mb-4 bg-white pr-16"
          value={username}
          onChangeText={setUsername}
          placeholder="Digite seu usuário"
        />

        <View>
          <Text className="text-lg font-semibold mb-2">Senha:</Text>
          <View className="relative">
            <TextInput
              className="border border-gray-400 p-2 rounded-md mt-1 mb-4 bg-white pr-16"
              value={password}
              onChangeText={setPassword}
              placeholder="Digite sua senha"
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3"
            >
              <Text className="text-blue-500 font-semibold">
                {showPassword ? 'Ocultar' : 'Mostrar'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          className="bg-blue-500 py-2 px-6 rounded-md items-center"
          onPress={handleLogin}
        >
          <Text className="text-white text-sm font-semibold">Entrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
