using GastosResidenciais.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GastosResidenciais.Domain.Entities
{
    public class Transacao
    {
        public int Id { get; private set; }
        public string Descricao { get; private set; } = default!;
        public decimal Valor { get; private set; }
        public TipoTransacao Tipo { get; private set; }

        public int CategoriaId { get; private set; }
        public Categoria Categoria { get; private set; } = default!;

        public int PessoaId { get; private set; }
        public Pessoa Pessoa { get; private set; } = default!;

        private Transacao() { }

        public Transacao(string descricao, decimal valor, TipoTransacao tipo, int categoriaId, int pessoaId)
        {
            if (string.IsNullOrWhiteSpace(descricao)) throw new ArgumentException("Descrição é obrigatória.");
            if (valor <= 0) throw new ArgumentException("Valor deve ser positivo.");
            if (categoriaId <= 0) throw new ArgumentException("CategoriaId inválido.");
            if (pessoaId <= 0) throw new ArgumentException("PessoaId inválido.");

            Descricao = descricao.Trim();
            Valor = valor;
            Tipo = tipo;
            CategoriaId = categoriaId;
            PessoaId = pessoaId;
        }
    }
}
