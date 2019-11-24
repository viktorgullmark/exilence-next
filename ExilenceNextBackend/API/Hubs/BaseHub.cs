using AutoMapper;
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
        readonly string _instanceName;
        readonly IMapper _mapper;
        readonly IAccountRepository _accountRepository;
        readonly IGroupRepository _groupRepository;

        public BaseHub(IMapper mapper, IAccountRepository accountRepository, IGroupRepository groupRepository, IConfiguration configuration)
        {
            _mapper = mapper;
            _groupRepository = groupRepository;
            _accountRepository = accountRepository;
            _instanceName = configuration.GetSection("Settings")["InstanceName"];            
        }

        public override async Task OnConnectedAsync()
        {
            await Log($"ConnectionId: {Context.ConnectionId} Connected");
            var connection = new Connection(Context.ConnectionId, _instanceName);
            await _groupRepository.AddConnection(connection);
            await _groupRepository.SaveChangesAsync();
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            await Log($"ConnectionId: {Context.ConnectionId} Disconnected");
            await _groupRepository.RemoveConnection(Context.ConnectionId);
            await _groupRepository.SaveChangesAsync();
            await base.OnDisconnectedAsync(exception);
        }

        public string GetConnectionId()
        {
            return Context.ConnectionId;
        }

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
