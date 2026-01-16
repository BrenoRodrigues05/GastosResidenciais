
namespace GastosResidenciais.Application.DTOs
{
    /// <summary>Resposta padrão de erro.</summary>
    public class ApiErrorDto
    {
        /// <summary>Mensagem do erro.</summary>
        /// <example>Categoria incompatível com o tipo da transação.</example>
        public string Error { get; set; } = string.Empty;
    }
}
