using API.Interfaces;
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
        IAccountRepository _accountRepository;
        ISnapshotRepository _snapshotRepository;
        readonly IMapper _mapper;

        public AccountService(IAccountRepository accountRepository, ISnapshotRepository snapshotRepository, IMapper mapper)
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

        public async Task<ConnectionModel> GetConnection(string accountName)
        {
            var account = await _accountRepository.GetConnections(connection => connection.Account.Name == accountName).FirstOrDefaultAsync();
            return _mapper.Map<ConnectionModel>(account);
        }

        public async Task<AccountModel> AddAccount(AccountModel accountModel)
        {
            var account = _mapper.Map<Account>(accountModel);
            account = _accountRepository.AddAccount(account);
            account.LastLogin = DateTime.UtcNow;
            await _accountRepository.SaveChangesAsync();
            accountModel = _mapper.Map<AccountModel>(account);
            return accountModel;
        }

        public async Task<AccountModel> EditAccount(AccountModel accountModel)
        {
            var account = await _accountRepository.GetAccounts(account => account.Name == accountModel.Name).FirstOrDefaultAsync();
            _mapper.Map(accountModel, account);
            account.LastLogin = DateTime.UtcNow;
            await _accountRepository.SaveChangesAsync();

            return accountModel = _mapper.Map<AccountModel>(account);
        }

        public async Task<AccountModel> RemoveAccount(string accountName)
        {
            var account = await _accountRepository.GetAccounts(account => account.Name == accountName).FirstOrDefaultAsync();
            _accountRepository.RemoveAccount(account);
            await _accountRepository.SaveChangesAsync();
            return _mapper.Map<AccountModel>(account);
        }

        public async Task<SnapshotProfileModel> ProfileExists(string accountName, SnapshotProfileModel profileModel)
        {
            var account = await _accountRepository.GetAccounts(a => a.Name == accountName).Include(account => account.Profiles).FirstOrDefaultAsync();

            if (account == null)
                throw new Exception("Can't find account");

            var profile = account.Profiles.FirstOrDefault(profile => profile.ClientId == profileModel.ClientId);

            if (profile == null)
                throw new Exception("Can't find profile");

            return _mapper.Map<SnapshotProfileModel>(profile);
        }
        public async Task<SnapshotProfileModel> GetProfile(string profileId)
        {
            var profile = await _accountRepository.GetProfiles(profile => profile.ClientId == profileId).FirstOrDefaultAsync();
            return _mapper.Map<SnapshotProfileModel>(profile);
        }

        public async Task<SnapshotProfileModel> GetActiveProfileWithSnapshots(string accountId)
        {
            var profile = await _accountRepository.GetProfiles(profile => profile.Account.ClientId == accountId && profile.Active).FirstOrDefaultAsync();
            var snapshots = await _snapshotRepository.GetSnapshots(snapshot => snapshot.ProfileClientId == profile.ClientId).ToListAsync();
            
            var profileModel = _mapper.Map<SnapshotProfileModel>(profile);
            profileModel.Snapshots = _mapper.Map<List<SnapshotModel>>(snapshots);
            return profileModel;
        }

        public async Task<SnapshotProfileModel> GetProfileWithSnapshots(string profileId)
        {
            var profile = await _accountRepository.GetProfiles(profile => profile.ClientId == profileId).FirstOrDefaultAsync();
            var snapshots = await _snapshotRepository.GetSnapshots(snapshot => snapshot.ProfileClientId == profile.ClientId).ToListAsync();

            var profileModel = _mapper.Map<SnapshotProfileModel>(profile);
            profileModel.Snapshots = _mapper.Map<List<SnapshotModel>>(snapshots);
            return profileModel;
        }

        public async Task<List<SnapshotProfileModel>> GetAllProfiles(string accountName)
        {
            var account = await _accountRepository.GetAccounts(account => account.Name == accountName)
                .Include(account => account.Profiles)
                .FirstOrDefaultAsync();
            return _mapper.Map<List<SnapshotProfileModel>>(account.Profiles);
        }

        public async Task<SnapshotProfileModel> AddProfile(string accountName, SnapshotProfileModel profileModel)
        {
            var account = await _accountRepository.GetAccounts(account => account.Name == accountName).Include(account => account.Profiles).FirstOrDefaultAsync();

            if (account == null)
                throw new Exception("Can't find account");

            var profile = _mapper.Map<SnapshotProfile>(profileModel);

            profile.Created = DateTime.UtcNow;

            account.Profiles.Add(profile);
            await _accountRepository.SaveChangesAsync();
            return _mapper.Map<SnapshotProfileModel>(profile);
        }

        public async Task<SnapshotProfileModel> EditProfile(string accountName, SnapshotProfileModel profileModel)
        {
            var account = await _accountRepository.GetAccounts(account => account.Name == accountName).Include(account => account.Profiles).FirstOrDefaultAsync();

            if (account == null)
                throw new Exception("Can't find account");

            var profile = account.Profiles.FirstOrDefault(profile => profile.ClientId == profileModel.ClientId);

            if (profile == null)
                throw new Exception("Can't find profile");

            _mapper.Map<SnapshotProfileModel, SnapshotProfile>(profileModel, profile);

            await _accountRepository.SaveChangesAsync();
            return _mapper.Map<SnapshotProfileModel>(profile);
        }

        public async Task<SnapshotProfileModel> RemoveProfile(string accountName, string profileId)
        {
            var account = await _accountRepository.GetAccounts(account => account.Name == accountName).Include(account => account.Profiles).FirstOrDefaultAsync();
            var profile = account.Profiles.First(p => p.ClientId == profileId);
            _accountRepository.RemoveProfile(profile);
            await _accountRepository.SaveChangesAsync();
            return _mapper.Map<SnapshotProfileModel>(profile);
        }

        public async Task RemoveAllProfiles(string accountId)
        {
            var account = await _accountRepository.GetAccounts(account => account.ClientId == accountId)
                .Include(account => account.Profiles)
                .FirstOrDefaultAsync();

            account.Profiles.Clear();

            await _accountRepository.SaveChangesAsync();
        }

        public async Task<SnapshotProfileModel> ChangeProfile(string accountName, string profileId)
        {
            var account = await _accountRepository
                .GetAccounts(account => account.Name == accountName)
                .Include(account => account.Profiles)
                .FirstOrDefaultAsync();

            var profile = account.Profiles.First(p => p.ClientId == profileId);

            foreach (var accountProfile in account.Profiles)
            {
                accountProfile.Active = false;
            }

            profile.Active = true;

            await _accountRepository.SaveChangesAsync();
            return _mapper.Map<SnapshotProfileModel>(profile);
        }

    }

}
