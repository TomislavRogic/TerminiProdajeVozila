using System.ComponentModel.DataAnnotations;

namespace TerminiProdajeVozila.Models.DTO
{
    
       public record TerminDTOInsertUpdate(

        [Required(ErrorMessage = "Vozilo obavezno")]
        [Range(1, int.MaxValue, ErrorMessage = "{0} mora biti između {1} i {2}")]
        int VozilaSifra,

        [Required(ErrorMessage = "Osoba obavezno")]
        [Range(1, int.MaxValue, ErrorMessage = "{0} mora biti između {1} i {2}")]
        int OsobeSifra,

        [Required(ErrorMessage = "Vrijeme termina obavezno")]
       DateTime? Vrijemetermina

   );
    
}
