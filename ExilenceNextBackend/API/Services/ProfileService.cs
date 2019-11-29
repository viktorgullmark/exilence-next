using API.Interfaces;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Shared.Entities;
using Shared.Interfaces;
using Shared.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Services
{
    public class ProfileService : IProfileService
    {
        ISnapshotRepository _snapshotRepository;
        IAccountRepository _accountRepository;
        readonly IMapper _mapper;

        public ProfileService(ISnapshotRepository snapshotRepository, IAccountRepository accountRepository, IMapper mapper)
        {
            _snapshotRepository = snapshotRepository;
            _accountRepository = accountRepository;
            _mapper = mapper;
        }
        public async Task<SnapshotProfileModel> AddProfile(string accountClientId, SnapshotProfileModel profileModel)
        {

            var account = await _accountRepository.GetAccounts(a => a.ClientId == accountClientId).FirstOrDefaultAsync();
            var profile = await _accountRepository.GetProfiles(p => p.ClientId == profileModel.ClientId).FirstOrDefaultAsync();

            if (account == null)
                throw new Exception("Can't find account");

            if (profile != null)
                throw new Exception("Profile already exists");

            profile = _mapper.Map<SnapshotProfile>(profileModel);
            account.Profiles.Add(profile);
            await _accountRepository.SaveChangesAsync();
            return _mapper.Map<SnapshotProfileModel>(profile);
        }
    }
}
