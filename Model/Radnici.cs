using System.ComponentModel.DataAnnotations;

namespace Model
{
    public class Radnici
    {
        [Key]
        public int ID { get; set; }
        [MaxLength(30)]
        [Required]
        public string Ime { get; set; }
        [MaxLength(30)]
        [Required]
        public string Prezime { get; set; }
        [MaxLength(80)]
        [Required]
        public string Email { get; set; }
        [Range(1, 10)]
        [Required]
        public int Iskustvo { get; set; }
        [Range(1000, 4000)]
        public int Dnevnica { get; set; }
        public Projekti Projekat { get; set; }
    }
}