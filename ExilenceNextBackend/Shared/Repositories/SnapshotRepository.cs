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

        public IQueryable<Snapshot> GetSnapshots(Expression<Func<Snapshot, bool>> predicate)
        {
            return _exilenceContext.Snapshots.Where(predicate);
        }

        public IQueryable<Stashtab> GetStashtabs(Expression<Func<Stashtab, bool>> predicate)
        {
            return _exilenceContext.StashTabs.Where(predicate);
        }
        public async Task SaveChangesAsync()
        {
            await _exilenceContext.SaveChangesAsync();
        }

        public Snapshot RemoveSnapshot(Snapshot snapshot)
        {
            _exilenceContext.Snapshots.Remove(snapshot);
            return snapshot;
        }

        public Stashtab RemoveStashtab(Stashtab stashtab)
        {
            _exilenceContext.StashTabs.Remove(stashtab);
            return stashtab;
        }
    }
}
