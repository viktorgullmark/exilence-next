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
    public class SnapshotService : ISnapshotService
    {
        ISnapshotRepository _snapshotRepository;
        IAccountRepository _accountRepository;
        readonly IMapper _mapper;

        public SnapshotService(ISnapshotRepository snapshotRepository, IAccountRepository accountRepository, IMapper mapper)
        {
            _snapshotRepository = snapshotRepository;
            _accountRepository = accountRepository;
            _mapper = mapper;
        }

        public async Task<SnapshotModel> AddSnapshot(string profileClientId, SnapshotModel snapshotModel)
        {
            var snapshot = _mapper.Map<Snapshot>(snapshotModel);
            var profile = await _accountRepository.GetProfiles(profile => profile.ClientId == profileClientId).FirstOrDefaultAsync();
            profile.Snapshots.Add(snapshot);
            await _snapshotRepository.SaveChangesAsync();
            return _mapper.Map<SnapshotModel>(snapshot);
        }

        public async Task<StashtabModel> AddStashtab(string snapshotClientId, StashtabModel stashtabModel)
        {
            var stashtab = _mapper.Map<Stashtab>(stashtabModel);
            var snapshot = await _snapshotRepository.GetSnapshots(tab => tab.ClientId == snapshotClientId).FirstOrDefaultAsync();
            snapshot.StashTabs.Add(stashtab);
            await _snapshotRepository.SaveChangesAsync();
            return _mapper.Map<StashtabModel>(stashtab);
        }
    }
}
