using GastosResidenciais.Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GastosResidenciais.Application.DTOs
{
    public class TransacaoCreateDto
    {
        public string Descricao { get; set; } = string.Empty;
        public decimal Valor { get; set; }
        public TipoTransacao Tipo { get; set; }

        public int CategoriaId { get; set; }
        public int PessoaId { get; set; }

        public DateTime Data { get; set; } = DateTime.UtcNow;
    }
}
