using GastosResidenciais.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GastosResidenciais.Domain.Entities
{
    public class Categoria
    {
        public int Id { get; private set; }
        public string Descricao { get; private set; } = default!;
        public FinalidadeCategoria Finalidade { get; private set; }

        private Categoria() { }

        public Categoria(string descricao, FinalidadeCategoria finalidade)
        {
            if (string.IsNullOrWhiteSpace(descricao)) throw new ArgumentException("Descrição é obrigatória.");
            Descricao = descricao.Trim();
            Finalidade = finalidade;
        }
    }
}
