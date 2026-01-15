using GastosResidenciais.Domain.Entities;
using GastosResidenciais.Domain.Enums;

namespace GastosResidenciais.Domain.Tests
{
    public class CategoriaTests
    {
        [Fact]
        public void Deve_Criar_Categoria_Valida()
        {
            var c = new Categoria("Mercado", FinalidadeCategoria.Despesa);
            Assert.Equal("Mercado", c.Descricao);
            Assert.Equal(FinalidadeCategoria.Despesa, c.Finalidade);
        }

        [Theory]
        [InlineData("")]
        [InlineData("   ")]
        public void Nao_Deve_Criar_Categoria_Com_Descricao_Invalida(string desc)
        {
            var ex = Assert.Throws<ArgumentException>(() => new Categoria(desc, FinalidadeCategoria.Ambas));
            Assert.Contains("Descrição", ex.Message);
        }
    }
}

