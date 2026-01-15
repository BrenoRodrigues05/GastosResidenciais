using GastosResidenciais.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace GastosResidenciais.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RelatoriosController : ControllerBase
    {
        private readonly RelatorioService _service;
        public RelatoriosController(RelatorioService service) => _service = service;

        [HttpGet("totais-por-pessoa")]
        public async Task<IActionResult> TotaisPorPessoa()
        {
            var (pessoas, totalGeral) = await _service.GetTotaisPorPessoaAsync();
            return Ok(new { pessoas, totalGeral });
        }
    }
}
