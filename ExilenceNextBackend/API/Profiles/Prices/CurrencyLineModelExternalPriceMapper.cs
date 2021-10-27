using API.Models.Ninja;
using AutoMapper;
using Shared.Entities;
using Shared.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace API.Profiles
{
    public class CurrencyLineModelExternalPriceMapper : Profile
    {
        public CurrencyLineModelExternalPriceMapper()
        {
            CreateMap<NinjaCurrencyLineModel, ExternalPriceModel>()
                .ForMember(dest => dest.Name, opt => { opt.MapFrom(src => src.CurrencyTypeName); })
                .ForMember(dest => dest.Calculated, opt => { opt.MapFrom(src => src.Receive.Value); })
                .ForMember(dest => dest.Count, opt => { opt.MapFrom(src => src.Receive.Count); })
                .ForMember(dest => dest.FrameType, opt => { opt.MapFrom(src => 5); })
                .ForAllOtherMembers(dest => dest.Ignore());
        }
    }
}
