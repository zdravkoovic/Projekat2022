using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Model
{
    public class ProjekatInzenjer
    {
        [Key]
        public int ID { get; set; }
        [Range(1000, 10000)]
        public int Dnevnica { get; set; }
        [JsonIgnore]
        public Inzenjeri Inzenjer { get; set; }
        public Projekti Projekat { get; set; }
    }
}