

namespace GastosResidenciais.Application.DTOs
{
    public class PessoaListDto
    {
        /// <summary>Identificador da pessoa.</summary>
        /// <example>10</example>
        public int Id { get; set; }

        /// <summary>Nome da pessoa.</summary>
        /// <example>Ana</example>
        public string Nome { get; set; } = string.Empty;

        /// <summary>Idade da pessoa.</summary>
        /// <example>18</example>
        public int Idade { get; set; }
    }
}
