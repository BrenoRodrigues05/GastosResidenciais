using GastosResidenciais.Application.Interfaces;
using GastosResidenciais.Domain.Entities;
using System.Reflection;

namespace GastosResidenciais.Infrastructure.Repositories
{
    /// <summary>
    /// Implementação fake de <see cref="IPessoaRepository"/> utilizada exclusivamente para testes.
    /// </summary>
    /// <remarks>
    /// Esta implementação mantém os dados em memória e simula o comportamento
    /// de um repositório real, permitindo testes das regras de negócio
    /// sem dependência de banco de dados ou Entity Framework.
    /// </remarks>
    public class FakePessoaRepository : IPessoaRepository
    {
        private readonly List<Pessoa> _pessoas = new();

        /// <summary>
        /// Inicializa o repositório fake com uma lista inicial de pessoas.
        /// </summary>
        /// <param name="pessoas">Pessoas que serão adicionadas inicialmente ao repositório.</param>
        public FakePessoaRepository(params Pessoa[] pessoas)
        {
            foreach (var p in pessoas)
            {
                AddWithId(p);
            }
        }

        /// <summary>
        /// Adiciona uma pessoa atribuindo um identificador incremental.
        /// </summary>
        /// <remarks>
        /// Como a entidade <see cref="Pessoa"/> possui o identificador com setter privado,
        /// este método utiliza reflexão para simular o comportamento do Entity Framework
        /// durante os testes.
        /// </remarks>
        /// <param name="pessoa">Pessoa a ser adicionada.</param>
        private void AddWithId(Pessoa pessoa)
        {
            var prop = typeof(Pessoa).GetProperty(
                "Id",
                BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic
            );

            prop!.SetValue(pessoa, _pessoas.Count + 1);
            _pessoas.Add(pessoa);
        }

        /// <summary>
        /// Adiciona uma nova pessoa ao repositório em memória.
        /// </summary>
        /// <param name="pessoa">Pessoa a ser adicionada.</param>
        /// <returns>Tarefa concluída.</returns>
        public Task AddAsync(Pessoa pessoa)
        {
            AddWithId(pessoa);
            return Task.CompletedTask;
        }

        /// <summary>
        /// Recupera uma pessoa pelo identificador.
        /// </summary>
        /// <param name="id">Identificador da pessoa.</param>
        /// <returns>
        /// A pessoa encontrada, ou <c>null</c> caso não exista registro com o identificador informado.
        /// </returns>
        public Task<Pessoa?> GetByIdAsync(int id)
        {
            return Task.FromResult(_pessoas.FirstOrDefault(x => x.Id == id));
        }

        /// <summary>
        /// Retorna todas as pessoas armazenadas no repositório em memória.
        /// </summary>
        /// <returns>Lista de pessoas.</returns>
        public Task<List<Pessoa>> ListAsync()
        {
            return Task.FromResult(_pessoas.ToList());
        }

        /// <summary>
        /// Remove uma pessoa do repositório em memória.
        /// </summary>
        /// <param name="pessoa">Pessoa a ser removida.</param>
        public void Remove(Pessoa pessoa)
        {
            _pessoas.Remove(pessoa);
        }
    }
}
