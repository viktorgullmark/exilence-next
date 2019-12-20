using Shared.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Interfaces
{
    public interface IAccountService
    {
        Task<AccountModel> GetAccount(string accountName);
        Task<AccountModel> AddAccount(AccountModel accountModel);
        Task<AccountModel> EditAccount(AccountModel accountModel);
        Task<AccountModel> RemoveAccount(string accountName);
        Task<SnapshotProfileModel> GetProfile(string accountName, string profileClientId);
        Task<SnapshotProfileModel> AddProfile(string accountName, SnapshotProfileModel profileModel);
        Task<SnapshotProfileModel> EditProfile(string accountName, SnapshotProfileModel profileModel);
        Task<SnapshotProfileModel> RemoveProfile(string accountName, string profileClientIt);
    }
}
