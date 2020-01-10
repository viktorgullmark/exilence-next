using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Shared.Entities;
using Shared.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading;
using System.Threading.Channels;
using System.Threading.Tasks;

namespace API.Hubs
{
    public partial class BaseHub : Hub
    {
        [Authorize]
        public async Task<string> GroupExists(string groupName)
        {
            var group = await _groupService.GetGroup(groupName);
            return group?.Name;
        }

        [Authorize]
        public async Task<GroupModel> JoinGroup(GroupModel groupModel)
        {
            var connection = groupModel.Connections.First(c => c.ConnectionId == ConnectionId);

            groupModel = await _groupService.JoinGroup(ConnectionId, groupModel);
            await Groups.AddToGroupAsync(ConnectionId, groupModel.Name);

            await Clients.Group(groupModel.Name).SendAsync("OnJoinGroup", connection);
            await Log($"Joined group: {groupModel.Name}");
            return groupModel;
        }

        [Authorize]
        public async Task<GroupModel> LeaveGroup(GroupModel groupModel)
        {
            var connection = groupModel.Connections.First(c => c.ConnectionId == ConnectionId);

            groupModel = await _groupService.LeaveGroup(ConnectionId, groupModel);
            await Groups.RemoveFromGroupAsync(ConnectionId, groupModel.Name);
            
            await Clients.Group(groupModel.Name).SendAsync("OnLeaveGroup", connection);
            await Log($"Left group: {groupModel.Name}");
            return groupModel;
        }

        public async Task<GroupModel> AddLogger(GroupModel groupModel)
        {
            if (groupModel.Password == _loggerPassword)
            {
                var groupName = "logger";
                groupModel = await _groupService.JoinGroup(ConnectionId, groupModel);
                await Groups.AddToGroupAsync(ConnectionId, groupName);
                await Log($"Joined logger group.");
                return groupModel;
            }
            return null;
        }


    }
}
