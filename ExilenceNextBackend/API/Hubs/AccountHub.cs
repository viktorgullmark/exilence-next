﻿using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Hubs
{
    public class AccountHub : Hub
    {
        public async Task Ping()
        {
            await Clients.Caller.SendAsync("Pong");
        }
    }
}
