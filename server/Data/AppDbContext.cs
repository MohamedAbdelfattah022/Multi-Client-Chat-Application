using dotenv.net;
using Microsoft.EntityFrameworkCore;

namespace server.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<PrivateMessage> PrivateMessages { get; set; }
        public DbSet<GroupMessage> GroupMessages { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<GroupMember> GroupMembers { get; set; }
        public DbSet<FriendRequest> FriendRequests { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) {
            base.OnConfiguring(optionsBuilder);
            DotEnv.Load();

            var connectionString = Environment.GetEnvironmentVariable("constr");
            optionsBuilder.UseSqlServer(connectionString);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder) {
            base.OnModelCreating(modelBuilder);

            // Configure PrivateMessage relationships
            modelBuilder.Entity<PrivateMessage>()
                .HasOne<User>(m => m.Sender)
                .WithMany(u => u.SentPrivateMessages)
                .HasForeignKey(m => m.SenderId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<PrivateMessage>()
                .HasOne<User>(m => m.Recipient)
                .WithMany(u => u.ReceivedPrivateMessages)
                .HasForeignKey(m => m.RecipientId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure GroupMessage relationships
            modelBuilder.Entity<GroupMessage>()
                .HasOne<Group>(m => m.Group)
                .WithMany(g => g.Messages)
                .HasForeignKey(m => m.GroupId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<GroupMessage>()
                .HasOne<User>(m => m.Sender)
                .WithMany(u => u.SentGroupMessages)
                .HasForeignKey(m => m.SenderId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure GroupMember relationships
            modelBuilder.Entity<GroupMember>()
                .HasOne<Group>(gm => gm.Group)
                .WithMany(g => g.GroupMembers)
                .HasForeignKey(gm => gm.GroupId);

            modelBuilder.Entity<GroupMember>()
                .HasOne<User>(gm => gm.User)
                .WithMany(u => u.GroupMemberships)
                .HasForeignKey(gm => gm.UserId);

            // Configure FriendRequest relationships
            modelBuilder.Entity<FriendRequest>()
                .HasOne<User>(fr => fr.Sender)
                .WithMany(u => u.SentRequests)
                .HasForeignKey(fr => fr.SenderId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<FriendRequest>()
                .HasOne<User>(fr => fr.Recipient)
                .WithMany(u => u.ReceivedRequests)
                .HasForeignKey(fr => fr.RecipientId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
