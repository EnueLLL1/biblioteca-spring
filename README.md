# 📚 Sistema de Biblioteca - Spring Boot + React

> **Projeto #1 de 7** do meu [Roadmap de Aprendizado em Spring Boot](https://github.com/EnueLLL1/EnueLLL1/blob/main/ROADMAP.md)

Uma aplicação Full Stack completa de gerenciamento de biblioteca, desenvolvida para aprender e praticar conceitos essenciais de desenvolvimento Java/Spring Boot e React.

[![Java](https://img.shields.io/badge/Java-21-orange?style=flat&logo=openjdk)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.7-brightgreen?style=flat&logo=spring)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-blue?style=flat&logo=react)](https://react.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-blue?style=flat&logo=postgresql)](https://www.postgresql.org/)
[![Status](https://img.shields.io/badge/Status-Concluído-success?style=flat)]()

---

## 🎯 Sobre o Projeto

Sistema completo de biblioteca que permite gerenciar livros, autores, categorias, gêneros, usuários e empréstimos. Aplicação construída do zero com foco em **boas práticas**, **arquitetura limpa** e **aprendizado progressivo**.

### 🌟 Destaques

- ✅ **Backend RESTful** completo com Spring Boot
- ✅ **Frontend moderno** com React + Vite + Tailwind CSS
- ✅ **Banco de dados** PostgreSQL com relacionamentos complexos
- ✅ **DTOs** para separação de camadas
- ✅ **Validações** robustas em todos os endpoints
- ✅ **CRUD completo** para todas as entidades

---

## 🛠️ Tecnologias Utilizadas

### Backend
- **Java 21** - Linguagem de programação
- **Spring Boot 3.5.7** - Framework principal
  - Spring Data JPA - Persistência de dados
  - Spring Web - API REST
  - Spring Validation - Validação de dados
- **PostgreSQL** - Banco de dados relacional
- **Lombok** - Redução de código boilerplate
- **Maven** - Gerenciamento de dependências

### Frontend
- **React 18** - Biblioteca UI
- **Vite** - Build tool
- **Tailwind CSS** - Framework CSS
- **React Router DOM** - Roteamento

---

## 📐 Arquitetura

O projeto segue a arquitetura em camadas (Layered Architecture):

```
├── Backend (Spring Boot)
│   ├── Model (Entities)
│   │   ├── ModelBiblioteca (Livro)
│   │   ├── ModelAutor
│   │   ├── ModelUsuario
│   │   ├── Categoria
│   │   ├── Genero
│   │   └── ModelEmprestimos
│   │
│   ├── Repository (Acesso a dados)
│   │   ├── LivroRepository
│   │   ├── AutorRepository
│   │   ├── UsuarioRepository
│   │   ├── CategoriaRepository
│   │   ├── GeneroRepository
│   │   └── EmprestimoRepository
│   │
│   ├── DTO (Data Transfer Objects)
│   │   ├── LivroDTO
│   │   ├── CriarLivroDTO
│   │   ├── AutorDTO
│   │   ├── UsuarioDTO
│   │   ├── CategoriaDTO
│   │   ├── GeneroDTO
│   │   └── EmprestimoDTO
│   │
│   ├── Service (Lógica de negócio)
│   │   ├── LivroService
│   │   ├── AutorService
│   │   ├── UsuarioService
│   │   ├── CategoriaService
│   │   ├── GeneroService
│   │   └── EmprestimoService
│   │
│   └── Controller (Endpoints REST)
│       ├── LivroController
│       ├── AutorController
│       ├── UsuarioController
│       ├── CategoriaController
│       ├── GeneroController
│       └── EmprestimoController
│
└── Frontend (React)
    ├── pages/
    │   ├── Home.jsx
    │   ├── Livros.jsx
    │   ├── CadastrarLivro.jsx
    │   ├── Autores.jsx
    │   ├── CadastrarAutor.jsx
    │   ├── Emprestimos.jsx
    │   └── CadastrarEmprestimo.jsx
    │
    ├── components/
    │   └── Header.jsx
    │
    └── services/
        └── api.js
```

---

## 🗄️ Modelo de Dados

### Relacionamentos Implementados

```
Livro (ModelBiblioteca)
  ├── @ManyToOne → Autor
  ├── @ManyToMany → Categorias
  └── @ManyToMany → Gêneros

Empréstimo (ModelEmprestimos)
  ├── @ManyToOne → Livro
  └── @ManyToOne → Usuário

Autor (ModelAutor)
  └── @OneToMany → Livros

Usuário (ModelUsuario)
  └── @OneToMany → Empréstimos

Categoria
  └── @ManyToMany (inverso) → Livros

Gênero
  └── @ManyToMany (inverso) → Livros
```

### Validações Implementadas

- `@NotBlank` - Campos obrigatórios (título, autor, etc)
- `@Email` - Validação de formato de email
- `@ISBN` - Validação de ISBN válido
- `@NotNull` - Campos que não podem ser nulos
- `@Min/@Max` - Validação de valores numéricos

---

## 🚀 API REST - Endpoints

### 📚 Livros
```http
GET    /api/livros                      # Listar todos
GET    /api/livros/{id}                 # Buscar por ID
GET    /api/livros/disponiveis          # Listar disponíveis
GET    /api/livros/buscar?titulo=...    # Buscar por título
GET    /api/livros/autor/{id}           # Buscar por autor
GET    /api/livros/categoria/{id}       # Buscar por categoria
GET    /api/livros/genero/{id}          # Buscar por gênero
POST   /api/livros                      # Criar livro
PUT    /api/livros/{id}                 # Atualizar livro
DELETE /api/livros/{id}                 # Deletar livro
```

### ✍️ Autores
```http
GET    /api/autores                     # Listar todos
GET    /api/autores/{id}                # Buscar por ID
GET    /api/autores/buscar?nome=...     # Buscar por nome
POST   /api/autores?nome=...&nacionalidade=...  # Criar autor
DELETE /api/autores/{id}                # Deletar autor
```

### 👥 Usuários
```http
GET    /api/usuarios                    # Listar todos
GET    /api/usuarios/{id}               # Buscar por ID
GET    /api/usuarios/buscar?nome=...    # Buscar por nome
GET    /api/usuarios/email?email=...    # Buscar por email
POST   /api/usuarios?nome=...&email=...&telefone=...  # Criar usuário
DELETE /api/usuarios/{id}               # Deletar usuário
```

### 📋 Empréstimos
```http
GET    /api/emprestimos/ativos          # Listar ativos
GET    /api/emprestimos/atrasados       # Listar atrasados
GET    /api/emprestimos/usuario/{id}    # Listar por usuário
POST   /api/emprestimos?livroId=...&usuarioId=...  # Criar empréstimo
POST   /api/emprestimos/{id}/devolver   # Devolver livro
```

### 📁 Categorias e Gêneros
```http
GET    /api/categorias                  # Listar todas
POST   /api/categorias?nome=...         # Criar categoria
DELETE /api/categorias/{id}             # Deletar categoria

GET    /api/generos                     # Listar todos
POST   /api/generos?nome=...            # Criar gênero
DELETE /api/generos/{id}                # Deletar gênero
```

---

## 💡 Conceitos Aplicados

### Backend

✅ **DTOs (Data Transfer Objects)**
- Separação entre camadas de domínio e apresentação
- Evita exposição de dados sensíveis
- Previne lazy loading issues

✅ **Queries Personalizadas**
- Query Methods (findByTituloContaining, existsByEmail)
- @Query com JPQL para buscas complexas
- Queries para relacionamentos Many-to-Many

✅ **Validações**
- Bean Validation com anotações
- Validações customizadas de negócio
- Tratamento de erros com mensagens claras

✅ **Transações**
- @Transactional em operações críticas
- Garantia de consistência de dados

✅ **Relacionamentos JPA**
- OneToMany / ManyToOne
- ManyToMany com tabelas de junção
- Bidirecionais com mappedBy

### Frontend

✅ **Componentização**
- Páginas separadas por responsabilidade
- Componentes reutilizáveis

✅ **Estado e Efeitos**
- useState para estado local
- useEffect para carregamento de dados
- useNavigate para navegação programática

✅ **Integração com API**
- Fetch API para requisições HTTP
- Async/await para operações assíncronas
- Tratamento de erros

✅ **Roteamento**
- React Router DOM
- Rotas protegidas por funcionalidade

---

## 📦 Como Executar

### Pré-requisitos

- Java 21+
- Maven 3.8+
- PostgreSQL 12+
- Node.js 18+
- npm ou yarn

### Backend

1. **Clone o repositório**
```bash
git clone https://github.com/EnueLLL1/biblioteca-spring.git
cd biblioteca-spring
```

2. **Configure o PostgreSQL**

Crie o banco de dados:
```sql
CREATE DATABASE usuarios_db;
CREATE USER meuapp WITH PASSWORD 'senha123';
GRANT ALL PRIVILEGES ON DATABASE usuarios_db TO meuapp;
```

3. **Configure application.properties**
```properties
# src/main/resources/application.properties
server.port=3000
spring.datasource.url=jdbc:postgresql://localhost:5432/usuarios_db
spring.datasource.username=meuapp
spring.datasource.password=senha123
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

4. **Execute a aplicação**
```bash
mvn spring-boot:run
```

API disponível em: `http://localhost:3000`

### Frontend

1. **Navegue até a pasta do frontend**
```bash
cd biblioteca-frontend
```

2. **Instale as dependências**
```bash
npm install
```

3. **Execute o projeto**
```bash
npm run dev
```

Frontend disponível em: `http://localhost:5173`

---

## 📸 Demonstração

### Tela Inicial
- Acesso rápido às principais funcionalidades
- Cards interativos para navegação

### Gestão de Livros
- Listagem com status de disponibilidade
- Formulário completo de cadastro
- Busca por múltiplos critérios

### Sistema de Empréstimos
- Criação de empréstimos com validação
- Listagem de empréstimos ativos/atrasados
- Devolução de livros

---

## 🎓 O Que Aprendi

### Técnicas de Desenvolvimento

1. **Arquitetura em Camadas**
   - Separação clara de responsabilidades
   - Facilita manutenção e testes

2. **Padrão DTO**
   - Proteção de dados sensíveis
   - Controle sobre o que é exposto na API

3. **Relacionamentos JPA**
   - OneToMany, ManyToOne, ManyToMany
   - Cascade, fetch types, mappedBy

4. **Validações**
   - Bean Validation
   - Validações customizadas no Service

5. **Queries Personalizadas**
   - Query Methods
   - JPQL
   - SQL Nativo quando necessário

6. **Frontend Moderno**
   - Hooks (useState, useEffect)
   - React Router
   - Tailwind CSS

### Desafios Superados

- Configuração de relacionamentos bidirecionais
- Validação de ISBN
- Sincronização entre estado do livro e empréstimos
- Conversão Entity ↔ DTO
- CORS entre frontend e backend
- Gerenciamento de estado no React

---

## 🔄 Roadmap do Projeto

- [x] Configuração inicial do projeto
- [x] Modelagem do banco de dados
- [x] Implementação das Entities
- [x] Criação dos Repositories com queries personalizadas
- [x] Desenvolvimento dos DTOs
- [x] Implementação dos Services com lógica de negócio
- [x] Criação dos Controllers REST
- [x] Validações completas
- [x] Testes manuais com Thunder Client
- [x] Frontend React com Vite
- [x] Integração Frontend ↔ Backend
- [x] Deploy local funcional
- [ ] Testes unitários (JUnit)
- [ ] Testes de integração
- [ ] Documentação Swagger
- [ ] Deploy em produção

---

## 🚀 Próximos Passos

Este projeto está **concluído** como MVP! Próximos aprendizados:

1. **Projeto #2**: To-Do List com Categorias e Prioridades
2. Adicionar Spring Security (autenticação/autorização)
3. Implementar testes unitários e de integração
4. Documentar API com Swagger/OpenAPI
5. Containerizar com Docker
6. Deploy em cloud (Railway/Render)

---

## 📚 Recursos e Referências

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Data JPA](https://spring.io/projects/spring-data-jpa)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

## 🤝 Contribuições

Este é um projeto de aprendizado pessoal, mas feedback é sempre bem-vindo!

Se você:
- Encontrou um bug
- Tem sugestões de melhoria
- Quer discutir conceitos

Abra uma [issue](https://github.com/EnueLLL1/biblioteca-spring/issues) ou entre em contato!

---

## 📝 Licença

Projeto desenvolvido para fins educacionais.

---

## 👨‍💻 Autor

**EnueLLL1**

[![GitHub](https://img.shields.io/badge/GitHub-EnueLLL1-black?style=flat&logo=github)](https://github.com/EnueLLL1)

---

## ⭐ Mostre seu apoio

Se este projeto te ajudou de alguma forma, considere dar uma ⭐!

---

<div align="center">

**✨ "Cada linha de código é um passo. Cada erro, uma lição." ✨**

**Projeto #1/7 - Sistema de Biblioteca** ✅ **CONCLUÍDO**

[🎯 Ver Roadmap Completo](https://github.com/EnueLLL1/EnueLLL1/blob/main/ROADMAP.md)

</div>
