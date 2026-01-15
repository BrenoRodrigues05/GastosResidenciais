using GastosResidenciais.Application.Interfaces;
using GastosResidenciais.Domain.Entities;
using System.Reflection;


namespace GastosResidenciais.Infrastructure.Repositories
{
    public class FakeCategoriaRepository : ICategoriaRepository
    {
        private readonly List<Categoria> _categorias = new();

        public FakeCategoriaRepository(params Categoria[] categorias)
        {
            foreach (var c in categorias) AddWithId(c);
        }

        private void AddWithId(Categoria c)
        {
            var prop = typeof(Categoria).GetProperty("Id", BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic);
            prop!.SetValue(c, _categorias.Count + 1);
            _categorias.Add(c);
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
    }
}

