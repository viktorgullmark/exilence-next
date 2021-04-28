using Microsoft.AspNetCore.SignalR;
using Polly;
using Polly.Contrib.WaitAndRetry;
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

        public async Task<SnapshotModel> GetSnapshot(string snapshotId)
        {
            var snapshotModel = await _snapshotService.GetSnapshot(snapshotId);
            LogDebug($"Retrived snapshot in " + _timer.ElapsedMilliseconds + " ms.");
            return snapshotModel;
        }

        public async Task<SnapshotModel> GetLatestSnapshotForProfile(string profileId)
        {
            var profileModel = await _accountService.GetProfileWithSnapshots(profileId);
            var latestSnapshot = profileModel.Snapshots.OrderByDescending(snapshot => snapshot.Created).FirstOrDefault();
            var snapshotModelWithItems = await _snapshotService.GetSnapshot(latestSnapshot.ClientId);

            LogDebug($"Retrived latest snapshot in " + _timer.ElapsedMilliseconds + " ms.");
            return snapshotModelWithItems;
        }

        public async Task<SnapshotModel> AddSnapshot(SnapshotModel snapshotModel, string profileId)
        {
            snapshotModel = await _snapshotService.AddSnapshot(profileId, snapshotModel);

            var group = await _groupService.GetGroupForConnection(ConnectionId);
            if (group != null)
            {
                await Clients.OthersInGroup(group.Name).SendAsync("OnAddSnapshot", ConnectionId, profileId, snapshotModel);
            }

            LogDebug($"Added snapshot containing {snapshotModel.StashTabs.Sum(s => s.PricedItems.Count())} items in " + _timer.ElapsedMilliseconds + " ms.");
                       
            
            return snapshotModel;
        }

        public async Task<string> RemoveSnapshot(string snapshotId)
        {
            await _snapshotService.RemoveSnapshot(snapshotId);

            var group = await _groupService.GetGroupForConnection(ConnectionId);
            if (group != null)
            {
                await Clients.OthersInGroup(group.Name).SendAsync("OnRemoveSnapshot", ConnectionId, snapshotId);
            }

            LogDebug($"Removed snapshot with ClientId: {snapshotId} in " + _timer.ElapsedMilliseconds + " ms.");
            return snapshotId;
        }

        public async Task RemoveAllSnapshots(string profileClientId)
        {
            await _snapshotService.RemoveAllSnapshots(profileClientId);

            var group = await _groupService.GetGroupForConnection(ConnectionId);
            if (group != null)
            {
                await Clients.OthersInGroup(group.Name).SendAsync("OnRemoveAllSnapshots", ConnectionId, profileClientId);
            }
            LogDebug($"Removed all snapshots for ProfileId: {profileClientId} in " + _timer.ElapsedMilliseconds + " ms.");
        }

        public async Task<List<SnapshotModel>> GetSnapshotsWithItemsForProfile(string profileId)
        {
            var snapshotWithItemsForProfile = await _snapshotService.GetSnapshotsForProfile(profileId);
            LogDebug($"Retrived snapshot with items for profile in " + _timer.ElapsedMilliseconds + " ms.");
            return snapshotWithItemsForProfile;
        }


        #region Streams

        public async IAsyncEnumerable<SnapshotModel> StreamSnapshotsWithItemsForProfile(string profileId, [EnumeratorCancellation] CancellationToken cancellationToken)
        {
            var snapshots = await _snapshotService.GetSnapshotsForProfile(profileId);

            foreach (var snapshot in snapshots.AsQueryable())
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

        #endregion

    }
}
