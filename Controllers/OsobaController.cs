﻿using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using TerminiProdajeVozila.Data;
using TerminiProdajeVozila.Models;
using TerminiProdajeVozila.Models.DTO;

namespace TerminiProdajeVozila.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class OsobaController : ControllerBase
    {
        private readonly TerminiProdajeVozilaContext _context;
        private readonly IMapper _mapper;

        public OsobaController(TerminiProdajeVozilaContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // RUTE
        // Kontroler koji vraća sve osobe iz baze podataka
        [HttpGet]
        public ActionResult<List<OsobaDTORead>> Get()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { poruka = ModelState });
            }
            try
            {
                return Ok(_mapper.Map<List<OsobaDTORead>>(_context.Osobe.ToList()));
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
        }

        // Kontroler koji vraća jednu osobu iz baze podataka
        [HttpGet("{id:int}")]
        public ActionResult<OsobaDTORead> GetById(int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { poruka = ModelState });
            }
            try
            {
                var osoba = _context.Osobe.Find(id);
                if (osoba == null)
                {
                    return NotFound(new { poruka = "Osoba ne postoji u bazi" });
                }
                return Ok(_mapper.Map<OsobaDTORead>(osoba));
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
        }

        // Kontroler za dodavanje nove osobe
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

        // Kontroler za ažuriranje postojeće osobe
        [HttpPut("{id:int}")]
        public IActionResult Put(int id, OsobaDTOInsertUpdate dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { poruka = ModelState });
            }
            try
            {
                var osoba = _context.Osobe.Find(id);
                if (osoba == null)
                {
                    return NotFound(new { poruka = "Osoba ne postoji u bazi" });
                }

                // Ažurirajte svojstva entiteta koristeći mapper
                osoba = _mapper.Map(dto, osoba);

                _context.Osobe.Update(osoba);
                _context.SaveChanges();

                return Ok(new { poruka = "Uspješno promijenjeno" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
        }

        // Kontroler za brisanje osobe
        [HttpDelete("{id:int}")]
        public IActionResult Delete(int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { poruka = ModelState });
            }
            try
            {
                var osoba = _context.Osobe.Find(id);
                if (osoba == null)
                {
                    return NotFound(new { poruka = "Osoba ne postoji u bazi" });
                }

                _context.Osobe.Remove(osoba);
                _context.SaveChanges();

                return Ok(new { poruka = "Uspješno obrisano" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }

        }
    }
}