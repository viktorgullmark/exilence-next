using Microsoft.EntityFrameworkCore;
using Shared.Entities;
using Shared.Interfaces;
using System;
using System.Collections.Generic;
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
            await _exilenceContext.Accounts.AddAsync(account);
            await _exilenceContext.SaveChangesAsync();
            return account;
        }

        public async Task<Account> GetAccount(int id)
        {
            var account = await _exilenceContext.Accounts.FirstOrDefaultAsync(t => t.Id == id);
            return account;
        }

        public async Task<Account> GetAccount(string name)
        {
            var account = await _exilenceContext.Accounts.FirstOrDefaultAsync(t => t.Name == name);
            return account;
        }


    }
}
