using Microsoft.EntityFrameworkCore;
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
    public class GroupRepository : IGroupRepository
    {
        private readonly ExilenceContext _exilenceContext;
        public GroupRepository(ExilenceContext context)
        {
            _exilenceContext = context;
        }

        public Group AddGroup(Group group)
        {
            _exilenceContext.Groups.Add(group);
            return group;
        }

        public IQueryable<Group> GetGroups(Expression<Func<Group, bool>> predicate)
        {
            var group = _exilenceContext.Groups.Where(predicate);
            return group;
        }

        public async Task<Group> RemoveGroup(string groupName)
        {
            var group = await GetGroups(g => g.Name == groupName).FirstOrDefaultAsync();
            _exilenceContext.Groups.Remove(group);
            return group;
        }

        public async Task<Connection> GetConnection(string connectionId)
        {
            var connection = await _exilenceContext.Connections
                .Include(connection => connection.Account)
                .ThenInclude(account => account.Profiles)
                .FirstOrDefaultAsync(c => c.ConnectionId == connectionId);
            return connection;
        }

        public async Task<Connection> RemoveConnection(string connectionId)
        {
            var connection = await GetConnection(connectionId);
            _exilenceContext.Connections.Remove(connection);
            return connection;
        }

        public Connection AddConnection(Connection connection)
        {
            _exilenceContext.Connections.Add(connection);
            return connection;
        }

        public async Task SaveChangesAsync()
        {
            await _exilenceContext.SaveChangesAsync();
        }
    }
}
