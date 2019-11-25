using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Shared.Entities;
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
        public async Task JoinGroup(string name)
        {
            try
            {
                var connection = await _groupRepository.GetConnection(Context.ConnectionId);
                var group = await _groupRepository.GetGroup(name);
                if (group == null)
                {
                    group = new Group(name, new List<Connection>() { connection });
                    group = await _groupRepository.AddGroup(group);
                }
                else if (!group.Connections.Any(c => c.ConnectionId == connection.ConnectionId))
                {
                    group.Connections.Add(connection);
                }
                await _groupRepository.SaveChangesAsync();
                await Groups.AddToGroupAsync(Context.ConnectionId, name);
                await Log($"Added connectionId: {connection.ConnectionId} to group: {group.Name}");
                await Clients.Caller.SendAsync("JoinGroup", group);
            }
            catch (Exception e)
            {
                await Log(e.Message);
                await Clients.Caller.SendAsync("JoinGroup", e);
            }
        }

        public async Task LeaveGroup(string name)
        {
            try
            {
                var group = await _groupRepository.GetGroupQuery(g => g.Name == name).FirstOrDefaultAsync();

                if (group == null)
                {
                    throw new Exception("Group not found");
                }

                var connection = group.Connections.FirstOrDefault(t => t.ConnectionId == Context.ConnectionId);
                group.Connections.Remove(connection);
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, name);
                await Log($"Removed connectionId: {connection.ConnectionId} from group: {group.Name}");
                if (!group.Connections.Any())
                {
                    group = await _groupRepository.RemoveGroup(group.Name);
                    await Log($"Removed group: {group.Name}, Reason: No connections left");
                }
                await _groupRepository.SaveChangesAsync();
                await Clients.Caller.SendAsync("LeaveGroup", group);
            }
            catch (Exception e)
            {
                await Log(e.Message);
                await Clients.Caller.SendAsync("LeaveGroup", e);
            }
        }
    }
}
