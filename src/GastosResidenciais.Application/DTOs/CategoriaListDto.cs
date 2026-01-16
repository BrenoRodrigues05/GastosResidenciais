using GastosResidenciais.Domain.Enums;

namespace GastosResidenciais.Application.DTOs
{
    public class CategoriaListDto
    {
        /// <summary>Identificador da categoria.</summary>
        /// <example>1</example>
        public int Id { get; set; }

        /// <summary>Descrição da categoria.</summary>
        /// <example>Salário</example>
        public string Descricao { get; set; } = string.Empty;

        /// <summary>Finalidade da categoria.</summary>
        /// <example>Receita</example>
        public FinalidadeCategoria Finalidade { get; set; }
    }
}
