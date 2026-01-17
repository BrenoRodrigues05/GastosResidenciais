using GastosResidenciais.Application.Interfaces;
using GastosResidenciais.Domain.Entities;

namespace GastosResidenciais.Infrastructure.Repositories
{
    /// <summary>
    /// Implementação fake de <see cref="ITransacaoRepository"/> utilizada exclusivamente para testes.
    /// </summary>
    /// <remarks>
    /// Este repositório mantém as transações em memória e simula
    /// operações básicas de inclusão e listagem com relacionamentos,
    /// sem dependência de banco de dados ou Entity Framework.
    /// </remarks>
    public class FakeTransacaoRepository : ITransacaoRepository
    {
        private readonly List<Transacao> _transacoes = new();

        /// <summary>
        /// Adiciona uma nova transação ao repositório em memória.
        /// </summary>
        /// <param name="transacao">Transação a ser adicionada.</param>
        /// <returns>Tarefa concluída.</returns>
        public Task AddAsync(Transacao transacao)
        {
            _transacoes.Add(transacao);
            return Task.CompletedTask;
        }

        /// <summary>
        /// Retorna todas as transações armazenadas no repositório em memória.
        /// </summary>
        /// <remarks>
        /// Este método simula uma consulta com <c>Include</c>,
        /// assumindo que as entidades relacionadas já estão carregadas
        /// no contexto de teste.
        /// </remarks>
        /// <returns>Lista de transações.</returns>
        public Task<List<Transacao>> ListWithIncludesAsync()
        {
            return Task.FromResult(_transacoes.ToList());
        }

        /// <summary>
        /// Verifica se existe alguma transação vinculada a uma categoria específica.
        /// </summary>
        /// <param name="categoriaId">Identificador da categoria.</param>
        /// <returns>
        /// <c>true</c> se houver ao menos uma transação associada à categoria;
        /// caso contrário, <c>false</c>.
        /// </returns>
        public Task<bool> ExistsByCategoriaIdAsync(int categoriaId)
        {
            var existe = _transacoes.Any(t => t.CategoriaId == categoriaId);
            return Task.FromResult(existe);
        }

        /// <summary>
        /// Exposição somente leitura das transações armazenadas,
        /// útil para validações em testes unitários.
        /// </summary>
        public IReadOnlyList<Transacao> Data => _transacoes;
    }
}
