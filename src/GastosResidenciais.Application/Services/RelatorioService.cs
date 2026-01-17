using GastosResidenciais.Application.Interfaces;
using GastosResidenciais.Domain.Enums;

namespace GastosResidenciais.Application.Services
{
    /// <summary>
    /// DTO de saída para consolidado financeiro por pessoa.
    /// </summary>
    /// <param name="PessoaId">Identificador da pessoa.</param>
    /// <param name="PessoaNome">Nome da pessoa.</param>
    /// <param name="TotalReceitas">Somatório de receitas da pessoa.</param>
    /// <param name="TotalDespesas">Somatório de despesas da pessoa.</param>
    /// <param name="Saldo">Saldo da pessoa (TotalReceitas - TotalDespesas).</param>
    public record TotaisPessoaDto(
        int PessoaId,
        string PessoaNome,
        decimal TotalReceitas,
        decimal TotalDespesas,
        decimal Saldo
    );

    /// <summary>
    /// DTO de saída para consolidado financeiro geral do sistema.
    /// </summary>
    /// <param name="TotalReceitas">Somatório de receitas de todas as pessoas.</param>
    /// <param name="TotalDespesas">Somatório de despesas de todas as pessoas.</param>
    /// <param name="Saldo">Saldo geral (TotalReceitas - TotalDespesas).</param>
    public record TotaisGeraisDto(
        decimal TotalReceitas,
        decimal TotalDespesas,
        decimal Saldo
    );

    /// <summary>
    /// Serviço responsável pela geração de relatórios financeiros do sistema.
    /// </summary>
    /// <remarks>
    /// Este serviço consolida receitas e despesas a partir das transações
    /// cadastradas, retornando totais por pessoa e total geral.
    /// </remarks>
    public class RelatorioService
    {
        private readonly IPessoaRepository _pessoas;

        /// <summary>
        /// Inicializa uma nova instância do <see cref="RelatorioService"/>.
        /// </summary>
        /// <param name="pessoas">Repositório para consulta de pessoas e suas transações.</param>
        public RelatorioService(IPessoaRepository pessoas)
        {
            _pessoas = pessoas;
        }

        /// <summary>
        /// Calcula os totais financeiros por pessoa e o total geral do sistema.
        /// </summary>
        /// <remarks>
        /// Para cada pessoa cadastrada, o método calcula:
        /// <list type="bullet">
        /// <item><description>Total de receitas (transações do tipo <see cref="TipoTransacao.Receita"/>).</description></item>
        /// <item><description>Total de despesas (transações do tipo <see cref="TipoTransacao.Despesa"/>).</description></item>
        /// <item><description>Saldo (receitas - despesas).</description></item>
        /// </list>
        ///
        /// Observação: a implementação do repositório deve garantir que as transações
        /// estejam disponíveis (ex.: via <c>Include</c>) para evitar resultados incompletos.
        /// </remarks>
        /// <returns>
        /// Uma tupla contendo:
        /// <list type="bullet">
        /// <item><description><c>Pessoas</c>: lista de totais por pessoa.</description></item>
        /// <item><description><c>TotalGeral</c>: totais consolidados do sistema.</description></item>
        /// </list>
        /// </returns>
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
