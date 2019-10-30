using AutoMapper;
using Microsoft.AspNetCore.SignalR;
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
        readonly IAccountRepository _accountRepository;
        readonly IGroupRepository _groupRepository;

        public BaseHub(IMapper mapper, IAccountRepository accountRepository, IGroupRepository groupRepository)
        {
            _mapper = mapper;
            _groupRepository = groupRepository;
            _accountRepository = accountRepository;
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
