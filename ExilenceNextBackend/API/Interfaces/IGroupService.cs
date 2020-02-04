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
        Task<GroupModel> GetGroupForConnection(string connectionId);
        Task<bool> GroupExists(string groupName);
        Task<GroupModel> JoinGroup(string connectionId, GroupModel groupModel);
        Task<GroupModel> LeaveGroup(string connectionId, string groupName);

        Task<ConnectionModel> GetConnection(string connectionId);
        Task<ConnectionModel> AddConnection(ConnectionModel connectionModel, string accountName);
        Task<ConnectionModel> RemoveConnection(string connectionId);
    }
}
