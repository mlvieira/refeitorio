import FuncionarioService from '../services/FuncionarioService';
import AsyncStorageService from '../services/AsyncStorageService';
import FuncionarioModel from '../models/FuncionarioModel';
import HashData from '../utils/Hash';

class FuncionarioController {
  async fetchFuncionarios(
    page,
    setFuncionarios,
    setPage,
    setHasMore,
    setLoading,
  ) {
    if (setLoading) setLoading(true);

    try {
      const data = await FuncionarioService.getFuncionarios(page, 10);
      if (!data || data.length === 0) {
        setHasMore(false);
        return;
      }

      const newFuncionarios = data.map(FuncionarioModel.fromJson);
      const prevFuncionarios =
        (await AsyncStorageService.getData('funcionarios')) || [];
      const prevHash = HashData(prevFuncionarios);
      const newHash = HashData(newFuncionarios);

      if (prevHash !== newHash) {
        setFuncionarios((prev) => {
          const updatedList = [...prev, ...newFuncionarios];
          AsyncStorageService.saveData('funcionarios', updatedList);
          return updatedList;
        });

        setPage((prevPage) => prevPage + 1);
      }
    } catch (_) {
      const cachedData = await AsyncStorageService.getData('funcionarios');
      if (cachedData) setFuncionarios(cachedData);
    } finally {
      if (setLoading) setLoading(false);
    }
  }

  async adicionarFuncionario(formData, setFuncionarios) {
    try {
      const response = await FuncionarioService.addFuncionario(formData);
      delete formData.password;
      const newFuncionario = FuncionarioModel.fromJson(formData);

      setFuncionarios((prevFuncionarios) => [
        newFuncionario,
        ...prevFuncionarios,
      ]);
      await AsyncStorageService.saveData('funcionarios', (prevData) => [
        newFuncionario,
        ...prevData,
      ]);

      return response.message;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || 'Não foi possível criar o usuário.',
      );
    }
  }

  async editarFuncionario(id, formData, currentUser, setUser) {
    try {
      const response = await FuncionarioService.updateFuncionario(id, formData);

      if (currentUser.id === id) {
        delete formData.password;
        const updatedUser = new FuncionarioModel(
          id,
          formData.nome,
          formData.username,
          formData.role,
          formData.alergias,
        );
        await AsyncStorageService.saveData('user', updatedUser);
        setUser(updatedUser);
      }

      return response.message;
    } catch (error) {
      console.error('Erro ao atualizar funcionário:', error);
      throw new Error(
        error.response?.data?.error || 'Erro ao atualizar o perfil.',
      );
    }
  }
}

export default new FuncionarioController();
