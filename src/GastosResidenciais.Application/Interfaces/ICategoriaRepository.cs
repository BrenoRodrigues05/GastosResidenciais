using GastosResidenciais.Domain.Entities;

namespace GastosResidenciais.Application.Interfaces
{
    /// <summary>
    /// Define o contrato para acesso e gerenciamento de categorias no sistema.
    /// </summary>
    /// <remarks>
    /// As categorias são utilizadas para classificar transações financeiras
    /// (receitas e despesas) e possuem uma finalidade que restringe seu uso
    /// conforme o tipo da transação.
    /// </remarks>
    public interface ICategoriaRepository
    {
        /// <summary>
        /// Recupera uma categoria a partir do seu identificador.
        /// </summary>
        /// <param name="id">Identificador único da categoria.</param>
        /// <returns>
        /// A categoria correspondente ao identificador informado,
        /// ou <c>null</c> caso não seja encontrada.
        /// </returns>
        Task<Categoria?> GetByIdAsync(int id);

        /// <summary>
        /// Retorna todas as categorias cadastradas no sistema.
        /// </summary>
        /// <returns>
        /// Uma lista contendo todas as categorias existentes.
        /// </returns>
        Task<List<Categoria>> ListAsync();

        /// <summary>
        /// Adiciona uma nova categoria ao contexto de persistência.
        /// </summary>
        /// <remarks>
        /// A persistência efetiva dos dados ocorre somente após a chamada
        /// do método <see cref="IUnitOfWork.SaveChangesAsync"/>.
        /// </remarks>
        /// <param name="categoria">Categoria a ser adicionada.</param>
        Task AddAsync(Categoria categoria);
    }
}
