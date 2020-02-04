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
                ClientId = TestHelper.GenerateUUID(),
                Name = TestHelper.GetRandomString(),
                Role = Role.Admin,
                Characters = new List<CharacterModel>(),
                Verified = true
            };
            accountModel.AccessToken = AuthHelper.GenerateToken(_fixture.Secret, accountModel);

            accountModel = await _fixture.AccountService.AddAccount(accountModel);
            Assert.NotNull(accountModel.ClientId);
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
            createdAccountModel.AccessToken = AuthHelper.GenerateToken(_fixture.Secret, createdAccountModel);

            createdAccountModel = await _fixture.AccountService.AddAccount(createdAccountModel);
            var retrivedAccountModel = await _fixture.AccountService.GetAccount(createdAccountModel.Name);
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
            createdAccountModel.AccessToken = AuthHelper.GenerateToken(_fixture.Secret, createdAccountModel);

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
                ClientId = TestHelper.GenerateUUID(),
                Name = TestHelper.GetRandomString(),
                Role = Role.Admin,
                Characters = new List<CharacterModel>(),
                Verified = true
            };
            account.AccessToken = AuthHelper.GenerateToken(_fixture.Secret, account);

            account = await _fixture.AccountService.AddAccount(account);

            var newProfile = new SnapshotProfileModel()
            {
                ActiveLeagueId = TestHelper.GenerateUUID(),
                ActivePriceLeagueId = TestHelper.GenerateUUID(),
                ActiveStashTabIds = new List<string>() { },
                ClientId = TestHelper.GenerateUUID(),
                Name = TestHelper.GetRandomString(),
                Snapshots = new List<SnapshotModel>() { }
            };

            newProfile = await _fixture.AccountService.AddProfile(account.Name, newProfile);            
            var addedProfile = await _fixture.AccountService.GetProfile( newProfile.ClientId);
            await _fixture.AccountService.RemoveProfile(account.Name, newProfile.ClientId);
            var removedProfile = await _fixture.AccountService.GetProfile(newProfile.ClientId);

            Assert.NotNull(newProfile.ClientId);
            Assert.Equal(newProfile.ClientId, addedProfile.ClientId);
            Assert.Null(removedProfile);
        }
    }
}
