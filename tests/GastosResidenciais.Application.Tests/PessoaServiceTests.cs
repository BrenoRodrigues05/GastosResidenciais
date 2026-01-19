using GastosResidenciais.Application.DTOs;
using GastosResidenciais.Application.Interfaces;
using GastosResidenciais.Application.Services;
using GastosResidenciais.Domain.Entities;
using GastosResidenciais.Infrastructure.Repositories;

namespace GastosResidenciais.Application.Tests
{
    public class PessoaServiceTests
    {
        [Fact]
        public async Task Deve_Criar_Pessoa_Valida()
        {
            // Arrange
            var repo = new FakePessoaRepository();
            var uow = new FakeUnitOfWork();
            var service = new PessoaService(repo, uow);

            var dto = new PessoaCreateDto
            {
                Nome = "Breno",
                Idade = 25
            };

            // Act
            var id = await service.CreateAsync(dto);

            // Assert
            Assert.True(id > 0);
            Assert.Equal(1, uow.SaveCalls);

            var pessoa = await repo.GetByIdAsync(id);
            Assert.NotNull(pessoa);
            Assert.Equal("Breno", pessoa!.Nome);
            Assert.Equal(25, pessoa.Idade);
        }

        [Fact]
        public async Task Deve_Listar_Pessoas()
        {
            // Arrange
            var p1 = new Pessoa("Breno", 25);
            var p2 = new Pessoa("Ester", 30);

            var repo = new FakePessoaRepository(p1, p2);
            var uow = new FakeUnitOfWork();
            var service = new PessoaService(repo, uow);

            // Act
            var list = await service.ListAsync();

            // Assert
            Assert.Equal(2, list.Count);
            Assert.Contains(list, x => x.Nome == "Breno" && x.Idade == 25);
            Assert.Contains(list, x => x.Nome == "Ester" && x.Idade == 30);
        }

        [Fact]
        public async Task Deve_Retornar_Pessoa_Por_Id()
        {
            // Arrange
            var p1 = new Pessoa("Breno", 25);

            var repo = new FakePessoaRepository(p1); // vira Id=1 no fake
            var uow = new FakeUnitOfWork();
            var service = new PessoaService(repo, uow);

            // Act
            var pessoa = await service.GetByIdAsync(1);

            // Assert
            Assert.NotNull(pessoa);
            Assert.Equal(1, pessoa!.Id);
            Assert.Equal("Breno", pessoa.Nome);
            Assert.Equal(25, pessoa.Idade);
        }

        [Fact]
        public async Task Nao_Deve_Retornar_Pessoa_Se_Nao_Existir()
        {
            // Arrange
            var repo = new FakePessoaRepository();
            var uow = new FakeUnitOfWork();
            var service = new PessoaService(repo, uow);

            // Act
            var pessoa = await service.GetByIdAsync(999);

            // Assert
            Assert.Null(pessoa);
        }

        [Fact]
        public async Task Deve_Atualizar_Pessoa_Existente()
        {
            // Arrange
            var p1 = new Pessoa("Breno", 25);

            var repo = new FakePessoaRepository(p1); // Id=1
            var uow = new FakeUnitOfWork();
            var service = new PessoaService(repo, uow);

            var dto = new PessoaUpdateDto
            {
                Nome = "Breno Atualizado",
                Idade = 26
            };

            // Act
            var ok = await service.UpdateAsync(1, dto);

            // Assert
            Assert.True(ok);
            Assert.Equal(1, uow.SaveCalls);

            var pessoa = await repo.GetByIdAsync(1);
            Assert.NotNull(pessoa);
            Assert.Equal("Breno Atualizado", pessoa!.Nome);
            Assert.Equal(26, pessoa.Idade);
        }

        [Fact]
        public async Task Nao_Deve_Atualizar_Pessoa_Se_Nao_Existir()
        {
            // Arrange
            var repo = new FakePessoaRepository();
            var uow = new FakeUnitOfWork();
            var service = new PessoaService(repo, uow);

            var dto = new PessoaUpdateDto
            {
                Nome = "X",
                Idade = 20
            };

            // Act
            var ok = await service.UpdateAsync(999, dto);

            // Assert
            Assert.False(ok);
            Assert.Equal(0, uow.SaveCalls);
        }

        [Fact]
        public async Task Deve_Remover_Pessoa_Existente()
        {
            // Arrange
            var p1 = new Pessoa("Breno", 25);

            var repo = new FakePessoaRepository(p1); // Id=1
            var uow = new FakeUnitOfWork();
            var service = new PessoaService(repo, uow);

            // Act
            var ok = await service.DeleteAsync(1);

            // Assert
            Assert.True(ok);
            Assert.Equal(1, uow.SaveCalls);

            var pessoa = await repo.GetByIdAsync(1);
            Assert.Null(pessoa);
        }

        [Fact]
        public async Task Nao_Deve_Remover_Pessoa_Se_Nao_Existir()
        {
            // Arrange
            var repo = new FakePessoaRepository();
            var uow = new FakeUnitOfWork();
            var service = new PessoaService(repo, uow);

            // Act
            var ok = await service.DeleteAsync(999);

            // Assert
            Assert.False(ok);
            Assert.Equal(0, uow.SaveCalls);
        }
    }
}
