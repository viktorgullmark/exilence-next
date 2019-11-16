using Shared.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using System.Threading.Tasks;
using Shared.Entities;
using System.Linq.Expressions;

namespace Shared.Repositories
{
    class EconomyRepository : IEconomyRepository
    {
        private readonly ExilenceContext _exilenceContext;
        public EconomyRepository(ExilenceContext context)
        {
            _exilenceContext = context;
        }

        public IQueryable<Snapshot> RetriveSnapshots(Expression<Func<Snapshot, bool>> predicate)
        {
            return _exilenceContext.Snapshots.Where(predicate);
        }
    }
}
