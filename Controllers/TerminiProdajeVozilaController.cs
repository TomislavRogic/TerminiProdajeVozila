using AutoMapper;
using TerminiProdajeVozila.Data;
using TerminiProdajeVozila.Models;
using Microsoft.AspNetCore.Mvc;

namespace TerminiProdajeVozila.Controllers
{
    public abstract class TerminiProdajeVozilaController : ControllerBase
    {
        // Dependency injection
        // 1. Definiraš privatno svojstvo
        protected readonly TerminiProdajeVozilaContext _context;
        protected readonly IMapper _mapper;

        // dependecy injection
        // 2. proslijediš instancu kroz konstruktor
        public TerminiProdajeVozilaController(TerminiProdajeVozilaContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
    }
}