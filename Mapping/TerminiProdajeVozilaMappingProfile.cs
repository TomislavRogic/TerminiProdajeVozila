using AutoMapper;
using TerminiProdajeVozila.Models.DTO;
using TerminiProdajeVozila.Models;
using TerminiProdajeVozila.Models.DTO.TerminiProdajeVozila.DTO;





namespace TerminiProdajeVozila.Mapping
{
    public class TerminiProdajeVozilaMappingProfile : Profile
    {
        public TerminiProdajeVozilaMappingProfile()
        {
            // Kreiramo mapiranja: izvor, odredište
            CreateMap<Osoba, OsobaDTORead>();
            CreateMap<OsobaDTOInsertUpdate, Osoba>();
        }
    }
}

