using GastosResidenciais.Domain.Enums;
using Xunit;

namespace GastosResidenciais.Domain.Tests.Enums
{
    public class TipoTransacaoTests
    {
        [Fact]
        public void Valores_Do_Enum_Nao_Devem_Ser_Alterados()
        {
            Assert.Equal(1, (int)TipoTransacao.Despesa);
            Assert.Equal(2, (int)TipoTransacao.Receita);
        }

        [Fact]
        public void Deve_Conter_Dois_Valores_Definidos()
        {
            var valores = Enum.GetValues(typeof(TipoTransacao));
            Assert.Equal(2, valores.Length);
        }

        [Fact]
        public void Deve_Permitir_Conversao_De_String_Para_Enum()
        {
            var valor = Enum.Parse<TipoTransacao>("Receita");
            Assert.Equal(TipoTransacao.Receita, valor);
        }
    }
}
