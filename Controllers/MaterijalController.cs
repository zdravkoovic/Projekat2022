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
    public class MaterijalController : ControllerBase
    {
        public GradjevinskiPContext Context { get; set; }
        public MaterijalController(GradjevinskiPContext context)
        {
            Context = context;
        }
        [Route("Brojevi/{id}")]
        [HttpGet]
        public async Task<ActionResult> GetBroj(int id)
        {
            try
            {
                var broj = await Context.ProjekatMaterijali.Where(p=>p.Projekat.ID == id).Select(p=>p.Kolicina).ToListAsync();
                return Ok(broj.Sum());
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        [Route("Materijali/{id}")]
        [HttpGet]
        public async Task<ActionResult> Materijali(int id)
        {
            var materijali = Context.ProjekatMaterijali
                .Include(p=>p.Materijal)
                .Where(p=>p.Projekat.ID == id);

            return Ok(await materijali.Select(p=>new{
                p.Materijal.ID,
                p.Materijal.Naziv,
                p.Materijal.Klasa,
                p.Kolicina,
                p.Materijal.Cena
            }).ToListAsync());
        }
        [Route("UkloniMaterijal/{IDProjekta}/{IDMaterijala}")]
        [HttpDelete]
        public async Task<ActionResult> UkloniMaterijal(int IDProjekta, int IDMaterijala)
        {
            try
            {
                var materijal = Context.ProjekatMaterijali.Where(p=>p.Materijal.ID == IDMaterijala);
                var count = materijal.Count();
                var nadjen = Context.ProjekatMaterijali.Where(p=>p.Projekat.ID == IDProjekta 
                                                            && p.Materijal.ID == IDMaterijala)
                                                            .FirstOrDefault();
                var kolicina = nadjen.Kolicina;
                Context.ProjekatMaterijali.Remove(nadjen);
                if(count == 1)
                {
                    var mat = await Context.Materijali.FindAsync(IDMaterijala);
                    Context.Materijali.Remove(mat);
                }
                await Context.SaveChangesAsync();
                return Ok(kolicina);
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        [Route("DodajMaterijal/{IDProjekta}/{materijal}/{klasa}/{kolicina}/{cena}")]
        [HttpPost]
        public async Task<ActionResult> DodajMaterijal(int IDProjekta, string materijal,
                                                        string klasa, int kolicina, int cena)
        {
            if(string.IsNullOrWhiteSpace(materijal) || materijal.Length > 30)
            {
                return BadRequest("Greska u nazivu materijala!");
            }
            if(string.IsNullOrEmpty(klasa) || klasa.Length > 3)
            {
                return BadRequest("Greska u nazivu klase!");
            }
            if(kolicina < 1 || kolicina > 500)
            {
                return BadRequest("Greska u kolicini!");
            }
            if(cena < 50 || cena > 1000)
            {
                return BadRequest("Greska u ceni!");
            }
            var postoji = Context.ProjekatMaterijali.Where(p=>p.Projekat.ID == IDProjekta
                                                        && p.Materijal.Naziv == materijal)
                                                        .FirstOrDefault();
            if(postoji != null)
            {
                postoji.Kolicina = postoji.Kolicina + kolicina;
                await Context.SaveChangesAsync();
            }
            else
            {
                Materijal mat = new Materijal
                {
                    Naziv = materijal,
                    Klasa = klasa,
                    Cena = cena
                };
                Context.Materijali.Add(mat);
                var projekat = await Context.Projekti.FindAsync(IDProjekta);
                ProjekatMaterijal spoj = new ProjekatMaterijal
                {
                    Kolicina = kolicina,
                    Projekat = projekat,
                    Materijal = mat
                };
                Context.ProjekatMaterijali.Add(spoj);
                await Context.SaveChangesAsync();
            }
            return Ok("Uspesno dodat materijal!");
        }
    }
}