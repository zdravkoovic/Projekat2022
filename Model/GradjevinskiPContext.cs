using Microsoft.EntityFrameworkCore;

namespace Model
{
    public class GradjevinskiPContext : DbContext
    {
        public DbSet<Inzenjeri> Inzenjeri { get; set; }
        public DbSet<Masine> Masine { get; set; }
        public DbSet<Materijal> Materijali { get; set; }
        public DbSet<ProjekatInzenjer> ProjekatInzenjer { get; set; }
        public DbSet<ProjekatMaterijal> ProjekatMaterijali { get; set; }
        public DbSet<Projekti> Projekti { get; set; }
        public DbSet<Radnici> Radnici { get; set; }
        public GradjevinskiPContext(DbContextOptions options) : base(options)
        {

        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

        }
    }
}