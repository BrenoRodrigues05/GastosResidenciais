using GastosResidenciais.Application.DTOs;
using GastosResidenciais.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace GastosResidenciais.Api.Controllers
{
    /// <summary>
    /// Gerencia transações financeiras (receitas e despesas).
    /// </summary>
    /// <remarks>
    /// Regras principais:
    /// - Menores de 18 anos não podem cadastrar <c>Receita</c>.
    /// - A categoria deve ser compatível com o tipo da transação.
    /// </remarks>
    [Route("api/[controller]")]
    [ApiController]
    public class TransacoesController : ControllerBase
    {
        private readonly TransacaoService _service;

        public TransacoesController(TransacaoService service) => _service = service;

        /// <summary>Cria uma nova transação.</summary>
        /// <param name="dto">Dados da transação.</param>
        /// <returns>ID da transação criada.</returns>
        /// <response code="201">Criada com sucesso.</response>
        /// <response code="400">Dados inválidos ou regra de negócio violada.</response>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(ApiErrorDto), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Create([FromBody] TransacaoCreateDto dto)
        {
            try
            {
                var id = await _service.CreateAsync(dto);
                return Ok(new
                {
                    message = "Transação criada com sucesso!"
                });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new ApiErrorDto { Error = ex.Message });
            }
        }

        /// <summary>Lista todas as transações.</summary>
        /// <remarks>Retorna transações com dados básicos de pessoa e categoria.</remarks>
        /// <response code="200">Lista retornada com sucesso.</response>
        [HttpGet]
        [ProducesResponseType(typeof(List<TransacaoListDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAll()
        {
            var list = await _service.ListAsync();
            return Ok(list);
        }
    }
}
