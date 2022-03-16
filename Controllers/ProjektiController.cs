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
    public class ProjektiController : ControllerBase
    {
        public GradjevinskiPContext Context { get; set; }
        public ProjektiController(GradjevinskiPContext context)
        {
            Context = context;
        }
        [Route("NazivProjekta")]
        [HttpGet]
        public async Task<ActionResult> GetNaziv()
        {
            try
            {
                return Ok(await Context.Projekti.Select(p=>new{p.ID, p.Naziv, p.Adresa, p.DatumPocetka}).ToListAsync());
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        [Route("Projekat/{id}")]
        [HttpGet]
        public async Task<ActionResult> GetProjekat(int id)
        {
            try
            {
                var projekat = await Context.Projekti.FindAsync(id);
                return Ok(projekat);
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        [Route("PromeniNazivProjekta/{IDProjekta}/{naziv}")]
        [HttpPut]
        public async Task<ActionResult> PromeniNazivProjekta(int IDProjekta, string naziv, string adresa)
        {
            if(string.IsNullOrWhiteSpace(naziv) && naziv.Length > 80)
            {
                return BadRequest("Doslo je do greske prilikom promene naziva!");
            }
            if(string.IsNullOrWhiteSpace(adresa) && adresa.Length > 80)
            {
                return BadRequest("Doslo je do greske kod adrese!");
            }
            try
            {
                var projekat = await Context.Projekti.FindAsync(IDProjekta);
                projekat.Naziv = naziv;
                if(adresa != null)
                projekat.Adresa = adresa;
                await Context.SaveChangesAsync();
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
            return Ok("Uspenso ste promenili naziv projekta!");
        }
        [Route("DodajProjekat/{naziv}/{adresa}/{datum}")]
        [HttpPost]
        public async Task<ActionResult> DodajProjekat(string naziv, string adresa, DateTime datum)
        {
            if(string.IsNullOrWhiteSpace(naziv) || naziv.Length > 80)
            {
                return BadRequest("Naziv je neispravan!");
            }
            if(string.IsNullOrWhiteSpace(adresa) || adresa.Length > 80)
            {
                return BadRequest("Adresa je neispravna!");
            }
            try
            {
                Projekti projekat = new Projekti
                {
                    Naziv = naziv,
                    Adresa = adresa,
                    DatumPocetka = datum
                };
                Context.Projekti.Add(projekat);
                await Context.SaveChangesAsync();
                return Ok(projekat.ID);
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        [Route("ObrisiProjekat/{IDProjekta}")]
        [HttpDelete]
        public async Task<ActionResult> ObrisiProjekat(int IDProjekta)
        {
            try
            {
                var projekat = await Context.Projekti.FindAsync(IDProjekta);
                var pi = Context.ProjekatInzenjer.Where(p=>p.Projekat == projekat);
                Context.ProjekatInzenjer.RemoveRange(pi);
                var pm = Context.ProjekatMaterijali.Where(p=>p.Projekat == projekat);
                Context.ProjekatMaterijali.RemoveRange(pm);
                var masine = Context.Masine.Where(p=>p.Projekat == projekat);
                Context.Masine.RemoveRange(masine);
                var radnici = Context.Radnici.Where(p=>p.Projekat == projekat);
                Context.Radnici.RemoveRange(radnici);
                Context.Projekti.Remove(projekat);
                await Context.SaveChangesAsync();
                return Ok();
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}