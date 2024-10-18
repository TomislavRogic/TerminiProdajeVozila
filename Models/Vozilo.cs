using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace TerminiProdajeVozila.Models
{
    public class Vozilo
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int? Sifravozila { get; set; }
        public string? Marka { get; set; }
        public string? Opisvozila { get; set; }
        public decimal? Cijena { get; set; }

        public ICollection<Termin> Termini { get; set; } // Dodano navigacijsko svojstvo

    }
}
