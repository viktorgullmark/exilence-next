using MongoDB.Driver;
using MongoDBMigrations;
using Shared.Entities;
using System;

namespace Shared.MongoMigrations
{
    public class CacheMigration : IMigration
    {
        public MongoDBMigrations.Version Version => new MongoDBMigrations.Version(1, 1, 0);
        public string Name => "Cache";
        public void Up(IMongoDatabase database)
        {
            database.CreateCollection("Cache");
            var collection = database.GetCollection<CacheValue>("Cache");
            var indexModel = new CreateIndexModel<CacheValue>(
                keys: Builders<CacheValue>.IndexKeys.Ascending("ExpireAt"),
                options: new CreateIndexOptions
                {
                    ExpireAfter = TimeSpan.FromSeconds(0),
                    Name = "ExpireAtIndex"
                });

            collection.Indexes.CreateOne(indexModel);
        }

        public void Down(IMongoDatabase database)
        {
            database.DropCollection("Cache");
        }
    }
}
