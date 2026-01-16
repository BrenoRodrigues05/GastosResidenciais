using GastosResidenciais.Application.DTOs;
using GastosResidenciais.Application.Interfaces;
using GastosResidenciais.Domain.Entities;

namespace GastosResidenciais.Application.Services
{
    /// <summary>
    /// Serviço responsável pelas regras e casos de uso relacionados a pessoas.
    /// </summary>
    public class PessoaService
    {
        private readonly IPessoaRepository _pessoas;
        private readonly IUnitOfWork _uow;

        public PessoaService(IPessoaRepository pessoas, IUnitOfWork uow)
        {
            _pessoas = pessoas;
            _uow = uow;
        }

        /// <summary>Cria uma nova pessoa.</summary>
        public async Task<int> CreateAsync(PessoaCreateDto dto)
        {
            var pessoa = new Pessoa(dto.Nome, dto.Idade);

            await _pessoas.AddAsync(pessoa);
            await _uow.SaveChangesAsync();
            return pessoa.Id;
        }

        /// <summary>Lista pessoas em formato DTO.</summary>
        public async Task<List<PessoaListDto>> ListAsync()
        {
            var list = await _pessoas.ListAsync();

            return list.Select(p => new PessoaListDto
            {
                Id = p.Id,
                Nome = p.Nome,
                Idade = p.Idade
            }).ToList();
        }

        /// <summary>Retorna uma pessoa pelo ID em formato DTO.</summary>
        public async Task<PessoaListDto?> GetByIdAsync(int id)
        {
            var p = await _pessoas.GetByIdAsync(id);
            if (p is null) return null;

            return new PessoaListDto
            {
                Id = p.Id,
                Nome = p.Nome,
                Idade = p.Idade
            };
        }

        /// <summary>Atualiza uma pessoa existente.</summary>
        public async Task<bool> UpdateAsync(int id, PessoaUpdateDto dto)
        {
            var pessoa = await _pessoas.GetByIdAsync(id);
            if (pessoa is null) return false;

            pessoa.Atualizar(dto.Nome, dto.Idade);

            _pessoas.Update(pessoa);
            await _uow.SaveChangesAsync();
            return true;
        }

        /// <summary>Remove uma pessoa existente.</summary>
        public async Task<bool> DeleteAsync(int id)
        {
            var pessoa = await _pessoas.GetByIdAsync(id);
            if (pessoa is null) return false;

            _pessoas.Remove(pessoa);
            await _uow.SaveChangesAsync();
            return true;
        }
    }
}
