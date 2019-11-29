using AutoMapper;
using Shared.Entities;
using Shared.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Profiles
{
    public class GroupProfileMapper: Profile
    {
        public GroupProfileMapper()
        {
            CreateMap<Group, GroupModel>();
            CreateMap<GroupModel, Group>();
        }
    }
}
