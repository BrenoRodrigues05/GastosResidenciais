using GastosResidenciais.Domain.Enums;

namespace GastosResidenciais.Application.DTOs
{
    public class TransacaoUpdateDto
    {
        /// <summary>Nova descrição da transação.</summary>
        /// <example>Conta de luz</example>
        public string Descricao { get; set; } = string.Empty;

        /// <summary>Novo valor da transação.</summary>
        /// <example>210.75</example>
        public decimal Valor { get; set; }

        /// <summary>Novo tipo da transação.</summary>
        /// <example>Despesa</example>
        public TipoTransacao Tipo { get; set; }

        /// <summary>Novo ID de categoria.</summary>
        /// <example>4</example>
        public int CategoriaId { get; set; }

        /// <summary>Novo ID de pessoa.</summary>
        /// <example>1</example>
        public int PessoaId { get; set; }

        /// <summary>Nova data/hora da transação (UTC).</summary>
        /// <example>2026-01-10T09:00:00Z</example>
        public DateTime Data { get; set; }
    }
}
