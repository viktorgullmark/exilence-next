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

        public async Task<SnapshotModel> GetSnapshotWithItems(string snapshotClientId)
        {
            var snapshot = await _snapshotRepository.GetSnapshots(snapshot => snapshot.ClientId == snapshotClientId)
                .Include(snapshot => snapshot.StashTabs)
                .ThenInclude(stashtab => stashtab.PricedItems)
                .FirstOrDefaultAsync();
            return _mapper.Map<SnapshotModel>(snapshot);
        }

        public async Task<SnapshotModel> AddSnapshot(string profileClientId, SnapshotModel snapshotModel)
        {
            var snapshot = _mapper.Map<Snapshot>(snapshotModel);

            await _snapshotRepository.RemovePricedItems(profileClientId);

            var profile = await _accountRepository.GetProfiles(profile => profile.ClientId == profileClientId)
                .Include(profile => profile.Snapshots)
                .AsNoTracking()
                .FirstAsync();

            snapshot.ProfileId = profile.Id;

            await _snapshotRepository.AddSnapshots(new List<Snapshot>() { snapshot });

            return _mapper.Map<SnapshotModel>(snapshot);
        }
        public async Task RemoveSnapshot(string snapshotClientId)
        {
            var snapshot = await _snapshotRepository.GetSnapshots(snapshot => snapshot.ClientId == snapshotClientId).FirstAsync();
            _snapshotRepository.RemoveSnapshot(snapshot);
            await _snapshotRepository.SaveChangesAsync();
        }

        public async Task RemoveAllSnapshots(string profileClientId)
        {
            var profile = await _accountRepository.GetProfiles(profile => profile.ClientId == profileClientId).Include(profile => profile.Snapshots).FirstAsync();
            profile.Snapshots.Clear();
            await _snapshotRepository.SaveChangesAsync();
        }
        #endregion

        #region Stashtab
        public async Task<StashtabModel> GetStashtab(string stashtabId)
        {
            var stashtab = await _snapshotRepository.GetStashtabs(stashtab => stashtab.ClientId == stashtabId).FirstAsync();
            return _mapper.Map<StashtabModel>(stashtab);
        }
        public IQueryable<Stashtab> GetStashtabs(string snapshotId)
        {
            var stashtabs = _snapshotRepository.GetStashtabs(stashtab => stashtab.Snapshot.ClientId == snapshotId);
            return stashtabs;
        }
        public async Task<StashtabModel> AddStashtab(string snapshotId, StashtabModel stashtabModel)
        {
            var stashtab = _mapper.Map<Stashtab>(stashtabModel);
            var snapshot = await _snapshotRepository.GetSnapshots(tab => tab.ClientId == snapshotId).FirstAsync();
            snapshot.StashTabs.Add(stashtab);
            await _snapshotRepository.SaveChangesAsync();
            return _mapper.Map<StashtabModel>(stashtab);
        }
        public async Task<StashtabModel> RemoveStashtab(string snapshotId, string stashtabId)
        {
            var snapshot = await _snapshotRepository.GetSnapshots(snapshot => snapshot.ClientId == snapshotId).Include(snapshot => snapshot.StashTabs).FirstAsync();
            var stashtasb = snapshot.StashTabs.FirstOrDefault(snapshot => snapshot.ClientId == snapshotId);
            _snapshotRepository.RemoveStashtab(stashtasb);
            await _snapshotRepository.SaveChangesAsync();
            return _mapper.Map<StashtabModel>(snapshot);
        }

        public async Task<PricedItemModel> AddPricedItem(string stashtabId, PricedItemModel pricedItemModel)
        {
            var pricedItem = _mapper.Map<PricedItem>(pricedItemModel);
            var stashtab = await _snapshotRepository.GetStashtabs(tab => tab.ClientId == stashtabId).Include(stashtab => stashtab.PricedItems).FirstAsync();
            stashtab.PricedItems.Add(pricedItem);
            await _snapshotRepository.SaveChangesAsync();
            return _mapper.Map<PricedItemModel>(pricedItem);
        }

        public async Task<StashtabModel> AddPricedItems(string stashtabId, List<PricedItemModel> pricedItemModels)
        {
            var pricedItems = _mapper.Map<List<PricedItem>>(pricedItemModels);
            var stashtab = await _snapshotRepository.GetStashtabs(tab => tab.ClientId == stashtabId)
                //.Include(stashtab => stashtab.Snapshot)
                //.ThenInclude(snapshot => snapshot.Profile)
                .Include(stashtab => stashtab.PricedItems)
                .FirstAsync();
            pricedItems.AddRange(pricedItems);
            await _snapshotRepository.SaveChangesAsync();
            return _mapper.Map<StashtabModel>(stashtab);
        }
        #endregion
    }
}
