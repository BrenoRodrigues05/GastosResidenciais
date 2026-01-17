using GastosResidenciais.Domain.Enums;

namespace GastosResidenciais.Domain.Entities
{
    /// <summary>
    /// Representa uma transação financeira associada a uma pessoa e a uma categoria.
    /// </summary>
    /// <remarks>
    /// Uma transação pode ser do tipo <see cref="TipoTransacao.Receita"/> ou
    /// <see cref="TipoTransacao.Despesa"/> e deve respeitar as regras de
    /// compatibilidade entre tipo e finalidade da categoria,
    /// bem como as regras relacionadas à idade da pessoa.
    /// </remarks>
    public class Transacao
    {
        /// <summary>
        /// Identificador único da transação.
        /// Gerado automaticamente pelo sistema.
        /// </summary>
        public int Id { get; private set; }

        /// <summary>
        /// Descrição da transação.
        /// Deve ser um texto não vazio.
        /// </summary>
        public string Descricao { get; private set; } = default!;

        /// <summary>
        /// Valor monetário da transação.
        /// Deve ser um número decimal positivo.
        /// </summary>
        public decimal Valor { get; private set; }

        /// <summary>
        /// Tipo da transação financeira (Receita ou Despesa).
        /// </summary>
        public TipoTransacao Tipo { get; private set; }

        /// <summary>
        /// Identificador da categoria associada à transação.
        /// </summary>
        public int CategoriaId { get; private set; }

        /// <summary>
        /// Categoria associada à transação.
        /// </summary>
        public Categoria Categoria { get; private set; } = default!;

        /// <summary>
        /// Identificador da pessoa associada à transação.
        /// </summary>
        public int PessoaId { get; private set; }

        /// <summary>
        /// Pessoa associada à transação.
        /// </summary>
        public Pessoa Pessoa { get; private set; } = default!;

        /// <summary>
        /// Data e hora da transação
        /// </summary>
        public DateTime? Data { get; private set; }

        /// <summary>
        /// Construtor protegido utilizado exclusivamente pelo Entity Framework.
        /// </summary>
        private Transacao() { }

        /// <summary>
        /// Inicializa uma nova instância da classe <see cref="Transacao"/>.
        /// </summary>
        /// <param name="descricao">Descrição da transação.</param>
        /// <param name="valor">Valor monetário da transação.</param>
        /// <param name="tipo">Tipo da transação (receita ou despesa).</param>
        /// <param name="categoriaId">Identificador da categoria associada.</param>
        /// <param name="pessoaId">Identificador da pessoa associada.</param>
        /// <param name="Data">Identificador da data associada à transação.</param>
        /// <exception cref="ArgumentException">
        /// Lançada quando:
        /// <list type="bullet">
        /// <item><description>A descrição é nula, vazia ou contém apenas espaços.</description></item>
        /// <item><description>O valor é menor ou igual a zero.</description></item>
        /// <item><description>O identificador da categoria é inválido.</description></item>
        /// <item><description>O identificador da pessoa é inválido.</description></item>
        /// </list>
        /// </exception>
        public Transacao(string descricao, decimal valor, TipoTransacao tipo, int categoriaId, int pessoaId, DateTime? Data)
        {
            if (string.IsNullOrWhiteSpace(descricao))
                throw new ArgumentException("Descrição é obrigatória.");

            if (valor <= 0)
                throw new ArgumentException("Valor deve ser positivo.");

            if (categoriaId <= 0)
                throw new ArgumentException("CategoriaId inválido.");

            if (pessoaId <= 0)
                throw new ArgumentException("PessoaId inválido.");

            Descricao = descricao.Trim();
            Valor = valor;
            Tipo = tipo;
            CategoriaId = categoriaId;
            PessoaId = pessoaId;
            this.Data = Data;
        }
    }
}
