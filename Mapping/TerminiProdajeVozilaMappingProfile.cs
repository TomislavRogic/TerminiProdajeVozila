using AutoMapper;
using Microsoft.IdentityModel.Tokens;
using TerminiProdajeVozila.Models;
using TerminiProdajeVozila.Models.DTO;

namespace TerminiProdajeVozila.Mapping
{
    public class TerminiProdajeVozilaMappingProfile : Profile
    {
        public TerminiProdajeVozilaMappingProfile()
        {

            // Mapiranje za Osoba
            CreateMap<Osoba, OsobaDTORead>()
                .ConstructUsing(entitet =>
                new OsobaDTORead(
                    entitet.Sifraosoba,
                    entitet.Email ?? "",
                    entitet.Ime ?? "",
                    entitet.Prezime ?? "",
                    PutanjaDatoteke(entitet)));

            CreateMap<OsobaDTOInsertUpdate, Osoba>();

            // Mapiranje za Vozila
            CreateMap<Vozilo, VozilaDTORead>()
            .ConstructUsing(entitet =>
                new VozilaDTORead(
                    entitet.Sifravozila,
                    entitet.Marka ?? "",
                    entitet.Opisvozila ?? "",
                    entitet.Cijena,
                    PutanjaDatoteke(entitet)));
            CreateMap<VozilaDTOInsertUpdate, Vozilo>();

            // Mapiranje za Termin
            CreateMap<Termin, TerminDTORead>()
                 .ForCtorParam("VozilaMarka", opt => opt.MapFrom(src => src.Vozilo.Marka))

                 .ForCtorParam("OsobaIme", opt => opt.MapFrom(src => src.Osoba.Ime + " " + src.Osoba.Prezime));

            //CreateMap<Termin, TerminDTOInsertUpdate>().ForMember(dest => dest.Vozila, opt => opt.MapFrom(src => src.Vozila));
            CreateMap<Termin, TerminDTOInsertUpdate>()
             .ForCtorParam("VozilaSifra", opt => opt.MapFrom(src => src.Vozilo.Sifravozila))
            .ForCtorParam("OsobeSifra", opt => opt.MapFrom(src => src.Osoba.Sifraosoba));

            CreateMap<TerminDTOInsertUpdate, Termin>();
        }

            private static string? PutanjaDatoteke(Osoba e)
            {
                try
                {
                    var ds = Path.DirectorySeparatorChar;
                string slika = Path.Combine(Directory.GetCurrentDirectory()
                    + ds + "wwwroot" + ds + "slike" + ds + "osobe" + ds + e.Sifraosoba + ".png");
                return File.Exists(slika) ? "/slike/osobe/" + e.Sifraosoba + ".png" : null;
                }
            catch
            {
                return null;
            }
            }

        private static string? PutanjaDatoteke(Vozilo f)
        {
            try
            {
                var ds = Path.DirectorySeparatorChar;
                string slika = Path.Combine(Directory.GetCurrentDirectory()
                    + ds + "wwwroot" + ds + "slike" + ds + "vozila" + ds + f.Sifravozila + ".png");
                return File.Exists(slika) ? "/slike/vozila/" + f.Sifravozila + ".png" : null;
            }
            catch
            {
                return null;
            }
        }


    }

}