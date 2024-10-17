using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace TerminiProdajeVozila.Models
{
    public class Termin
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Sifratermina { get; set; }  // Ovo odgovara stupcu Sifratermina

        [ForeignKey("Osobe")]
        
        public required Osoba Osoba { get; set; } // Ovo odgovara stupcu Osobe

        [ForeignKey("Vozila")]
        
        public required Vozilo Vozilo { get; set; } // Ovo odgovara stupcu Vozila

        [Column("Termin")]
        public required DateTime Vrijemetermina { get; set; } // Ovo odgovara stupcu Termin

        


    }
}
