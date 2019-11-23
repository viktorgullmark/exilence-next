using AutoMapper;
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
                else
                {
                    group.Connections.Add(connection);
                }
                await _groupRepository.SaveChangesAsync();
                await Groups.AddToGroupAsync(Context.ConnectionId, name);
                await Log($"Added connectionId: {connection.ConnectionId} to group: {group.Name}");
            }
            catch (Exception e)
            {
                await Log(e.Message);
                await Clients.Caller.SendAsync("OnJoinGroup", false);
            }
            await Clients.Caller.SendAsync("OnJoinGroup", true);
        }

        public async Task LeaveGroup(string name)
        {
            try
            {
                var test = await _groupRepository.GetGroupQuery(g => g.Name == name).FirstOrDefaultAsync();

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
            catch (Exception e)
            {
                await Log(e.Message);
                await Clients.Caller.SendAsync("OnLeaveGroup", false);
            }
            await Clients.Caller.SendAsync("OnLeaveGroup", true);
        }


        public async Task AddSnapshot()
        {

        }

        //public async Task UploadStream(IAsyncEnumerable<string> stream)
        //{
        //    await foreach (var item in stream)
        //    {
        //        Console.WriteLine(item);
        //    }
        //}

        public async IAsyncEnumerable<int> DownloadSnapshots(int count, int delay, [EnumeratorCancellation] CancellationToken cancellationToken)
        {
            //Can be something else then ints
            var listOfSnapshots = Enumerable.Range(0, count).AsQueryable();

            foreach (var snapshot in listOfSnapshots)
            {
                // Check the cancellation token regularly so that the server will stop
                // producing items if the client disconnects.
                cancellationToken.ThrowIfCancellationRequested();

                yield return snapshot;

                // Use the cancellationToken in other APIs that accept cancellation
                // tokens so the cancellation can flow down to them.
                await Task.Delay(delay, cancellationToken);
            }
        }
    }
}
