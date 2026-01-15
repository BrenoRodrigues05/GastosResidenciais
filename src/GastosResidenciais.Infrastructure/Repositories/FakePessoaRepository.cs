using GastosResidenciais.Application.Interfaces;
using GastosResidenciais.Domain.Entities;
using System.Reflection;


namespace GastosResidenciais.Infrastructure.Repositories
{
    public class FakePessoaRepository : IPessoaRepository
    {
        private readonly List<Pessoa> _pessoas = new();

        public FakePessoaRepository(params Pessoa[] pessoas)
        {
            foreach (var p in pessoas) AddWithId(p);
        }

        private void AddWithId(Pessoa p)
        {
            // seta Id via reflection (porque é private set)
            var prop = typeof(Pessoa).GetProperty("Id", BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic);
            prop!.SetValue(p, _pessoas.Count + 1);
            _pessoas.Add(p);
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
            => _pessoas.Remove(pessoa);
    }
}

