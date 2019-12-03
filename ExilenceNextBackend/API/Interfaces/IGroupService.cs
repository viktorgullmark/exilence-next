using Shared.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Interfaces
{
    public interface IGroupService
    {
        Task<GroupModel> GetGroup(string groupName);
        Task<GroupModel> JoinGroup(ConnectionModel connectionModel, string groupName);
        Task<GroupModel> LeaveGroup(ConnectionModel connectionModel, string groupName);

        Task<ConnectionModel> GetConnection(string connectionId);
        Task<ConnectionModel> AddConnection(ConnectionModel connectionMode);
        Task<ConnectionModel> RemoveConnection(string connectionId);
    }
}
