using Shared.Entities.Prices;
using System.Threading.Tasks;

namespace Shared.Interfaces
{
    public interface IExternalPriceRepository
    {
        Task<ExternalPrice> GetPrice(string key);
    }
}
