using GastosResidenciais.Application.Interfaces;
using GastosResidenciais.Infrastructure.Data;

namespace GastosResidenciais.Infrastructure.Repositories
{
    /// <summary>
    /// Implementação do padrão Unit of Work utilizando Entity Framework Core.
    /// </summary>
    /// <remarks>
    /// O Unit of Work coordena a persistência das alterações realizadas
    /// nos repositórios, garantindo que todas as operações sejam
    /// confirmadas de forma consistente no banco de dados.
    /// </remarks>
    public class UnitOfWork : IUnitOfWork
    {
        private readonly AppDbContext _context;

        /// <summary>
        /// Inicializa uma nova instância do <see cref="UnitOfWork"/>.
        /// </summary>
        /// <param name="context">Contexto do Entity Framework responsável pela persistência.</param>
        public UnitOfWork(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Persiste todas as alterações pendentes no contexto de dados.
        /// </summary>
        /// <remarks>
        /// Este método deve ser chamado após operações de inclusão,
        /// alteração ou remoção realizadas nos repositórios.
        /// </remarks>
        /// <returns>
        /// Um valor inteiro representando o número de registros
        /// afetados pela operação de persistência.
        /// </returns>
        public Task<int> SaveChangesAsync()
            => _context.SaveChangesAsync();
    }
}
