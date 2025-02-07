import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import XXH from 'xxhashjs';
import { getFuncionarios, addFuncionario } from '../services/ApiServices';
import { saveData, getData } from '../storage/AsyncStorageService';
import UserForm from '../components/UserForm';

const roleNames = {
  1: 'Funcionário',
  2: 'Cozinheiro',
  3: 'RH',
};

export default function CadastroScreen() {
  const [funcionarios, setFuncionarios] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [formHidden, setFormHidden] = useState(false);
  const [formHeight, setFormHeight] = useState(0);
  const navigation = useNavigation();

  const formTranslateY = useRef(new Animated.Value(0)).current;
  const listTranslateY = formHeight
    ? formTranslateY.interpolate({
        inputRange: [-formHeight, 0],
        outputRange: [0, formHeight],
        extrapolate: 'clamp',
      })
    : 0;

  const hashData = (data) => XXH.h32(JSON.stringify(data), 0xabcd).toString(16);

  const fetchFuncionarios = useCallback(
    async (reset = false) => {
      if (loading || !hasMore) return;

      setLoading(true);
      try {
        const data = await getFuncionarios(page, 10);
        if (data.length === 0) {
          setHasMore(false);
          return;
        }

        const currentHash = hashData(funcionarios);
        const newHash = hashData(data);

        if (reset) {
          setFuncionarios(data);
        } else if (currentHash !== newHash) {
          setFuncionarios((prev) => [...prev, ...data]);
        }
        await saveData('funcionarios', data);
        setPage((prevPage) => prevPage + 1);
      } catch (_error) {
        const cachedData = await getData('funcionarios');
        if (cachedData) setFuncionarios(cachedData);
      } finally {
        setLoading(false);
      }
    },
    [page, loading, hasMore, funcionarios],
  );

  const adicionarFuncionario = async (formData) => {
    try {
      const response = await addFuncionario(formData);
      Alert.alert('Sucesso', response.message);

      delete formData.password;

      setFuncionarios((prev) => [formData, ...prev]);
      await saveData('funcionarios', [formData, ...funcionarios]);
    } catch (error) {
      Alert.alert(
        'Erro',
        error.response?.data?.error || 'Não foi possível criar o usuário.',
      );
    }
  };

  const getRoleName = useMemo(
    () => (role) => roleNames[role] || 'Desconhecido',
    [],
  );

  useEffect(() => {
    fetchFuncionarios();
  }, [fetchFuncionarios]);

  const onFormLayout = (event) => {
    const { height } = event.nativeEvent.layout;
    if (height && height !== formHeight) {
      setFormHeight(height);
    }
  };

  const handleScroll = (event) => {
    if (!formHeight) return;

    const scrollOffset = event.nativeEvent.contentOffset.y;

    if (scrollOffset > 10 && !formHidden) {
      setFormHidden(true);
      Animated.timing(formTranslateY, {
        toValue: -formHeight,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else if (scrollOffset <= 10 && formHidden) {
      setFormHidden(false);
      Animated.timing(formTranslateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <View className="p-4 bg-gray-50 flex-1">
      <Animated.View
        onLayout={onFormLayout}
        className="absolute top-0 left-0 right-0 z-10"
        style={{
          transform: [{ translateY: formTranslateY }],
        }}
        pointerEvents={formHidden ? 'none' : 'auto'}
      >
        <UserForm onSubmit={adicionarFuncionario} showRole={true} />
      </Animated.View>

      <Animated.View
        style={{ transform: [{ translateY: listTranslateY }] }}
        className="px-4 pt-4 flex-1"
      >
        <Text className="text-xl font-bold text-gray-800 mb-2">
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
          onScroll={handleScroll}
          scrollEventThrottle={16}
          ListEmptyComponent={
            <Text className="text-center text-gray-500 mt-4">
              Nenhum funcionário cadastrado.
            </Text>
          }
        />
      </Animated.View>
    </View>
  );
}
