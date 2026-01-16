using GastosResidenciais.Domain.Enums;

namespace GastosResidenciais.Domain.Entities
{
    /// <summary>
    /// Representa uma categoria utilizada para classificar transações financeiras.
    /// </summary>
    /// <remarks>
    /// A categoria define a finalidade das transações que podem utilizá-la,
    /// podendo ser restrita a <see cref="FinalidadeCategoria.Despesa"/>,
    /// <see cref="FinalidadeCategoria.Receita"/> ou ambas.
    /// </remarks>
    public class Categoria
    {
        /// <summary>
        /// Identificador único da categoria.
        /// Gerado automaticamente pelo sistema.
        /// </summary>
        public int Id { get; private set; }

        /// <summary>
        /// Descrição da categoria.
        /// Deve ser um texto não vazio.
        /// </summary>
        public string Descricao { get; private set; } = default!;

        /// <summary>
        /// Finalidade da categoria, indicando se pode ser usada
        /// para despesas, receitas ou ambos os tipos de transação.
        /// </summary>
        public FinalidadeCategoria Finalidade { get; private set; }

        /// <summary>
        /// Construtor protegido utilizado exclusivamente pelo Entity Framework.
        /// </summary>
        private Categoria() { }

        /// <summary>
        /// Inicializa uma nova instância da classe <see cref="Categoria"/>.
        /// </summary>
        /// <param name="descricao">Descrição da categoria.</param>
        /// <param name="finalidade">Finalidade permitida para a categoria.</param>
        /// <exception cref="ArgumentException">
        /// Lançada quando a descrição é nula, vazia ou contém apenas espaços em branco.
        /// </exception>
        public Categoria(string descricao, FinalidadeCategoria finalidade)
        {
            if (string.IsNullOrWhiteSpace(descricao))
                throw new ArgumentException("Descrição é obrigatória.");

            Descricao = descricao.Trim();
            Finalidade = finalidade;
        }

        /// <summary>
        /// Atualiza os dados da categoria.
        /// </summary>
        /// <param name="descricao">Nova descrição.</param>
        /// <param name="finalidade">Nova finalidade.</param>
        /// <exception cref="ArgumentException">
        /// Lançada quando a descrição é inválida.
        /// </exception>
        public void Atualizar(string descricao, FinalidadeCategoria finalidade)
        {
            if (string.IsNullOrWhiteSpace(descricao))
                throw new ArgumentException("Descrição é obrigatória.");

            Descricao = descricao.Trim();
            Finalidade = finalidade;
        }

    }
}
