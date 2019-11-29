using Shared.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Shared.Interfaces
{
    public interface ISnapshotRepository
    {
        Task<bool> SnapshotExists(string clientId);
        IQueryable<Snapshot> GetSnapshots(Expression<Func<Group, bool>> predicate);
        IQueryable<Stashtab> GetStashtabs(Expression<Func<Group, bool>> predicate);
        Task SaveChangesAsync();


    }
}
