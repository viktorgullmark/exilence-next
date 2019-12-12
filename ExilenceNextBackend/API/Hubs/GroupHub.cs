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
            var groupModel = await _groupService.JoinGroup(_connectionId, groupName);
            await Groups.AddToGroupAsync(_connectionId, groupName);
            await Log($"{_connectionId}´joined group {groupName}");
            return groupModel;
        }

        public async Task<GroupModel> LeaveGroup(string groupName)
        {
            var groupModel = await _groupService.LeaveGroup(_connectionId, groupName);
            await Groups.RemoveFromGroupAsync(_connectionId, groupName);
            await Log($"{_connectionId}´left group {groupName}");
            return groupModel;
        }
    }
}
