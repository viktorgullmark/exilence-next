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
        ISnapshotRepository _snapshotRepository;
        readonly IMapper _mapper;

        public SnapshotService(ISnapshotRepository snapshotRepository, IMapper mapper)
        {
            _snapshotRepository = snapshotRepository;
            _mapper = mapper;
        }


        public async Task<SnapshotModel> GetSnapshot(string snapshotClientId)
        {
            var snapshot = await _snapshotRepository.GetSnapshots(snapshot => snapshot.ClientId == snapshotClientId).FirstAsync();
            snapshot.StashTabs = await _snapshotRepository.GetStashtabs(stashtab => stashtab.SnapshotClientId == snapshotClientId).ToListAsync();

            foreach (var stashtab in snapshot.StashTabs)
            {
                stashtab.PricedItems = await _snapshotRepository.GetPricedItems(p => p.StashtabClientId == stashtab.ClientId).ToListAsync();
            }

            return _mapper.Map<SnapshotModel>(snapshot);
        }

        public async Task<SnapshotModel> AddSnapshot(string profileClientId, SnapshotModel snapshotModel)
        {
            var snapshot = _mapper.Map<Snapshot>(snapshotModel);

            // TODO: temporarily disabled snapshot storing

            return _mapper.Map<SnapshotModel>(snapshot);
        }

        public async Task RemoveSnapshot(string snapshotClientId)
        {
            var snapshot = await _snapshotRepository.GetSnapshots(snapshot => snapshot.ClientId == snapshotClientId).FirstAsync();
            await _snapshotRepository.RemoveSnapshot(snapshot);
        }

        public async Task RemoveAllSnapshots(string profileClientId)
        {
            await _snapshotRepository.RemoveAllSnapshots(profileClientId);
        }
    }
}
