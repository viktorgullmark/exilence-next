using Microsoft.EntityFrameworkCore;
using Shared.Entities;
using Shared.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Shared.Repositories
{
    public class AccountRepository : IAccountRepository
    {
        private readonly ExilenceContext _exilenceContext;
        public AccountRepository(ExilenceContext context)
        {
            _exilenceContext = context;
        }

        public Account AddAccount(Account account)
        {
            account.Created = DateTime.UtcNow;
            _exilenceContext.Accounts.Add(account);
            return account;
        }
        public Account RemoveAccount(Account account)
        {
            _exilenceContext.Accounts.Remove(account);
            return account;
        }

        public IQueryable<Account> GetAccounts(Expression<Func<Account, bool>> predicate)
        {
            return _exilenceContext.Accounts.Where(predicate);
        }

        public IQueryable<Connection> GetConnections(Expression<Func<Connection, bool>> predicate)
        {
            return _exilenceContext.Connections.Where(predicate);
        }

        public IQueryable<SnapshotProfile> GetProfiles(Expression<Func<SnapshotProfile, bool>> predicate)
        {
            return _exilenceContext.SnapshotProfiles.Where(predicate);
        }

        public SnapshotProfile RemoveProfile(SnapshotProfile profile)
        {
            _exilenceContext.SnapshotProfiles.Remove(profile);
            return profile;
        }

        public async Task SaveChangesAsync()
        {
            await _exilenceContext.SaveChangesAsync();
        }


    }
}
