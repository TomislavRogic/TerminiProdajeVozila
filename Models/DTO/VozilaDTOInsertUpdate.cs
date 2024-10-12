using System.ComponentModel.DataAnnotations;

namespace TerminiProdajeVozila.Models.DTO
{
        public record VozilaDTOInsertUpdate(
        [Required(ErrorMessage = "Marka je obavezna")]
        [StringLength(100, MinimumLength = 1, ErrorMessage = "Marka mora biti između 1 i 100 znakova")]
        string Marka,

        [StringLength(100, ErrorMessage = "Opis vozila mora biti do 100 znakova")]
        string? Opisvozila,

        [Required(ErrorMessage = "Cijena je obavezna")]
        [Range(0, 999999.999, ErrorMessage = "Cijena mora biti validna decimalna vrijednost")]
        decimal Cijena
    );
}
