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


    }
}
