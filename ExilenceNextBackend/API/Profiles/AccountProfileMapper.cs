using AutoMapper;
using Shared.Entities;
using Shared.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace API.Profiles
{
    public class AccountProfileMapper : Profile
    {
        public AccountProfileMapper()
        {
            CreateMap<AccountModel, Account>()
                .ForMember(o => o.Id, opt => opt.Ignore());
            CreateMap<Account, AccountModel>();
        }
    }
}
