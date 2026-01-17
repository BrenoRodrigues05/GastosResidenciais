using GastosResidenciais.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace GastosResidenciais.Application.DTOs
{
    public class TransacaoCreateDto
    {
        /// <summary>Descrição da transação.</summary>
        /// <example>Compra no supermercado</example>
        [Required(ErrorMessage = "Descrição é obrigatória.")]
        [StringLength(200, ErrorMessage = "Descrição deve ter no máximo 200 caracteres.")]
        public string Descricao { get; set; } = string.Empty;

        /// <summary>Valor da transação (sempre positivo; o tipo define se é receita ou despesa).</summary>
        /// <example>120.50</example>
        [Range(0.01, double.MaxValue, ErrorMessage = "Valor deve ser maior que zero.")]
        public decimal Valor { get; set; }

        /// <summary>Tipo da transação (Receita ou Despesa).</summary>
        /// <example>Despesa</example>
        [EnumDataType(typeof(TipoTransacao),
           ErrorMessage = "Tipo inválido. Use: Receita, Despesa ou Ambas.")]
        public TipoTransacao Tipo { get; set; }

        /// <summary>ID da categoria associada.</summary>
        /// <example>3</example>
        [Range(1, int.MaxValue, ErrorMessage = "Categoria é obrigatória.")]
        public int CategoriaId { get; set; }

        /// <summary>ID da pessoa associada.</summary>
        /// <example>2</example>
        [Range(1, int.MaxValue, ErrorMessage = "Pessoa é obrigatória.")]
        public int PessoaId { get; set; }

        /// <summary>Data/hora da transação (UTC).</summary>
        /// <example>2026-01-16T12:30:00Z</example>
        public DateTime? Data { get; set; }
    }
}
