using Shared.Entities;
using Shared.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Interfaces
{
    public interface ISnapshotService
    {
        Task<SnapshotModel> GetSnapshot(string snapshotId);
        Task<SnapshotModel> GetSnapshotWithItems(string snapshotClientId);
        //Task<SnapshotModel> AddSnapshotUsingBulk(string profileId, SnapshotModel snapshotModel);
        Task<SnapshotModel> AddSnapshot(string profileId, SnapshotModel snapshotModel);
        Task RemoveSnapshot(string snapshotId);
        Task RemoveAllSnapshots(string profileClientId);
        Task<StashtabModel> GetStashtab(string stashtabId);
        Task<StashtabModel> AddStashtab(string snapshotId, StashtabModel stashtabModel);
        Task<PricedItemModel> AddPricedItem(string stashtabId, PricedItemModel stashtabModel);
        Task<StashtabModel> AddPricedItems(string stashtabId, List<PricedItemModel> pricedItemModels);
        Task<StashtabModel> RemoveStashtab(string snapshotId, string stashtabId);
        IQueryable<Stashtab> GetStashtabs(string snapshotId);
    }
}