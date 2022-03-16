using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Model
{
    public class Projekti
    {
        [Key]
        public int ID { get; set; }
        [MaxLength(80)]
        [Required]
        public string Naziv { get; set; }
        [MaxLength(80)]
        [Required]
        public string Adresa { get; set; }
        public DateTime DatumPocetka { get; set; }
        public List<ProjekatInzenjer> ProjekatInzenjer { get; set; }
        public List<ProjekatMaterijal> ProjekatMaterijal { get; set; }
        public List<Radnici> Radnici { get; set; }
        public List<Masine> Masine { get; set; }
    }
}