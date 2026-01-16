using GastosResidenciais.Application.DTOs;
using GastosResidenciais.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace GastosResidenciais.Api.Controllers
{
    /// <summary>
    /// Controller responsável pelo gerenciamento de transações financeiras
    /// (receitas e despesas) do sistema.
    /// </summary>
    /// <remarks>
    /// Este controller expõe endpoints para:
    /// - Criação de transações
    /// - Listagem de transações com dados relacionados de pessoa e categoria
    ///
    /// As regras de negócio são aplicadas na camada de serviço
    /// (<see cref="TransacaoService"/>).
    /// </remarks>
    [Route("api/[controller]")]
    [ApiController]
    public class TransacoesController : ControllerBase
    {
        private readonly TransacaoService _service;

        /// <summary>
        /// Inicializa uma nova instância do <see cref="TransacoesController"/>.
        /// </summary>
        /// <param name="service">Serviço responsável pelas regras de negócio de transações.</param>
        public TransacoesController(TransacaoService service)
        {
            _service = service;
        }

        /// <summary>
        /// Cria uma nova transação financeira.
        /// </summary>
        /// <remarks>
        /// Regras de negócio aplicadas:
        /// <list type="bullet">
        /// <item>
        /// <description>Pessoas menores de 18 anos não podem cadastrar transações do tipo <c>Receita</c>.</description>
        /// </item>
        /// <item>
        /// <description>
        /// A categoria informada deve ser compatível com o tipo da transação
        /// (finalidade despesa, receita ou ambas).
        /// </description>
        /// </item>
        /// </list>
        /// </remarks>
        /// <param name="dto">Objeto contendo os dados necessários para criação da transação.</param>
        /// <returns>Identificador da transação criada.</returns>
        /// <response code="201">Transação criada com sucesso.</response>
        /// <response code="400">Violação de regra de negócio ou dados inválidos.</response>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Create([FromBody] TransacaoCreateDto dto)
        {
            try
            {
                var id = await _service.CreateAsync(dto);
                return CreatedAtAction(nameof(GetAll), new { }, new { id });
            }
            catch (InvalidOperationException ex)
            {
                // Regras de negócio → 400 com mensagem clara
                return BadRequest(new { error = ex.Message });
            }
        }

        /// <summary>
        /// Lista todas as transações cadastradas no sistema.
        /// </summary>
        /// <remarks>
        /// Cada transação retornada inclui:
        /// <list type="bullet">
        /// <item><description>Dados da pessoa associada</description></item>
        /// <item><description>Dados da categoria associada</description></item>
        /// </list>
        /// </remarks>
        /// <returns>Lista de transações cadastradas.</returns>
        /// <response code="200">Lista retornada com sucesso.</response>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAll()
        {
            var list = await _service.ListAsync();
            return Ok(list);
        }
    }
}
