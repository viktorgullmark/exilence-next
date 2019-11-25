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
    public class EconomyRepository : IEconomyRepository
    {
        private readonly ExilenceContext _exilenceContext;
        public EconomyRepository(ExilenceContext context)
        {
            _exilenceContext = context;
        }

        public async Task<bool> SnapshotExists(string clientId)
        {
            var count = await _exilenceContext.Snapshots.Where(s => s.ClientId == clientId).CountAsync();
            return count > 0;

        }

        public IQueryable<Snapshot> RetriveSnapshots(Expression<Func<Snapshot, bool>> predicate)
        {
            return _exilenceContext.Snapshots.Where(predicate);
        }
    }
}
