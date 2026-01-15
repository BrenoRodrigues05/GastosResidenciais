using GastosResidenciais.Application.DTOs;
using GastosResidenciais.Application.Interfaces;
using GastosResidenciais.Application.Services;
using GastosResidenciais.Domain.Entities;
using GastosResidenciais.Domain.Enums;
using GastosResidenciais.Infrastructure.Repositories;

namespace GastosResidenciais.Application.Tests
{
    public class TransacaoServiceTests
    {
        [Fact]
        public async Task Menor_De_Idade_Nao_Pode_Cadastrar_Receita()
        {
            var pessoas = new FakePessoaRepository(new Pessoa("Joao", 17));
            var categorias = new FakeCategoriaRepository(new Categoria("Salario", FinalidadeCategoria.Receita));
            var transacoes = new FakeTransacaoRepository();
            var uow = new FakeUnitOfWork();

            var service = new TransacaoService(pessoas, categorias, transacoes, uow);

            var dto = new TransacaoCreateDto
            {
                Descricao = "Mesada",
                Valor = 10,
                Tipo = TipoTransacao.Receita,
                PessoaId = 1,
                CategoriaId = 1
            };

            var ex = await Assert.ThrowsAsync<InvalidOperationException>(() => service.CreateAsync(dto));
            Assert.Contains("Menor de idade", ex.Message);
            Assert.Equal(0, uow.SaveCalls);
        }

        [Fact]
        public async Task Deve_Bloquear_Categoria_Incompativel_Com_Tipo()
        {
            var pessoas = new FakePessoaRepository(new Pessoa("Maria", 20));
            var categorias = new FakeCategoriaRepository(new Categoria("Salario", FinalidadeCategoria.Receita));
            var transacoes = new FakeTransacaoRepository();
            var uow = new FakeUnitOfWork();

            var service = new TransacaoService(pessoas, categorias, transacoes, uow);

            var dto = new TransacaoCreateDto
            {
                Descricao = "Mercado",
                Valor = 200,
                Tipo = TipoTransacao.Despesa,
                PessoaId = 1,
                CategoriaId = 1 // categoria é Receita, mas transacao é Despesa
            };

            var ex = await Assert.ThrowsAsync<InvalidOperationException>(() => service.CreateAsync(dto));
            Assert.Contains("Categoria incompatível", ex.Message);
            Assert.Equal(0, uow.SaveCalls);
        }

        [Fact]
        public async Task Deve_Aceitar_Categoria_Ambas_Para_Despesa_E_Receita()
        {
            var pessoas = new FakePessoaRepository(new Pessoa("Ana", 22));
            var categorias = new FakeCategoriaRepository(new Categoria("Diversos", FinalidadeCategoria.Ambas));
            var transacoes = new FakeTransacaoRepository();
            var uow = new FakeUnitOfWork();

            var service = new TransacaoService(pessoas, categorias, transacoes, uow);

            var dto1 = new TransacaoCreateDto
            {
                Descricao = "Freela",
                Valor = 500,
                Tipo = TipoTransacao.Receita,
                PessoaId = 1,
                CategoriaId = 1
            };

            var dto2 = new TransacaoCreateDto
            {
                Descricao = "Uber",
                Valor = 50,
                Tipo = TipoTransacao.Despesa,
                PessoaId = 1,
                CategoriaId = 1
            };

            var id1 = await service.CreateAsync(dto1);
            var id2 = await service.CreateAsync(dto2);

            Assert.True(id1 >= 0);
            Assert.True(id2 >= 0);
            Assert.Equal(2, uow.SaveCalls);
            Assert.Equal(2, transacoes.Data.Count);
        }
    }
}
