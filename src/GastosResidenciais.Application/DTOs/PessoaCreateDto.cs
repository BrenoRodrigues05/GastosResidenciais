
using System.ComponentModel.DataAnnotations;

namespace GastosResidenciais.Application.DTOs
{
    public class PessoaCreateDto
    {
        /// <summary>Nome da pessoa.</summary>
        /// <example>Breno</example>
        [RegularExpression(@"^(?=.*[A-Za-zÀ-ÿ]).+$",
        ErrorMessage = "Nome deve conter pelo menos uma letra.")]
        public string Nome { get; set; } = string.Empty;

        /// <summary>Idade da pessoa.</summary>
        /// <example>25</example>
        public int Idade { get; set; }
    }
}
