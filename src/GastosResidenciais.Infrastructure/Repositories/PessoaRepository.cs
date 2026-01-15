using GastosResidenciais.Application.Interfaces;
using GastosResidenciais.Domain.Entities;
using GastosResidenciais.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace GastosResidenciais.Infrastructure.Repositories
{
    public class PessoaRepository : IPessoaRepository
    {
        private readonly AppDbContext _context;
        public PessoaRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Pessoa?> GetByIdAsync(int id)
        {
      
            return await _context.Pessoas
                .Include(p => p.Transacoes)
                    .ThenInclude(t => t.Categoria)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<List<Pessoa>> ListAsync()
        {
            
            return await _context.Pessoas
                .Include(p => p.Transacoes)
                    .ThenInclude(t => t.Categoria)
                .ToListAsync();
        }

        public async Task AddAsync(Pessoa pessoa)
        {
            await _context.Pessoas.AddAsync(pessoa);
        }

        public void Remove(Pessoa pessoa)
        {
            _context.Pessoas.Remove(pessoa);
        }
    }

}
