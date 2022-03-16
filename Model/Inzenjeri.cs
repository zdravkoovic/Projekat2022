using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Model
{
    public class Inzenjeri
    {
        [Key]
        public int ID { get; set; }
        [MaxLength(30)]
        [Required]
        public string Ime { get; set; }
        [MaxLength(30)]
        [Required]
        public string Prezime { get; set; }
        [MaxLength(50)]
        [Required]
        public string Email { get; set; }
        [MaxLength(3)]
        [Required]
        public string Licenca { get; set; }
        [JsonIgnore]
        public List<ProjekatInzenjer> ProjekatInzenjer { get; set; }    
    }
}