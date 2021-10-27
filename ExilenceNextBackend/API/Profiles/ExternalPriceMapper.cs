using AutoMapper;
using Shared.Entities;
using Shared.Entities.Prices;
using Shared.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace API.Profiles
{
    public class ExternalPriceMapper : Profile
    {
        public ExternalPriceMapper()
        {
            CreateMap<ExternalPriceModel, ExternalPrice>();
            CreateMap<ExternalPrice, ExternalPriceModel>();
        }
    }
}
