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
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace ExilenceTests
{
    public class AccountTests
    {
        private readonly AccountService _accountService;

        public AccountTests()
        {
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
                ClientId = "6d9b3712-7f9c-4f7f-a50c-05bfa4df2e01",
                Name = "TestAccount",
                Role = Role.Admin,
                Token = "RandomToken",
                Characters = new List<CharacterModel>(),
                Verified = true
            };

            accountModel = await _accountService.AddAccount(accountModel);

            Assert.NotNull(accountModel.Id);
        }

        [Fact]
        public async Task CreateAndRetriveAccount()
        {
            var createdAccountModel = new AccountModel()
            {
                ClientId = "6d9b3712-7f9c-4f7f-a50c-05bfa4df2e01",
                Name = "TestAccount",
                Role = Role.Admin,
                Token = "RandomToken",
                Characters = new List<CharacterModel>(),
                Verified = true
            };

            createdAccountModel = await _accountService.AddAccount(createdAccountModel);

            var retrivedAccountModel = await _accountService.GetAccount(createdAccountModel.Name);

            Assert.Equal(createdAccountModel.Id, retrivedAccountModel.Id);
        }

    }
}
