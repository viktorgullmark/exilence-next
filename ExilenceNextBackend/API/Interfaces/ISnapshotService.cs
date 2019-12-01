using Shared.Models;
using System.Threading.Tasks;

namespace API.Interfaces
{
    public interface ISnapshotService
    {
        Task<SnapshotModel> GetSnapshot(string accountName, string snapshotClientId);
        Task<SnapshotModel> AddSnapshot(string accountName, string profileClientId, SnapshotModel snapshotModel);
        Task<SnapshotModel> RemoveSnapshot(string accountName, string profileClientId, string snapshotClientId);
        Task<StashtabModel> GetStashtab(string accountName, string stashtabClientId);
        Task<StashtabModel> AddStashtab(string accountName, string snapshotClientId, StashtabModel stashtabModel);
        Task<StashtabModel> RemoveStashtab(string accountName, string snapshotClientId, string stashtabClientId);

    }
}