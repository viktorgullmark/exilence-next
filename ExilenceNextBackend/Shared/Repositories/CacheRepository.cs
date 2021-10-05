using Microsoft.Extensions.Configuration;
using MongoDB.Driver;
using MongoDB.Driver.Linq;
using Shared.Entities;
using Shared.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Shared.Repositories
{
    public class CacheRepository : ICacheRepository
    {
        private readonly IMongoClient _client;
        private readonly IMongoDatabase _database;

        private readonly IMongoCollection<CacheItem> _cache;
        
        public CacheRepository(IConfiguration configuration)
        {
            _client = new MongoClient(configuration.GetSection("ConnectionStrings")["Mongo"]);
            _database = _client.GetDatabase(configuration.GetSection("Mongo")["Database"]);
            _cache = _database.GetCollection<CacheItem>("Cache");
        }

        public IQueryable<CacheItem> Queryable(Expression<Func<CacheItem, bool>> predicate)
        {
            return _cache.AsQueryable().Where(predicate);

        }

        public async Task<CacheItem> Get(string key)
        {
            return await _cache.AsQueryable().FirstOrDefaultAsync(c => c.Key == key);
        }

        public async Task Add(CacheItem cacheValue)
        {
            await _cache.InsertOneAsync(cacheValue);
        }

    }
}
