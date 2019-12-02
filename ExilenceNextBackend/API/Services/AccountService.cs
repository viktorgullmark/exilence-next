﻿using API.Interfaces;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Shared.Entities;
using Shared.Interfaces;
using Shared.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Services
{
    public class AccountService : IAccountService
    {
        ISnapshotRepository _snapshotRepository;
        IAccountRepository _accountRepository;
        readonly IMapper _mapper;

        public AccountService(ISnapshotRepository snapshotRepository, IAccountRepository accountRepository, IMapper mapper)
        {
            _snapshotRepository = snapshotRepository;
            _accountRepository = accountRepository;
            _mapper = mapper;
        }

        public async Task<AccountModel> GetAccount(string accountName)
        {
            var account = await _accountRepository.GetAccounts(account => account.Name == accountName).FirstOrDefaultAsync();
            return _mapper.Map<AccountModel>(account);
        }

        public async Task<AccountModel> AddAccount(AccountModel accountModel)
        {
            var account = _mapper.Map<Account>(accountModel);
            account = await _accountRepository.AddAccount(account);
            await _accountRepository.SaveChangesAsync();
            accountModel = _mapper.Map<AccountModel>(account);
            return accountModel;
        }

        public async Task<AccountModel> RemoveAccount(string accountName)
        {
            var account = await _accountRepository.GetAccounts(account => account.Name == accountName).FirstOrDefaultAsync();
            _accountRepository.RemoveAccount(account);
            await _accountRepository.SaveChangesAsync();
            return _mapper.Map<AccountModel>(account);
        }

        public async Task<SnapshotProfileModel> GetProfile(string accountName, string profileClientId)
        {
            var profile = await _accountRepository.GetProfiles(profile => profile.Account.Name == accountName && profile.ClientId == profileClientId).FirstOrDefaultAsync();
            return _mapper.Map<SnapshotProfileModel>(profile);
        }

        public async Task<SnapshotProfileModel> AddProfile(string accountName, SnapshotProfileModel profileModel)
        {
            var account = await _accountRepository.GetAccounts(a => a.Name == accountName).FirstOrDefaultAsync();

            if (account == null)
                throw new Exception("Can't find account");

            var profile = _mapper.Map<SnapshotProfile>(profileModel);
            account.Profiles.Add(profile);
            await _accountRepository.SaveChangesAsync();
            return _mapper.Map<SnapshotProfileModel>(profile);
        }

        public async Task<SnapshotProfileModel> RemoveProfile(string accountName, string profileClientId)
        {
            var account = await _accountRepository.GetAccounts(a => a.Name == accountName).FirstOrDefaultAsync();
            var profile = account.Profiles.First(p => p.ClientId == profileClientId);
            account.Profiles.Remove(profile);
            await _accountRepository.SaveChangesAsync();
            return _mapper.Map<SnapshotProfileModel>(profile);
        }
    }

}
