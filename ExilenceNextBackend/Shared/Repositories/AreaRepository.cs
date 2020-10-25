using Microsoft.Extensions.Configuration;
using MongoDB.Driver;
using MongoDB.Driver.Linq;
using Shared.Entities;
using Shared.Entities.Areas;
using Shared.Interfaces;
using Shared.Models.Areas;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Shared.Repositories
{
    public class AreaRepository : IAreaRepository
    {
        private readonly IMongoClient _client;
        private readonly IMongoDatabase _database;

        private readonly IMongoCollection<ExtenedAreaInfo> _areas;

        public AreaRepository(IConfiguration configuration)
        {
            _client = new MongoClient(configuration.GetSection("ConnectionStrings")["Mongo"]);
            _database = _client.GetDatabase(configuration.GetSection("Mongo")["Database"]);
            _areas = _database.GetCollection<ExtenedAreaInfo>("Areas");
        }

        public async Task AddArea(ExtenedAreaInfo extenedAreaInfo)
        {
            await _areas.InsertOneAsync(extenedAreaInfo);
        }

        public IMongoQueryable<Snapshot> GetAreas(Expression<Func<ExtenedAreaInfo, bool>> predicate)
        {
            throw new NotImplementedException();
        }

        public async Task RemoveAllAreas(string accountId)
        {
            throw new NotImplementedException();
        }
    }
}
