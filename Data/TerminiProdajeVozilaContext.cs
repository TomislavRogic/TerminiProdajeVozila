using Microsoft.EntityFrameworkCore;
using TerminiProdajeVozila.Models;

namespace TerminiProdajeVozila.Data
{
    public class TerminiProdajeVozilaContext(DbContextOptions<TerminiProdajeVozilaContext> opcije) : DbContext(opcije)
    {
        public DbSet<Osoba> Osobe { get; set; }


    }
}
