using Microsoft.EntityFrameworkCore;
using TerminiProdajeVozila.Models;

namespace TerminiProdajeVozila.Data
{
    public class TerminiProdajeVozilaContext: DbContext
    {

        // public TerminiProdajeVozilaContext(DbContextOptions<TerminiProdajeVozilaContext> opcije): base(opcije)
        // ovo je konstruktor koji prima opcije za konfiguraciju baze podataka, nama je potreban jer nasledjujemo DbContext klasu
        // ovo je potrebno da bi koristili DbContext s mojim opcijama koje cu definirati u programu
        public TerminiProdajeVozilaContext(DbContextOptions<TerminiProdajeVozilaContext> opcije): base(opcije)
        {


        }

        public DbSet<Osoba> Osobe { get; set; }


    }
}
