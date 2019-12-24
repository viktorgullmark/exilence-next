using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Configuration;
using Shared.Interfaces;
using Shared.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Hubs
{
    public partial class BaseHub : Hub
    {
        readonly IMapper _mapper;
        readonly ISnapshotService _snapshotService;
        readonly IAccountService _accountService;
        readonly IGroupService _groupService;

        private readonly string _instanceName;
        private string ConnectionId => Context.ConnectionId;
        private string AccountName => Context.User.Identity.Name;
        private bool IsAdmin => Context.User.IsInRole("Admin");
        private bool IsPremium => Context.User.IsInRole("Premium");

        public BaseHub(
            IMapper mapper, 
            IConfiguration configuration, 
            IGroupService groupService,
            ISnapshotService snapshotService,
            IAccountService accountService
            )
        {
            _mapper = mapper;
            _instanceName = configuration.GetSection("Settings")["InstanceName"];   

            _snapshotService = snapshotService;
            _accountService = accountService;
            _groupService = groupService;
        }

        [Authorize]
        public override async Task OnConnectedAsync()
        {
            await Log($"ConnectionId: {ConnectionId} connected");

            var connection = new ConnectionModel() {
                ConnectionId = ConnectionId,
                InstanceName = _instanceName,
                Created = DateTime.UtcNow
            };
            await _groupService.AddConnection(connection, AccountName);            
            await base.OnConnectedAsync();
        }

        [Authorize]
        public override async Task OnDisconnectedAsync(Exception exception)
        {
            await Log($"ConnectionId: {ConnectionId} disconnected");
            var groupModel = await _groupService.GetGroupForConnection(ConnectionId);
            if (groupModel != null)
            {
                await _groupService.LeaveGroup(ConnectionId, groupModel.Name);
            }
            await _groupService.RemoveConnection(ConnectionId);
            await base.OnDisconnectedAsync(exception);
        }

        [Authorize]
        public string GetConnectionId()
        {
            return Context.ConnectionId;
        }

        [Authorize]
        private async Task Log (string message)
        {
            var time = String.Format("{0:MM/dd/yyyy HH:mm:ss}", DateTime.UtcNow);
            await Clients.Group("logger").SendAsync("Log", $"[{time}] [Account: {AccountName}] - {message}");
        }


        // EXAMPLE OF HOW TO RECIVE A STREAM
        //public async Task UploadStream(IAsyncEnumerable<string> stream)
        //{
        //    await foreach (var item in stream)
        //    {
        //        Console.WriteLine(item);
        //    }
        //}

        // EXAMPLE OF HOW TO SEND A STREAM
        //public async IAsyncEnumerable<int> DownloadSnapshots(int count, int delay, [EnumeratorCancellation] CancellationToken cancellationToken)
        //{
        //    //Can be something else then ints
        //    var listOfSnapshots = Enumerable.Range(0, count).AsQueryable();

        //    foreach (var snapshot in listOfSnapshots)
        //    {
        //        // Check the cancellation token regularly so that the server will stop
        //        // producing items if the client disconnects.
        //        cancellationToken.ThrowIfCancellationRequested();

        //        yield return snapshot;

        //        // Use the cancellationToken in other APIs that accept cancellation
        //        // tokens so the cancellation can flow down to them.
        //        await Task.Delay(delay, cancellationToken);
        //    }
        //}


    }
}
