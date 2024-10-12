using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TerminiProdajeVozila.Models
{
    public class Osoba
    {

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int? Sifraosoba { get; set; }
        public string? Email { get; set; }
        public string? Ime { get; set; }
        public string? Prezime { get; set; }
        

    }
}
