using API.Models.Ninja;
using AutoMapper;
using Shared.Entities;
using Shared.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace API.Profiles
{
    public class NinjaItemLineModelExternalPriceModelMapper : Profile
    {
        public NinjaItemLineModelExternalPriceModelMapper()
        {
            CreateMap<NinjaItemLineModel, ExternalPriceModel>()
                //.ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null))
                .ForMember(dest => dest.Name, opt => { opt.MapFrom(src => src.Name); opt.NullSubstitute(null); })
                //.ForMember(dest => dest.Icon, opt => opt.MapFrom(src => src))
                .ForMember(dest => dest.Calculated, opt => opt.MapFrom(src => src.ChaosValue))
                .ForMember(dest => dest.Links, opt => { opt.MapFrom(src => src.Links); opt.NullSubstitute(0); })
                .ForMember(dest => dest.Variant, opt => { opt.MapFrom(src => src.Variant); opt.NullSubstitute(null); })
                .ForMember(dest => dest.Elder, opt => { opt.MapFrom(src => src.Variant == "Elder"); opt.NullSubstitute(false); })
                .ForMember(dest => dest.Shaper, opt => { opt.MapFrom(src => src.Variant == "Shaper"); opt.NullSubstitute(false); })
                .ForMember(dest => dest.Level, opt => { opt.MapFrom(src => src.GemLevel); opt.NullSubstitute(0); })
                .ForMember(dest => dest.FrameType, opt => { opt.MapFrom(src => src.ItemClass); opt.NullSubstitute(0); })
                //.ForMember(dest => dest.BaseType, opt => { opt.MapFrom(src => src.BaseType); opt.NullSubstitute(null); })
                .ForMember(dest => dest.Ilvl, opt => { opt.MapFrom(src => src.LevelRequired); opt.NullSubstitute(0); })
                .ForMember(dest => dest.Corrupted, opt => { opt.MapFrom(src => src.Corrupted); opt.NullSubstitute(false); })
                //.ForMember(dest => dest.TotalStackSize, opt => { opt.MapFrom(src => src.StackSize); opt.NullSubstitute(0); })
                .ForMember(dest => dest.Tier, opt => { opt.MapFrom(src => src.MapTier); opt.NullSubstitute(0); })
                //.ForMember(dest => dest.Count, opt => opt.MapFrom(src => src.Count))
                .ForMember(dest => dest.Quality, opt => { opt.MapFrom(src => src.GemQuality); opt.NullSubstitute(0); })
                .ForAllOtherMembers(dest => dest.Ignore());
                
                //.ForMember(dest => dest.DetailsUrl, opt => opt.MapFrom(src => src))
                //.ForMember(dest => dest.SparkLine, opt => opt.MapFrom(src => src));
                ;
        }
    }
}
