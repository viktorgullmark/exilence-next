using API.Helpers;
using API.Interfaces;
using API.Profiles;
using API.Services;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Moq;
using Shared;
using Shared.Entities;
using Shared.Enums;
using Shared.Models;
using Shared.Profiles;
using Shared.Repositories;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Xunit;

namespace ExilenceTests
{
    [CollectionDefinition("NoParallelization", DisableParallelization = true)]
    public class AccountTests
    {
        private readonly AccountService _accountService;
        private readonly string _secret;

        public AccountTests()
        {
            _secret = "KeGPyghP5CSoSwPpzkBvKG2k";

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

            _accountService = new AccountService(snapshotRepository, accountRepository, mapper);
        }

        [Fact]
        public async Task CreateAccount()
        {
            var accountModel = new AccountModel()
            {
                ClientId = TestHelper.GenerateUUID(),
                Name = TestHelper.GetRandomString(),
                Role = Role.Admin,
                Characters = new List<CharacterModel>(),
                Verified = true
            };
            accountModel.Token = AuthHelper.GenerateToken(_secret, accountModel);

            accountModel = await _accountService.AddAccount(accountModel);
            Assert.NotNull(accountModel.Id);
        }

        [Fact]
        public async Task CreateAndRetriveAccount()
        {
            var createdAccountModel = new AccountModel()
            {
                ClientId = TestHelper.GenerateUUID(),
                Name = TestHelper.GetRandomString(),
                Role = Role.Admin,
                Characters = new List<CharacterModel>(),
                Verified = true
            };
            createdAccountModel.Token = AuthHelper.GenerateToken(_secret, createdAccountModel);

            createdAccountModel = await _accountService.AddAccount(createdAccountModel);
            var retrivedAccountModel = await _accountService.GetAccount(createdAccountModel.Name);
            Assert.Equal(createdAccountModel.ClientId, retrivedAccountModel.ClientId);
            Assert.Equal(Role.Admin, createdAccountModel.Role);
        }

        [Fact]
        public async Task CreateAndDeleteAccount()
        {
            var createdAccountModel = new AccountModel()
            {
                ClientId = TestHelper.GenerateUUID(),
                Name = TestHelper.GetRandomString(),
                Role = Role.Admin,
                Characters = new List<CharacterModel>(),
                Verified = true
            };
            createdAccountModel.Token = AuthHelper.GenerateToken(_secret, createdAccountModel);

            createdAccountModel = await _accountService.AddAccount(createdAccountModel);
            await _accountService.RemoveAccount(createdAccountModel.Name);
            var retrivedAccountModel = await _accountService.GetAccount(createdAccountModel.Name);

            Assert.Null(retrivedAccountModel);
        }

        [Fact]
        public async Task CreateReciveAndDeleteProfile()
        {
            var account = new AccountModel()
            {
                ClientId = TestHelper.GenerateUUID(),
                Name = TestHelper.GetRandomString(),
                Role = Role.Admin,
                Characters = new List<CharacterModel>(),
                Verified = true
            };
            account.Token = AuthHelper.GenerateToken(_secret, account);

            account = await _accountService.AddAccount(account);

            var newProfile = new SnapshotProfileModel()
            {
                ActiveLeagueId = TestHelper.GenerateUUID(),
                ActivePriceLeagueId = TestHelper.GenerateUUID(),
                ActiveStashTabIds = new List<string>() { },
                ClientId = TestHelper.GenerateUUID(),
                Name = TestHelper.GetRandomString(),
                Snapshots = new List<SnapshotModel>() { }
            };

            newProfile = await _accountService.AddProfile(account.Name, newProfile);            
            var addedProfile = await _accountService.GetProfile(account.Name, newProfile.ClientId);
            await _accountService.RemoveProfile(account.Name, newProfile.ClientId);
            var removedProfile = await _accountService.GetProfile(account.Name, newProfile.ClientId);

            Assert.NotNull(newProfile.Id);
            Assert.Equal(newProfile.ClientId, addedProfile.ClientId);
            Assert.Null(removedProfile);
        }

    }
}
