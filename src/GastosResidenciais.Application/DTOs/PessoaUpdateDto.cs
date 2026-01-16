
namespace GastosResidenciais.Application.DTOs
{
    public class PessoaUpdateDto
    {
        /// <summary>Novo nome da pessoa.</summary>
        /// <example>Maria</example>
        public string Nome { get; set; } = string.Empty;

        /// <summary>Nova idade da pessoa.</summary>
        /// <example>30</example>
        public int Idade { get; set; }
    }
}
