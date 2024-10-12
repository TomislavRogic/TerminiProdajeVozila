using AutoMapper;
using TerminiProdajeVozila.Models;
using TerminiProdajeVozila.Models.DTO;

namespace TerminiProdajeVozila.Mapping
{
    public class TerminiProdajeVozilaMappingProfile : Profile
    {
        public TerminiProdajeVozilaMappingProfile()
        {
            
            // Mapiranje za Osoba
            CreateMap<Osoba, OsobaDTORead>();
            CreateMap<OsobaDTOInsertUpdate, Osoba>();
            
            // Mapiranje za Vozila
            CreateMap<Vozila, VozilaDTORead>();
            CreateMap<VozilaDTOInsertUpdate, Vozila>();
        }
    }
}