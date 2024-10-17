using Microsoft.EntityFrameworkCore;
using TerminiProdajeVozila.Models;

namespace TerminiProdajeVozila.Data
{
    public class TerminiProdajeVozilaContext : DbContext
    {
        public TerminiProdajeVozilaContext(DbContextOptions<TerminiProdajeVozilaContext> opcije) : base(opcije)
        {
        }

        public DbSet<Osoba> Osobe { get; set; }
        public DbSet<Vozilo> Vozila { get; set; }
        public DbSet<Termin> Termini { get; set; }

        // mapping veze 1:n
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Veza 1:n između Termin i Vozila
            modelBuilder.Entity<Termin>()
                .HasOne(g => g.Vozilo);

            modelBuilder.Entity<Termin>()
                .HasOne(g => g.Osoba);
        }
    }
}