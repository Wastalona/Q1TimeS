using Microsoft.EntityFrameworkCore;
using Q1TimeS.Models.Db;

namespace Q1TimeS.Controllers
{
    public class MySqlContext : DbContext
    {
        public MySqlContext(DbContextOptions options) : base(options){}

        public DbSet<Survey> Surveys { get; set; }
        public DbSet<Question> Questions { get; set; }
        public DbSet<Answer> Answers { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<UserAnswer> UserAnswers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
        }
    }
}
