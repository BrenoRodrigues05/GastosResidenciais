using GastosResidenciais.Application.DTOs;
using GastosResidenciais.Application.Interfaces;
using GastosResidenciais.Domain.Entities;

namespace GastosResidenciais.Application.Services
{
    /// <summary>
    /// Serviço responsável pelas regras e casos de uso relacionados a categorias.
    /// </summary>
    public class CategoriaService
    {
        private readonly ICategoriaRepository _categorias;
        private readonly IUnitOfWork _uow;

        public CategoriaService(ICategoriaRepository categorias, IUnitOfWork uow)
        {
            _categorias = categorias;
            _uow = uow;
        }

        /// <summary>
        /// Cria uma nova categoria.
        /// </summary>
        public async Task<int> CreateAsync(CategoriaCreateDto dto)
        {
            var categoria = new Categoria(dto.Descricao, dto.Finalidade);

            await _categorias.AddAsync(categoria);
            await _uow.SaveChangesAsync();

            return categoria.Id;
        }

        /// <summary>
        /// Lista todas as categorias em formato DTO.
        /// </summary>
        public async Task<List<CategoriaListDto>> ListAsync()
        {
            var list = await _categorias.ListAsync();

            return list.Select(c => new CategoriaListDto
            {
                Id = c.Id,
                Descricao = c.Descricao,
                Finalidade = c.Finalidade
            }).ToList();
        }

        /// <summary>
        /// Retorna uma categoria pelo ID em formato DTO.
        /// </summary>
        public async Task<CategoriaListDto?> GetByIdAsync(int id)
        {
            var c = await _categorias.GetByIdAsync(id);
            if (c is null) return null;

            return new CategoriaListDto
            {
                Id = c.Id,
                Descricao = c.Descricao,
                Finalidade = c.Finalidade
            };
        }

        /// <summary>
        /// Atualiza uma categoria existente.
        /// </summary>
        /// <returns>
        /// true se atualizou; false se não encontrou.
        /// </returns>
        public async Task<bool> UpdateAsync(int id, CategoriaUpdateDto dto)
        {
            var categoria = await _categorias.GetByIdAsync(id);
            if (categoria is null)
                return false;

            // Atualização via método da entidade (respeitando encapsulamento)
            categoria.Atualizar(dto.Descricao, dto.Finalidade);

            _categorias.Update(categoria);
            await _uow.SaveChangesAsync();

            return true;
        }

        /// <summary>
        /// Remove uma categoria existente.
        /// </summary>
        public async Task<bool> DeleteAsync(int id)
        {
            var categoria = await _categorias.GetByIdAsync(id);
            if (categoria is null)
                return false;

            _categorias.Remove(categoria);
            await _uow.SaveChangesAsync();

            return true;
        }
    }
}
