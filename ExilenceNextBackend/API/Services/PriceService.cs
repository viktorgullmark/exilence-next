using API.Interfaces;
using AutoMapper;
using Shared.Interfaces;

namespace API.Services
{
    public class PriceService : IPriceService
    {
        IExternalPriceRepository _ninjaCurrencyLineRepository;
        readonly IMapper _mapper;

        public PriceService(IExternalPriceRepository ninjaCurrencyLineRepository, IMapper mapper)
        {
            _ninjaCurrencyLineRepository = ninjaCurrencyLineRepository;
            _mapper = mapper;
        }
    }
}
