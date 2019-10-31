using Shared.Entities;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Shared.Interfaces
{
    public interface IAccountRepository
    {
        Task<Account> CreateAccount(Account account);
        Task<Account> GetAccount(int id);
        Task<Account> GetAccount(string name);
        Task SaveChangesAsync();
    }
}
