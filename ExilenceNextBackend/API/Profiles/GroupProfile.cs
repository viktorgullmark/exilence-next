using AutoMapper;
using Shared.Entities;
using Shared.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Profiles
{
    public class GroupProfile: Profile
    {
        public GroupProfile()
        {
            CreateMap<Group, GroupModel>();
            CreateMap<GroupModel, Group>();
        }
    }
}
