using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GastosResidenciais.Domain.Entities
{
    public class Pessoa
    {
        public int Id { get; private set; }
        public string Nome { get; private set; } = default!;
        public int Idade { get; private set; }

        public List<Transacao> Transacoes { get; private set; } = new();

        private Pessoa() { } 

        public Pessoa(string nome, int idade)
        {
            if (string.IsNullOrWhiteSpace(nome)) throw new ArgumentException("Nome é obrigatório.");
            if (idade <= 0) throw new ArgumentException("Idade deve ser um inteiro positivo.");

            Nome = nome.Trim();
            Idade = idade;
        }
    }
}
