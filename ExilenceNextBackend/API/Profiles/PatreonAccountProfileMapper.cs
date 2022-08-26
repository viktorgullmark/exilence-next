using AutoMapper;
using Shared.Entities;
using Shared.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace API.Profiles
{
    public class PatreonAccountProfileMapper : Profile
    {
        public PatreonAccountProfileMapper()
        {
            CreateMap<PatreonAccountModel, PatreonAccount>()
                .ForMember(s => s.ExpiresAt, opt => opt.MapFrom(d => DateTime.UtcNow.AddSeconds(d.ExpiresIn)));
            CreateMap<PatreonAccount, PatreonAccountModel>()
                .ForMember(s => s.ExpiresIn, opt => opt.MapFrom(d => (d.ExpiresAt - DateTime.UtcNow).TotalSeconds));
        }
    }
}
