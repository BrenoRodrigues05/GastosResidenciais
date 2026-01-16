namespace GastosResidenciais.Domain.Entities
{
    /// <summary>
    /// Representa uma pessoa cadastrada no sistema de controle de gastos residenciais.
    /// </summary>
    /// <remarks>
    /// Uma pessoa pode possuir múltiplas transações financeiras (receitas e despesas).
    /// Pessoas menores de 18 anos possuem restrições quanto ao cadastro de receitas,
    /// conforme regras de negócio aplicadas na camada de aplicação.
    /// </remarks>
    public class Pessoa
    {
        /// <summary>
        /// Identificador único da pessoa.
        /// Gerado automaticamente pelo sistema.
        /// </summary>
        public int Id { get; private set; }

        /// <summary>
        /// Nome da pessoa.
        /// Deve ser um texto não vazio.
        /// </summary>
        public string Nome { get; private set; } = default!;

        /// <summary>
        /// Idade da pessoa.
        /// Deve ser um número inteiro positivo.
        /// </summary>
        public int Idade { get; private set; }

        /// <summary>
        /// Coleção de transações associadas à pessoa.
        /// </summary>
        public List<Transacao> Transacoes { get; private set; } = new();

        /// <summary>
        /// Construtor protegido utilizado exclusivamente pelo Entity Framework.
        /// </summary>
        private Pessoa() { }

        /// <summary>
        /// Inicializa uma nova instância da classe <see cref="Pessoa"/>.
        /// </summary>
        /// <param name="nome">Nome da pessoa.</param>
        /// <param name="idade">Idade da pessoa.</param>
        /// <exception cref="ArgumentException">
        /// Lançada quando:
        /// <list type="bullet">
        /// <item><description>O nome é nulo, vazio ou contém apenas espaços.</description></item>
        /// <item><description>A idade é menor ou igual a zero.</description></item>
        /// </list>
        /// </exception>
        public Pessoa(string nome, int idade)
        {
            if (string.IsNullOrWhiteSpace(nome))
                throw new ArgumentException("Nome é obrigatório.");

            if (idade <= 0)
                throw new ArgumentException("Idade deve ser um inteiro positivo.");

            Nome = nome.Trim();
            Idade = idade;
        }

        /// <summary>
        /// Atualiza os dados da pessoa.
        /// </summary>
        /// <param name="nome">Novo nome.</param>
        /// <param name="idade">Nova idade.</param>
        /// <exception cref="ArgumentException">
        /// Lançada quando nome/idade forem inválidos.
        /// </exception>
        public void Atualizar(string nome, int idade)
        {
            if (string.IsNullOrWhiteSpace(nome))
                throw new ArgumentException("Nome é obrigatório.");

            if (idade <= 0)
                throw new ArgumentException("Idade deve ser um inteiro positivo.");

            Nome = nome.Trim();
            Idade = idade;
        }
    }
}
