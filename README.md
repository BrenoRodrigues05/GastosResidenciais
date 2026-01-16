# GastosResidenciais

💰 Gastos Residenciais — Controle Financeiro Residencial

Sistema de controle de gastos residenciais desenvolvido como teste técnico Full Stack, com foco em boas práticas, regras de negócio bem definidas, arquitetura limpa e código legível e testável.

O projeto é estruturado em monorepo, contendo backend (.NET) e frontend (React + TypeScript) no mesmo repositório.

# 📌 Objetivo do Projeto

 Implementar um sistema capaz de:

- Gerenciar pessoas, categorias e transações financeiras

- Aplicar corretamente as regras de negócio

- Gerar relatórios consolidados

- Persistir dados de forma confiável

- Demonstrar boas práticas em .NET e React

# 📌 Objetivo do Projeto

- Implementar um sistema capaz de:

- Gerenciar pessoas, categorias e transações financeiras

- Aplicar corretamente as regras de negócio

- Gerar relatórios consolidados

- Persistir dados de forma confiável

- Demonstrar boas práticas em .NET e React

# Estrutura do projeto

gastos-residenciais/
│
├── src/
│   ├── GastosResidenciais.Api              # Web API (.NET)
│   ├── GastosResidenciais.Application      # Regras de negócio, serviços e DTOs
│   ├── GastosResidenciais.Domain            # Entidades e enums (Domínio)
│   └── GastosResidenciais.Infrastructure   # EF Core, DbContext e Repositórios
│
├── tests/
│   ├── GastosResidenciais.Domain.Tests
│   └── GastosResidenciais.Application.Tests
│
└── frontend/                                # React + TypeScript

# ⚙️ Tecnologias Utilizadas

- Backend

.NET 8 / 9

ASP.NET Core Web API

Entity Framework Core

MySQL

xUnit (testes unitários)

- Frontend

React

TypeScript

Vite

# Arquitetura & Boas Práticas

- Clean Architecture

- SOLID

- Repository Pattern

- Unit of Work

- DTOs

- XML Documentation

- Testes unitários com repositórios fake

# 📚 Funcionalidades Implementadas
👤 Cadastro de Pessoas

- Criar

- Listar

- Deletar

- Cascade delete: ao remover uma pessoa, suas transações também são removidas

# Campos:

- Id (gerado automaticamente)

- Nome

- Idade

# 🗂 Cadastro de Categorias

- Criar

- Listar

- Campos:

- Id

- Descrição

# Finalidade:

- Despesa

- Receita

- Ambas

# 💸 Cadastro de Transações

- Criar

- Listar

# Campos:

- Id

- Descrição

- Valor (decimal positivo)

- Tipo (Despesa ou Receita)

- Categoria

- Pessoa

# Regras de Negócio Aplicadas

- Pessoas menores de 18 anos só podem cadastrar despesas

- A categoria deve ser compatível com o tipo da transação

Ex: Receita não pode usar categoria de Despesa

# 📊 Relatórios Financeiros
- Totais por Pessoa

# Para cada pessoa:

- Total de receitas

- Total de despesas

- Saldo (receita − despesa)

- Total Geral

- Soma de todas as receitas

- Soma de todas as despesas

- Saldo geral

# 🧪 Testes Automatizados

- O projeto possui testes unitários reais, focados nas regras de negócio:

- Tipos de testes

- Validação de entidades do domínio

- Regras de negócio do TransacaoService

- Cálculo de relatórios no RelatorioService

- Estratégia

- Uso de repositórios fake em memória

- Sem dependência de banco de dados

- Testes rápidos, determinísticos e legíveis

# Para rodar os testes:

- dotnet test

# 🛠️ Como Executar o Projeto
Backend

# Configure a connection string no arquivo:

src/GastosResidenciais.Api/appsettings.Development.json


# Exemplo:

{
  "ConnectionStrings": {
    "Default": "Server=localhost;Port=3306;Database=gastos_residenciais;Uid=root;Pwd=SUA_SENHA;"
  }
}


# Execute as migrations:

dotnet ef database update \
  --project src/GastosResidenciais.Infrastructure \
  --startup-project src/GastosResidenciais.Api


# Inicie a API:

dotnet run --project src/GastosResidenciais.Api


- A API ficará disponível em:

https://localhost:7108

http://localhost:5277

# Frontend
cd frontend
npm install
npm run dev

# 📖 Documentação

- Código documentado com XML Documentation

- Comentários focados em intenção e regras de negócio

- Separação clara entre código de produção e código de teste

# 🧠 Decisões Técnicas Importantes

- Regras de negócio concentradas na camada Application

- Entidades com validações básicas (invariantes)

- Repositórios sem lógica de negócio

- Unit of Work controlando persistência

- FakeRepositories para testes isolados

- Cascade delete configurado no DbContext

- Monorepo para facilitar entrega e avaliação

# 🚀 Considerações Finais

- Este projeto foi desenvolvido com foco em:

- Clareza de código

- Manutenibilidade

- Boas práticas de mercado

- Aderência total aos requisitos do teste técnico

- Recursos adicionais poderiam ser facilmente adicionados sem impactar a estrutura atual.

# 👤 Autor

Breno Rodrigues
Desenvolvedor Full Stack
C# • .NET • React • TypeScript



