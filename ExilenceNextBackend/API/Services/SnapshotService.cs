using API.Interfaces;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Shared.Entities;
using Shared.Interfaces;
using Shared.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Services
{
    public class SnapshotService : ISnapshotService
    {
        IMongoRepository _mongoRepository;
        IAccountRepository _accountRepository;
        readonly IMapper _mapper;

        public SnapshotService(IAccountRepository accountRepository, IMongoRepository mongoRepository, IMapper mapper)
        {
            _accountRepository = accountRepository;
            _mongoRepository = mongoRepository;
            _mapper = mapper;
        }

        #region Snapshot

        public async Task<SnapshotModel> GetSnapshot(string snapshotClientId)
        {
            var snapshot = await _mongoRepository.GetSnapshots(snapshot => snapshot.ClientId == snapshotClientId).FirstAsync();
            return _mapper.Map<SnapshotModel>(snapshot);
        }

        public async Task<SnapshotModel> GetSnapshotWithItems(string snapshotClientId)
        {
            var snapshot = await _mongoRepository.GetSnapshots(snapshot => snapshot.ClientId == snapshotClientId).FirstOrDefaultAsync();
            var stashtabs = await _mongoRepository.GetStashtabs(stashtab => stashtab.SnapshotClientId == snapshot.Id).ToListAsync();
            var pricedItems = await _mongoRepository.GetPricedItems(pricedItem => stashtabs.Select(stashTab => stashTab.ClientId).Contains(pricedItem.StashtabClientId)).ToListAsync();

            var snapshotModel = _mapper.Map<SnapshotModel>(snapshot);
            snapshotModel.StashTabs = _mapper.Map<List<StashtabModel>>(stashtabs);
            foreach (var stashTab in snapshotModel.StashTabs)
            {
                var items = pricedItems.Where(p => p.StashtabClientId == stashTab.ClientId);
                stashTab.PricedItems = _mapper.Map<List<PricedItemModel>>(items);
            }

            return snapshotModel;
        }
        
        public async Task<SnapshotModel> AddSnapshot(string profileClientId, SnapshotModel snapshotModel)
        {
            var snapshot = _mapper.Map<Snapshot>(snapshotModel);

            await _mongoRepository.RemovePricedItems(profileClientId);

            var profile = await _accountRepository.GetProfiles(profile => profile.ClientId == profileClientId).AsNoTracking().FirstAsync();

            snapshot.ProfileClientId = profile.ClientId;

            await _mongoRepository.AddSnapshots(new List<Snapshot>() { snapshot });

            return _mapper.Map<SnapshotModel>(snapshot);
        }

        public async Task RemoveSnapshot(string snapshotClientId)
        {
            var snapshot = await _mongoRepository.GetSnapshots(snapshot => snapshot.ClientId == snapshotClientId).FirstAsync();
            await _mongoRepository.RemoveSnapshot(snapshot);
        }

        public async Task RemoveAllSnapshots(string profileClientId)
        {
            await _mongoRepository.RemoveAllSnapshots(profileClientId);
        }
        #endregion

    }
}
