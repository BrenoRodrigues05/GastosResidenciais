using GastosResidenciais.Application.DTOs;
using GastosResidenciais.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace GastosResidenciais.Api.Controllers
{
    /// <summary>
    /// Controller responsável pelo gerenciamento de categorias financeiras.
    /// </summary>
    /// <remarks>
    /// Categorias classificam transações conforme sua finalidade: despesa, receita ou ambas.
    /// </remarks>
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriasController : ControllerBase
    {
        private readonly CategoriaService _service;

        public CategoriasController(CategoriaService service)
        {
            _service = service;
        }

        /// <summary>Cria uma nova categoria.</summary>
        /// <param name="dto">Dados da categoria.</param>
        /// <response code="201">Categoria criada com sucesso.</response>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        public async Task<IActionResult> Create([FromBody] CategoriaCreateDto dto)
        {
            var id = await _service.CreateAsync(dto);

            return Ok(new
            {
                message = "Categoria criada com sucesso!"
            });
        }

        /// <summary>Lista todas as categorias cadastradas.</summary>
        /// <response code="200">Lista retornada com sucesso.</response>
        [HttpGet]
        [ProducesResponseType(typeof(List<CategoriaListDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAll()
        {
            var list = await _service.ListAsync();
            return Ok(list);
        }

        /// <summary>Retorna uma categoria pelo ID.</summary>
        /// <param name="id">ID da categoria.</param>
        /// <response code="200">Categoria encontrada.</response>
        /// <response code="404">Categoria não encontrada.</response>
        [HttpGet("{id:int}")]
        [ProducesResponseType(typeof(CategoriaListDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetById(int id)
        {
            var categoria = await _service.GetByIdAsync(id);
            return categoria is null
                ? NotFound(new { error = "Categoria não encontrada." })
                : Ok(categoria);
        }

        /// <summary>Atualiza uma categoria existente.</summary>
        /// <param name="id">ID da categoria.</param>
        /// <param name="dto">Novos dados.</param>
        /// <response code="204">Categoria atualizada com sucesso.</response>
        /// <response code="404">Categoria não encontrada.</response>
        [HttpPut("{id:int}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Update(int id, [FromBody] CategoriaUpdateDto dto)
        {
            var ok = await _service.UpdateAsync(id, dto);
            return ok ? NoContent() : NotFound(new { error = "Categoria não encontrada." });
        }

        /// <summary>Remove uma categoria existente.</summary>
        /// <param name="id">ID da categoria.</param>
        /// <response code="204">Categoria removida com sucesso.</response>
        /// <response code="404">Categoria não encontrada.</response>
        [HttpDelete("{id:int}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Delete(int id)
        {
            var ok = await _service.DeleteAsync(id);
            return ok ? NoContent() : NotFound(new { error = "Categoria não encontrada." });
        }
    }
}
