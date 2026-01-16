using GastosResidenciais.Domain.Enums;

namespace GastosResidenciais.Application.DTOs
{
    public class TransacaoCreateDto
    {
        /// <summary>Descrição da transação.</summary>
        /// <example>Compra no supermercado</example>
        public string Descricao { get; set; } = string.Empty;

        /// <summary>Valor da transação (sempre positivo; o tipo define se é receita ou despesa).</summary>
        /// <example>120.50</example>
        public decimal Valor { get; set; }

        /// <summary>Tipo da transação (Receita ou Despesa).</summary>
        /// <example>Despesa</example>
        public TipoTransacao Tipo { get; set; }

        /// <summary>ID da categoria associada.</summary>
        /// <example>3</example>
        public int CategoriaId { get; set; }

        /// <summary>ID da pessoa associada.</summary>
        /// <example>2</example>
        public int PessoaId { get; set; }

        /// <summary>Data/hora da transação (UTC).</summary>
        /// <example>2026-01-16T12:30:00Z</example>
        public DateTime Data { get; set; } = DateTime.UtcNow;
    }
}
