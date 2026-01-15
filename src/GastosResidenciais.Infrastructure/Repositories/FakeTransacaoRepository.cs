using GastosResidenciais.Application.Interfaces;
using GastosResidenciais.Domain.Entities;

namespace GastosResidenciais.Infrastructure.Repositories
{
    public class FakeTransacaoRepository : ITransacaoRepository
    {
        private readonly List<Transacao> _transacoes = new();

        public Task AddAsync(Transacao transacao)
        {
            _transacoes.Add(transacao);
            return Task.CompletedTask;
        }

        public Task<List<Transacao>> ListWithIncludesAsync()
            => Task.FromResult(_transacoes.ToList());

        public IReadOnlyList<Transacao> Data => _transacoes;
    }

}
