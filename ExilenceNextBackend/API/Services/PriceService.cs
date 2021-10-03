using API.Interfaces;
using AutoMapper;
using MongoDB.Driver;
using MongoDB.Driver.Linq;
using Shared.Entities;
using Shared.Interfaces;
using Shared.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Services
{
    public class PriceService : IPriceService
    {
        IPriceRepository _priceRepository;
        readonly IMapper _mapper;


        public PriceService(IPriceRepository priceRepository, IMapper mapper)
        {
            _priceRepository = priceRepository;
            _mapper = mapper;
        }

        public async Task<object> GetPrices(string snapshotClientId)
        {
            throw new NotImplementedException();

        }

        public async Task<SnapshotModel> AddSnapshot(string profileClientId, SnapshotModel snapshotModel)
        {
            throw new NotImplementedException();
        }

    }
}
