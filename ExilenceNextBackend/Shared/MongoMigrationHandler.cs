using MongoDBMigrations;

namespace Shared
{
    public class MongoMigrationHandler
    {
        // https://bitbucket.org/i_am_a_kernel/mongodbmigrations/src/master/
        public static MigrationResult Run(string connectionString, string databaseName)
        {
            var result = new MigrationEngine().UseDatabase(connectionString, databaseName)
                .UseAssemblyOfType<MongoMigrationHandler>() //Required   
                .UseSchemeValidation(false)  //Optional true or false
              //.UseCancelationToken(token) //Optional if you wanna have posibility to cancel migration process. Might be usefull when you have many migrations and some interaction with user.
              //.UseProgressHandler(Action <> action) // Optional some delegate that will be called each migration
                .Run(); // Execution call. Might be called without targetVersion, in that case, the engine will choose the latest available version.

            return result;
        }
    }
}
