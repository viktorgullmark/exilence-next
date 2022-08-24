using Microsoft.Extensions.Configuration;
using MongoDB.Driver;
using MongoDB.Driver.Linq;
using Shared.Entities.Prices;
using Shared.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace Shared.Repositories
{
    public class ExternalPriceRepository : IExternalPriceRepository
    {
        private readonly IMongoClient _client;
        private readonly IMongoDatabase _database;

        private readonly IMongoCollection<ExternalPrice> _externalPrices;

        public ExternalPriceRepository(IConfiguration configuration)
        {
            _client = new MongoClient(configuration.GetSection("ConnectionStrings")["Mongo"]);
            _database = _client.GetDatabase(configuration.GetSection("Mongo")["Database"]);
            _externalPrices = _database.GetCollection<ExternalPrice>("ExternalPrices");
        }

        public IQueryable<ExternalPrice> Queryable(Expression<Func<ExternalPrice, bool>> predicate)
        {
            return _externalPrices.AsQueryable().Where(predicate);
        }

        public async Task AddPrices(IEnumerable<ExternalPrice> externalPrices)
        {
            await _externalPrices.InsertManyAsync(externalPrices);
        }

        public async Task<ExternalPrice> GetPrice(string key)
        {
            var price = await _externalPrices.AsQueryable().FirstOrDefaultAsync();
            return price;
        }
    }
}
