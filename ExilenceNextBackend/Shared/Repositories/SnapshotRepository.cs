using Shared.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using System.Threading.Tasks;
using Shared.Entities;
using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using EFCore.BulkExtensions;

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

        public async Task AddSnapshots(List<Snapshot> snapshots)
        {
            var pricedItems = new List<PricedItem>();
            var stashTabs = new List<Stashtab>();

            using var transaction = _exilenceContext.Database.BeginTransaction();

            var bulkConfig = new BulkConfig { PreserveInsertOrder = true, SetOutputIdentity = true };
            await _exilenceContext.BulkInsertAsync(snapshots, bulkConfig);

            foreach (var snapshot in snapshots)
            {
                foreach (var stashtab in snapshot.StashTabs)
                {
                    stashtab.SnapshotId = snapshot.Id;
                    foreach (var pricedItem in stashtab.PricedItems)
                    {
                        pricedItem.StashtabId = stashtab.Id;
                    }
                    pricedItems.AddRange(stashtab.PricedItems);
                }
                stashTabs.AddRange(snapshot.StashTabs);
            }

            await _exilenceContext.BulkInsertAsync(stashTabs, bulkConfig);
            await _exilenceContext.BulkInsertAsync(pricedItems);

            transaction.Commit();
        }

        public async Task RemovePricedItems(string profileId)
        {
            await _exilenceContext.PricedItems.Where(pricedItems => pricedItems.Stashtab.Snapshot.Profile.ClientId == profileId).BatchDeleteAsync();
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
