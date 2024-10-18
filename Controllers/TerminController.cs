using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TerminiProdajeVozila.Models;
using TerminiProdajeVozila.Models.DTO;
using TerminiProdajeVozila.Data;
using System.Collections.Generic;

namespace TerminiProdajeVozila.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class TerminController : ControllerBase
    {
        private readonly TerminiProdajeVozilaContext _context;
        private readonly IMapper _mapper;

        public TerminController(TerminiProdajeVozilaContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public ActionResult<List<TerminDTORead>> Get()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { poruka = ModelState });
            }
            try
            {
                var termini = _context.Termini
                    .Include(t => t.Vozilo)
                    .Include(t => t.Osoba)
                    .ToList();

                var terminiDTO = _mapper.Map<List<TerminDTORead>>(termini);
                return Ok(terminiDTO);
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
        }
        [HttpGet]
        [Route("{sifra:int}")]
        public ActionResult<TerminDTORead> GetBySifra(int sifra)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { poruka = ModelState });
            }

            Termin? termin;
            try
            {
                termin = _context.Termini
                    .Include(t => t.Vozilo)
                    .Include(t => t.Osoba)
                    .FirstOrDefault(t => t.Sifratermina == sifra);
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }

            if (termin == null)
            {
                return NotFound(new { poruka = "Termin ne postoji u bazi" });
            }

            return Ok(_mapper.Map<TerminDTORead>(termin));
        }

        [HttpPost]
        public IActionResult Post(TerminDTOInsertUpdate dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { poruka = ModelState });
            }

            Vozilo? vozilo;
            Osoba? osoba;
            try
            {
                vozilo = _context.Vozila.Find(dto.Vozila);
                osoba = _context.Osobe.Find(dto.Osobe);
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }

            if (vozilo == null)
            {
                return NotFound(new { poruka = "Vozilo ne postoji u bazi" });
            }

            if (osoba == null)
            {
                return NotFound(new { poruka = "Osoba ne postoji u bazi" });
            }

            try
            {
                var termin = _mapper.Map<Termin>(dto);
                termin.Vozilo = vozilo;
                termin.Osoba = osoba;
                _context.Termini.Add(termin);
                _context.SaveChanges();
                return StatusCode(StatusCodes.Status201Created, _mapper.Map<TerminDTORead>(termin));
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
        }

        [HttpPut]
        [Route("{sifra:int}")]
        [Produces("application/json")]
        public IActionResult Put(int sifra, TerminDTOInsertUpdate dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { poruka = ModelState });
            }
            try
            {
                Termin? termin;
                try
                {
                    termin = _context.Termini
                        .Include(t => t.Vozilo)
                        .Include(t => t.Osoba)
                        .FirstOrDefault(x => x.Sifratermina == sifra);
                }
                catch (Exception ex)
                {
                    return BadRequest(new { poruka = ex.Message });
                }
                if (termin == null)
                {
                    return NotFound(new { poruka = "Termin ne postoji u bazi" });
                }

                Vozilo? vozilo;
                Osoba? osoba;
                try
                {
                    vozilo = _context.Vozila.Find(dto.Vozila);
                    osoba = _context.Osobe.Find(dto.Osobe);
                }
                catch (Exception ex)
                {
                    return BadRequest(new { poruka = ex.Message });
                }
                if (vozilo == null)
                {
                    return NotFound(new { poruka = "Vozilo ne postoji u bazi" });
                }
                if (osoba == null)
                {
                    return NotFound(new { poruka = "Osoba ne postoji u bazi" });
                }

                termin = _mapper.Map(dto, termin);
                termin.Vozilo = vozilo;
                termin.Osoba = osoba;
                _context.Termini.Update(termin);
                _context.SaveChanges();
                return Ok(new { poruka = "Uspješno promijenjeno" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
        }

        [HttpDelete]
        [Route("{sifra:int}")]
        [Produces("application/json")]
        public IActionResult Delete(int sifra)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { poruka = ModelState });
            }
            try
            {
                Termin? termin;
                try
                {
                    termin = _context.Termini.Find(sifra);
                }
                catch (Exception ex)
                {
                    return BadRequest(new { poruka = ex.Message });
                }
                if (termin == null)
                {
                    return NotFound(new { poruka = "Termin ne postoji u bazi" });
                }
                _context.Termini.Remove(termin);
                _context.SaveChanges();
                return Ok(new { poruka = "Uspješno obrisano" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
        }
        [HttpGet]
        [Route("Vozilo/{sifravozila:int}")]
        public ActionResult<List<TerminDTORead>> GetTerminiByVozilo(int sifravozila)
        {
            if (!ModelState.IsValid || sifravozila <= 0)
            {
                return BadRequest(new { poruka = ModelState });
            }
            try
            {
                var termini = _context.Termini
                    .Include(t => t.Vozilo)
                    .Include(t => t.Osoba)
                    .Where(t => t.Vozilo.Sifravozila == sifravozila)
                    .ToList();

                if (termini == null || termini.Count == 0)
                {
                    return NotFound(new { poruka = "Ne postoji termin za vozilo s šifrom " + sifravozila + " u bazi" });
                }

                var terminiDTO = _mapper.Map<List<TerminDTORead>>(termini);
                return Ok(terminiDTO);
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
        }

        [HttpPost]
        [Route("Vozilo")]
        public IActionResult PostVozilo(VozilaDTOInsertUpdate dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { poruka = ModelState });
            }

            try
            {
                var vozilo = _mapper.Map<Vozilo>(dto);
                _context.Vozila.Add(vozilo);
                _context.SaveChanges();
                return StatusCode(StatusCodes.Status201Created, _mapper.Map<VozilaDTORead>(vozilo));
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
        }

        [HttpDelete]
        [Route("Vozilo/{sifravozila:int}")]
        public IActionResult DeleteVozilo(int sifravozila)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { poruka = ModelState });
            }
            try
            {
                var vozilo = _context.Vozila
                    .Include(v => v.Termini)
                    .FirstOrDefault(v => v.Sifravozila == sifravozila);

                if (vozilo == null)
                {
                    return NotFound(new { poruka = "Ne postoji vozilo s šifrom " + sifravozila + " u bazi" });
                }

                if (vozilo.Termini.Any())
                {
                    return BadRequest(new { poruka = "Vozilo ima povezane termine i ne može se obrisati" });
                }

                _context.Vozila.Remove(vozilo);
                _context.SaveChanges();
                return Ok(new { poruka = "Uspješno obrisano vozilo iz svih termina" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
        }
    }
}
