using GastosResidenciais.Application.DTOs;
using GastosResidenciais.Application.Interfaces;
using GastosResidenciais.Domain.Entities;
using GastosResidenciais.Domain.Enums;

namespace GastosResidenciais.Application.Services
{
    /// <summary>
    /// Serviço responsável pelas regras de negócio e casos de uso relacionados a transações.
    /// </summary>
    /// <remarks>
    /// Este serviço centraliza validações e regras do domínio antes de persistir a transação.
    /// Principais regras implementadas:
    /// <list type="bullet">
    /// <item>
    /// <description>Pessoas menores de 18 anos não podem cadastrar transações do tipo <see cref="TipoTransacao.Receita"/>.</description>
    /// </item>
    /// <item>
    /// <description>A categoria informada deve ser compatível com o tipo da transação (finalidade despesa/receita/ambas).</description>
    /// </item>
    /// </list>
    /// </remarks>
    public class TransacaoService
    {
        private readonly IPessoaRepository _pessoas;
        private readonly ICategoriaRepository _categorias;
        private readonly ITransacaoRepository _transacoes;
        private readonly IUnitOfWork _uow;

        /// <summary>
        /// Inicializa uma nova instância do <see cref="TransacaoService"/>.
        /// </summary>
        /// <param name="pessoas">Repositório de pessoas para validação de existência e regras por idade.</param>
        /// <param name="categorias">Repositório de categorias para validação de existência e compatibilidade.</param>
        /// <param name="transacoes">Repositório de transações para inclusão e consultas.</param>
        /// <param name="uow">Unidade de trabalho responsável por persistir as alterações.</param>
        public TransacaoService(
            IPessoaRepository pessoas,
            ICategoriaRepository categorias,
            ITransacaoRepository transacoes,
            IUnitOfWork uow)
        {
            _pessoas = pessoas;
            _categorias = categorias;
            _transacoes = transacoes;
            _uow = uow;
        }

        /// <summary>
        /// Cria uma nova transação aplicando as regras de negócio do sistema.
        /// </summary>
        /// <remarks>
        /// Regras aplicadas:
        /// <list type="bullet">
        /// <item>
        /// <description>
        /// Pessoas menores de 18 anos não podem cadastrar transações do tipo <see cref="TipoTransacao.Receita"/>.
        /// </description>
        /// </item>
        /// <item>
        /// <description>
        /// A categoria deve ser compatível com o tipo da transação:
        /// <c>Despesa</c> só pode usar categoria com finalidade <c>Despesa</c> ou <c>Ambas</c>;
        /// <c>Receita</c> só pode usar categoria com finalidade <c>Receita</c> ou <c>Ambas</c>.
        /// </description>
        /// </item>
        /// </list>
        /// </remarks>
        /// <param name="dto">Dados necessários para criação da transação.</param>
        /// <returns>Identificador da transação criada.</returns>
        /// <exception cref="InvalidOperationException">
        /// Lançada quando:
        /// <list type="bullet">
        /// <item><description>A pessoa informada não existe.</description></item>
        /// <item><description>A categoria informada não existe.</description></item>
        /// <item><description>Uma regra de negócio for violada (idade ou compatibilidade de categoria).</description></item>
        /// </list>
        /// </exception>
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

        /// <summary>
        /// Verifica se a finalidade da categoria é compatível com o tipo da transação.
        /// </summary>
        /// <param name="tipo">Tipo da transação (receita ou despesa).</param>
        /// <param name="finalidade">Finalidade da categoria (receita, despesa ou ambas).</param>
        /// <returns>
        /// <c>true</c> se a categoria puder ser utilizada para o tipo de transação informado;
        /// caso contrário, <c>false</c>.
        /// </returns>
        private static bool CategoriaCompativel(TipoTransacao tipo, FinalidadeCategoria finalidade)
        {
            if (finalidade == FinalidadeCategoria.Ambas) return true;
            if (tipo == TipoTransacao.Despesa && finalidade == FinalidadeCategoria.Despesa) return true;
            if (tipo == TipoTransacao.Receita && finalidade == FinalidadeCategoria.Receita) return true;
            return false;
        }

        /// <summary>
        /// Lista todas as transações cadastradas, retornando DTOs com dados de pessoa e categoria.
        /// </summary>
        /// <remarks>
        /// Este método depende de uma consulta que inclua os relacionamentos
        /// (pessoa e categoria) para montar corretamente o <see cref="TransacaoListDto"/>.
        /// </remarks>
        /// <returns>Lista de transações em formato de DTO.</returns>
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
