using Shared.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Interfaces
{
    public interface IPriceService
    {
        Task AddPrices(IEnumerable<ExternalPriceModel> externalPriceModels);
        Task<ExternalPriceModel> PriceItem(PricedItemModel item);
    }
}
