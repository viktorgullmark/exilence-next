using Shared.Entities;
using System;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace Shared.Interfaces
{   public interface IGroupRepository
    {
        IQueryable<Group> GetGroups(Expression<Func<Group, bool>> predicate);
        Group AddGroup(Group group);
        Task<Group> RemoveGroup(string name);

        Task<Connection> GetConnection(string connectionId);
        Connection AddConnection(Connection connection);
        Task<Connection> RemoveConnection(string connectionId);

        Task SaveChangesAsync();
    }
}