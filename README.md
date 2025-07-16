# 🔐 NestJS JWT Auth

Este projeto fornece uma estrutura completa de **autenticação com NestJS utilizando JWT**, incluindo:

## 📚 Funcionalidades

- ✅ Cadastro (Signup): Permite que novos usuários se registrem.
- 🔑 Login: Autentica usuários e gera tokens de acesso e refresh.
- 🔄 Tokens de Acesso e Refresh: Garante que os usuários possam permanecer autenticados sem precisar fazer login repetidamente.
- 🛡️ Proteção de Rotas: Utiliza Guards para proteger rotas sensíveis, garantindo que apenas usuários autenticados possam acessá-las
- ⚙️ Suporte a variáveis de ambiente via `.env`
- 🔌 Conexão com MongoDB via Mongoose

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

## ⚙️ Configuração do Ambiente

Crie um arquivo .env na raiz do projeto com base no arquivo .env.example

```bash
cp .env.example .env
```

## 🔐 Endpoints de Autenticação

Abaixo estão os principais endpoints disponíveis na API para autenticação:

| Método | Rota            | Descrição                      |
| ------ | --------------- | ------------------------------ |
| `POST` | `/auth/signup`  | Cadastro de novo usuário       |
| `POST` | `/auth/login`   | Login e geração dos tokens JWT |
| `POST` | `/auth/refresh` | Gera novo token de acesso      |

## 🚀 Rodando o projeto

```bash
# Rode o comando
npm run start:dev
```

## 🧾 Convenção de Commits

Este projeto utiliza uma padronização de commits seguindo o padrão do [Gitmoji](https://gitmoji.dev) 🎉.

Usar emojis nos commits ajuda a identificar rapidamente o propósito de cada alteração no histórico do Git, facilitando o entendimento e a manutenção do projeto.

### Exemplos

- ✨ `feat: adicionar rota de cadastro`
- 🐛 `fix: corrigir erro na validação do token`
- 🔧 `chore: atualizar dependências`
