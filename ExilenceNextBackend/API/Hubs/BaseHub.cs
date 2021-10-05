using API.Interfaces;
using AutoMapper;
using MessagePack;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Shared.Models;
using System;
using System.Diagnostics;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace API.Hubs
{
    [Authorize]
    public partial class BaseHub : Hub
    {
        readonly IMapper _mapper;
        readonly ISnapshotService _snapshotService;
        readonly IAccountService _accountService;
        readonly IGroupService _groupService;

        private readonly ILogger<BaseHub> _logger;

        private readonly string _instanceName;
        private readonly string _loggerPassword;
        private string ConnectionId => Context.ConnectionId;
        private string AccountName => Context.User.Identity.Name;
        private bool IsAdmin => Context.User.IsInRole("Admin");
        private bool IsPremium => Context.User.IsInRole("Premium");
        private Stopwatch _timer;


        public BaseHub(
            IMapper mapper,
            ILogger<BaseHub> logger,
            IConfiguration configuration,
            IGroupService groupService,
            ISnapshotService snapshotService,
            IAccountService accountService
            )
        {
            _logger = logger;
            _mapper = mapper;
            _instanceName = configuration.GetSection("Settings")["InstanceName"];
            _loggerPassword = configuration.GetSection("Logger")["Password"];

            _snapshotService = snapshotService;
            _accountService = accountService;
            _groupService = groupService;

            _timer = Stopwatch.StartNew();
        }

        public override async Task OnConnectedAsync()
        {

            //Close already existing connection for the same account
            var existingConnection = await _accountService.GetConnection(AccountName);
            if (existingConnection != null)
            {
                await CloseConnection(existingConnection.ConnectionId);
            }

            var connection = new ConnectionModel()
            {
                ConnectionId = ConnectionId,
                InstanceName = _instanceName
            };
            await _groupService.AddConnection(connection, AccountName);
            await base.OnConnectedAsync();
            LogDebug($"ConnectionId: {ConnectionId} connected in " + _timer.ElapsedMilliseconds + " ms.");
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var groupModel = await _groupService.GetGroupForConnection(ConnectionId);
            if (groupModel != null)
            {
                await LeaveGroup(groupModel.Name);
            }
            await _groupService.RemoveConnection(ConnectionId);
            await base.OnDisconnectedAsync(exception);
            LogDebug($"ConnectionId: {ConnectionId} disconnected in " + _timer.ElapsedMilliseconds + " ms.");
        }

        public async Task CloseConnection(string connectionId)
        {
            await Clients.Client(connectionId).SendAsync("OnCloseConnection");
            LogDebug($"Told connectionId: {connectionId} to close");
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
