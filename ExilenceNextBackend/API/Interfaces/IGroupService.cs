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
        Task<GroupModel> JoinGroup(string connectionId, string groupName);
        Task<GroupModel> LeaveGroup(string connectionId, string groupName);
    }
}
