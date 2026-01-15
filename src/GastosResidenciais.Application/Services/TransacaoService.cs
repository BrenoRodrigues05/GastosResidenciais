using GastosResidenciais.Application.DTOs;
using GastosResidenciais.Application.Interfaces;
using GastosResidenciais.Domain.Entities;
using GastosResidenciais.Domain.Enums;

namespace GastosResidenciais.Application.Services
{
    public class TransacaoService
    {
        private readonly IPessoaRepository _pessoas;
        private readonly ICategoriaRepository _categorias;
        private readonly ITransacaoRepository _transacoes;
        private readonly IUnitOfWork _uow;

        public TransacaoService(IPessoaRepository pessoas, ICategoriaRepository categorias, 
            ITransacaoRepository transacoes, IUnitOfWork uow)
        {
            _pessoas = pessoas;
            _categorias = categorias;
            _transacoes = transacoes;
            _uow = uow;
        }

        /// <summary>
        /// Regras:
        /// - Menor de idade (<18) só pode cadastrar DESPESA.
        /// - Categoria precisa ser compatível com Tipo (Finalidade).
        /// </summary>
        public async Task<int> CreateAsync(TransacaoCreateDto dto)
        {
            var pessoa = await _pessoas.GetByIdAsync(dto.PessoaId)
                         ?? throw new InvalidOperationException("Pessoa não encontrada.");

            var categoria = await _categorias.GetByIdAsync(dto.CategoriaId)
                            ?? throw new InvalidOperationException("Categoria não encontrada.");

            if (pessoa.Idade < 18 && dto.Tipo == TipoTransacao.Receita)
                throw new InvalidOperationException("Menor de idade só pode cadastrar despesas.");

            if (!CategoriaCompativel(dto.Tipo, categoria.Finalidade))
                throw new InvalidOperationException("Categoria incompatível com o tipo da transação.");

            var transacao = new Transacao(dto.Descricao, dto.Valor, dto.Tipo, dto.CategoriaId, dto.PessoaId);

            await _transacoes.AddAsync(transacao);
            await _uow.SaveChangesAsync();
            return transacao.Id;
        }

        private static bool CategoriaCompativel(TipoTransacao tipo, FinalidadeCategoria finalidade)
        {
            if (finalidade == FinalidadeCategoria.Ambas) return true;
            if (tipo == TipoTransacao.Despesa && finalidade == FinalidadeCategoria.Despesa) return true;
            if (tipo == TipoTransacao.Receita && finalidade == FinalidadeCategoria.Receita) return true;
            return false;
        }

        public async Task<List<TransacaoListDto>> ListAsync()
        {
            var list = await _transacoes.ListWithIncludesAsync();

            return list.Select(t => new TransacaoListDto
            {
                Id = t.Id,
                Descricao = t.Descricao,
                Valor = t.Valor,
                Tipo = t.Tipo,
                CategoriaId = t.CategoriaId,
                CategoriaDescricao = t.Categoria.Descricao,
                PessoaId = t.PessoaId,
                PessoaNome = t.Pessoa.Nome
            }).ToList();
        }
    }
}
