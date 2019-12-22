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
            var snapshot = await _snapshotRepository.GetSnapshots(snapshot => snapshot.ClientId == snapshotClientId).FirstAsync();
            return _mapper.Map<SnapshotModel>(snapshot);
        }
        public async Task<SnapshotModel> AddSnapshot(string profileClientId, SnapshotModel snapshotModel)
        {
            var snapshot = _mapper.Map<Snapshot>(snapshotModel);
            var profile = await _accountRepository.GetProfiles(profile => profile.ClientId == profileClientId).Include(profile => profile.Snapshots).FirstAsync();
            profile.Snapshots.Add(snapshot);
            await _snapshotRepository.SaveChangesAsync();
            return _mapper.Map<SnapshotModel>(snapshot);
        }
        public async Task<SnapshotModel> RemoveSnapshot(string profileClientId, string snapshotClientId)
        {
            var profile = await _accountRepository.GetProfiles(profile => profile.ClientId == profileClientId).Include(profile => profile.Snapshots).FirstAsync();
            var snapshot = profile.Snapshots.FirstOrDefault(snapshot => snapshot.ClientId == snapshotClientId);
            _snapshotRepository.RemoveSnapshot(snapshot);
            await _snapshotRepository.SaveChangesAsync();
            return _mapper.Map<SnapshotModel>(snapshot);
        }
        #endregion

        #region Stashtab
        public async Task<StashtabModel> GetStashtab(string stashtabClientId)
        {
            var stashtab = await _snapshotRepository.GetStashtabs(stashtab => stashtab.ClientId == stashtabClientId).FirstAsync();
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
            var snapshot = await _snapshotRepository.GetSnapshots(tab => tab.ClientId == snapshotClientId).FirstAsync();
            snapshot.StashTabs.Add(stashtab);
            await _snapshotRepository.SaveChangesAsync();
            return _mapper.Map<StashtabModel>(stashtab);
        }
        public async Task<StashtabModel> RemoveStashtab(string snapshotClientId, string stashtabClientId)
        {
            var snapshot = await _snapshotRepository.GetSnapshots(snapshot => snapshot.ClientId == snapshotClientId).Include(snapshot => snapshot.StashTabs).FirstAsync();
            var stashtasb = snapshot.StashTabs.FirstOrDefault(snapshot => snapshot.ClientId == snapshotClientId);
            _snapshotRepository.RemoveStashtab(stashtasb);
            await _snapshotRepository.SaveChangesAsync();
            return _mapper.Map<StashtabModel>(snapshot);
        }

        public async Task<PricedItemModel> AddPricedItem(string stashtabClientId, PricedItemModel pricedItemModel)
        {
            var pricedItem = _mapper.Map<PricedItem>(pricedItemModel);
            var stashtab = await _snapshotRepository.GetStashtabs(tab => tab.ClientId == stashtabClientId).Include(stashtab => stashtab.PricedItems).FirstAsync();
            stashtab.PricedItems.Add(pricedItem);
            await _snapshotRepository.SaveChangesAsync();
            return _mapper.Map<PricedItemModel>(pricedItem);
        }

        public async Task<StashtabModel> AddPricedItems(string stashtabClientId, List<PricedItemModel> pricedItemModels)
        {
            var pricedItems = _mapper.Map<List<PricedItem>>(pricedItemModels);
            var stashtab = await _snapshotRepository.GetStashtabs(tab => tab.ClientId == stashtabClientId).Include(stashtab => stashtab.PricedItems).FirstAsync();
            pricedItems.ForEach(pricedItem => stashtab.PricedItems.Add(pricedItem));
            await _snapshotRepository.SaveChangesAsync();
            return _mapper.Map<StashtabModel>(stashtab);
        }
        #endregion
    }
}
