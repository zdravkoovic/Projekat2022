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
    public class InzenjerController : ControllerBase
    {
        public GradjevinskiPContext Context { get; set; }
        public InzenjerController(GradjevinskiPContext context)
        {
            Context = context;
        }
        [Route("Brojevi/{id}")]
        [HttpGet]
        public int GetBroj(int id)
        {
            var broj = Context.ProjekatInzenjer.Where(p=>p.Projekat.ID == id).Count();
            return broj;
        }
        [Route("Inzenjeri/{id}")]
        [HttpGet]
        public async Task<ActionResult> Inzenjeri(int id)
        {
            var inzenjeri = Context.ProjekatInzenjer
                .Include(p=>p.Inzenjer)
                .Where(p=>p.Projekat.ID == id);

            return Ok(await inzenjeri.Select(p=>new{
                p.Inzenjer.ID,
                p.Inzenjer.Ime,
                p.Inzenjer.Prezime,
                p.Dnevnica,
                p.Inzenjer.Licenca,
                p.Inzenjer.Email
            }).ToListAsync());
        }
        [Route("InzenjerProjekat/{IDProjekta}/{ime}/{prezime}/{email}/{dnevnica}/{licenca}")]
        [HttpPost]
        public async Task<ActionResult> DodajInzenjera(int IDProjekta, string ime, string prezime, string email,
                                                        int dnevnica, string licenca)
        {
            if(string.IsNullOrWhiteSpace(ime) || ime.Length > 30)
            {
                return BadRequest("Neispravno ime!");
            }
            if(string.IsNullOrWhiteSpace(prezime) || prezime.Length > 30)
            {
                return BadRequest("Neispravno prezime!");
            }
            if(string.IsNullOrWhiteSpace(email) || email.Length > 50)
            {
                return BadRequest("Neispravno email!");
            }
            if(dnevnica < 1000 && dnevnica > 10000)
            {
                return BadRequest("Neispravna dnevnica!");
            }
            if(licenca != "310" && licenca != "410")
            {
                return BadRequest("Neispravna licenca");
            }

            var postoji = Context.Inzenjeri
                        .Include(p=>p.ProjekatInzenjer)
                        .Where(p=>p.Email == email).FirstOrDefault();
            try
            {
                if(postoji != null)
                {
                    var provera = Context.ProjekatInzenjer.Where(p=>p.Inzenjer.ID == postoji.ID && p.Projekat.ID == IDProjekta).FirstOrDefault();
                    if(provera != null)
                    {
                        return Ok(1);
                    }

                    var projekat = await Context.Projekti.FindAsync(IDProjekta);
                    if(projekat == null)
                    {
                        return BadRequest("Projekat iz nekog razloga ne postoji!");
                    }
                    ProjekatInzenjer pi = new ProjekatInzenjer
                    {
                        Dnevnica = dnevnica,
                        Inzenjer = postoji,
                        Projekat = projekat
                    };
                    Context.ProjekatInzenjer.Add(pi);
                    await Context.SaveChangesAsync();
                    return Ok(2);
                }
                else
                {
                    Inzenjeri inzenjer = new Inzenjeri
                    {
                        Ime = ime,
                        Prezime = prezime,
                        Email = email,
                        Licenca = licenca
                    };
                    Context.Inzenjeri.Add(inzenjer);
                    await Context.SaveChangesAsync();
                    var projekat = await Context.Projekti.FindAsync(IDProjekta);
                    if(projekat == null)
                    {
                        return BadRequest("Projekat iz nekog razloga ne postoji!");
                    }
                    ProjekatInzenjer spoj = new ProjekatInzenjer
                    {
                        Dnevnica = dnevnica,
                        Inzenjer = inzenjer,
                        Projekat = projekat
                    };
                    Context.ProjekatInzenjer.Add(spoj);
                    await Context.SaveChangesAsync();
                    return Ok(3);
                }
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        [Route("OtpustiInzenjera/{IDProjekta}/{IDInzenjera}")]
        [HttpDelete]
        public async Task<ActionResult> OtpustiInzenjera(int IDProjekta, int IDInzenjera)
        {
            var inzenjer = Context.ProjekatInzenjer
                        .Include(p=>p.Inzenjer)
                        .Where(p=>p.Inzenjer.ID == IDInzenjera);
            var nadjen = Context.ProjekatInzenjer.Where(p=>p.Inzenjer.ID == IDInzenjera
                                                && p.Projekat.ID == IDProjekta)
                                                .FirstOrDefault();
            try
            {
                Context.ProjekatInzenjer.Remove(nadjen);

                if(inzenjer.Count() == 1)
                {
                    var covek = await Context.Inzenjeri.FindAsync(IDInzenjera);
                    Context.Inzenjeri.Remove(covek);
                }
                await Context.SaveChangesAsync();
                return Ok("Uspeno otpusten inzenjer!");
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}