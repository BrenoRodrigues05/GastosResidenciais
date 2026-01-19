using GastosResidenciais.Domain.Enums;
using Xunit;

namespace GastosResidenciais.Domain.Tests.Enums
{
    public class FinalidadeCategoriaTests
    {
        [Fact]
        public void Valores_Do_Enum_Nao_Devem_Ser_Alterados()
        {
            Assert.Equal(1, (int)FinalidadeCategoria.Despesa);
            Assert.Equal(2, (int)FinalidadeCategoria.Receita);
            Assert.Equal(3, (int)FinalidadeCategoria.Ambas);
        }

        [Fact]
        public void Deve_Conter_Tres_Valores_Definidos()
        {
            var valores = Enum.GetValues(typeof(FinalidadeCategoria));
            Assert.Equal(3, valores.Length);
        }

        [Fact]
        public void Deve_Permitir_Conversao_De_String_Para_Enum()
        {
            var valor = Enum.Parse<FinalidadeCategoria>("Despesa");
            Assert.Equal(FinalidadeCategoria.Despesa, valor);
        }
    }
}
