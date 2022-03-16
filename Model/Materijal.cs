using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Model
{
    public class Materijal
    {
        [Key]
        public int ID { get; set; }
        [MaxLength(30)]
        [Required]
        public string Naziv { get; set; }
        [MaxLength(3)]
        public string Klasa { get; set; }
        [Range(50, 1000)]
        public int Cena { get; set; }
        public List<ProjekatMaterijal> ProjekatMaterijal { get; set; }
    }
}