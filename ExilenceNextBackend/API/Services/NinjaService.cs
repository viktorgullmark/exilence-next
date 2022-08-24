using API.Interfaces;
using AutoMapper;
using Shared.Entities.Prices;
using Shared.Interfaces;
using System.Threading.Tasks;

namespace API.Services
{
    public class NinjaService : INinjaService
    {
        IExternalPriceRepository _ninjaCurrencyLineRepository;
        readonly IMapper _mapper;


        public NinjaService(IExternalPriceRepository ninjaCurrencyLineRepository, IMapper mapper)
        {
            _ninjaCurrencyLineRepository = ninjaCurrencyLineRepository;
            _mapper = mapper;
        }

        public async Task<string> GetPrice(string key)
        {
            ExternalPrice price = await _ninjaCurrencyLineRepository.GetPrice(key);
            return price.Calculated.ToString();
        }


    }
}
