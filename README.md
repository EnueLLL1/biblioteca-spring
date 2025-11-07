# 📚 Sistema de Biblioteca – Primeiro Passo do Meu Roadmap Spring Boot

![Spring Boot Roadmap](https://img.shields.io/badge/Roadmap%20Spring%20Boot-1%2F7-00a86b?style=flat-square&logo=spring&logoColor=white)

Uma aplicação simples de biblioteca desenvolvida com **Spring Boot** para treinar e aprender conceitos essenciais de desenvolvimento Java.  
Este projeto é o **Projeto #1 de 7** do meu [**Roadmap de Aprendizado em Spring Boot**](https://github.com/EnueLLL1/EnueLLL1/blob/main/ROADMAP.md), onde construo aplicações reais com complexidade progressiva — do básico ao avançado — com foco em **boas práticas, arquitetura limpa**. 


---

## 🧪 O que já foi aplicado

### 🔗 Relacionamentos entre Entidades
- Implementação de relacionamentos **`@ManyToMany`** entre:
  - `Livro` ↔ `Gênero`
  - `Livro` ↔ `Categoria`

### ✅ Validações de Dados
- `@NotBlank` para campos obrigatórios (`tituloLivro`, `autorLivro`, etc.)
- `@ISBN` para garantir formato válido de ISBN *(em validação customizada ou via biblioteca)*

### 🔍 Queries Personalizadas com Spring Data JPA
- Métodos no `BibliotecaRepository` para buscas específicas (ex: por título, autor, gênero)

### 📦 DTOs (Data Transfer Objects)
- Classe `ViewBiblioteca.java` como **objeto de entrada/saída da API**
- Separação clara entre **modelo de domínio** (`ModelBiblioteca`) e **representação externa**

---

## 🛠️ Tecnologias Utilizadas

- **Java 21**
- **Spring Boot** (`spring-boot-starter-web`, `spring-boot-starter-data-jpa`, `spring-boot-starter-validation`)
- **PostgreSQL**
- **Lombok** (para reduzir código boilerplate)
- **Maven**

---

## 🚀 Como Executar Localmente

1. **Clone o repositório**
   ```bash
   git clone https://github.com/EnueLLL1/biblioteca-spring.git
   cd biblioteca-spring
   ```

2. **Configure o PostgreSQL**  
   Atualize `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/nome_do_banco
   spring.datasource.username=seu_usuario
   spring.datasource.password=sua_senha
   spring.jpa.hibernate.ddl-auto=update
   ```

3. **Execute a aplicação**
   ```bash
   mvn spring-boot:run
   ```
   A API estará disponível em: `http://localhost:8080`

---

## 📡 Exemplo de Requisição (POST /livros)

```json
{
  "tituloLivro": "Dom Casmurro",
  "autorLivro": "Machado de Assis",
  "editoraLivro": "Editora Brasil",
  "anoPublicado": 1899,
  "descricaoLivro": "Clássico da literatura brasileira...",
  "isbnLivro": "978-85-260-0190-0",
  "generos": [{"idGenero": 1}, {"idGenero": 3}],
  "categoria": [{"idCategoria": 2}]
}
```

> Para ver todos os endpoints, consulte `BibliotecaController.java`.

---

## 🗺️ Roadmap de Aprendizado

Este projeto é o **primeiro de uma jornada estruturada** para dominar Spring Boot antes de avançar para Docker, microsserviços e nuvem.

| # | Projeto                          | Nível           | Status       |
|---|----------------------------------|------------------|--------------|
| 1 | **Sistema de Biblioteca**        | Básico           | ✅ Em andamento |
| 2 | To-Do List com Categorias        | Básico/Intermediário | ⏳ Próximo |
| 3 | API de Blog/Rede Social          | Intermediário    | — |
| 4 | E-commerce Simples               | Intermediário    | — |
| 5 | Gerenciamento Financeiro         | Intermediário/Avançado | — |
| 6 | Sistema de Gestão Escolar        | Avançado         | — |
| 7 | Plataforma de Cursos Online      | Projeto Final    | — |

> 🌱 **Objetivo**: Construir aplicações reais, documentar meu aprendizado e criar um portfólio que mostre **esforço, evolução e compreensão profunda** — não apenas código funcional.

---

## 💬 Sobre Meu Processo de Aprendizado

- Busco **boas práticas desde o início**: validação, DTOs, separação de camadas.
- **Commits frequentes e descritivos** refletem minha jornada passo a passo.

---

## 🤝 Contribuições

Aceito sugestões, críticas construtivas e dicas! Se notar algo que pode ser melhorado ou quiser discutir conceitos, abra uma **issue**.  
Este é um espaço de **aprendizado contínuo**.

> 🔒 **Licença**: Ainda sem licença formal. Uso por conta e risco.  
> ❤️ Desenvolvido com dedicação por [EnueLLL1](https://github.com/EnueLLL1)

---

✨ **Cada linha de código é um passo. Cada erro, uma lição.**  
✨ **Estou aqui para aprender — e construir com propósito.**
