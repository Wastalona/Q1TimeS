using Microsoft.EntityFrameworkCore;
using Q1TimeS.Models;

namespace Q1TimeS.Controllers
{
    public class MySqlContext : DbContext
    {
        public MySqlContext(DbContextOptions options) : base(options){}

        public DbSet<SurveyModel> Surveys { get; set; }
        public DbSet<QuestionModel> Questions { get; set; }
        public DbSet<AnswerModel> Answers { get; set; }
        public DbSet<UserModel> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<SurveyModel>()
                .HasMany(s => s.Questions)
                .WithOne(q => q.Survey)
                .HasForeignKey(q => q.SurveyId);

            modelBuilder.Entity<QuestionModel>()
                .HasMany(q => q.Answers)
                .WithOne(a => a.Question)
                .HasForeignKey(a => a.QuestionId);

            modelBuilder.Entity<UserModel>()
                .HasOne(u => u.Survey)
                .WithMany()
                .HasForeignKey(u => u.SurveyId);
        }
    }
}
