using Microsoft.EntityFrameworkCore;
using Shared.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Shared
{
    public class ExilenceContext : DbContext
    {
        public ExilenceContext(DbContextOptions<ExilenceContext> options) : base(options)
        {
        }

        public DbSet<Account> Accounts { get; set; }
        public DbSet<Character> Characters { get; set; }
        public DbSet<Connection> Connections { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<League> Leagues { get; set; }
        public DbSet<SnapshotProfile> SnapshotProfiles { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            modelBuilder.Ignore<Snapshot>();
            modelBuilder.Ignore<StashTab>();
            modelBuilder.Ignore<PricedItem>();

            modelBuilder.Entity<SnapshotProfile>()
            .Property(e => e.ActiveStashTabIds)
            .HasConversion(
                v => string.Join(',', v),
                v => v.Split(',', StringSplitOptions.RemoveEmptyEntries));

            modelBuilder.Entity<Account>()
                .HasIndex(x => x.ClientId);
            modelBuilder.Entity<Character>()
                .HasIndex(x => x.ClientId);
            modelBuilder.Entity<Connection>()
                .HasIndex(x => x.ConnectionId);
            modelBuilder.Entity<Group>()
                .HasIndex(x => x.ClientId);
            modelBuilder.Entity<League>()
                .HasIndex(x => x.ClientId);
            modelBuilder.Entity<SnapshotProfile>()
                .HasIndex(x => x.ClientId);



        }
    }
}
