using Microsoft.EntityFrameworkCore;
using ConstructCoAPI.Data.Models;
using ConstructCoAPI.Data.Models;

namespace ConstructCoAPI.Data
{
    public class ConstructCoDbContext : DbContext
    {
        public ConstructCoDbContext() : base()
        {
        }
        public ConstructCoDbContext(DbContextOptions options)
        : base(options)
        { 
        }

        public DbSet<Assignment> Assignments => Set<Assignment>();
        public DbSet<Employee> Employees => Set<Employee>();
        public DbSet<Job> Jobs => Set<Job>();
        public DbSet<Project> Projects => Set<Project>();


    } //End class ConstructCoDbContext
}//End namespace ConstructCoAPI.Data

