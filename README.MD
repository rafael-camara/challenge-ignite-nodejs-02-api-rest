<p align="center">
  <img alt="Logo Node.JS" src="https://www.vectorlogo.zone/logos/nodejs/nodejs-icon.svg" width="100px" />
</p>

<p align="center">
  <a href="LICENSE"><img  src="https://img.shields.io/static/v1?label=License&message=MIT&color=8cc84b&labelColor=202024" alt="License"></a>
</p>

# 💻 Daily Diet API

Este projeto é o desafio 02 do módulo: Criando APIs RESTfull com Node.js do Ignite ministrado pela [Rocketseat](https://github.com/rocketseat) com o educador [Diego Fernandes](https://github.com/diego3g).

## 📌 Objetivo

API que realiza o CRUD (Create, Read, Update, Delete) para gerenciar sua dieta diária.

# Requisitos Funcionais

- [x] Deve ser possível criar um usuário
- [x] Deve ser possível registrar uma refeição feita, com as seguintes informações:
  - Nome
  - Descrição
  - Data e Hora
  - Está dentro ou não da dieta

- [x] Deve ser possível editar uma refeição, podendo alterar todos os dados acima
- [x] Deve ser possível apagar uma refeição
- [x] Deve ser possível listar todas as refeições de um usuário
- [x] Deve ser possível visualizar uma única refeição
- [x] Deve ser possível recuperar as métricas de um usuário:
  - Quantidade total de refeições registradas
  - Quantidade total de refeições dentro da dieta
  - Quantidade total de refeições fora da dieta
  - Melhor sequência de refeições dentro da dieta

# Regras de Negócio

- [x] O usuário só pode visualizar, editar e apagar as refeições o qual ele criou
- [x] Deve ser possível identificar o usuário entre as requisições

### Rotas e regras de negócio

Estrutura (propriedades) do usuário:

- `id` - Identificador único de cada usuário
- `name` - Nome do usuário
- `email` - Email do usuário
- `session_id` - Identificador da sessão de usuário

Estrutura (propriedades) da refeição:

- `id` - Identificador único de cada refeição
- `user_id` - Identificador do usuário que criou a refeição
- `title` - Título da refeição
- `description` - Descrição da refeição
- `is_diet` - Valor booleano para informar se está dentro ou não da dieta
- `date` - Data de quando a refeição foi criada.

Rotas do usuário:

- `POST - /users`

Rotas da refeição:

- `POST - /meals`
- `GET - /meals`
- `GET - /meals/:id`
- `GET - /meals/metrics`
- `PUT - /meals/:id`
- `DELETE - /meals/:id`

## 📝 Licença

Esse projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---
