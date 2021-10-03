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
    public class PriceRepository : IPriceRepository
    {
        private readonly IMongoClient _client;
        private readonly IMongoDatabase _database;

        private readonly IMongoCollection<object> _prices;
        
        public PriceRepository(IConfiguration configuration)
        {
            _client = new MongoClient(configuration.GetSection("ConnectionStrings")["Mongo"]);
            _database = _client.GetDatabase(configuration.GetSection("Mongo")["Database"]);
            _prices = _database.GetCollection<object>("Prices");
        }

        public async Task<object> GetPrices(Expression<Func<object, bool>> predicate)
        {
            return _prices.AsQueryable().Where(predicate);

        }

        public async Task<object> AddSnapshot(object priceModel)
        {
            _prices.InsertOneAsync(priceModel, new InsertOneOptions() { });
        }

    }
}
