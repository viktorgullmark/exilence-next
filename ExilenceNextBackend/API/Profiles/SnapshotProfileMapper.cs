using AutoMapper;
using Shared.Entities;
using Shared.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Profiles
{
    public class SnapshotProfileMapper : Profile
    {
        public SnapshotProfileMapper()
        {
            CreateMap<SnapshotModel, Snapshot>();
            CreateMap<Snapshot, SnapshotModel>()
                .ForMember(o => o.Id, opt => opt.Ignore());
        }
    }
}
