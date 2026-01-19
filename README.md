# 💰 GastosResidenciais — Sistema de Controle Financeiro Residencial

# Sistema Full Stack desenvolvido como teste técnico, com foco em:

- Arquitetura limpa e organizada

- Regras de negócio bem definidas

- Código legível e testável

# Integração completa entre Front, API e Banco via Docker

- O projeto é um monorepo, contendo:

- Backend: ASP.NET Core Web API

- Frontend: React + TypeScript

- Banco: MySQL

- Orquestração: Docker Compose

  # 🎯 Objetivo

# Implementar um sistema capaz de:

- Gerenciar pessoas, categorias e transações financeiras

- Aplicar regras de negócio reais

- Gerar relatórios consolidados

- Persistir dados de forma confiável

# 🧱 Estrutura do Projeto

GastosResidenciais/
│
├── src/
│   ├── GastosResidenciais.Api            → Web API (.NET)
│   ├── GastosResidenciais.Application    → Serviços e DTOs
│   ├── GastosResidenciais.Domain         → Entidades e regras
│   └── GastosResidenciais.Infrastructure → EF Core e Repositórios
│
├── tests/
│   ├── Domain.Tests
│   └── Application.Tests
│
└── frontend/
    └── gastos-residenciais-front → React + TypeScript

# 🛠 Tecnologias
# Backend

- .NET 9

- ASP.NET Core Web API

- Entity Framework Core

- MySQL

- xUnit

- Swagger

# Frontend

- React

- TypeScript

- Vite

- React Query

- Axios

- Tailwind + shadcn/ui

# Arquitetura

- Clean Architecture

- SOLID

- Repository Pattern

- Unit of Work

- DTOs

- Validações de domínio

- Testes com repositórios fake

# 📦 Funcionalidades
# 👤 Pessoas

- Criar

- Listar

- Excluir

- Cascade delete das transações

- Campos: Id, Nome, Idade

# 🗂 Categorias

- Criar

- Listar

- Finalidade:

- Despesa

- Receita

- Ambas

# 💸 Transações

- Criar

- Listar

# Validações:

- Valor positivo

- Categoria compatível com tipo

- Menores de 18 → apenas despesas

# 📊 Relatórios

- Totais por pessoa

- Total de receitas

- Total de despesas

- Saldo individual

- Total geral consolidado

# 🧠 Regras de Negócio

- Menores de 18 anos só podem registrar DESPESAS

- Categoria deve ser compatível com o tipo

- Exclusão de pessoa remove suas transações

- Saldo = Receitas − Despesas
 
# 🧪 Testes Automatizados
- Cobertura

- Validação de entidades

- Regras do TransacaoService

- Cálculo do RelatorioService

# Estratégia

- Repositórios fake em memória

- Sem dependência de banco

- Testes rápidos e determinísticos
- 
- Demonstrar boas práticas de desenvolvimento moderno

# dotnet test

# 🚀 Executando com Docker (RECOMENDADO)

# Pré-requisitos

- Docker Desktop

# Subir tudo
- docker compose up --build

# Acessos

| Serviço   | URL                                                                    |
| --------- | ---------------------------------------------------------------------- |
| Frontend  | [http://localhost:5173](http://localhost:5173)                         |
| Swagger   | [http://localhost:7108/swagger](http://localhost:7108/swagger)         |
| Proxy API | [http://localhost:5173/api/Pessoas](http://localhost:5173/api/Pessoas) |

# Parar

- docker compose down

# Resetar banco

- docker compose down -v

# 🧪 Roteiro de Teste

# 1) Teste via Swagger

- Criar Pessoa

- Criar Categoria

- Criar Transação

- Consultar Relatórios

# 2) Teste via Front

- Abrir http://localhost:5173

- Cadastrar Pessoa

- Cadastrar Categoria

- Cadastrar Transação

- Validar relatório e saldo

# 3) Teste de Persistência

docker compose down
docker compose up -d

# 🌐 Endpoints Principais

- GET /api/Pessoas

- POST /api/Pessoas

- GET /api/Categorias

- POST /api/Categorias

- GET /api/Transacoes

- POST /api/Transacoes

- GET /api/Relatorios

# 🧾 Decisões Técnicas

- Regras concentradas na camada Application

- Domínio com invariantes

- Repositórios sem lógica de negócio

- UnitOfWork para consistência

- DTOs isolando API do domínio

- Monorepo para avaliação facilitada

- Docker para execução em 1 comando

# 📚 Documentação

- XML Docs no backend

- Swagger documentado

- Mensagens de erro padronizadas

- Validações amigáveis

# 🚧 Possíveis Evoluções

- Autenticação JWT

- Paginação e filtros

- Cache de relatórios

- Testes E2E

- Pipeline CI/CD

# 👤 Autor

Breno Rodrigues Dos Santos -
Desenvolvedor Full Stack
C# • .NET • React • TypeScript
