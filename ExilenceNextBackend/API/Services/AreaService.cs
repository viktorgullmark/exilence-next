using API.Interfaces;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Shared.Entities;
using Shared.Helpers;
using Shared.Interfaces;
using Shared.Models;
using Shared.Models.Areas;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Services
{
    public class AreaService : IAreaService
    {
        private readonly IMapper _mapper;
        private readonly IAccountRepository _accountRepository;

        public AreaService(IAccountRepository accountRepository, IMapper mapper)
        {
            _accountRepository = accountRepository;
            _mapper = mapper;
        }

        public Task<ExtenedAreaInfoModel> AddArea(ExtenedAreaInfoModel extenedAreaInfoModel)
        {
            throw new NotImplementedException();
        }
    }
}
