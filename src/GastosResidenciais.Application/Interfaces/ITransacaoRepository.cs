using GastosResidenciais.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GastosResidenciais.Application.Interfaces
{
    public interface ITransacaoRepository
    {
        Task<List<Transacao>> ListWithIncludesAsync();
        Task AddAsync(Transacao transacao);
    }
}
