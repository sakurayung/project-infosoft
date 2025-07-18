using Microsoft.EntityFrameworkCore;
using project_infosoft.Models;

namespace project_infosoft.Data
{
    public class RentalContext : DbContext
    {
        public RentalContext (DbContextOptions<RentalContext> options)
            : base(options)
        {
        }

        public DbSet<Video> Video { get; set; } = null!;
        public DbSet<Customer> Customer { get; set; } = null!;
        public DbSet<Rental> Rental { get; set; } = null!;

        // Defining the Foreign Key in Customer and Video to the Rental
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Rental>()
                .HasOne(r => r.Customer)
                .WithMany()
                .HasForeignKey(r => r.CustomerId);

            modelBuilder.Entity<Rental>()
                .HasOne(r => r.Video)
                .WithMany()
                .HasForeignKey(r => r.VideoId);
        }
    }

}
