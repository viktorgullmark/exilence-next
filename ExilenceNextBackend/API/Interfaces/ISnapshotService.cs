using Shared.Entities;
using Shared.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Interfaces
{
    public interface ISnapshotService
    {
        Task<SnapshotModel> GetSnapshot(string snapshotClientId);
        Task<SnapshotModel> AddSnapshot(string profileClientId, SnapshotModel snapshotModel);
        Task<SnapshotModel> RemoveSnapshot(string profileClientId, string snapshotClientId);
        Task<StashtabModel> GetStashtab(string stashtabClientId);
        Task<StashtabModel> AddStashtab(string snapshotClientId, StashtabModel stashtabModel);
        Task<PricedItemModel> AddPricedItem(string stashtabClientId, PricedItemModel stashtabModel);
        Task<PricedItemModel> AddPricedItems(string stashtabClientId, List<PricedItemModel> stashtabModel);
        Task<StashtabModel> RemoveStashtab(string snapshotClientId, string stashtabClientId);
        IQueryable<Stashtab> GetStashtabs(string snapshotClientId);
    }
}