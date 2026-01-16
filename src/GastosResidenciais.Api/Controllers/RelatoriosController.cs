using GastosResidenciais.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace GastosResidenciais.Api.Controllers
{
    /// <summary>
    /// Controller responsável pela geração de relatórios financeiros do sistema.
    /// </summary>
    /// <remarks>
    /// Os relatórios consolidados permitem visualizar:
    /// - Totais de receitas, despesas e saldo por pessoa
    /// - Totais gerais considerando todas as pessoas cadastradas
    /// </remarks>
    [Route("api/[controller]")]
    [ApiController]
    public class RelatoriosController : ControllerBase
    {
        private readonly RelatorioService _service;

        /// <summary>
        /// Inicializa uma nova instância do <see cref="RelatoriosController"/>.
        /// </summary>
        /// <param name="service">Serviço responsável pelo cálculo dos relatórios financeiros.</param>
        public RelatoriosController(RelatorioService service)
        {
            _service = service;
        }

        /// <summary>
        /// Retorna os totais financeiros por pessoa e o total geral do sistema.
        /// </summary>
        /// <remarks>
        /// Para cada pessoa cadastrada, o relatório apresenta:
        /// - Total de receitas
        /// - Total de despesas
        /// - Saldo (receitas menos despesas)
        ///
        /// Ao final, é retornado também o total geral consolidado,
        /// somando todas as pessoas cadastradas.
        /// </remarks>
        /// <returns>
        /// Um objeto contendo:
        /// <list type="bullet">
        /// <item>
        /// <description><c>pessoas</c>: lista com os totais financeiros por pessoa.</description>
        /// </item>
        /// <item>
        /// <description><c>totalGeral</c>: totais consolidados do sistema.</description>
        /// </item>
        /// </list>
        /// </returns>
        /// <response code="200">Relatório gerado com sucesso.</response>
        [HttpGet("totais-por-pessoa")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> TotaisPorPessoa()
        {
            var (pessoas, totalGeral) = await _service.GetTotaisPorPessoaAsync();
            return Ok(new { pessoas, totalGeral });
        }
    }
}
