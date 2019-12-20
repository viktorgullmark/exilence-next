using API.Profiles;
using API.Services;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Shared;
using Shared.Repositories;
using System;
using System.Collections.Generic;
using System.Text;
using Xunit;

namespace ExilenceTests
{
    public class DatabaseFixture : IDisposable
    {
        public SnapshotService SnapshotService { get; private set; }
        public AccountService AccountService { get; private set; }
        public GroupService GroupService { get; private set; }
        public string Secret { get; private set; }
        public string InstanceName { get; private set; }

        public DatabaseFixture()
        {
            Secret = "KeGPyghP5CSoSwPpzkBvKG2k";
            InstanceName = "Hawkeye";

            DbContextOptions<ExilenceContext> options;
            var builder = new DbContextOptionsBuilder<ExilenceContext>();
            builder.UseInMemoryDatabase("Exilence");
            options = builder.Options;

            var mockMapper = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile(new AccountProfileMapper());
                cfg.AddProfile(new CharacterProfileMapper());
                cfg.AddProfile(new ConnectionProfileMapper());
                cfg.AddProfile(new GroupProfileMapper());
                cfg.AddProfile(new LeagueProfileMapper());
                cfg.AddProfile(new PricedItemProfileMapper());
                cfg.AddProfile(new SnapshotProfileMapper());
                cfg.AddProfile(new SnapshotProfileProfileMapper());
                cfg.AddProfile(new StashtabProfileMapper());
            });
            var mapper = mockMapper.CreateMapper();

            var context = new ExilenceContext(options);

            var accountRepository = new AccountRepository(context);
            var snapshotRepository = new SnapshotRepository(context);
            var groupRepository = new GroupRepository(context);

            AccountService = new AccountService(snapshotRepository, accountRepository, mapper);
            SnapshotService = new SnapshotService(snapshotRepository, accountRepository, mapper);
            GroupService = new GroupService(groupRepository, accountRepository, mapper);
        }

        public void Dispose()
        {
            
        }
    }

    [CollectionDefinition("DatabaseCollection")] // DisableParallelization = true
    public class DatabaseCollection : ICollectionFixture<DatabaseFixture>
    {
        // This class has no code, and is never created. Its purpose is simply
        // to be the place to apply [CollectionDefinition] and all the
        // ICollectionFixture<> interfaces.
    }
}
