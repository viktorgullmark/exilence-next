using Shared.Entities;
using System.Threading.Tasks;

namespace Shared.Interfaces
{   public interface IGroupRepository
    {
        Task<Group> GetGroup(string name);
        Task<Group> AddGroup(Group group);
        Task<Group> RemoveGroup(string name);

        Task<Connection> GetConnection(string connectionId);
        Task<Connection> AddConnection(Connection connection);
        Task<Connection> RemoveConnection(string connectionId);

        Task SaveChangesAsync();
    }
}