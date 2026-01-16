using GastosResidenciais.Application.DTOs;
using GastosResidenciais.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace GastosResidenciais.Api.Controllers
{
    /// <summary>
    /// Controller responsável pelo gerenciamento de pessoas do sistema.
    /// </summary>
    /// <remarks>
    /// Pessoas são utilizadas para vincular transações financeiras e gerar relatórios consolidados.
    /// </remarks>
    [Route("api/[controller]")]
    [ApiController]
    public class PessoasController : ControllerBase
    {
        private readonly PessoaService _service;

        public PessoasController(PessoaService service)
        {
            _service = service;
        }

        /// <summary>Cria uma nova pessoa.</summary>
        /// <param name="dto">Dados da pessoa.</param>
        /// <response code="201">Pessoa criada com sucesso.</response>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        public async Task<IActionResult> Create([FromBody] PessoaCreateDto dto)
        {
            var id = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id }, new { id });
        }

        /// <summary>Lista todas as pessoas cadastradas.</summary>
        /// <response code="200">Lista retornada com sucesso.</response>
        [HttpGet]
        [ProducesResponseType(typeof(List<PessoaListDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAll()
        {
            var list = await _service.ListAsync();
            return Ok(list);
        }

        /// <summary>Retorna uma pessoa pelo ID.</summary>
        /// <param name="id">ID da pessoa.</param>
        /// <response code="200">Pessoa encontrada.</response>
        /// <response code="404">Pessoa não encontrada.</response>
        [HttpGet("{id:int}")]
        [ProducesResponseType(typeof(PessoaListDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetById(int id)
        {
            var pessoa = await _service.GetByIdAsync(id);
            return pessoa is null
                ? NotFound(new { error = "Pessoa não encontrada." })
                : Ok(pessoa);
        }

        /// <summary>Atualiza uma pessoa existente.</summary>
        /// <param name="id">ID da pessoa.</param>
        /// <param name="dto">Novos dados.</param>
        /// <response code="204">Pessoa atualizada com sucesso.</response>
        /// <response code="404">Pessoa não encontrada.</response>
        [HttpPut("{id:int}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Update(int id, [FromBody] PessoaUpdateDto dto)
        {
            var ok = await _service.UpdateAsync(id, dto);
            return ok ? NoContent() : NotFound(new { error = "Pessoa não encontrada." });
        }

        /// <summary>Remove uma pessoa existente.</summary>
        /// <param name="id">ID da pessoa.</param>
        /// <response code="204">Pessoa removida com sucesso.</response>
        /// <response code="404">Pessoa não encontrada.</response>
        [HttpDelete("{id:int}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Delete(int id)
        {
            var ok = await _service.DeleteAsync(id);
            return ok ? NoContent() : NotFound(new { error = "Pessoa não encontrada." });
        }
    }
}
