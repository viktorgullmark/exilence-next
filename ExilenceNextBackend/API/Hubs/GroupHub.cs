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
        public async Task<GroupModel> JoinGroup(string groupName)
        {
            var connectionModel = await _groupService.GetConnection(ConnectionId);
            var groupModel = await _groupService.JoinGroup(connectionModel, groupName);
            return groupModel;
        }

        public async Task<GroupModel> LeaveGroup(string groupName)
        {
            var connectionModel = await _groupService.GetConnection(ConnectionId);
            var groupModel = await _groupService.LeaveGroup(connectionModel, groupName);
            return groupModel;
        }
    }
}
