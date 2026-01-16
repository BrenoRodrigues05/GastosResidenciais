using GastosResidenciais.Application.Interfaces;
using GastosResidenciais.Domain.Entities;
using System.Reflection;

namespace GastosResidenciais.Infrastructure.Repositories
{
    /// <summary>
    /// Implementação fake de <see cref="ICategoriaRepository"/> utilizada exclusivamente para testes.
    /// </summary>
    /// <remarks>
    /// Esta implementação mantém os dados em memória e não realiza persistência real.
    /// É utilizada para testar regras de negócio e serviços sem dependência de banco de dados.
    /// </remarks>
    public class FakeCategoriaRepository : ICategoriaRepository
    {
        private readonly List<Categoria> _categorias = new();

        /// <summary>
        /// Inicializa o repositório fake com uma lista inicial de categorias.
        /// </summary>
        /// <param name="categorias">Categorias que serão adicionadas inicialmente ao repositório.</param>
        public FakeCategoriaRepository(params Categoria[] categorias)
        {
            foreach (var c in categorias)
            {
                AddWithId(c);
            }
        }

        /// <summary>
        /// Adiciona uma categoria atribuindo um identificador incremental.
        /// </summary>
        /// <remarks>
        /// Como a entidade <see cref="Categoria"/> possui o identificador com setter privado,
        /// este método utiliza reflexão para simular o comportamento do Entity Framework
        /// durante os testes.
        /// </remarks>
        /// <param name="categoria">Categoria a ser adicionada.</param>
        private void AddWithId(Categoria categoria)
        {
            var prop = typeof(Categoria).GetProperty(
                "Id",
                BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic
            );

            prop!.SetValue(categoria, _categorias.Count + 1);
            _categorias.Add(categoria);
        }

        /// <summary>
        /// Adiciona uma nova categoria ao repositório em memória.
        /// </summary>
        /// <param name="categoria">Categoria a ser adicionada.</param>
        /// <returns>Tarefa concluída.</returns>
        public Task AddAsync(Categoria categoria)
        {
            AddWithId(categoria);
            return Task.CompletedTask;
        }

        /// <summary>
        /// Recupera uma categoria pelo identificador.
        /// </summary>
        /// <param name="id">Identificador da categoria.</param>
        /// <returns>
        /// A categoria encontrada, ou <c>null</c> caso não exista registro com o identificador informado.
        /// </returns>
        public Task<Categoria?> GetByIdAsync(int id)
        {
            return Task.FromResult(_categorias.FirstOrDefault(x => x.Id == id));
        }

        /// <summary>
        /// Retorna todas as categorias armazenadas no repositório em memória.
        /// </summary>
        /// <returns>Lista de categorias.</returns>
        public Task<List<Categoria>> ListAsync()
        {
            return Task.FromResult(_categorias.ToList());
        }
    }
}
