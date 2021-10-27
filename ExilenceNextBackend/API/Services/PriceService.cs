using API.Interfaces;
using AutoMapper;
using Shared.Entities.Prices;
using Shared.Interfaces;
using Shared.Models;
using System.Collections.Generic;
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
    }
}
