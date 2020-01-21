using API.Interfaces;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Shared.Entities;
using Shared.Helpers;
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
            var account = await _accountRepository.GetAccounts(account => account.Name == accountName).FirstAsync();

            var connection = _mapper.Map<Connection>(connectionModel);

            connection.Account = account;
            connection.Created = DateTime.UtcNow;

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

        public async Task<bool> GroupExists(string groupName)
        {
            var group = await GetGroup(groupName);
            if (group != null)
            {
                return true;
            }
            return false;
        }

        public async Task<GroupModel> GetGroup(string groupName)
        {
            var group = await _groupRepository.GetGroups(group => group.Name == groupName).FirstOrDefaultAsync();
            return _mapper.Map<GroupModel>(group);
        }

        public async Task<GroupModel> GetGroupForConnection(string connectionId)
        {
            var group = await _groupRepository.GetGroups(group => group.Connections.Any(connection => connection.ConnectionId == connectionId))
                .Include(grp => grp.Connections)
                .ThenInclude(connection => connection.Account)
                .FirstOrDefaultAsync();

            return _mapper.Map<GroupModel>(group);
        }

        public async Task<GroupModel> JoinGroup(string connectionId, GroupModel groupModel)
        {
            var connection = await _groupRepository.GetConnection(connectionId);
            var group = await _groupRepository.GetGroups(group => group.Name == groupModel.Name)
                .Include(group => group.Connections)
                .ThenInclude(connection => connection.Account)
                .ThenInclude(account => account.Profiles)
                .FirstOrDefaultAsync();

            if (group == null)
            {
                var salt = Password.Salt();

                group = new Group()
                {
                    Name = groupModel.Name,
                    ClientId = Guid.NewGuid().ToString(),
                    Connections = new List<Connection>() { connection },
                    Created = DateTime.UtcNow,
                    Salt = salt,
                    Hash = Password.Hash(salt, groupModel.Password)
                };
                _groupRepository.AddGroup(group);
            }
            else
            {
                bool verified = Password.Verify(groupModel.Password, group.Salt, group.Hash);
                if (verified)
                {
                    group.Connections.Add(connection);
                }
                else
                {
                    throw new Exception("The password is incorrect");
                }
            }

            await _groupRepository.SaveChangesAsync();            
            return _mapper.Map<GroupModel>(group);
        }

        public async Task<GroupModel> LeaveGroup(string connectionId, string groupName)
        {
            var group = await _groupRepository.GetGroups(group => group.Name == groupName)
                .Include(group => group.Connections)
                .ThenInclude(connection => connection.Account)
                .FirstAsync();
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
