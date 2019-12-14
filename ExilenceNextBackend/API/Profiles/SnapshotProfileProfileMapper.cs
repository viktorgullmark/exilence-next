using AutoMapper;
using Shared.Entities;
using Shared.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Profiles
{
    public class SnapshotProfileProfileMapper : Profile
    {
        public SnapshotProfileProfileMapper()
        {
            CreateMap<SnapshotProfileModel, SnapshotProfile>()
                .ForMember(x => x.Account, opt => opt.Ignore())
                .ForMember(x => x.Id, opt => opt.Ignore());

            CreateMap<SnapshotProfile, SnapshotProfileModel>();
        }
    }
}
