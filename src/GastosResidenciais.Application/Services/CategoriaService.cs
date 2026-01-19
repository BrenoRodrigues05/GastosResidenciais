using GastosResidenciais.Application.DTOs;
using GastosResidenciais.Application.Interfaces;
using GastosResidenciais.Domain.Entities;
using GastosResidenciais.Domain.Enums;

namespace GastosResidenciais.Application.Services
{
    /// <summary>
    /// Serviço responsável pelas regras e casos de uso relacionados a categorias.
    /// </summary>
    public class CategoriaService
    {
        private readonly ICategoriaRepository _categorias;
        private readonly IUnitOfWork _uow;
        private readonly ITransacaoRepository _transacoes;

        public CategoriaService(ICategoriaRepository categorias, IUnitOfWork uow, ITransacaoRepository transacoes)
        {
            _categorias = categorias;
            _uow = uow;
            _transacoes = transacoes;
        }

        /// <summary>
        /// Cria uma nova categoria.
        /// </summary>
        public async Task<int> CreateAsync(CategoriaCreateDto dto)
        {
            if (!Enum.IsDefined(typeof(FinalidadeCategoria), dto.Finalidade))
                throw new InvalidOperationException("Finalidade inválida. Valores permitidos: 1-Despesa, 2-Receita, 3-Ambas.");

            if (dto is null)
                throw new ArgumentNullException(nameof(dto));

            var descricao = (dto.Descricao ?? string.Empty).Trim();

            var existe = await _categorias.ExistsByDescricaoAsync(descricao);
            if (existe)
                throw new InvalidOperationException("Já existe uma categoria com essa descrição.");

            var categoria = new Categoria(descricao, dto.Finalidade);

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

            var emUso = await _transacoes.ExistsByCategoriaIdAsync(id);
            if (emUso)
                throw new InvalidOperationException(
                    "Não é possível excluir esta categoria porque existem transações vinculadas a ela."
                );

            _categorias.Remove(categoria);
            await _uow.SaveChangesAsync();

            return true;
        }
    }
}
