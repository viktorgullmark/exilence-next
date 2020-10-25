using AutoMapper;
using Shared.Entities;
using Shared.Entities.Areas;
using Shared.Models;
using Shared.Models.Areas;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Profiles
{
    public class AreaProfileMapper : Profile
    {
        public AreaProfileMapper()
        {
            CreateMap<ExtenedAreaInfoModel, ExtenedAreaInfo>();
            CreateMap<ExtenedAreaInfo, ExtenedAreaInfoModel>()
                .ForMember(o => o.Id, opt => opt.Ignore());
        }
    }
}
