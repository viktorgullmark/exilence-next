using Shared.Entities.Prices;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace Shared.Interfaces
{
    public interface IExternalPriceRepository
    {
        IQueryable<ExternalPrice> Queryable(Expression<Func<ExternalPrice, bool>> predicate);
        Task AddPrices(IEnumerable<ExternalPrice> externalPrices);
        Task<ExternalPrice> GetPrice(string key);
    }
}
