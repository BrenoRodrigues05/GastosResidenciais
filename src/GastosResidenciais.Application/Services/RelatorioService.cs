using GastosResidenciais.Application.Interfaces;
using GastosResidenciais.Domain.Enums;

namespace GastosResidenciais.Application.Services
{
    public record TotaisPessoaDto(int PessoaId, string Nome, decimal TotalReceitas, decimal TotalDespesas, decimal Saldo);
    public record TotaisGeraisDto(decimal TotalReceitas, decimal TotalDespesas, decimal Saldo);
    public class RelatorioService
    {
        private readonly IPessoaRepository _pessoas;

        public RelatorioService(IPessoaRepository pessoas)
        {
            _pessoas = pessoas;
        }

        public async Task<(List<TotaisPessoaDto> Pessoas, TotaisGeraisDto TotalGeral)> GetTotaisPorPessoaAsync()
        {
            var pessoas = await _pessoas.ListAsync();

            var lista = new List<TotaisPessoaDto>();

            foreach (var p in pessoas)
            {
                var pessoa = await _pessoas.GetByIdAsync(p.Id) ?? p;

                var receitas = pessoa.Transacoes
                    .Where(t => t.Tipo == TipoTransacao.Receita)
                    .Sum(t => t.Valor);

                var despesas = pessoa.Transacoes
                    .Where(t => t.Tipo == TipoTransacao.Despesa)
                    .Sum(t => t.Valor);

                lista.Add(new TotaisPessoaDto(pessoa.Id, pessoa.Nome, receitas, despesas, receitas - despesas));
            }

            var totalReceitas = lista.Sum(x => x.TotalReceitas);
            var totalDespesas = lista.Sum(x => x.TotalDespesas);

            return (lista, new TotaisGeraisDto(totalReceitas, totalDespesas, totalReceitas - totalDespesas));
        }
    }
}
