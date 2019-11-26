using Shared.Models;
using System.Threading.Tasks;

namespace API.Interfaces
{
    public interface ISnapshotService
    {
        Task<SnapshotProfileModel> AddProfile(string accountClientId, SnapshotProfileModel profileModel);
        Task<SnapshotModel> AddSnapshot(string profileClientId, SnapshotModel snapshotModel);
        Task<StashtabModel> AddStashtab(string snapshotClientId, StashtabModel stashtabModel);

    }
}