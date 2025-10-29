# 📚 Biblioteca Spring

Uma aplicação simples de biblioteca desenvolvida com **Spring Boot** para treinar e aprender conceitos essenciais de desenvolvimento Java, como relacionamentos entre tabelas, validações de dados, queries personalizadas no Repository e o uso de DTOs (Data Transfer Objects).

## 🌟 Funcionalidades Principais

- **Relacionamentos entre Tabelas**: Implementação de relacionamentos **ManyToMany** entre entidades (Livro ↔ Gênero e Livro ↔ Categoria).
- **Validações de Dados**: Uso de anotações como `@NotBlank` e `@ISBN` para garantir integridade dos dados.
- **Queries Personalizadas**: Consulta e manipulação avançada de dados através do Repository do Spring Data JPA.
- **DTOs**: Estruturação de objetos de transferência de dados para APIs mais limpas e performáticas.

## 🛠️ Tecnologias Utilizadas

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.7-brightgreen)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-21-orange)](https://www.java.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15.4-blue)](https://www.postgresql.org/)

- **Spring Boot Starter Web**: Para criação de APIs REST.
- **Spring Boot Starter Data JPA**: Para persistência de dados com Hibernate.
- **Spring Boot Starter Validation**: Para validações automáticas de entrada.
- **PostgreSQL**: Banco de dados relacional.
- **Lombok**: Para reduzir código boilerplate com anotações.

## 🚀 Como Executar

### Pré-requisitos
- Java 21 instalado
- PostgreSQL executando localmente
- Maven para gerenciamento de dependências

### Passos
1. **Clone o repositório**:
   ```bash
   git clone https://github.com/EnueLLL1/biblioteca-spring.git
   cd biblioteca-spring
   ```

2. **Configure o banco de dados**: Atualize `src/main/resources/application.properties` com suas credenciais do PostgreSQL:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/nome_do_banco
   spring.datasource.username=seu_usuario
   spring.datasource.password=sua_senha
   spring.jpa.hibernate.ddl-auto=update
   ```

3. **Execute a aplicação**:
   ```bash
   mvn spring-boot:run
   ```

A aplicação estará rodando em `http://localhost:8080`.

## 📁 Estrutura do Projeto

```
src/
├── main/java/com/enuelll1/biblioteca_spring/
│   ├── BibliotecaSpringApplication.java       # Classe principal
│   ├── controller/                             # Controladores REST
│   │   └── BibliotecaController.java
│   ├── model/                                  # Modelos/entidades JPA
│   │   ├── ModelBiblioteca.java (Livro)
│   │   ├── Genero.java
│   │   └── Categoria.java
│   └── view/                                   # DTOs e objetos de view
│       └── ViewBiblioteca.java
├── main/resources/
│   ├── application.properties                  # Configurações da aplicação
│   └── static/                                 # Recursos estáticos (CSS, JS, etc.)
└── test/                                       # Testes unitários
```

## 🎯 Exemplos de Uso

### Criar um novo livro:
```bash
POST /livros
{
  "tituloLivro": "Exemplo de Título",
  "autorLivro": "Autor Exemplo",
  "editoraLivro": "Editora Exemplo",
  "anoPublicado": 2023,
  "descricaoLivro": "Uma descrição interessante...",
  "isbnLivro": "978-1234567890",
  "generos": [{"idGenero": 1}, {"idGenero": 2}],
  "categoria": [{"idCategoria": 1}]
}
```

Para mais endpoints, consulte o `BibliotecaController.java`.

## 🤝 Contribuição

Sinta-se à vontade para contribuir! Abra uma issue ou envie um pull request. Ideias para melhorias são sempre bem-vindas.

## 📄 Licença

Este projeto não possui licença específica (ainda). Use por conta e risco 😉.

---

Desenvolvido com ❤️ por EnueLLL1. Bom aprendizado!
