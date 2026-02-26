# Backend Jati - API de Catálogo

Este é o backend da aplicação Jati, uma API RESTful desenvolvida em Node.js para gerenciar um catálogo de produtos hierárquico. O sistema permite o gerenciamento de Linhas, Produtos, Tabelas e Dados técnicos, implementando funcionalidades de criação, leitura, atualização e exclusão (CRUD), incluindo _soft delete_ (lixeira e restauração) e **exclusão física**.

## 🛠 Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript.
- **Express**: Framework web para construção da API.
- **MongoDB**: Banco de dados NoSQL.
- **Mongoose**: ODM (Object Data Modeling) para MongoDB.
- **Dotenv**: Gerenciamento de variáveis de ambiente.
- **CORS**: Middleware para permitir pedidos de diferentes origens.
- **Nodemon**: Utilitário para desenvolvimento (hot-reload).

## ⚙️ Pré-requisitos

- Node.js instalado (versão recomendada LTS).
- MongoDB (instância local ou cluster no MongoDB Atlas).

## 🚀 Como Rodar o Projeto

### 1. Instalação

Clone o repositório e instale as dependências:

```bash
npm install
```

````

### 2. Configuração de Variáveis de Ambiente

Crie um ficheiro `.env` na raiz do projeto seguindo o modelo do `.env.example`:

```env
MONGO_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/banco
FRONTEND_URL_LOCAL=http://localhost:5173
FRONTEND_URL=[https://oseusite.com.br/](https://oseusite.com.br/)
FRONTEND_ADMIN_URL=[https://admin.oseusite.com.br](https://admin.oseusite.com.br)
TOKEN_SECRETO=seu_token_secreto_aqui

```

### 3. Execução

Para rodar em modo de desenvolvimento (com reinicialização automática):

```bash
npm run dev

```

Para rodar em modo de produção:

```bash
npm start

```

O servidor iniciará em `http://localhost:3000`.

### 4. Populando o Banco de Dados (Data Seeding)

Para facilitar o setup inicial ou restaurar o estado original do catálogo, o projeto inclui um script utilitário de importação. O ficheiro `importarCatalogo.js`, localizado na raiz do projeto, funciona como um **Seed Script**.

Ele lê o ficheiro JSON localizado em `src/data/catalogo.json` e popula o banco de dados MongoDB com a estrutura completa de linhas, produtos, tabelas e dados técnicos. Isso serve como um ponto de restauração (_checkpoint_) ou carga inicial de dados.

Para executar a importação:

```bash
node importarCatalogo.js

```

> **Nota:** Certifique-se de que o MongoDB esteja rodando e que as variáveis de ambiente (`.env`) estejam configuradas corretamente antes de executar este script.

---

## 🗂 Estrutura de Dados (Models)

O banco de dados utiliza uma estrutura aninhada (Nested Schemas) dentro da coleção `Linhas`. A hierarquia é:
**Linha** -> **Produtos** -> **Tabelas** -> **Dados**.

### Entidades Principais

- **Linha**: Representa uma categoria principal. Campos: `linha`, `painel_linha`, `imagem_linha`, `pdf_linha`.
- **Produto**: Item dentro de uma linha. Campos: `produto_id`, `nome_produto`, `imagem_produto`, `imagem_patente`, `pdf_produto`, `descricao_produto`.
- **Tabela**: Agrupamento técnico dentro de um produto. Campos: `tabela_id`, `pn`.
- **Dados**: Informações técnicas específicas (dimensões, códigos). Campos: `dn`, `codigo`, `embalagem`, `de`, `esp`, `comp`, `peso`.

_Nota: Todas as entidades possuem a flag `deletado` para controle de exclusão lógica (soft delete)._

---

## 📡 Endpoints da API

### 📂 Linhas

Rotas para gerenciamento das linhas de produtos.

| Método   | Rota                         | Descrição                                      |
| -------- | ---------------------------- | ---------------------------------------------- |
| `GET`    | `/catalogo`                  | Lista todas as linhas ativas.                  |
| `GET`    | `/catalogo/resumo`           | Lista linhas de forma resumida e paginada.     |
| `GET`    | `/catalogo/deletados`        | Lista todas as linhas marcadas como deletadas. |
| `GET`    | `/catalogo/:linha`           | Busca uma linha específica pelo nome.          |
| `POST`   | `/catalogo`                  | Cria uma nova linha.                           |
| `PATCH`  | `/catalogo/:linha`           | Atualiza os dados de uma linha.                |
| `PATCH`  | `/catalogo/:linha/deletar`   | Marca a linha como deletada (Soft Delete).     |
| `PATCH`  | `/catalogo/:linha/restaurar` | Restaura uma linha deletada.                   |
| `DELETE` | `/catalogo/:linha`           | Exclui fisicamente a linha do banco de dados.  |

### 📦 Produtos

Rotas para gerenciamento dos produtos dentro de uma linha.

| Método   | Rota                                    | Descrição                                             |
| -------- | --------------------------------------- | ----------------------------------------------------- |
| `GET`    | `/catalogo/:linha/produtos`             | Lista todos os produtos de uma linha.                 |
| `GET`    | `/catalogo/:linha/produtos/paginados`   | Lista os produtos de uma linha com paginação.         |
| `GET`    | `/catalogo/:linha/:produtoId`           | Busca um produto específico pelo ID.                  |
| `PUT`    | `/catalogo/:linha/produtos/completo`    | Salva ou atualiza um produto completo e suas tabelas. |
| `POST`   | `/catalogo/:linha`                      | Adiciona um novo produto a uma linha.                 |
| `PATCH`  | `/catalogo/:linha/:produtoId`           | Atualiza os dados de um produto.                      |
| `PATCH`  | `/catalogo/:linha/:produtoId/deletar`   | Marca o produto como deletado (Soft Delete).          |
| `PATCH`  | `/catalogo/:linha/:produtoId/restaurar` | Restaura um produto deletado.                         |
| `DELETE` | `/catalogo/:linha/:produtoId`           | Exclui fisicamente um produto.                        |

### 📊 Tabelas

Rotas para gerenciamento das tabelas técnicas de um produto.

| Método   | Rota                                                      | Descrição                            |
| -------- | --------------------------------------------------------- | ------------------------------------ |
| `GET`    | `/catalogo/:linha/:produtoId/tabelas`                     | Lista tabelas de um produto.         |
| `GET`    | `/catalogo/:linha/:produtoId/tabelas/:tabelaId`           | Busca tabela específica pelo ID.     |
| `POST`   | `/catalogo/:linha/:produtoId/tabelas`                     | Cria uma nova tabela para o produto. |
| `PATCH`  | `/catalogo/:linha/:produtoId/tabelas/:tabelaId`           | Atualiza uma tabela.                 |
| `PATCH`  | `/catalogo/:linha/:produtoId/tabelas/:tabelaId/deletar`   | Deleta (Soft Delete) uma tabela.     |
| `PATCH`  | `/catalogo/:linha/:produtoId/tabelas/:tabelaId/restaurar` | Restaura uma tabela.                 |
| `DELETE` | `/catalogo/:linha/:produtoId/tabelas/:tabelaId`           | Exclui fisicamente uma tabela.       |

### 📝 Dados Técnicos

Rotas para gerenciamento dos itens (dados) dentro das tabelas.

| Método   | Rota                                                                    | Descrição                                        |
| -------- | ----------------------------------------------------------------------- | ------------------------------------------------ |
| `GET`    | `/catalogo/:linha/:produtoId/tabelas/:tabelaId/dados`                   | Lista dados de uma tabela.                       |
| `PUT`    | `/catalogo/:linha/:produtoId/tabelas/:tabelaId/dados`                   | Adiciona novos dados à tabela.                   |
| `PATCH`  | `/catalogo/:linha/:produtoId/tabelas/:tabelaId/dados/:codigo`           | Atualiza um dado específico (busca pelo código). |
| `PATCH`  | `/catalogo/:linha/:produtoId/tabelas/:tabelaId/dados/:codigo/deletar`   | Deleta (Soft Delete) um dado específico.         |
| `PATCH`  | `/catalogo/:linha/:produtoId/tabelas/:tabelaId/dados/:codigo/restaurar` | Restaura um dado específico.                     |
| `DELETE` | `/catalogo/:linha/:produtoId/tabelas/:tabelaId/dados/:codigo`           | Exclui fisicamente o dado técnico específico.    |
````
