using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Configuration;
using Shared.Entities;
using Shared.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Hubs
{
    public partial class BaseHub : Hub
    {
        readonly IMapper _mapper;
        readonly string _instanceName;
        readonly IHttpContextAccessor _accessor;
        readonly IGroupRepository _groupRepository;
        readonly IAccountRepository _accountRepository;
        readonly ISnapshotRepository _economyRepository;

        private bool IsPremium => Context.User.IsInRole("Premium");
        private bool IsAdmin => Context.User.IsInRole("Admin");
        private string Account => Context.User.Identity.Name;
        private string ConnectionId => Context.ConnectionId;

        public BaseHub(IMapper mapper, IAccountRepository accountRepository, IGroupRepository groupRepository, IConfiguration configuration, ISnapshotRepository economyRepository)
        {
            _mapper = mapper;
            _groupRepository = groupRepository;
            _accountRepository = accountRepository;
            _economyRepository = economyRepository;
            _instanceName = configuration.GetSection("Settings")["InstanceName"];            
        }

        [Authorize]
        public override async Task OnConnectedAsync()
        {
            await Log($"ConnectionId: {ConnectionId} connected");
            var connection = new Connection(ConnectionId, _instanceName);
            await _groupRepository.AddConnection(connection);
            await _groupRepository.SaveChangesAsync();
            
            await base.OnConnectedAsync();
        }

        [Authorize]
        public override async Task OnDisconnectedAsync(Exception exception)
        {
            await Log($"ConnectionId: {ConnectionId} disconnected");
            await _groupRepository.RemoveConnection(ConnectionId);
            await _groupRepository.SaveChangesAsync();
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
            await Clients.All.SendAsync("Log", message);
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
