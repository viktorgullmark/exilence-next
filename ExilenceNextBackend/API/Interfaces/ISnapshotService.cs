using Shared.Models;
using System.Threading.Tasks;

namespace API.Interfaces
{
    public interface ISnapshotService
    {   
        Task<SnapshotModel> AddSnapshot(string profileClientId, SnapshotModel snapshotModel);
        Task<StashtabModel> AddStashtab(string snapshotClientId, StashtabModel stashtabModel);

    }
}