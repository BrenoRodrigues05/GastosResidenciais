using GastosResidenciais.Domain.Enums;

namespace GastosResidenciais.Application.DTOs
{
    /// <summary>DTO para criação de categoria.</summary>
    public class CategoriaCreateDto
    {
        /// <summary>Descrição da categoria (ex.: Alimentação, Salário).</summary>
        /// <example>Alimentação</example>
        public string Descricao { get; set; } = string.Empty;

        /// <summary>Finalidade da categoria (Receita, Despesa ou Ambas).</summary>
        /// <example>Despesa</example>
        public FinalidadeCategoria Finalidade { get; set; }
    }
}
