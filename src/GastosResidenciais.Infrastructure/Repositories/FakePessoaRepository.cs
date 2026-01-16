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

        public FakePessoaRepository(params Pessoa[] pessoas)
        {
            foreach (var p in pessoas)
                AddWithId(p);
        }

        private void AddWithId(Pessoa pessoa)
        {
            var prop = typeof(Pessoa).GetProperty(
                "Id",
                BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic
            );

            prop!.SetValue(pessoa, _pessoas.Count + 1);
            _pessoas.Add(pessoa);
        }

        public Task AddAsync(Pessoa pessoa)
        {
            AddWithId(pessoa);
            return Task.CompletedTask;
        }

        public Task<Pessoa?> GetByIdAsync(int id)
            => Task.FromResult(_pessoas.FirstOrDefault(x => x.Id == id));

        public Task<List<Pessoa>> ListAsync()
            => Task.FromResult(_pessoas.ToList());

        public void Remove(Pessoa pessoa)
        {
            // Remover por Id é mais seguro do que por referência
            _pessoas.RemoveAll(x => x.Id == pessoa.Id);
        }

        /// <summary>
        /// Atualiza uma pessoa existente no repositório em memória.
        /// </summary>
        /// <remarks>
        /// Normalmente o objeto já está atualizado (ex.: via pessoa.Atualizar()),
        /// mas mantemos este método para ficar 100% igual ao contrato do repositório real.
        /// </remarks>
        public void Update(Pessoa pessoa)
        {
            var index = _pessoas.FindIndex(x => x.Id == pessoa.Id);
            if (index >= 0)
                _pessoas[index] = pessoa;
        }
    }
}
