using API.Interfaces;
using AutoMapper;
using MongoDB.Driver;
using MongoDB.Driver.Linq;
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
        readonly IMapper _mapper;

        public SnapshotService(IMongoRepository mongoRepository, IMapper mapper)
        {
            _mongoRepository = mongoRepository;
            _mapper = mapper;
        }

        #region Snapshot

        public async Task<SnapshotModel> GetSnapshot(string snapshotClientId)
        {
            var snapshot = await _mongoRepository.GetSnapshots(snapshot => snapshot.ClientId == snapshotClientId).FirstAsync();
            snapshot.StashTabs = await _mongoRepository.GetStashtabs(stashtab => stashtab.SnapshotClientId == snapshotClientId).ToListAsync();

            foreach (var stashtab in snapshot.StashTabs)
            {
                stashtab.PricedItems = await _mongoRepository.GetPricedItems(p => p.StashtabClientId == stashtab.ClientId).ToListAsync();
            }

            return _mapper.Map<SnapshotModel>(snapshot);
        }
        
        public async Task<SnapshotModel> AddSnapshot(string profileClientId, SnapshotModel snapshotModel)
        {
            var snapshot = _mapper.Map<Snapshot>(snapshotModel);

            snapshot.ProfileClientId = profileClientId;

            await _mongoRepository.AddSnapshots(new List<Snapshot>() { snapshot });

            snapshot.StashTabs.Select(stashtab => { 
                stashtab.SnapshotClientId = snapshot.ClientId;
                stashtab.SnapshotProfileClientId = profileClientId;
                return stashtab; 
            }).ToList();

            await _mongoRepository.AddStashtabs(snapshot.StashTabs.ToList());

            snapshot.StashTabs.ForEach( 
                stashtab => stashtab.PricedItems.Select(pricedItem => { 
                    pricedItem.StashtabClientId = stashtab.ClientId;
                    pricedItem.SnapshotProfileClientId = profileClientId;
                    return stashtab; 
                }).ToList());
           
            await _mongoRepository.AddPricedItems(snapshot.StashTabs.SelectMany(s => s.PricedItems).ToList());

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
