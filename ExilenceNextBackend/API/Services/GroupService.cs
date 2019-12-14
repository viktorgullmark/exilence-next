using API.Interfaces;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Shared.Entities;
using Shared.Interfaces;
using Shared.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Services
{
    public class GroupService : IGroupService
    {
        private readonly IMapper _mapper;
        private readonly IGroupRepository _groupRepository;
        private readonly IAccountRepository _accountRepository;

        public GroupService(IGroupRepository groupRepository, IAccountRepository accountRepository, IMapper mapper)
        {
            _groupRepository = groupRepository;
            _accountRepository = accountRepository;
            _mapper = mapper;
        }

        public async Task<ConnectionModel> AddConnection(ConnectionModel connectionModel, string accountName)
        {
            var account = await _accountRepository.GetAccounts(account => account.Name == accountName).FirstOrDefaultAsync();

            var connection = _mapper.Map<Connection>(connectionModel);

            connection.Account = account;

            connection = _groupRepository.AddConnection(connection);
            await _groupRepository.SaveChangesAsync();
            return _mapper.Map<ConnectionModel>(connection);
        }

        public async Task<ConnectionModel> GetConnection(string connectionId)
        {
            var connection = await _groupRepository.GetConnection(connectionId);
            return _mapper.Map<ConnectionModel>(connection);
        }
        public async Task<ConnectionModel> RemoveConnection(string connectionId)
        {
            var connection = await _groupRepository.RemoveConnection(connectionId);
            await _groupRepository.SaveChangesAsync();
            return _mapper.Map<ConnectionModel>(connection);
        }

        public async Task<GroupModel> GetGroup(string groupName)
        {
            var group = await _groupRepository.GetGroup(groupName);
            return _mapper.Map<GroupModel>(group);
        }

        public async Task<GroupModel> JoinGroup(string connectionId, string groupName)
        {
            var connection = await _groupRepository.GetConnection(connectionId);
            var group = await _groupRepository.GetGroups(group => group.Name == groupName).FirstOrDefaultAsync();
            if (group == null)
            {
                group = new Group()
                {
                    Name = groupName,
                    ClientId = Guid.NewGuid().ToString(),
                    Connections = new List<Connection>() { connection }
                };
                _groupRepository.AddGroup(group);
            }
            else
            {
                group.Connections.Add(connection);
            }

            await _groupRepository.SaveChangesAsync();
            return _mapper.Map<GroupModel>(group);
        }

        public async Task<GroupModel> LeaveGroup(string connectionId, string groupName)
        {
            var group = await _groupRepository.GetGroups(group => group.Name == groupName).FirstOrDefaultAsync();
            var connection = group.Connections.First(connection => connection.ConnectionId == connectionId);
            group.Connections.Remove(connection);

            if (group.Connections.Count == 0)
            {
                await _groupRepository.RemoveGroup(group.Name);
            }

            await _groupRepository.SaveChangesAsync();
            return _mapper.Map<GroupModel>(group);
        }
    }
}
