using Microsoft.AspNetCore.Mvc;
using TerminiProdajeVozila.Data;
using TerminiProdajeVozila.Models;

namespace TerminiProdajeVozila.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class OsobaController : ControllerBase
    {
        // dependency injection
        // 1. korak: dodati privatno polje _context tipa TerminiProdajeVozilaContext

        private readonly TerminiProdajeVozilaContext _context;

        // dependency injection
        // 2. korak: dodati konstruktor koji prima TerminiProdajeVozilaContext
        // proslijedis instancu kroz konstruktor
        public OsobaController(TerminiProdajeVozilaContext context)
        {
            _context = context;
        }

        // ovo je jedan kontroler koji vraca sve osobe iz baze podataka
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(_context.Osobe);
        }

        // druga ruta
        //  ovo je jedan kontroler koji vraca jednu osobu iz baze podataka
        // ova ruta koristi se kao INSERT INTO
        [HttpPost]
        public IActionResult Post(Osoba osoba)
        {

            _context.Osobe.Add(osoba);
            _context.SaveChanges();
            return StatusCode(StatusCodes.Status201Created, osoba);
        }
        // s rutom put azuriramo podatke
        [HttpPut]
        [Route("{Sifraosoba:int}")]
        [Produces("application/json")]
        public IActionResult Put(int Sifraosoba, Osoba osoba)
        {
            var osobaIzBaze = _context.Osobe.Find(Sifraosoba);
            if (osobaIzBaze == null)
            {
                return NotFound();
            }

            // Ažurirajte svojstva entiteta
            osobaIzBaze.Email = osoba.Email;
            osobaIzBaze.Ime = osoba.Ime;
            osobaIzBaze.Prezime = osoba.Prezime;

            // Spremite promjene u bazu podataka
            _context.SaveChanges();

            return Ok("Uspjesno promjenjeno");
        }

        // delete sifre
        [HttpDelete]
        [Route("{Sifraosoba:int}")]
        public IActionResult Delete(int Sifraosoba)
        {
            try
            {
                var osobaIzBaze = _context.Osobe.Find(Sifraosoba);
                if (osobaIzBaze == null)
                {
                    return NotFound();
                }

                _context.Osobe.Remove(osobaIzBaze);
                _context.SaveChanges();

                return Ok("Uspjesno obrisano!");
            }
            catch
            {
                // Log the exception if necessary
                return StatusCode(StatusCodes.Status500InternalServerError, "Greska prilikom brisanja");
            }
        }

        // za frontend nam treba jos jedna ruta koja ce vratiti jednu osobu iz baze podataka
        // get by sifraosoba

        [HttpGet]
        [Route("{Sifraosoba:int}")]
        public IActionResult GetBy(int Sifraosoba)
        {
            return Ok(_context.Osobe.Find(Sifraosoba));
        }


    }
}