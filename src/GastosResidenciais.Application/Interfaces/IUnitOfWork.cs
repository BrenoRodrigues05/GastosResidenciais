namespace GastosResidenciais.Application.Interfaces
{
    /// <summary>
    /// Define o contrato para o padrão Unit of Work do sistema.
    /// </summary>
    /// <remarks>
    /// O Unit of Work é responsável por coordenar a persistência
    /// das alterações realizadas em múltiplos repositórios,
    /// garantindo consistência e controle transacional.
    /// </remarks>
    public interface IUnitOfWork
    {
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
        Task<int> SaveChangesAsync();
    }
}
