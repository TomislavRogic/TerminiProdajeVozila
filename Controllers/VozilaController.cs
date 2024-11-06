using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TerminiProdajeVozila.Data;
using TerminiProdajeVozila.Models;
using TerminiProdajeVozila.Models.DTO;

namespace TerminiProdajeVozila.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class VozilaController : ControllerBase
    {
        private readonly TerminiProdajeVozilaContext _context;
        private readonly IMapper _mapper;

        public VozilaController(TerminiProdajeVozilaContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // RUTE
        // Kontroler koji vraća sva vozila iz baze podataka
        [HttpGet]
        public ActionResult<List<VozilaDTORead>> Get()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { poruka = ModelState });
            }
            try
            {
                return Ok(_mapper.Map<List<VozilaDTORead>>(_context.Vozila.ToList()));
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
        }

        // Kontroler koji vraća jedno vozilo iz baze podataka prema šifri
        [HttpGet]
        [Route("{Sifravozila:int}")]
        public ActionResult<VozilaDTORead> GetBySifravozila(int Sifravozila)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { poruka = ModelState });
            }
            Vozilo? vozilo;
            try
            {
                vozilo = _context.Vozila.Find(Sifravozila);
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
            if (vozilo == null)
            {
                return NotFound(new { poruka = "Vozilo ne postoji u bazi" });
            }
            return Ok(_mapper.Map<VozilaDTORead>(vozilo));
        }

        // Kontroler za dodavanje novog vozila
        [HttpPost]
        public IActionResult Post(VozilaDTOInsertUpdate dto)
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

        // Kontroler za ažuriranje postojećeg vozila
        [HttpPut("{Sifravozila:int}")]
        public IActionResult Put(int Sifravozila, VozilaDTOInsertUpdate dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { poruka = ModelState });
            }
            try
            {
                var vozilo = _context.Vozila.Find(Sifravozila);
                if (vozilo == null)
                {
                    return NotFound(new { poruka = "Vozilo ne postoji u bazi" });
                }

                // Ažurirajte svojstva entiteta koristeći mapper
                vozilo = _mapper.Map(dto, vozilo);

                _context.Vozila.Update(vozilo);
                _context.SaveChanges();

                return Ok(new { poruka = "Uspješno promijenjeno" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
        }

        // Kontroler za brisanje vozila
        [HttpDelete("{Sifravozila:int}")]
        public IActionResult Delete(int Sifravozila)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { poruka = ModelState });
            }
            try
            {
                var vozilo = _context.Vozila.Find(Sifravozila);
                if (vozilo == null)
                {
                    return NotFound(new { poruka = "Vozilo ne postoji u bazi" });
                }

                _context.Vozila.Remove(vozilo);
                _context.SaveChanges();

                return Ok(new { poruka = "Uspješno obrisano" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
        }

        [HttpGet]
        [Route("trazi/{uvjet}")]
        public ActionResult<List<VozilaDTORead>> TraziVozilo(string uvjet)
        {
            if (uvjet == null || uvjet.Length < 3)
            {
                return BadRequest(ModelState);
            }
            uvjet = uvjet.ToLower();
            try
            {
                IEnumerable<Vozilo> query = _context.Vozila;
                var niz = uvjet.Split(" ");
                foreach (var s in uvjet.Split(" "))
                {
                    query = query.Where(p => p.Marka.ToLower().Contains(s) || p.Opisvozila.ToLower().Contains(s));

                }
                var vozila = query.ToList();
                return Ok(_mapper.Map<List<VozilaDTORead>>(vozila));

            }
            catch (Exception e)
            {
                return BadRequest(new { poruka = e.Message });
            }
        }


        [HttpGet]
        [Route("traziStranicenje/{stranica}")]
        public IActionResult TraziVoziloStranicenje (int stranica, string uvjet = "")

        {
            var poStranici = 4;
            uvjet = uvjet.ToLower();
            try
            {
                var vozila = _context.Vozila
                    .Where(p => EF.Functions.Like(p.Marka.ToLower(), "%" + uvjet + "%") 
                    || EF.Functions.Like(p.Opisvozila.ToLower(), "%" + uvjet + "%"))
                    .Skip((poStranici * stranica) - poStranici)
                    .Take(poStranici)
                    .OrderBy(p => p.Marka)
                    .ToList();

                return Ok(_mapper.Map<List<VozilaDTORead>>(vozila));

            }
            catch (Exception e)
            {
                return BadRequest( e.Message );
            }
        }
        


    }
}