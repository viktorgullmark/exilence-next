using AutoMapper;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Hubs
{
    public partial class BaseHub : Hub
    {
        public async Task JoinGroup(string group)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, group);
            await Clients.All.SendAsync("Log", $"Added connectionId: {Context.ConnectionId} to group: {group}");
        }

        public async Task LeaveGroup(string group)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, group);
            await Clients.All.SendAsync("Log", $"Removed connectionId: {Context.ConnectionId} to group: {group}");
        }
    }
}
