using AutoMapper;
using Microsoft.AspNetCore.SignalR;
using Shared.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Hubs
{
    public partial class BaseHub : Hub
    {
        public async Task JoinGroup(string name)
        {
            var connection = await _groupRepository.GetConnection(Context.ConnectionId);
            var group = await _groupRepository.GetGroup(name);
            if (group == null)
            {
                group = new Group(name, new List<Connection>() { connection });
                group = await _groupRepository.AddGroup(group);
            }
            else
            {
                group.Connections.Add(connection);
            }
            await _groupRepository.SaveChangesAsync();
            await Groups.AddToGroupAsync(Context.ConnectionId, name);
            await Log($"Added connectionId: {connection.ConnectionId} to group: {group.Name}");
        }

        public async Task LeaveGroup(string name)
        {
            var group = await _groupRepository.GetGroup(name);
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

        }
    }
}
