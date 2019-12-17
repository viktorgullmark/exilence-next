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

        #region Snapshot

        public async Task<SnapshotModel> GetSnapshot(string snapshotClientId)
        {
            var snapshot = await _snapshotRepository.GetSnapshots(snapshot => snapshot.ClientId == snapshotClientId).FirstOrDefaultAsync();
            return _mapper.Map<SnapshotModel>(snapshot);
        }
        public async Task<SnapshotModel> AddSnapshot(string profileClientId, SnapshotModel snapshotModel)
        {
            var snapshot = _mapper.Map<Snapshot>(snapshotModel);
            var profile = await _accountRepository.GetProfiles(profile => profile.ClientId == profileClientId).FirstOrDefaultAsync();
            profile.Snapshots.Add(snapshot);
            await _snapshotRepository.SaveChangesAsync();
            return _mapper.Map<SnapshotModel>(snapshot);
        }
        public async Task<SnapshotModel> RemoveSnapshot(string profileClientId, string snapshotClientId)
        {
            var profile = await _accountRepository.GetProfiles(profile => profile.ClientId == profileClientId).FirstOrDefaultAsync();
            var snapshot = profile.Snapshots.FirstOrDefault(snapshot => snapshot.ClientId == snapshotClientId);
            profile.Snapshots.Remove(snapshot);
            await _snapshotRepository.SaveChangesAsync();
            return _mapper.Map<SnapshotModel>(snapshot);
        }
        #endregion

        #region Stashtab
        public async Task<StashtabModel> GetStashtab(string stashtabClientId)
        {
            var stashtab = await _snapshotRepository.GetStashtabs(stashtab => stashtab.ClientId == stashtabClientId).FirstOrDefaultAsync();
            return _mapper.Map<StashtabModel>(stashtab);
        }
        public IQueryable<Stashtab> GetStashtabs(string snapshotClientId)
        {
            var stashtabs = _snapshotRepository.GetStashtabs(stashtab => stashtab.Snapshot.ClientId == snapshotClientId);
            return stashtabs;
        }
        public async Task<StashtabModel> AddStashtab(string snapshotClientId, StashtabModel stashtabModel)
        {
            var stashtab = _mapper.Map<Stashtab>(stashtabModel);
            var snapshot = await _snapshotRepository.GetSnapshots(tab => tab.ClientId == snapshotClientId).FirstOrDefaultAsync();
            snapshot.StashTabs.Add(stashtab);
            await _snapshotRepository.SaveChangesAsync();
            return _mapper.Map<StashtabModel>(stashtab);
        }
        public async Task<StashtabModel> RemoveStashtab(string snapshotClientId, string stashtabClientId)
        {
            var snapshot = await _snapshotRepository.GetSnapshots(snapshot => snapshot.ClientId == snapshotClientId).FirstOrDefaultAsync();
            var stashtasb = snapshot.StashTabs.FirstOrDefault(snapshot => snapshot.ClientId == snapshotClientId);
            snapshot.StashTabs.Remove(stashtasb);
            await _snapshotRepository.SaveChangesAsync();
            return _mapper.Map<StashtabModel>(snapshot);
        }

        public async Task<PricedItemModel> AddPricedItem(string stashtabClientId, PricedItemModel pricedItemModel)
        {
            var pricedItem = _mapper.Map<PricedItem>(pricedItemModel);
            var stashtab = await _snapshotRepository.GetStashtabs(tab => tab.ClientId == stashtabClientId).FirstOrDefaultAsync();
            stashtab.PricedItems.Add(pricedItem);
            await _snapshotRepository.SaveChangesAsync();
            return _mapper.Map<PricedItemModel>(pricedItem);
        }
        #endregion
    }
}
