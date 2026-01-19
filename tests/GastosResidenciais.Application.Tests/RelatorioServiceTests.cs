using GastosResidenciais.Application.Services;
using GastosResidenciais.Domain.Entities;
using GastosResidenciais.Domain.Enums;
using GastosResidenciais.Infrastructure.Repositories;
using System.Reflection;

namespace GastosResidenciais.Application.Tests
{
    public class RelatorioServiceTests
    {
        [Fact]
        public async Task Deve_Calcular_Totais_Por_Pessoa_E_Total_Geral()
        {
            // Pessoas
            var p1 = new Pessoa("Breno", 25);
            var p2 = new Pessoa("Ester", 30);

            // Seta Id
            SetId(p1, 1);
            SetId(p2, 2);

            var cat = new Categoria("Geral", FinalidadeCategoria.Ambas);
            SetId(cat, 1);

            AddTransacao(p1, new Transacao("Salario", 1000m, TipoTransacao.Receita, 1, 1, null));
            AddTransacao(p1, new Transacao("Mercado", 200m, TipoTransacao.Despesa, 1, 1, null));

            AddTransacao(p2, new Transacao("Freela", 500m, TipoTransacao.Receita, 1, 2, null));
            AddTransacao(p2, new Transacao("Luz", 100m, TipoTransacao.Despesa, 1, 2, null));
            AddTransacao(p2, new Transacao("Internet", 50m, TipoTransacao.Despesa, 1, 2, null));

            var pessoasRepo = new FakePessoaRepository(p1, p2);

            var service = new RelatorioService(pessoasRepo);

            var (pessoas, totalGeral) = await service.GetTotaisPorPessoaAsync();

            Assert.Equal(2, pessoas.Count);

            var pessoa1 = pessoas.Single(x => x.PessoaId == 1);
            Assert.Equal(1000m, pessoa1.TotalReceitas);
            Assert.Equal(200m, pessoa1.TotalDespesas);
            Assert.Equal(800m, pessoa1.Saldo);

            var pessoa2 = pessoas.Single(x => x.PessoaId == 2);
            Assert.Equal(500m, pessoa2.TotalReceitas);
            Assert.Equal(150m, pessoa2.TotalDespesas);
            Assert.Equal(350m, pessoa2.Saldo);

            Assert.Equal(1500m, totalGeral.TotalReceitas);
            Assert.Equal(350m, totalGeral.TotalDespesas);
            Assert.Equal(1150m, totalGeral.Saldo);
        }

        private static void SetId<T>(T entity, int id)
        {
            var prop = typeof(T).GetProperty("Id", BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic);
            prop!.SetValue(entity, id);
        }

        private static void AddTransacao(Pessoa pessoa, Transacao t)
        {
            var prop = typeof(Pessoa).GetProperty("Transacoes", BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic);
            var list = (List<Transacao>)prop!.GetValue(pessoa)!;
            list.Add(t);
        }
    }
}
