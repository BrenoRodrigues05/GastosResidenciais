

namespace GastosResidenciais.Domain.Enums
{
    /// <summary>Define a finalidade de uma categoria financeira.</summary>
    public enum FinalidadeCategoria
    {
        /// <summary>Categoria usada apenas para despesas.</summary>
        Despesa = 1,

        /// <summary>Categoria usada apenas para receitas.</summary>
        Receita = 2,

        /// <summary>Categoria pode ser usada tanto para despesas quanto para receitas.</summary>
        Ambas = 3
    }
}
