
namespace GastosResidenciais.Application.Interfaces
{
    public class FakeUnitOfWork : IUnitOfWork
    {
        public int SaveCalls { get; private set; }

        public Task<int> SaveChangesAsync()
        {
            SaveCalls++;
            return Task.FromResult(1);
        }
    }
}
