using AutoMapper;
using Shared.Entities;
using Shared.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace Shared.Profiles
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
