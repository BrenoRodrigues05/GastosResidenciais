using GastosResidenciais.Application.Interfaces;
using GastosResidenciais.Domain.Entities;
using GastosResidenciais.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace GastosResidenciais.Infrastructure.Repositories
{
    /// <summary>
    /// Implementação de <see cref="IPessoaRepository"/> utilizando Entity Framework Core.
    /// </summary>
    /// <remarks>
    /// Este repositório é responsável por operações de leitura, inclusão e remoção de pessoas.
    /// As consultas incluem as transações relacionadas e suas categorias para atender os casos
    /// de uso de relatórios e regras de negócio.
    ///
    /// A persistência efetiva das alterações ocorre após a chamada de
    /// <see cref="IUnitOfWork.SaveChangesAsync"/>.
    /// </remarks>
    public class PessoaRepository : IPessoaRepository
    {
        private readonly AppDbContext _context;

        /// <summary>
        /// Inicializa uma nova instância do <see cref="PessoaRepository"/>.
        /// </summary>
        /// <param name="context">Contexto do Entity Framework utilizado para acesso aos dados.</param>
        public PessoaRepository(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Recupera uma pessoa pelo identificador, incluindo transações e categorias associadas.
        /// </summary>
        /// <remarks>
        /// Inclui:
        /// <list type="bullet">
        /// <item><description>Transações vinculadas à pessoa</description></item>
        /// <item><description>Categoria de cada transação</description></item>
        /// </list>
        /// </remarks>
        /// <param name="id">Identificador único da pessoa.</param>
        /// <returns>
        /// A pessoa encontrada com suas relações carregadas,
        /// ou <c>null</c> caso não exista registro com o identificador informado.
        /// </returns>
        public async Task<Pessoa?> GetByIdAsync(int id)
        {
            return await _context.Pessoas
                .Include(p => p.Transacoes)
                    .ThenInclude(t => t.Categoria)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        /// <summary>
        /// Retorna todas as pessoas cadastradas, incluindo transações e categorias associadas.
        /// </summary>
        /// <remarks>
        /// Este método é útil para relatórios e consultas que exigem os totais por pessoa.
        /// Caso o consumo seja somente leitura, pode ser utilizado <see cref="EntityFrameworkQueryableExtensions.AsNoTracking{TEntity}(IQueryable{TEntity})"/>
        /// para melhorar performance.
        /// </remarks>
        /// <returns>Lista de pessoas com transações e categorias carregadas.</returns>
        public async Task<List<Pessoa>> ListAsync()
        {
            return await _context.Pessoas
                .Include(p => p.Transacoes)
                    .ThenInclude(t => t.Categoria)
                .ToListAsync();
        }

        /// <summary>
        /// Adiciona uma nova pessoa ao contexto de persistência.
        /// </summary>
        /// <remarks>
        /// Este método apenas adiciona a entidade ao <see cref="DbContext"/>.
        /// Para persistir de fato no banco de dados, é necessário chamar
        /// <see cref="IUnitOfWork.SaveChangesAsync"/>.
        /// </remarks>
        /// <param name="pessoa">Pessoa a ser adicionada.</param>
        public async Task AddAsync(Pessoa pessoa)
        {
            await _context.Pessoas.AddAsync(pessoa);
        }

        /// <summary>
        /// Remove uma pessoa do contexto de persistência.
        /// </summary>
        /// <remarks>
        /// A remoção das transações vinculadas deve ocorrer conforme configuração do mapeamento
        /// (cascade delete) no <see cref="AppDbContext"/>.
        /// </remarks>
        /// <param name="pessoa">Pessoa a ser removida.</param>
        public void Remove(Pessoa pessoa)
        {
            _context.Pessoas.Remove(pessoa);
        }
    }
}
