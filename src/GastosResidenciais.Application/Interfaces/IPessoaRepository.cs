using GastosResidenciais.Domain.Entities;

namespace GastosResidenciais.Application.Interfaces
{
    /// <summary>
    /// Define o contrato para acesso e gerenciamento de pessoas no sistema.
    /// </summary>
    /// <remarks>
    /// Pessoas representam os indivíduos associados às transações financeiras.
    /// Ao remover uma pessoa, todas as transações vinculadas a ela devem ser
    /// removidas automaticamente (cascade delete).
    /// </remarks>
    public interface IPessoaRepository
    {
        /// <summary>
        /// Recupera uma pessoa a partir do seu identificador.
        /// </summary>
        /// <param name="id">Identificador único da pessoa.</param>
        /// <returns>
        /// A pessoa correspondente ao identificador informado,
        /// ou <c>null</c> caso não seja encontrada.
        /// </returns>
        Task<Pessoa?> GetByIdAsync(int id);

        /// <summary>
        /// Retorna todas as pessoas cadastradas no sistema.
        /// </summary>
        /// <remarks>
        /// Este método pode incluir as transações associadas à pessoa,
        /// dependendo da implementação do repositório.
        /// </remarks>
        /// <returns>
        /// Uma lista contendo todas as pessoas existentes.
        /// </returns>
        Task<List<Pessoa>> ListAsync();

        /// <summary>
        /// Adiciona uma nova pessoa ao contexto de persistência.
        /// </summary>
        /// <remarks>
        /// A persistência efetiva dos dados ocorre somente após a chamada
        /// do método <see cref="IUnitOfWork.SaveChangesAsync"/>.
        /// </remarks>
        /// <param name="pessoa">Pessoa a ser adicionada.</param>
        Task AddAsync(Pessoa pessoa);

        /// <summary>
        /// Remove uma pessoa do contexto de persistência.
        /// </summary>
        /// <remarks>
        /// Ao remover uma pessoa, todas as transações associadas devem ser
        /// removidas automaticamente conforme regra de negócio.
        /// </remarks>
        /// <param name="pessoa">Pessoa a ser removida.</param>
        void Remove(Pessoa pessoa);

        /// <summary>
        /// Atualiza uma pessoa no contexto de persistência.
        /// </summary>
        /// <remarks>
        /// A persistência efetiva ocorre somente após <see cref="IUnitOfWork.SaveChangesAsync"/>.
        /// </remarks>
        /// <param name="pessoa">Pessoa a ser atualizada.</param>
        void Update(Pessoa pessoa);
    }
}
