using Shared.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Shared.Interfaces
{
    public interface IAccountRepository
    {
        Account AddAccount(Account account);
        Account RemoveAccount(Account account);
        IQueryable<Account> GetAccounts(Expression<Func<Account, bool>> predicate);
        IQueryable<Connection> GetConnections(Expression<Func<Connection, bool>> predicate);
        IQueryable<SnapshotProfile> GetProfiles(Expression<Func<SnapshotProfile, bool>> predicate);
        SnapshotProfile RemoveProfile(SnapshotProfile account);
        Task SaveChangesAsync();
    }
}
