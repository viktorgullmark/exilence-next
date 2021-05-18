using AutoMapper;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Diagnostics;
using System.Threading.Tasks;

namespace API.Hubs
{
    public partial class AuthenticationHub : Hub    {

        private readonly ILogger<AuthenticationHub> _logger;
        private string ConnectionId => Context.ConnectionId;
        private string AccountName => Context.User.Identity.Name;
        private Stopwatch _timer;


        public AuthenticationHub(IMapper mapper,ILogger<AuthenticationHub> logger,IConfiguration configuration)
        {
            _logger = logger;
            _timer = Stopwatch.StartNew();
        }

        public override async Task OnConnectedAsync()
        {
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
        }

        public async Task Register(string state)
        {
            await Groups.AddToGroupAsync(ConnectionId, state);
            LogDebug($"ConnectionId: {ConnectionId} registered with state {state} in " + _timer.ElapsedMilliseconds + " ms.");
        }

        private void LogDebug(string message)
        {
            message = $"[Account: {AccountName}] -  " + message;
            _logger.LogDebug(message);
        }

        private void LogError(string message)
        {
            message = $"[Account: {AccountName}] -  " + message;
            _logger.LogError(message);
        }

    }
}
