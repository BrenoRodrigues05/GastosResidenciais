using GastosResidenciais.Application.Interfaces;
using GastosResidenciais.Domain.Entities;
using GastosResidenciais.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace GastosResidenciais.Infrastructure.Repositories
{
    /// <summary>
    /// Implementação de <see cref="ICategoriaRepository"/> utilizando Entity Framework Core.
    /// </summary>
    /// <remarks>
    /// Este repositório é responsável por operações de leitura e inclusão de categorias.
    /// A persistência efetiva das alterações ocorre após a chamada de
    /// <see cref="IUnitOfWork.SaveChangesAsync"/>.
    /// </remarks>
    public class CategoriaRepository : ICategoriaRepository
    {
        private readonly AppDbContext _context;

        /// <summary>
        /// Inicializa uma nova instância do <see cref="CategoriaRepository"/>.
        /// </summary>
        /// <param name="context">Contexto do Entity Framework utilizado para acesso aos dados.</param>
        public CategoriaRepository(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Recupera uma categoria a partir do seu identificador.
        /// </summary>
        /// <param name="id">Identificador único da categoria.</param>
        /// <returns>
        /// A categoria encontrada, ou <c>null</c> caso não exista registro com o identificador informado.
        /// </returns>
        public async Task<Categoria?> GetByIdAsync(int id)
        {
            return await _context.Categorias
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        /// <summary>
        /// Retorna todas as categorias cadastradas.
        /// </summary>
        /// <returns>Lista de categorias existentes no sistema.</returns>
        public async Task<List<Categoria>> ListAsync()
        {
            return await _context.Categorias
                .ToListAsync();
        }

        /// <summary>
        /// Adiciona uma nova categoria ao contexto de persistência.
        /// </summary>
        /// <remarks>
        /// Este método apenas adiciona a entidade ao <see cref="DbContext"/>.
        /// Para persistir de fato no banco de dados, é necessário chamar
        /// <see cref="IUnitOfWork.SaveChangesAsync"/>.
        /// </remarks>
        /// <param name="categoria">Categoria a ser adicionada.</param>
        public async Task AddAsync(Categoria categoria)
        {
            await _context.Categorias.AddAsync(categoria);
        }

        /// <summary>
        /// Atualiza uma categoria existente.
        /// </summary>
        /// <remarks>
        /// Este método apenas atualiza a entidade referente no <see cref="DbContext"/>.
        /// Para persistir de fato no banco de dados, é necessário chamar
        /// <see cref="IUnitOfWork.SaveChangesAsync"/>.
        /// </remarks>
        /// <param name="categoria">Categoria a ser adicionada.</param>
        public void Update(Categoria categoria)
        {
             _context.Categorias.Update(categoria);
        }

        /// <summary>
        /// Remove uma categoria existente.
        /// </summary>
        /// <remarks>
        /// Este método remove  uma a entidade existente no <see cref="DbContext"/>.
        /// Para persistir de fato no banco de dados, é necessário chamar
        /// <see cref="IUnitOfWork.SaveChangesAsync"/>.
        /// </remarks>
        /// <param name="categoria">Categoria a ser adicionada.</param>
        public void Remove(Categoria categoria)
        {
            _context.Categorias.Remove(categoria);
        }
    }
}
