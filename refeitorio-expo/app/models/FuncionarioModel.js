export default class FuncionarioModel {
  constructor(id, nome, username, alergias, role) {
    this.id = id;
    this.nome = nome;
    this.username = username;
    this.alergias = alergias;
    this.role = role;
  }

  static fromJson(data) {
    return new FuncionarioModel(
      data.id,
      data.nome,
      data.username,
      data.alergias,
      data.role,
    );
  }
}
