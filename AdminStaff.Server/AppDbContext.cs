
using AdminStaff.Server.Models;
using Microsoft.EntityFrameworkCore;
namespace AdminStaff.Server
{
    public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
    {
        public required DbSet<Student> Students { get; set; }
        public required DbSet<FamilyMember> FamilyMembers { get; set; }
        public required DbSet<Nationality> Nationalities { get; set; }
        public DbSet<Relationship> Relationships { get; set; }



    }
}
