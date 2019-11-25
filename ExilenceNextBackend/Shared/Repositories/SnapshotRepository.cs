using Shared.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using System.Threading.Tasks;
using Shared.Entities;
using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;

namespace Shared.Repositories
{
    public class SnapshotRepository : ISnapshotRepository
    {
        private readonly ExilenceContext _exilenceContext;
        public SnapshotRepository(ExilenceContext context)
        {
            _exilenceContext = context;
        }

        public async Task<bool> SnapshotExists(string clientId)
        {
            var count = await _exilenceContext.Snapshots.Where(s => s.ClientId == clientId).CountAsync();
            return count > 0;

        }
        
        public async Task<SnapshotProfile> AddProfile(string accountClientId, SnapshotProfile profile)
        {
            _exilenceContext.Accounts.First(a => a.ClientId == accountClientId).Profiles.Add(profile);
            await SaveChangesAsync();
            return profile;
        }

        public async Task<SnapshotProfile> AddProfile(int accountId, SnapshotProfile profile)
        {
            _exilenceContext.Accounts.First(a => a.Id == accountId).Profiles.Add(profile);
            await SaveChangesAsync();
            return profile;
        }

        public async Task<Snapshot> AddSnapshot(int profileId, Snapshot snapshot)
        {
            _exilenceContext.SnapshotProfiles.First(p => p.Id == profileId).Snapshots.Add(snapshot);
            await SaveChangesAsync();
            return snapshot;
        }

        public async Task<Snapshot> AddSnapshot(string profileClientId, Snapshot snapshot)
        {
            _exilenceContext.SnapshotProfiles.First(p => p.ClientId == profileClientId).Snapshots.Add(snapshot);
            await SaveChangesAsync();
            return snapshot;
        }

        public async Task<Stashtab> AddStashtab(string snapshotClientId, Stashtab stashtab)
        {
            var snapsot = await _exilenceContext.Snapshots.FirstAsync(s => s.ClientId == snapshotClientId);
            snapsot.StashTabs.Add(stashtab);
            await SaveChangesAsync();
            return stashtab;
        }

        public async Task<Stashtab> AddStashtab(int snapshotId, Stashtab stashtab)
        {
            var snapsot = await _exilenceContext.Snapshots.FirstAsync(s => s.Id == snapshotId);
            snapsot.StashTabs.Add(stashtab);
            await SaveChangesAsync();
            return stashtab;
        }

        public IQueryable<Snapshot> RetriveSnapshots(Expression<Func<Snapshot, bool>> predicate)
        {
            return _exilenceContext.Snapshots.Where(predicate);
        }
        
        public async Task SaveChangesAsync()
        {
            await _exilenceContext.SaveChangesAsync();
        }
    }
}
