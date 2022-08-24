using API.Interfaces;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Shared.Entities;
using Shared.Entities.Prices;
using Shared.Interfaces;
using Shared.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Services
{
    public class PriceService : IPriceService
    {
        IExternalPriceRepository _externalPriceRepository;
        readonly IMapper _mapper;

        public PriceService(IExternalPriceRepository externalPriceRepository, IMapper mapper)
        {
            _externalPriceRepository = externalPriceRepository;
            _mapper = mapper;
        }

        public async Task AddPrices(IEnumerable<ExternalPriceModel> externalPriceModels)
        {
            try
            {
                var externalPrices = _mapper.Map<IEnumerable<ExternalPrice>>(externalPriceModels);
                await _externalPriceRepository.AddPrices(externalPrices);

            }
            catch (System.Exception e)
            {
                throw e;
            }
        }

        public async Task<ExternalPriceModel> PriceItem(PricedItemModel itemModel)
        {
            PricedItem item = _mapper.Map<PricedItem>(itemModel);
            ExternalPrice price = await _externalPriceRepository.Queryable(externalPrice =>
                externalPrice.Name == item.Name &&
                externalPrice.Quality == item.Quality &&
                externalPrice.Links == item.Links &&
                externalPrice.Level == item.Level &&
                externalPrice.Corrupted == item.Corrupted &&
                externalPrice.FrameType == item.FrameType &&
                externalPrice.Variant == item.Variant &&
                externalPrice.Elder == item.Elder &&
                externalPrice.Shaper == item.Shaper &&
                externalPrice.Ilvl == item.Ilvl &&
                externalPrice.Icon == item.Icon &&
                externalPrice.Tier == item.Tier
            ).FirstOrDefaultAsync();
            return _mapper.Map<ExternalPriceModel>(price);
        }
    }
}
