using AutoMapper;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Hubs
{
    public  class BaseHub : Hub
    {
        IMapper _mapper;

        public BaseHub(IMapper mapper)
        {
            _mapper = mapper;
        }

        public string GetConnectionId()
        {
            return Context.ConnectionId;
        }

        public async Task Ping (string message)
        {
            await Clients.All.SendAsync("Pong", "pong");
        }
    }
}
