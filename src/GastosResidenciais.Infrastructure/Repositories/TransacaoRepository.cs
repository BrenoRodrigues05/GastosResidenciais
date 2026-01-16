using GastosResidenciais.Application.Interfaces;
using GastosResidenciais.Domain.Entities;
using GastosResidenciais.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace GastosResidenciais.Infrastructure.Repositories
{
    /// <summary>
    /// Implementação de <see cref="ITransacaoRepository"/> utilizando Entity Framework Core.
    /// </summary>
    /// <remarks>
    /// Este repositório é responsável pela inclusão e consulta de transações financeiras,
    /// garantindo o carregamento das entidades relacionadas necessárias para
    /// apresentação e relatórios.
    ///
    /// A persistência efetiva das alterações ocorre após a chamada de
    /// <see cref="IUnitOfWork.SaveChangesAsync"/>.
    /// </remarks>
    public class TransacaoRepository : ITransacaoRepository
    {
        private readonly AppDbContext _context;

        /// <summary>
        /// Inicializa uma nova instância do <see cref="TransacaoRepository"/>.
        /// </summary>
        /// <param name="context">Contexto do Entity Framework utilizado para acesso aos dados.</param>
        public TransacaoRepository(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Retorna todas as transações cadastradas, incluindo pessoa e categoria associadas.
        /// </summary>
        /// <remarks>
        /// Inclui:
        /// <list type="bullet">
        /// <item><description>Pessoa associada à transação</description></item>
        /// <item><description>Categoria associada à transação</description></item>
        /// </list>
        ///
        /// As transações são ordenadas de forma decrescente pelo identificador,
        /// exibindo primeiro as mais recentes.
        /// </remarks>
        /// <returns>Lista de transações com relacionamentos carregados.</returns>
        public async Task<List<Transacao>> ListWithIncludesAsync()
        {
            return await _context.Transacoes
                .Include(t => t.Pessoa)
                .Include(t => t.Categoria)
                .OrderByDescending(t => t.Id)
                .ToListAsync();
        }

        /// <summary>
        /// Adiciona uma nova transação ao contexto de persistência.
        /// </summary>
        /// <remarks>
        /// Este método apenas adiciona a entidade ao <see cref="DbContext"/>.
        /// Para persistir de fato no banco de dados, é necessário chamar
        /// <see cref="IUnitOfWork.SaveChangesAsync"/>.
        /// </remarks>
        /// <param name="transacao">Transação a ser adicionada.</param>
        public async Task AddAsync(Transacao transacao)
        {
            await _context.Transacoes.AddAsync(transacao);
        }
    }
}
