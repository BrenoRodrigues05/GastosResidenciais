using GastosResidenciais.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GastosResidenciais.Application.Interfaces
{
    public interface IPessoaRepository
    {
        Task<Pessoa?> GetByIdAsync(int id);
        Task<List<Pessoa>> ListAsync();
        Task AddAsync(Pessoa pessoa);
        void Remove(Pessoa pessoa);
    }
}
