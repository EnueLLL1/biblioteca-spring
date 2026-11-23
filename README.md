# Biblioteca Spring — Sistema Full-Stack de Gestão de Acervo

[![CI](https://github.com/EnueLLL1/biblioteca-spring/actions/workflows/ci.yml/badge.svg)](https://github.com/EnueLLL1/biblioteca-spring/actions/workflows/ci.yml)
![Java](https://img.shields.io/badge/Java-21-ED8B00?logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.5.7-6DB33F?logo=springboot&logoColor=white)
![React](https://img.shields.io/badge/React-Vite-61DAFB?logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)

Aplicação Full-Stack para gestão de acervo bibliográfico e empréstimos, construída com **API RESTful em Java 21 + Spring Boot** e interface web em **React + Tailwind CSS**.

---

## Principais Recursos

- **Arquitetura em Camadas:** separação clara entre `Controller`, `Service`, `Repository` e **DTOs** com Bean Validation (`@Valid`).
- **Tratamento Global de Exceções:** respostas de erro padronizadas (`ApiError`) via `@RestControllerAdvice` e exceções de domínio.
- **Documentação Interativa:** Swagger UI / OpenAPI (`springdoc-openapi`) disponível em `/swagger-ui.html`.
- **Testes Automatizados:**
  - **Back-End:** testes unitários com **JUnit 5 + Mockito** (camada `Service`) e testes de integração de rotas com **`@WebMvcTest` + `MockMvc`**, usando perfil `test` com **H2** em modo PostgreSQL.
  - **Front-End:** testes de componentes e fluxos com **Vitest + React Testing Library**.
- **Containerização & CI:** `Dockerfile` multi-stage, `docker-compose.yml` (API + PostgreSQL 16 com *healthcheck*) e pipeline no **GitHub Actions** executando testes e build automaticamente.

---

## Stack Tecnológica

| Camada | Tecnologias |
| :--- | :--- |
| **Back-End** | Java 21, Spring Boot 3.5.7, Spring Web, Spring Data JPA, Bean Validation, Springdoc OpenAPI, Lombok, Maven |
| **Front-End** | React, Vite, Tailwind CSS |
| **Banco de Dados** | PostgreSQL 16 (produção/dev) · H2 em memória (testes) |
| **Qualidade & Infra** | JUnit 5, Mockito, MockMvc, Vitest, React Testing Library, Docker, Docker Compose, GitHub Actions |

---

## Como Executar

### Opção 1: Via Docker Compose (recomendado)

```bash
git clone https://github.com/EnueLLL1/biblioteca-spring.git
cd biblioteca-spring
docker compose up --build
```

- **API:** `http://localhost:8080`
- **Swagger UI:** `http://localhost:8080/swagger-ui.html`

### Opção 2: Rodando Localmente (Back-End + Front-End)

**Back-End (Java 21 + PostgreSQL):**
```bash
# Configure DB_PASSWORD se necessário e inicie a API
./mvnw spring-boot:run
```

**Front-End (Node 22+):**
```bash
cd biblioteca-frontend
npm ci
npm run dev
```

---

## Testes Automatizados

**Back-End (20 testes):**
```bash
./mvnw test
```

**Front-End (6 testes + build):**
```bash
cd biblioteca-frontend
npm test
npm run build
```

---

## Estrutura do Projeto

```text
biblioteca-spring/
├── .github/workflows/ci.yml   # Pipeline de CI (Back-end + Front-end)
├── src/
│   ├── main/java/             # Controllers, Services, Repositories, DTOs, Exceptions, Config
│   └── test/                  # Testes unitários (Service), @WebMvcTest (Controller) e H2 profile
├── biblioteca-frontend/       # Aplicação React + Vite + Tailwind + testes Vitest
├── Dockerfile                 # Build multi-stage Java 21
└── docker-compose.yml         # Orquestração API + PostgreSQL 16
```

---

Desenvolvido por [**Emanuel Gomes Bispo**](https://www.linkedin.com/in/emanuel-gomes-bispo) · [GitHub](https://github.com/EnueLLL1)
