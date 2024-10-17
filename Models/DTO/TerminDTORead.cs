namespace TerminiProdajeVozila.Models.DTO
{
    public record TerminDTORead(
        int Sifratermina,
        string? VozilaMarka,
        string? OsobaIme,
        
        DateTime Vrijemetermina
    );
}
