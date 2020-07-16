using AutoMapper;
using Shared.Entities;
using Shared.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Profiles
{
    public class PricedItemProfileMapper : Profile
    {
        public PricedItemProfileMapper()
        {
            CreateMap<PricedItemModel, PricedItem>();
            CreateMap<PricedItem, PricedItemModel>()
                .ForMember(o => o.Id, opt => opt.Ignore());
        }
    }
}
