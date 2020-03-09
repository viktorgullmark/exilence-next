using Microsoft.Extensions.Configuration;
using MongoDB.Driver;
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


    public class MongoRepository : IMongoRepository
    {
        private readonly IMongoClient _client;
        private readonly IMongoDatabase _database;

        private readonly IMongoCollection<StashTab> _stashtabs;
        private readonly IMongoCollection<Snapshot> _snapshots;
        private readonly IMongoCollection<PricedItem> _pricedItems;

        public MongoRepository(IConfiguration configuration)
        {
            _client = new MongoClient(configuration.GetSection("ConnectionStrings")["Mongo"]);
            _database = _client.GetDatabase(configuration.GetSection("Mongo")["Database"]);
            _snapshots = _database.GetCollection<Snapshot>("Snapshots");
            _stashtabs = _database.GetCollection<StashTab>("Stashtabs");
            _pricedItems = _database.GetCollection<PricedItem>("Stashtabs");
        }

        public async Task<bool> SnapshotExists(string clientId)
        {
            var count = await _snapshots.CountDocumentsAsync(s => s.ClientId == clientId);
            return count > 0;
        }

        public IQueryable<Snapshot> GetSnapshots(Expression<Func<Snapshot, bool>> predicate)
        {
            return _snapshots.AsQueryable();
        }

        public IQueryable<StashTab> GetStashtabs(Expression<Func<StashTab, bool>> predicate)
        {
            return _stashtabs.AsQueryable();
        }
        public IQueryable<PricedItem> GetPricedItems(Expression<Func<PricedItem, bool>> predicate)
        {
            return _pricedItems.AsQueryable();
        }

        public async Task RemoveSnapshot(Snapshot snapshot)
        {
            await _snapshots.DeleteOneAsync(s => s.ClientId == snapshot.ClientId);
        }

        public async Task RemoveStashtab(StashTab stashtab)
        {
            await _stashtabs.DeleteOneAsync(s => s.ClientId == stashtab.ClientId);
        }

        public async Task AddSnapshots(List<Snapshot> snapshots)
        {
            await _snapshots.InsertManyAsync(snapshots);
        }

        public async Task RemovePricedItems(string stashtabId)
        {
            await _pricedItems.DeleteManyAsync(s => s.StashtabClientId == stashtabId);
        }

        public async Task RemoveAllSnapshots(string profileClientId)
        {
            await _snapshots.DeleteManyAsync(s => s.ProfileClientId == profileClientId);
        }


    }
}
