using Shared.Enums;
using Shared.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace ExilenceTests
{


    [Collection("DatabaseCollection")]
    public class SnapshotTests
    {
        DatabaseFixture _fixture;

        public SnapshotTests(DatabaseFixture fixture)
        {
            _fixture = fixture;
        }

        [Fact]
        public async Task AddSnapshot()
        {
            var account = new AccountModel()
            {
                ClientId = TestHelper.GenerateUUID(),
                Name = TestHelper.GetRandomString(),
                Role = Role.Admin,
                Characters = new List<CharacterModel>(),
                Verified = true
            };

            account = await _fixture.AccountService.AddAccount(account);

            var profile = new SnapshotProfileModel()
            {
                ClientId = TestHelper.GenerateUUID(),
                ActiveLeagueId = TestHelper.GenerateUUID(),
                ActiveStashTabIds = new List<string>() { },
                ActivePriceLeagueId = TestHelper.GenerateUUID(),
                Name = TestHelper.GetRandomString(),
                Snapshots = new List<SnapshotModel>() { }
            };

            profile = await _fixture.AccountService.AddProfile(account.Name, profile);

            var snapshot = new SnapshotModel()
            {
                ClientId = TestHelper.GenerateUUID(),
                StashTabs = new List<StashtabModel>()
            };

            snapshot = await _fixture.SnapshotService.AddSnapshot(profile.ClientId, snapshot);

            var stashtabs = new List<StashtabModel>()
            {
                new StashtabModel()
                {
                    ClientId = TestHelper.GenerateUUID(),
                    Color = TestHelper.GetRandomString(),
                    Index = 0,
                    Name = TestHelper.GetRandomString(),
                    PricedItems = new List<PricedItemModel>()
                },
                new StashtabModel()
                {
                    ClientId = TestHelper.GenerateUUID(),
                    Color = TestHelper.GetRandomString(),
                    Index = 1,
                    Name = TestHelper.GetRandomString(),
                    PricedItems = new List<PricedItemModel>()
                }
            };

            foreach (var stashtab in stashtabs)
            {
                var returnedStashtab = await _fixture.SnapshotService.AddStashtab(snapshot.ClientId, stashtab);
                Assert.NotNull(returnedStashtab.ClientId);
            }
            
            var retrivedAccount = await _fixture.AccountService.GetAccount(account.Name);

            Assert.NotNull(retrivedAccount.ClientId);
            Assert.NotNull(retrivedAccount.Profiles[0].ClientId);
            Assert.NotNull(retrivedAccount.Profiles[0].Snapshots[0].ClientId);
            Assert.NotNull(retrivedAccount.Profiles[0].Snapshots[0].StashTabs[0].ClientId);
            Assert.NotNull(retrivedAccount.Profiles[0].Snapshots[0].StashTabs[1].ClientId);
        }


    }
}
