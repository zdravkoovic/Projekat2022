using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Model;

namespace Projekat.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MasineController : ControllerBase
    {
        public GradjevinskiPContext Context { get; set; }
        public MasineController(GradjevinskiPContext context)
        {
            Context = context;
        }
        [Route("Brojevi/{id}")]
        [HttpGet]
        public int GetBroj(int id)
        {
            var broj = Context.Masine.Where(p=>p.Projekat.ID == id).Count();
            return broj;
        }
        [Route("Masine/{id}")]
        [HttpGet]
        public async Task<ActionResult> Masine(int id)
        {
            var masine = Context.Masine
                .Include(p=>p.Projekat)
                .Where(p=>p.Projekat.ID == id);

            return Ok(await masine.Select(p=>new{
                p.ID,
                p.Naziv,
                p.Potrosnja,
                p.CenaGoriva
            }).ToListAsync());
        }
        [Route("SkloniMasinu/{IDMasine}")]
        [HttpDelete]
        public async Task<ActionResult> UkloniMasinu(int IDMasine)
        {
            try
            {
                var masina = await Context.Masine.FindAsync(IDMasine);
                Context.Masine.Remove(masina);
                await Context.SaveChangesAsync();
                return Ok("Uspesno uklonjena masina!");
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        [Route("DodajMasinu/{IDProjekta}/{naziv}/{potrosnja}/{cena}")]
        [HttpPost]
        public async Task<ActionResult> DodajMasinu(int IDProjekta, string naziv, int potrosnja, int cena)
        {
            if(string.IsNullOrWhiteSpace(naziv) || naziv.Length > 50)
            {
                return BadRequest("Greska u nazivu!");
            }
            if(potrosnja < 1 || potrosnja > 30)
            {
                return BadRequest("Greska u potrosnji!");
            }
            if(cena < 50 || cena > 300)
            {
                return BadRequest("Greska u ceni!");
            }
            var projekat = await Context.Projekti.FindAsync(IDProjekta);
            Masine masina = new Masine
            {
                Naziv = naziv,
                Potrosnja = potrosnja,
                CenaGoriva = cena,
                Projekat = projekat
            };
            try
            {
                Context.Masine.Add(masina);
                await Context.SaveChangesAsync();                
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
            return Ok("Uspesno dodata masina!");
        }
    }
}