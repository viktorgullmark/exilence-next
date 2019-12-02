using API.Interfaces;
using AutoMapper;
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

        public GroupService(IGroupRepository groupRepository, IMapper mapper)
        {
            _groupRepository = groupRepository;
            _mapper = mapper;
        }
        public async Task<GroupModel> GetGroup(string groupName)
        {
            var group = await _groupRepository.GetGroup(groupName);

            return _mapper.Map<GroupModel>(group);
        }

        public Task<GroupModel> JoinGroup(string connectionId, string groupName)
        {
            throw new NotImplementedException();
        }

        public Task<GroupModel> LeaveGroup(string connectionId, string groupName)
        {
            throw new NotImplementedException();
        }
    }
}
