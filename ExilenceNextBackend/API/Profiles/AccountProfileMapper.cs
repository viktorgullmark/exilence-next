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
            CreateMap<Account, AccountModel>();
            CreateMap<AccountModel, Account>();
        }
    }
}
