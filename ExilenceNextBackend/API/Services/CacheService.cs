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

        public async Task<string> Get(string key)
        {
            CacheItem cache = await _cacheRepository.Get(key);

            if (cache != null)
                return cache.Value;

            return null;
        }


        public async Task Add(string key, string value, DateTime expireAt)
        {
            CacheItem cacheValue = new CacheItem()
            {
                Key = key,
                Value = value,
                ExpireAt = expireAt
            };

            await _cacheRepository.Add(cacheValue);
        }

    }
}
