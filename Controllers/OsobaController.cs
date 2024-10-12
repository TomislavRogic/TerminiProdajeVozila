using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using TerminiProdajeVozila.Data;
using TerminiProdajeVozila.Models;
using TerminiProdajeVozila.Models.DTO;
using TerminiProdajeVozila.Models.DTO.TerminiProdajeVozila.DTO;

namespace TerminiProdajeVozila.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class OsobaController(TerminiProdajeVozilaContext context, IMapper mapper): TerminiProdajeVozilaController(context, mapper)
    {


        // RUTE
        // ovo je jedan kontroler koji vraca sve osobe iz baze podataka
        [HttpGet]
        public ActionResult<List<OsobaDTORead>> Get()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { poruka = ModelState });
            }
            try
            {
                return Ok(_mapper.Map<List<OsobaDTORead>>(_context.Osobe));
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
        }
        // druga ruta
        //  ovo je jedan kontroler koji vraca jednu osobu iz baze podataka
        // ova ruta koristi se kao INSERT INTO
        [HttpPost]
        public IActionResult Post(OsobaDTOInsertUpdate dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { poruka = ModelState });
            }
            try
            {
                var osoba = _mapper.Map<Osoba>(dto);
                _context.Osobe.Add(osoba);
                _context.SaveChanges();
                return StatusCode(StatusCodes.Status201Created, _mapper.Map<OsobaDTORead>(osoba));
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
           
        }
        // s rutom put azuriramo podatke
        [HttpPut]
        [Route("{Sifraosoba:int}")]
        [Produces("application/json")]
        public IActionResult Put(int Sifraosoba, OsobaDTOInsertUpdate osoba)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { poruka = ModelState });
            }
            try
            {
                Osoba? e;
                try
                {
                    e = _context.Osobe.Find(Sifraosoba);
                }
                catch (Exception ex)
                {
                    return BadRequest(new { poruka = ex.Message });
                }
                if (e == null)
                {
                    return NotFound(new { poruka = "Osoba ne postoji u bazi" });
                }

                // Ažurirajte svojstva entiteta koristeći mapper
                e = _mapper.Map(osoba, e);

                _context.Osobe.Update(e);
                _context.SaveChanges();

                return Ok(new { poruka = "Uspješno promjenjeno" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
        }
        // delete sifre
        [HttpDelete]
        [Route("{Sifraosoba:int}")]
        [Produces("application/json")]
        public IActionResult Delete(int Sifraosoba)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { poruka = ModelState });
            }
            try
            {
                Osoba? e;
                try
                {
                    e = _context.Osobe.Find(Sifraosoba);
                }
                catch (Exception ex)
                {
                    return BadRequest(new { poruka = ex.Message });
                }
                if (e == null)
                {
                    return NotFound(new { poruka = "Osoba ne postoji u bazi" });
                }

                _context.Osobe.Remove(e);
                _context.SaveChanges();

                return Ok(new { poruka = "Uspješno obrisano" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
        }

        // za frontend nam treba jos jedna ruta koja ce vratiti jednu osobu iz baze podataka
        // get by sifraosoba

        [HttpGet]
        [Route("{Sifraosoba:int}")]
        public ActionResult<OsobaDTORead> GetBy(int Sifraosoba)
        {
            if (!ModelState.IsValid)

            {
                return BadRequest(new { poruka = ModelState });
            }
            Osoba? e;
            try 
            { 
            e = _context.Osobe.Find(Sifraosoba); 
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
            if (e == null)
            {
                return NotFound(new {poruka= "Osoba ne postoji u bazi"});
            }
            return Ok(_mapper.Map<OsobaDTORead>(e));
        }


    }
}