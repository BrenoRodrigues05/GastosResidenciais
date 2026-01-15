using GastosResidenciais.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GastosResidenciais.Application.DTOs
{
    public class TransacaoListDto
    {
        public int Id { get; set; }
        public string Descricao { get; set; } = default!;
        public decimal Valor { get; set; }
        public TipoTransacao Tipo { get; set; }

        public int CategoriaId { get; set; }
        public string CategoriaDescricao { get; set; } = default!;

        public int PessoaId { get; set; }
        public string PessoaNome { get; set; } = default!;
    }
}
