using GastosResidenciais.Domain.Entities;
using GastosResidenciais.Domain.Enums;

namespace GastosResidenciais.Domain.Tests
{
    public class TransacaoTests
    {
        [Fact]
        public void Deve_Criar_Transacao_Valida()
        {
            var t = new Transacao(
                "Conta de luz",
                100.50m,
                TipoTransacao.Despesa,
                1,
                1,
                null  
            );

            Assert.Equal("Conta de luz", t.Descricao);
            Assert.Equal(100.50m, t.Valor);
            Assert.Equal(TipoTransacao.Despesa, t.Tipo);
            Assert.Equal(1, t.CategoriaId);
            Assert.Equal(1, t.PessoaId);
        }

        [Theory]
        [InlineData(0)]
        [InlineData(-10)]
        public void Nao_Deve_Criar_Transacao_Com_Valor_Invalido(decimal valor)
        {
            var ex = Assert.Throws<ArgumentException>(() =>
                new Transacao(
                    "X",
                    valor,
                    TipoTransacao.Despesa,
                    1,
                    1,
                    null   
                )
            );

            Assert.Contains("Valor", ex.Message);
        }
    }
}
