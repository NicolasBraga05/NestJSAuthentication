# 🔐 NestJS JWT Auth

Este projeto fornece uma estrutura completa de **autenticação com NestJS utilizando JWT**, incluindo:

- Login e cadastro (signup)
- Tokens de acesso e refresh
- Proteção de rotas com Guards
- Uso de variáveis de ambiente com `.env`
- Ideal para **APIs seguras e escaláveis**

## 🚀 Tecnologias

- [NestJS](https://nestjs.com/)
- [JWT (JSON Web Token)](https://jwt.io/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)

## 📦 Instalação

```bash
# Clone o repositório
git clone https://github.com/NicolasBraga05/NestJSAuthentication.git

# Acesse a pasta do projeto
cd NestJSAuthentication

# Instale as dependências
npm install
```

## 🚀 Rodando o projeto

```bash
# Rode o comando
npm run start:dev
```

## 📚 Funcionalidades

- Cadastro (Signup): Permite que novos usuários se registrem.
- Login: Autentica usuários e gera tokens de acesso e refresh.
- Tokens de Acesso e Refresh: Garante que os usuários possam permanecer autenticados sem precisar fazer login repetidamente.
- Proteção de Rotas: Utiliza Guards para proteger rotas sensíveis, garantindo que apenas usuários autenticados possam acessá-las
