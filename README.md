## Trabalho de Extensão para Disciplina "Programação Para Dispositivos Móveis em Android"

### O que você vai encontrar aqui:
1. `refeitorio-expo` - Contém o aplicativo desenvolvido em React Native.
2. `refeitorio-api` - Contém a API RESTful para comunicação entre o aplicativo e o banco de dados.
3. `refeitorio-python-stats` - Contém python scripts para gerar estatísticas.
4. `stats` - Contém gráficos gerados usando python scripts.
5. `screenshots` - Contém screenshots individuais de cada tela.

---
### Preview:

![collage.png](https://github.com/mlvieira/refeitorio/blob/master/collage.png?raw=true)

---

## Tecnologias Utilizadas no Aplicativo (`refeitorio-expo`):

1. **React Native:**
   Utilizado para o desenvolvimento da interface do aplicativo, permitindo a criação de componentes nativos para Android.

2. **Expo:**
   Plataforma para desenvolvimento, construção e publicação de apps React Native.

3. **React Navigation:**
   Biblioteca para gerenciar a navegação entre telas.

4. **AsyncStorage:**
   Utilizado para armazenamento local de dados de forma assíncrona.

5. **Axios:**
   Biblioteca para fazer requisições HTTP.

6. **Tailwind CSS + NativeWind:**
   Framework de utilitários para estilização rápida e responsiva da interface do aplicativo. O NativeWind integra o Tailwind CSS ao React Native.

---

## Tecnologias Utilizadas no Backend (`refeitorio-api`):

1. **Node.js + Express:**
   Plataforma para desenvolvimento do servidor backend, utilizando o framework **Express** para criar rotas e gerenciar as requisições HTTP.

2. **SQLite:**
   Utilizado para armazenar informações persistentes do aplicativo.

3. **JWT (JSON Web Tokens):**
   Implementado para autenticação segura dos usuários, protegendo as rotas da API.

4. **bcryptjs:**
   Biblioteca para hash de senhas, garantindo a segurança dos dados sensíveis armazenados no banco de dados.

5. **dotenv:**
   Gerencia variáveis de ambiente de forma segura, protegendo informações sensíveis, como credenciais e chaves de API.

---

## **Como Executar o Projeto:**

### 1. Executando o Aplicativo (`refeitorio-expo`):
```bash
cd refeitorio-expo
npm install
npm start
```
Ou para executar diretamente no Android:
```bash
npm run android
```

### 2. Executando a API Backend (`refeitorio-api`):
```bash
cd refeitorio-api
npm install
npm start
```

### 3. Criando um Usuário Administrador
Para criar um usuário administrador, utilize o script `createAdmin.js`. Você deve passar os seguintes parâmetros: `<usuario> <senha> <nome> <cargo>`.

Exemplo de uso:
```bash
node src/createAdmin.js admin admin123 "Administrador do Sistema" 3
```
- **username:** Nome de usuário para login (ex: `admin`)
- **password:** Senha do usuário (ex: `admin123`)
- **nome:** Nome completo do usuário (ex: `Administrador do Sistema`)
- **role:** Nível de permissão (ex: `3` para administrador)

Se o usuário já existir, uma mensagem de erro será exibida. Caso contrário, o novo usuário será criado com sucesso.

## **Como Configurar o Projeto:**

### **Para a API Backend (`.env`)**
1. **Copie o arquivo de exemplo** para um novo arquivo `.env`:  
```bash
cd refeitorio-api
cp .env.example .env
```

2. **Edite o arquivo `.env`** com as configurações necessárias:  
```ini
JWT_SECRET=mysecretpassword
PORT=3000
```

3. **Salve o arquivo** e reinicie a API para aplicar as mudanças:  
```bash
npm start
```

---

### **Para o Expo (Frontend)**
1. **Abra o arquivo `app.json`** 
2. **Localize a seção `"extra"`** e edite conforme necessário:  
```json
{
  "expo": {
    "name": "MeuApp",
    "slug": "meuapp",
    "extra": {
      "API_URL": "https://meu-servidor.com/api",
      "DEADLINE_HOURS": 9,
      "DEADLINE_MINUTES": 30
    }
  }
}
```

3. **Salve as alterações** e reinicie o Expo para aplicar:  
```bash
npx expo start -c
```
