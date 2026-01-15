using GastosResidenciais.Domain.Entities;

namespace GastosResidenciais.Domain.Tests
{
    public class PessoaTests
    {
        [Fact]
        public void Deve_Criar_Pessoa_Valida()
        {
            var p = new Pessoa("Breno", 20);
            Assert.Equal("Breno", p.Nome);
            Assert.Equal(20, p.Idade);
        }

        [Theory]
        [InlineData("")]
        [InlineData("   ")]
        public void Nao_Deve_Criar_Pessoa_Com_Nome_Invalido(string nome)
        {
            var ex = Assert.Throws<ArgumentException>(() => new Pessoa(nome, 20));
            Assert.Contains("Nome", ex.Message);
        }

        [Theory]
        [InlineData(0)]
        [InlineData(-1)]
        public void Nao_Deve_Criar_Pessoa_Com_Idade_Invalida(int idade)
        {
            var ex = Assert.Throws<ArgumentException>(() => new Pessoa("Breno", idade));
            Assert.Contains("Idade", ex.Message);
        }
    }
}
