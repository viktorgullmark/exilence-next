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

        public async Task<Account> CreateAccount(Account account)
        {
            account.Created = DateTime.UtcNow;

            await _exilenceContext.Accounts.AddAsync(account);
            await _exilenceContext.SaveChangesAsync();
            return account;
        }

        public IQueryable<Account> GetAccounts(Expression<Func<Account, bool>> predicate)
        {
            return _exilenceContext.Accounts.Where(predicate);
        }

        public IQueryable<SnapshotProfile> GetProfiles(Expression<Func<SnapshotProfile, bool>> predicate)
        {
            return _exilenceContext.SnapshotProfiles.Where(predicate);
        }

        public async Task SaveChangesAsync()
        {
            await _exilenceContext.SaveChangesAsync();
        }


    }
}
