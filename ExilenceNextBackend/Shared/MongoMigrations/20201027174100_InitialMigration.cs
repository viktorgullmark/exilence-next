using MongoDB.Driver;
using MongoDBMigrations;

namespace Shared.MongoMigrations
{
    public class InitialMigration : IMigration
    {
        public Version Version => new Version(1, 0, 0);
        public string Name => "Initial Migration";
        public void Up(IMongoDatabase database)
        {
            //database.RunCommand();
        }

        public void Down(IMongoDatabase database)
        {
        }
    }
}
