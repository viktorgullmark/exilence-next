using API.Models.Ninja;
using AutoMapper;
using Shared.Entities;
using Shared.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace API.Profiles
{
    public class NinjaCombinedLineModelExternalPriceModelMapper : Profile
    {
        public NinjaCombinedLineModelExternalPriceModelMapper()
        {
            CreateMap<NinjaCombinedLineModel, ExternalPriceModel>()
                .ForMember(dest => dest.Name, opt => { opt.MapFrom(src => src.Name); opt.NullSubstitute(null); })
                .ForMember(dest => dest.Calculated, opt => opt.MapFrom(src => src.ChaosValue ?? src.Receive.Value))
                .ForMember(dest => dest.Links, opt => { opt.MapFrom(src => src.Links); opt.NullSubstitute(0); })
                .ForMember(dest => dest.Variant, opt => { opt.MapFrom(src => src.Variant); opt.NullSubstitute(null); })
                .ForMember(dest => dest.Elder, opt => { opt.MapFrom(src => src.Variant == "Elder"); opt.NullSubstitute(false); })
                .ForMember(dest => dest.Shaper, opt => { opt.MapFrom(src => src.Variant == "Shaper"); opt.NullSubstitute(false); })
                .ForMember(dest => dest.Level, opt => { opt.MapFrom(src => src.GemLevel); opt.NullSubstitute(0); })
                .ForMember(dest => dest.FrameType, opt => { opt.MapFrom(src => src.ItemClass); opt.NullSubstitute(5); })
                .ForMember(dest => dest.Ilvl, opt => { opt.MapFrom(src => src.LevelRequired); opt.NullSubstitute(0); })
                .ForMember(dest => dest.Corrupted, opt => { opt.MapFrom(src => src.Corrupted); opt.NullSubstitute(false); })
                .ForMember(dest => dest.Icon, opt => opt.MapFrom(src => src.Icon))
                .ForMember(dest => dest.Tier, opt => { opt.MapFrom(src => src.MapTier); opt.NullSubstitute(0); })
                .ForMember(dest => dest.Count, opt => opt.MapFrom(src => src.Count ?? src.Receive.Count))
                .ForMember(dest => dest.Quality, opt => { opt.MapFrom(src => src.GemQuality); opt.NullSubstitute(0); })
                .ForMember(dest => dest.SparkLine, opt => { opt.MapFrom(src => src.Count > 10 ? src.Sparkline : src.LowConfidenceSparkline); opt.NullSubstitute(null); })
                .ForAllOtherMembers(dest => dest.Ignore());
                
            CreateMap<NinjaSparkLineModel, ExternalPriceSparkLineModel>()
                .ForMember(dest => dest.Data, opt => { opt.MapFrom(src => src.Data); })
                .ForMember(dest => dest.TotalChange, opt => { opt.MapFrom(src => src.TotalChange); opt.NullSubstitute(0); });

        }
    }
}
