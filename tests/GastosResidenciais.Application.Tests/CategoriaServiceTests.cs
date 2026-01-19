using GastosResidenciais.Application.DTOs;
using GastosResidenciais.Application.Interfaces;
using GastosResidenciais.Application.Services;
using GastosResidenciais.Domain.Entities;
using GastosResidenciais.Domain.Enums;
using GastosResidenciais.Infrastructure.Repositories;

namespace GastosResidenciais.Application.Tests
{
    public class CategoriaServiceTests
    {
        [Fact]
        public async Task Deve_Criar_Categoria_Valida()
        {
            // Arrange
            var repo = new FakeCategoriaRepository();
            var uow = new FakeUnitOfWork();
            var transacoes = new FakeTransacaoRepository();
            var service = new CategoriaService(repo, uow, transacoes);

            var dto = new CategoriaCreateDto
            {
                Descricao = "Mercado",
                Finalidade = FinalidadeCategoria.Despesa
            };

            // Act
            var id = await service.CreateAsync(dto);

            // Assert
            Assert.True(id > 0);
            Assert.Equal(1, uow.SaveCalls);

            var categoria = await repo.GetByIdAsync(id);
            Assert.NotNull(categoria);
            Assert.Equal("Mercado", categoria!.Descricao);
            Assert.Equal(FinalidadeCategoria.Despesa, categoria.Finalidade);
        }

        [Fact]
        public async Task Nao_Deve_Criar_Categoria_Com_Finalidade_Invalida()
        {
            // Arrange
            var repo = new FakeCategoriaRepository();
            var uow = new FakeUnitOfWork();
            var transacoes = new FakeTransacaoRepository();
            var service = new CategoriaService(repo, uow, transacoes);

            var dto = new CategoriaCreateDto
            {
                Descricao = "Teste",
                Finalidade = (FinalidadeCategoria)999
            };

            // Act
            var ex = await Assert.ThrowsAsync<InvalidOperationException>(() => service.CreateAsync(dto));

            // Assert
            Assert.Contains("Finalidade inválida", ex.Message);
            Assert.Equal(0, uow.SaveCalls);
        }

        [Fact]
        public async Task Nao_Deve_Criar_Categoria_Com_Descricao_Duplicada()
        {
            // Arrange
            var repo = new FakeCategoriaRepository(
                new Categoria("Mercado", FinalidadeCategoria.Despesa)
            );
            var uow = new FakeUnitOfWork();
            var transacoes = new FakeTransacaoRepository();
            var service = new CategoriaService(repo, uow, transacoes);

            var dto = new CategoriaCreateDto
            {
                Descricao = "  mercado  ", 
                Finalidade = FinalidadeCategoria.Despesa
            };

            // Act
            var ex = await Assert.ThrowsAsync<InvalidOperationException>(() => service.CreateAsync(dto));

            // Assert
            Assert.Contains("Já existe uma categoria", ex.Message);
            Assert.Equal(0, uow.SaveCalls);
        }

        [Fact]
        public async Task Deve_Listar_Categorias()
        {
            // Arrange
            var repo = new FakeCategoriaRepository(
                new Categoria("Mercado", FinalidadeCategoria.Despesa),
                new Categoria("Salário", FinalidadeCategoria.Receita)
            );
            var uow = new FakeUnitOfWork();
            var transacoes = new FakeTransacaoRepository();
            var service = new CategoriaService(repo, uow, transacoes);

            // Act
            var list = await service.ListAsync();

            // Assert
            Assert.Equal(2, list.Count);
            Assert.Contains(list, x => x.Descricao == "Mercado" && x.Finalidade == FinalidadeCategoria.Despesa);
            Assert.Contains(list, x => x.Descricao == "Salário" && x.Finalidade == FinalidadeCategoria.Receita);
        }

        [Fact]
        public async Task Deve_Retornar_Categoria_Por_Id()
        {
            // Arrange
            var repo = new FakeCategoriaRepository(
                new Categoria("Mercado", FinalidadeCategoria.Despesa)
            );
            var uow = new FakeUnitOfWork();
            var transacoes = new FakeTransacaoRepository();
            var service = new CategoriaService(repo, uow, transacoes);

            // Act
            var categoria = await service.GetByIdAsync(1);

            // Assert
            Assert.NotNull(categoria);
            Assert.Equal(1, categoria!.Id);
            Assert.Equal("Mercado", categoria.Descricao);
            Assert.Equal(FinalidadeCategoria.Despesa, categoria.Finalidade);
        }

        [Fact]
        public async Task Nao_Deve_Retornar_Categoria_Se_Nao_Existir()
        {
            // Arrange
            var repo = new FakeCategoriaRepository();
            var uow = new FakeUnitOfWork();
            var transacoes = new FakeTransacaoRepository();
            var service = new CategoriaService(repo, uow, transacoes);

            // Act
            var categoria = await service.GetByIdAsync(999);

            // Assert
            Assert.Null(categoria);
        }

        [Fact]
        public async Task Deve_Atualizar_Categoria_Existente()
        {
            // Arrange
            var repo = new FakeCategoriaRepository(
                new Categoria("Mercado", FinalidadeCategoria.Despesa)
            );
            var uow = new FakeUnitOfWork();
            var transacoes = new FakeTransacaoRepository();
            var service = new CategoriaService(repo, uow, transacoes);

            var dto = new CategoriaUpdateDto
            {
                Descricao = "Mercado 2",
                Finalidade = FinalidadeCategoria.Ambas
            };

            // Act
            var ok = await service.UpdateAsync(1, dto);

            // Assert
            Assert.True(ok);
            Assert.Equal(1, uow.SaveCalls);

            var categoria = await repo.GetByIdAsync(1);
            Assert.NotNull(categoria);
            Assert.Equal("Mercado 2", categoria!.Descricao);
            Assert.Equal(FinalidadeCategoria.Ambas, categoria.Finalidade);
        }

        [Fact]
        public async Task Nao_Deve_Atualizar_Categoria_Se_Nao_Existir()
        {
            // Arrange
            var repo = new FakeCategoriaRepository();
            var uow = new FakeUnitOfWork();
            var transacoes = new FakeTransacaoRepository();
            var service = new CategoriaService(repo, uow, transacoes);

            var dto = new CategoriaUpdateDto
            {
                Descricao = "X",
                Finalidade = FinalidadeCategoria.Despesa
            };

            // Act
            var ok = await service.UpdateAsync(999, dto);

            // Assert
            Assert.False(ok);
            Assert.Equal(0, uow.SaveCalls);
        }

        [Fact]
        public async Task Deve_Remover_Categoria_Quando_Nao_Estiver_Em_Uso()
        {
            // Arrange
            var repo = new FakeCategoriaRepository(
                new Categoria("Mercado", FinalidadeCategoria.Despesa)
            );
            var uow = new FakeUnitOfWork();
            var transacoes = new FakeTransacaoRepository(); 
            var service = new CategoriaService(repo, uow, transacoes);

            // Act
            var ok = await service.DeleteAsync(1);

            // Assert
            Assert.True(ok);
            Assert.Equal(1, uow.SaveCalls);

            var categoria = await repo.GetByIdAsync(1);
            Assert.Null(categoria);
        }

        [Fact]
        public async Task Nao_Deve_Remover_Categoria_Quando_Estiver_Em_Uso()
        {
            // Arrange
            var repo = new FakeCategoriaRepository(
                new Categoria("Mercado", FinalidadeCategoria.Despesa)
            );
            var uow = new FakeUnitOfWork();

            var transacoes = new FakeTransacaoRepository();
      
            await transacoes.AddAsync(new Transacao("Teste", 10m, TipoTransacao.Despesa, 1, 1, null));

            var service = new CategoriaService(repo, uow, transacoes);

            // Act
            var ex = await Assert.ThrowsAsync<InvalidOperationException>(() => service.DeleteAsync(1));

            // Assert
            Assert.Contains("Não é possível excluir", ex.Message);
            Assert.Equal(0, uow.SaveCalls);

            var categoria = await repo.GetByIdAsync(1);
            Assert.NotNull(categoria); 
        }

        [Fact]
        public async Task Nao_Deve_Remover_Categoria_Se_Nao_Existir()
        {
            // Arrange
            var repo = new FakeCategoriaRepository();
            var uow = new FakeUnitOfWork();
            var transacoes = new FakeTransacaoRepository();
            var service = new CategoriaService(repo, uow, transacoes);

            // Act
            var ok = await service.DeleteAsync(999);

            // Assert
            Assert.False(ok);
            Assert.Equal(0, uow.SaveCalls);
        }
    }
}
