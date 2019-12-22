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
    [Collection("DatabaseCollection")]
    public class AccountTests
    {
        DatabaseFixture _fixture;

        public AccountTests(DatabaseFixture fixture)
        {
            _fixture = fixture;
        }

        [Fact]
        public async Task CreateAccount()
        {
            var accountModel = new AccountModel()
            {
                Id = TestHelper.GenerateUUID(),
                Name = TestHelper.GetRandomString(),
                Role = Role.Admin,
                Characters = new List<CharacterModel>(),
                Verified = true
            };
            accountModel.Token = AuthHelper.GenerateToken(_fixture.Secret, accountModel);

            accountModel = await _fixture.AccountService.AddAccount(accountModel);
            Assert.NotNull(accountModel.Id);
        }

        [Fact]
        public async Task CreateAndRetriveAccount()
        {
            var createdAccountModel = new AccountModel()
            {
                Id = TestHelper.GenerateUUID(),
                Name = TestHelper.GetRandomString(),
                Role = Role.Admin,
                Characters = new List<CharacterModel>(),
                Verified = true
            };
            createdAccountModel.Token = AuthHelper.GenerateToken(_fixture.Secret, createdAccountModel);

            createdAccountModel = await _fixture.AccountService.AddAccount(createdAccountModel);
            var retrivedAccountModel = await _fixture.AccountService.GetAccount(createdAccountModel.Name);
            Assert.Equal(createdAccountModel.Id, retrivedAccountModel.Id);
            Assert.Equal(Role.Admin, createdAccountModel.Role);
        }

        [Fact]
        public async Task CreateAndDeleteAccount()
        {
            var createdAccountModel = new AccountModel()
            {
                Id = TestHelper.GenerateUUID(),
                Name = TestHelper.GetRandomString(),
                Role = Role.Admin,
                Characters = new List<CharacterModel>(),
                Verified = true
            };
            createdAccountModel.Token = AuthHelper.GenerateToken(_fixture.Secret, createdAccountModel);

            createdAccountModel = await _fixture.AccountService.AddAccount(createdAccountModel);
            await _fixture.AccountService.RemoveAccount(createdAccountModel.Name);
            var retrivedAccountModel = await _fixture.AccountService.GetAccount(createdAccountModel.Name);

            Assert.Null(retrivedAccountModel);
        }

        [Fact]
        public async Task CreateReciveAndDeleteProfile()
        {
            var account = new AccountModel()
            {
                Id = TestHelper.GenerateUUID(),
                Name = TestHelper.GetRandomString(),
                Role = Role.Admin,
                Characters = new List<CharacterModel>(),
                Verified = true
            };
            account.Token = AuthHelper.GenerateToken(_fixture.Secret, account);

            account = await _fixture.AccountService.AddAccount(account);

            var newProfile = new SnapshotProfileModel()
            {
                ActiveLeagueId = TestHelper.GenerateUUID(),
                ActivePriceLeagueId = TestHelper.GenerateUUID(),
                ActiveStashTabIds = new List<string>() { },
                Id = TestHelper.GenerateUUID(),
                Name = TestHelper.GetRandomString(),
                Snapshots = new List<SnapshotModel>() { }
            };

            newProfile = await _fixture.AccountService.AddProfile(account.Name, newProfile);            
            var addedProfile = await _fixture.AccountService.GetProfile( newProfile.Id);
            await _fixture.AccountService.RemoveProfile(account.Name, newProfile.Id);
            var removedProfile = await _fixture.AccountService.GetProfile(newProfile.Id);

            Assert.NotNull(newProfile.Id);
            Assert.Equal(newProfile.Id, addedProfile.Id);
            Assert.Null(removedProfile);
        }
    }
}
