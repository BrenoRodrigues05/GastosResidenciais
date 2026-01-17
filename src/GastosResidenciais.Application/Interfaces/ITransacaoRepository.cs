using GastosResidenciais.Domain.Entities;

namespace GastosResidenciais.Application.Interfaces
{
    /// <summary>
    /// Define o contrato para acesso e gerenciamento de transações financeiras
    /// no sistema.
    /// </summary>
    /// <remarks>
    /// As transações representam registros financeiros do tipo
    /// receita ou despesa, vinculadas a uma pessoa e a uma categoria.
    /// </remarks>
    public interface ITransacaoRepository
    {
        /// <summary>
        /// Retorna todas as transações cadastradas no sistema,
        /// incluindo os dados relacionados de pessoa e categoria.
        /// </summary>
        /// <remarks>
        /// Este método deve retornar as entidades já carregadas
        /// com suas respectivas relações, evitando a necessidade
        /// de múltiplas consultas ao banco de dados.
        /// </remarks>
        /// <returns>
        /// Uma lista contendo todas as transações com seus dados relacionados.
        /// </returns>
        Task<List<Transacao>> ListWithIncludesAsync();

        /// <summary>
        /// Adiciona uma nova transação ao contexto de persistência.
        /// </summary>
        /// <remarks>
        /// A persistência efetiva da transação ocorre somente após
        /// a chamada do método <see cref="IUnitOfWork.SaveChangesAsync"/>.
        /// </remarks>
        /// <param name="transacao">Transação a ser adicionada.</param>
        Task AddAsync(Transacao transacao);

        /// <summary>
        /// Verifica se existe alguma transação vinculada a uma categoria.
        /// </summary>
        /// <param name="categoriaId">Id da categoria.</param>
        /// <returns>
        /// <c>true</c> se existir ao menos uma transação vinculada; caso contrário, <c>false</c>.
        /// </returns>
        Task<bool> ExistsByCategoriaIdAsync(int categoriaId);
    }
}
