using MongoDB.Driver;
using MongoDBMigrations;
using System;

namespace Shared.MongoMigrations
{
    public class PriceCacheMigration : IMigration
    {
        public MongoDBMigrations.Version Version => new MongoDBMigrations.Version(1, 0, 0);
        public string Name => "Cache";
        public void Up(IMongoDatabase database)
        {
            database.CreateCollection("Cache", new CreateCollectionOptions() { ExpireAfter = new TimeSpan(0, 0, 0) }); ;
        }

        public void Down(IMongoDatabase database)
        {
            database.DropCollection("Cache");
        }
    }
}
