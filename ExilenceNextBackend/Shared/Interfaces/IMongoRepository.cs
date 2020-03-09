using Shared.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Shared.Interfaces
{
    public interface IMongoRepository
    {
        Task<bool> SnapshotExists(string clientId);
        IQueryable<Snapshot> GetSnapshots(Expression<Func<Snapshot, bool>> predicate);
        IQueryable<StashTab> GetStashtabs(Expression<Func<StashTab, bool>> predicate);
        IQueryable<PricedItem> GetPricedItems(Expression<Func<PricedItem, bool>> predicate);
        Task AddSnapshots(List<Snapshot> snapshots);
        Task RemoveSnapshot(Snapshot snapshot);
        Task RemoveStashtab(StashTab stashtab);
        Task RemovePricedItems(string stashtabId);
        Task RemoveAllSnapshots(string profileClientId);
    }
}
