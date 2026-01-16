using GastosResidenciais.Domain.Enums;


namespace GastosResidenciais.Application.DTOs
{
    public class TransacaoListDto
    {
        /// <summary>Identificador da transação.</summary>
        /// <example>100</example>
        public int Id { get; set; }

        /// <summary>Descrição da transação.</summary>
        /// <example>Salário</example>
        public string Descricao { get; set; } = default!;

        /// <summary>Valor da transação.</summary>
        /// <example>3000</example>
        public decimal Valor { get; set; }

        /// <summary>Tipo da transação.</summary>
        /// <example>Receita</example>
        public TipoTransacao Tipo { get; set; }

        /// <summary>ID da categoria.</summary>
        /// <example>1</example>
        public int CategoriaId { get; set; }

        /// <summary>Descrição da categoria.</summary>
        /// <example>Salário</example>
        public string CategoriaDescricao { get; set; } = default!;

        /// <summary>ID da pessoa.</summary>
        /// <example>2</example>
        public int PessoaId { get; set; }

        /// <summary>Nome da pessoa.</summary>
        /// <example>Breno</example>
        public string PessoaNome { get; set; } = default!;
    }
}
