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
    public class CacheService : ICacheService
    {
        ICacheRepository _cacheRepository;
        readonly IMapper _mapper;


        public CacheService(ICacheRepository cacheRepository, IMapper mapper)
        {
            _cacheRepository = cacheRepository;
            _mapper = mapper;
        }

        public async Task<CacheValue> GetPrices(CacheValue value)
        {
            throw new NotImplementedException();
        }

        public async Task Add(CacheValue cacheValue)
        {
            throw new NotImplementedException();
        }

    }
}
