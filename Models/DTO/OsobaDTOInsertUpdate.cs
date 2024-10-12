using System.ComponentModel.DataAnnotations;

namespace TerminiProdajeVozila.Models.DTO
{
    public record OsobaDTOInsertUpdate(
        [Required(ErrorMessage = "Ime je obavezno")]
        string? Ime,

        [Required(ErrorMessage = "Prezime je obavezno")]
        string? Prezime,

        [Required(ErrorMessage = "Email obavezno")]
        [EmailAddress(ErrorMessage ="Email nije dobrog formata")]
        string? Email

        
    );
}