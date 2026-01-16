namespace GastosResidenciais.Application.Interfaces
{
    /// <summary>
    /// Implementação fake do <see cref="IUnitOfWork"/> utilizada exclusivamente
    /// para testes automatizados.
    /// </summary>
    /// <remarks>
    /// Esta classe não realiza persistência real de dados.
    /// Seu objetivo é:
    /// <list type="bullet">
    /// <item>
    /// <description>
    /// Simular o comportamento do Unit of Work em testes de serviços.
    /// </description>
    /// </item>
    /// <item>
    /// <description>
    /// Permitir a verificação de quantas vezes o método <see cref="SaveChangesAsync"/>
    /// foi invocado durante a execução de um caso de uso.
    /// </description>
    /// </item>
    /// </list>
    /// </remarks>
    public class FakeUnitOfWork : IUnitOfWork
    {
        /// <summary>
        /// Quantidade de vezes que o método <see cref="SaveChangesAsync"/> foi chamado.
        /// </summary>
        public int SaveCalls { get; private set; }

        /// <summary>
        /// Simula a persistência das alterações realizadas durante um teste.
        /// </summary>
        /// <remarks>
        /// Este método apenas incrementa o contador <see cref="SaveCalls"/> e
        /// retorna um valor fixo para simular o sucesso da operação.
        /// </remarks>
        /// <returns>
        /// Um valor inteiro representando o número de registros afetados
        /// (valor fixo igual a 1).
        /// </returns>
        public Task<int> SaveChangesAsync()
        {
            SaveCalls++;
            return Task.FromResult(1);
        }
    }
}
