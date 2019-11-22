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
        public DbSet<PricedItem> PricedItems { get; set; }
        public DbSet<Snapshot> Snapshots { get; set; }
        public DbSet<Stashtab> StashTabs { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

        }
    }
}
