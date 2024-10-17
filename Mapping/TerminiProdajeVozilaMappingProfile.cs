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
            CreateMap<Vozilo, VozilaDTORead>();
            CreateMap<VozilaDTOInsertUpdate, Vozilo>();

            // Mapiranje za Termin
            CreateMap<Termin, TerminDTORead>()
                 .ForCtorParam("VozilaMarka", opt => opt.MapFrom(src => src.Vozilo.Marka))
            
                 .ForCtorParam("OsobaIme", opt => opt.MapFrom(src => src.Osoba.Ime + " " + src.Osoba.Prezime));
           
            //CreateMap<Termin, TerminDTOInsertUpdate>().ForMember(dest => dest.Vozila, opt => opt.MapFrom(src => src.Vozila));
            CreateMap<TerminDTOInsertUpdate, Termin>();
        }
    }
}