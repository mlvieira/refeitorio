export default class PresencaModel {
  constructor(id, nome, alergias, confirmado) {
    this.id = id;
    this.nome = nome;
    this.alergias = alergias || 'Nenhuma';
    this.confirmado = confirmado;
  }

  static fromJson(data) {
    return new PresencaModel(
      data.id,
      data.nome,
      data.alergias,
      data.confirmado,
    );
  }
}
