using System.ComponentModel.DataAnnotations;

namespace Model
{
    public class ProjekatMaterijal
    {
        [Key]
        public int ID { get; set; }
        [Range(1, 500)]
        public int Kolicina { get; set; }
        public Projekti Projekat { get; set; }
        public Materijal Materijal { get; set; }
    }
}