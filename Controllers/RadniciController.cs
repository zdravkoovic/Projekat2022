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
    public class RadniciController : ControllerBase
    {
        public GradjevinskiPContext Context { get; set; }
        public RadniciController(GradjevinskiPContext context)
        {
            Context = context;
        }
        [Route("Brojevi/{id}")]
        [HttpGet]
        public int GetBroj(int id)
        {
            var broj = Context.Radnici.Where(p=>p.Projekat.ID == id).Count();
            return broj;
        }
        [Route("Radnici/{id}")]
        [HttpGet]
        public async Task<ActionResult> Radnici(int id)
        {
            var radnici = Context.Radnici
                .Include(p=>p.Projekat)
                .Where(p=>p.Projekat.ID == id);

            return Ok(await radnici.Select(p=>new{
                p.ID,
                p.Ime,
                p.Prezime,
                p.Dnevnica,
                p.Iskustvo,
                p.Email
            }).ToListAsync());
        }
        [Route("RadnikProjekat/{IDProjekta}/{ime}/{prezime}/{email}/{dnevnica}/{iskustvo}")]
        [HttpPost]
        public async Task<ActionResult> RadnikProjekat(int IDProjekta, string ime, string prezime, string email,
                                                        int dnevnica, int iskustvo)
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
            if(iskustvo < 1 && iskustvo > 10)
            {
                return BadRequest("Neispravna licenca");
            }

            var provera = Context.Radnici.Where(p=>p.Email == email).FirstOrDefault();
            try
            {
                if(provera == null)
                {
                    var projekat = await Context.Projekti.FindAsync(IDProjekta);
                    Radnici radnik = new Radnici
                    {
                        Ime = ime,
                        Prezime = prezime,
                        Email = email,
                        Dnevnica = dnevnica,
                        Iskustvo = iskustvo,
                        Projekat = projekat
                    };
                    Context.Radnici.Add(radnik);
                    await Context.SaveChangesAsync();
                    return Ok(1);
                }
                else
                {
                    return Ok(2);
                }
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        [Route("OtpustiRadnika/{IDRadnika}")]
        [HttpDelete]
        public async Task<ActionResult> OtpustiRadnika(int IDRadnika)
        {
            try
            {
                Context.Radnici.Remove(await Context.Radnici.FindAsync(IDRadnika));
                await Context.SaveChangesAsync();
                return Ok("Nazalost, uspesno otpusten radnik!");
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}