using Shared.Entities;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Shared.Interfaces
{
    public interface ISnapshotRepository
    {
        Task<bool> SnapshotExists(string clientId);
        Task<SnapshotProfile> AddProfile(string accountClientId, SnapshotProfile profile);
        Task<SnapshotProfile> AddProfile(int accountId, SnapshotProfile profile);
        Task<Snapshot> AddSnapshot(int profileId, Snapshot snapshot);
        Task<Snapshot> AddSnapshot(string profileClientId, Snapshot snapshot);
        Task<Stashtab> AddStashtab(int snapshotId, Stashtab stashtab);
        Task<Stashtab> AddStashtab(string snapshotClientId, Stashtab stashtab);
    }
}
