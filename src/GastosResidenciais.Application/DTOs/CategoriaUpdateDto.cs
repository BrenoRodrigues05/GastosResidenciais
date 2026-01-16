using GastosResidenciais.Domain.Enums;

namespace GastosResidenciais.Application.DTOs
{
    public class CategoriaUpdateDto
    {
        /// <summary>Nova descrição da categoria.</summary>
        /// <example>Transporte</example>
        public string Descricao { get; set; } = string.Empty;

        /// <summary>Nova finalidade da categoria.</summary>
        /// <example>Despesa</example>
        public FinalidadeCategoria Finalidade { get; set; }
    }
}
