
namespace GastosResidenciais.Application.DTOs
{
    /// <summary>Resposta do relatório consolidado por pessoa.</summary>
    public class RelatorioTotaisPorPessoaResponseDto
    {
        /// <summary>Lista com os totais financeiros por pessoa.</summary>
        public List<RelatorioPessoaTotaisDto> Pessoas { get; set; } = new();

        /// <summary>Totais consolidados do sistema (todas as pessoas).</summary>
        public RelatorioTotalGeralDto TotalGeral { get; set; } = new();
    }

    /// <summary>Totais financeiros de uma pessoa no relatório.</summary>
    public class RelatorioPessoaTotaisDto
    {
        /// <summary>Identificador da pessoa.</summary>
        /// <example>2</example>
        public int PessoaId { get; set; }

        /// <summary>Nome da pessoa.</summary>
        /// <example>Breno</example>
        public string PessoaNome { get; set; } = string.Empty;

        /// <summary>Total de receitas da pessoa.</summary>
        /// <example>3000</example>
        public decimal TotalReceitas { get; set; }

        /// <summary>Total de despesas da pessoa.</summary>
        /// <example>1200</example>
        public decimal TotalDespesas { get; set; }

        /// <summary>Saldo final (receitas - despesas).</summary>
        /// <example>1800</example>
        public decimal Saldo { get; set; }
    }

    /// <summary>Totais consolidados do sistema.</summary>
    public class RelatorioTotalGeralDto
    {
        /// <summary>Total de receitas do sistema.</summary>
        /// <example>5000</example>
        public decimal TotalReceitas { get; set; }

        /// <summary>Total de despesas do sistema.</summary>
        /// <example>2000</example>
        public decimal TotalDespesas { get; set; }

        /// <summary>Saldo total do sistema.</summary>
        /// <example>3000</example>
        public decimal Saldo { get; set; }
    }
}
