using System.ComponentModel.DataAnnotations;

namespace Model
{
    public class Masine
    {
        [Key]
        public int ID { get; set; }
        [MaxLength(30)]
        [Required]
        public string Naziv { get; set; }
        [Range(1, 30)]
        public int Potrosnja { get; set; }
        [Range(50, 300)]
        public int CenaGoriva { get; set; }
        public Projekti Projekat { get; set; }
    }
}