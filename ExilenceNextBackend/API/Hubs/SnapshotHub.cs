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

        public async Task AddSnapshot(string profileClientId, SnapshotModel snapshotModel)
        {
            var exists = await _snapshotRepository.SnapshotExists(snapshotModel.ClientId);

            if (exists)
                throw new Exception("Snapshot already exists");

            snapshotModel = await _snapshotService.AddSnapshot(profileClientId, snapshotModel);

            await Log($"Added snapshot with id: {snapshotModel.Id} and value: {snapshotModel.TotalValue} to database.");
            
        }

        public async Task AddStashtabs(string stashtabClientId, IAsyncEnumerable<StashtabModel> stashtabModels)
        {
            await foreach (var stashtabModel in stashtabModels)
            {
                await _snapshotService.AddStashtab(stashtabClientId, stashtabModel);
            }
        }

        public async IAsyncEnumerable<int> RetriveSnapshots(int count, int delay, [EnumeratorCancellation] CancellationToken cancellationToken)
        {
            //Can be something else then ints
            var listOfSnapshots = Enumerable.Range(0, count).AsQueryable();
            
            foreach (var snapshot in listOfSnapshots)
            {
                // Check the cancellation token regularly so that the server will stop
                // producing items if the client disconnects.
                cancellationToken.ThrowIfCancellationRequested();

                yield return snapshot;

                // Use the cancellationToken in other APIs that accept cancellation
                // tokens so the cancellation can flow down to them.
                await Task.Delay(delay, cancellationToken);
            }
        }
    }
}
