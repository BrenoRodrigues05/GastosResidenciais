using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GastosResidenciais.Application.DTOs
{
    public class PessoaCreateDto
    {
        public string Nome { get; set; } = string.Empty;
        public int Idade { get; set; }
    }
}
