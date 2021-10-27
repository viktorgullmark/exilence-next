using Shared.Entities.Prices;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Shared.Interfaces
{
    public interface IExternalPriceRepository
    {
        Task AddPrices(IEnumerable<ExternalPrice> externalPrices);
        Task<ExternalPrice> GetPrice(string key);
    }
}
