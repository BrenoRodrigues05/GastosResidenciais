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

        public FakeCategoriaRepository(params Categoria[] categorias)
        {
            foreach (var c in categorias)
                AddWithId(c);
        }

        private void AddWithId(Categoria categoria)
        {
            var prop = typeof(Categoria).GetProperty(
                "Id",
                BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic
            );

            prop!.SetValue(categoria, _categorias.Count + 1);
            _categorias.Add(categoria);
        }

        public Task AddAsync(Categoria categoria)
        {
            AddWithId(categoria);
            return Task.CompletedTask;
        }

        public Task<Categoria?> GetByIdAsync(int id)
            => Task.FromResult(_categorias.FirstOrDefault(x => x.Id == id));

        public Task<List<Categoria>> ListAsync()
            => Task.FromResult(_categorias.ToList());

        /// <summary>
        /// Atualiza uma categoria existente no repositório em memória.
        /// </summary>
        /// <remarks>
        /// Como a entidade é mutável apenas via métodos de domínio (ex.: Atualizar),
        /// aqui a atualização geralmente já foi aplicada no objeto.
        /// Este método garante que a referência armazenada seja a correta.
        /// </remarks>
        public void Update(Categoria categoria)
        {
            var index = _categorias.FindIndex(x => x.Id == categoria.Id);
            if (index >= 0)
                _categorias[index] = categoria;
        }

        /// <summary>
        /// Remove uma categoria do repositório em memória.
        /// </summary>
        public void Remove(Categoria categoria)
        {
            _categorias.RemoveAll(x => x.Id == categoria.Id);
        }

        /// <summary>
        /// Verifica se já existe uma categoria cadastrada com a mesma descrição.
        /// </summary>
        /// <param name="descricao">Descrição a ser verificada.</param>
        /// <returns>
        /// <c>true</c> se já existir categoria com a mesma descrição;
        /// caso contrário, <c>false</c>.
        /// </returns>
        /// <remarks>
        /// A comparação é realizada de forma case-insensitive e desconsidera
        /// espaços em branco no início e no fim da descrição.
        /// </remarks>
        public Task<bool> ExistsByDescricaoAsync(string descricao)
        {
            var normalizada = (descricao ?? string.Empty).Trim().ToUpper();

            var existe = _categorias.Any(c =>
                c.Descricao.Trim().ToUpper() == normalizada
            );

            return Task.FromResult(existe);
        }
    }
}
