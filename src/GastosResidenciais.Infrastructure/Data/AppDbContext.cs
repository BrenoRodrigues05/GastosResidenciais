using GastosResidenciais.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GastosResidenciais.Infrastructure.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
           : base(options)
        {
        }

        public DbSet<Pessoa> Pessoas { get; set; }
        public DbSet<Categoria> Categorias { get; set; }
        public DbSet<Transacao> Transacoes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // -------------------------
            // Configuração da entidade Pessoa
            // -------------------------
            modelBuilder.Entity<Pessoa>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Nome)
                      .IsRequired()
                      .HasMaxLength(150);

                // Regra: idade deve ser um inteiro positivo
                entity.Property(e => e.Idade)
                      .IsRequired();


                // Ao deletar uma pessoa, apagar todas as transações dela.
                entity.HasMany(e => e.Transacoes)
                      .WithOne(t => t.Pessoa)
                      .HasForeignKey(t => t.PessoaId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // -------------------------
            // Configuração da entidade Categoria
            // -------------------------
            modelBuilder.Entity<Categoria>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Descricao)
                      .IsRequired()
                      .HasMaxLength(150);

                entity.Property(e => e.Finalidade)
                      .IsRequired();
            });

            // -------------------------
            // Configuração da entidade Transacao
            // -------------------------
            modelBuilder.Entity<Transacao>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Descricao)
                      .IsRequired()
                      .HasMaxLength(200);

                // Regra: Valor deve ser positivo.
                entity.Property(e => e.Valor)
                      .IsRequired()
                       .HasPrecision(18, 2);

                entity.Property(e => e.Tipo)
                      .IsRequired();

                // Relacionamento: Transação -> Categoria (N para 1)
                entity.HasOne(t => t.Categoria)
                      .WithMany()
                      .HasForeignKey(t => t.CategoriaId)
                      .OnDelete(DeleteBehavior.Restrict);
                // Restrict evita deletar categoria com transações por acidente.

                // Relacionamento: Transação -> Pessoa (N para 1)
                entity.HasOne(t => t.Pessoa)
                      .WithMany(p => p.Transacoes)
                      .HasForeignKey(t => t.PessoaId)
                      .OnDelete(DeleteBehavior.Cascade);
            });
        }


    }
}
