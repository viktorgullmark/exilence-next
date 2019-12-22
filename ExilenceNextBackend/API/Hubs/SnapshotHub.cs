using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Shared.Entities;
using Shared.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading;
using System.Threading.Tasks;

namespace API.Hubs
{
    public partial class BaseHub : Hub
    {
        /* STUFF TODO
         * Add Snapshots
         * Add Stashtabs to Snapshot
         * Retrive Snapshot
         * Retrive Stashtabs for Snapshot
         * 
         */

        public async Task<SnapshotModel> GetSnapshot(string snapshotClientId)
        {
            var snapshotModel = await _snapshotService.GetSnapshot(snapshotClientId);
            return snapshotModel;
        }

        public async Task<SnapshotModel> AddSnapshot([FromBody]SnapshotModel snapshotModel, string profileClientId)
        {
            snapshotModel = await _snapshotService.AddSnapshot(profileClientId, snapshotModel);
            await Log($"Added snapshot with id: {snapshotModel.Id} for account {AccountName}.");
            return snapshotModel;
        }

        public async Task<string> RemoveSnapshot(string profileClientId, string snapshotClientId)
        {
            var snapshotModel = await _snapshotService.RemoveSnapshot(profileClientId, snapshotClientId);
            await Log($"Removed snapshot with id {snapshotModel.Id} for account {AccountName}.");
            return snapshotClientId;
        }

        public async Task AddPricedItems(List<PricedItemModel> pricedItems, string stashtabClientId)
        {
            await _snapshotService.AddPricedItems(stashtabClientId, pricedItems);
        }

        public async Task AddPricedItems(IAsyncEnumerable<PricedItemModel> pricedItems, string stashtabClientId)
        {
            await foreach (var pricedItem in pricedItems)
            {
                await _snapshotService.AddPricedItem(stashtabClientId, pricedItem);
            }
        }

        public async IAsyncEnumerable<SnapshotModel> RetriveSnapshots(string snapshotClientId, [EnumeratorCancellation] CancellationToken cancellationToken)
        {
            var snapshots = _snapshotService.GetStashtabs(snapshotClientId);

            foreach (var snapshot in snapshots)
            {
                // Check the cancellation token regularly so that the server will stop
                // producing items if the client disconnects.
                cancellationToken.ThrowIfCancellationRequested();

                yield return _mapper.Map<SnapshotModel>(snapshot);

                // Use the cancellationToken in other APIs that accept cancellation
                // tokens so the cancellation can flow down to them.
                await Task.Delay(100, cancellationToken);
            }
        }

    }
}
