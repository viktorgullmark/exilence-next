using Microsoft.AspNetCore.SignalR;
using Polly;
using Polly.Contrib.WaitAndRetry;
using Shared.Models;
using Shared.TemporaryModels;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace API.Hubs
{
    public partial class BaseHub : Hub
    {

        public async Task<SnapshotModel> GetSnapshot(string snapshotId)
        {
            var snapshotModel = await _snapshotService.GetSnapshot(snapshotId);
            Log($"Retrived snapshot worth {snapshotModel.StashTabs.Sum(s => s.Value)} chaos in " + _timer.ElapsedMilliseconds + " ms.");
            return snapshotModel;
        }

        public async Task<SnapshotModel> GetLatestSnapshotForProfile(string profileId)
        {
            var profileModel = await _accountService.GetProfileWithSnapshots(profileId);
            var latestSnapshot = profileModel.Snapshots.OrderByDescending(snapshot => snapshot.Created).FirstOrDefault();
            var snapshotModelWithItems = await _snapshotService.GetSnapshotWithItems(latestSnapshot.ClientId);

            Log($"Retrived latest snapshot with worth {snapshotModelWithItems.StashTabs.Sum(s => s.Value)} chaos " + _timer.ElapsedMilliseconds + " ms.");
            return snapshotModelWithItems;
        }

        public async Task<SnapshotModel> AddSnapshot(SnapshotModel snapshotModel, string profileId)
        {
            var delay = Backoff.DecorrelatedJitterBackoffV2(medianFirstRetryDelay: TimeSpan.FromMilliseconds(250), retryCount: 5);
            var retryPolicy = Policy.Handle<Exception>().WaitAndRetryAsync(delay, (exception, timeSpan, retryCount, context) => {
                Log($"Add snapshot failed: {exception.Message}, retrying in {Math.Round(timeSpan.TotalMilliseconds, 0)} ms. Retry count: {retryCount} of 5.");
            });

            snapshotModel = await retryPolicy.ExecuteAsync(() => _snapshotService.AddSnapshot(profileId, snapshotModel));

            var group = await _groupService.GetGroupForConnection(ConnectionId);
            if (group != null)
            {
                await Clients.OthersInGroup(group.Name).SendAsync("OnAddSnapshot", ConnectionId, profileId, snapshotModel);
            }

            Log($"Added snapshot containing {snapshotModel.StashTabs.Sum(s => s.PricedItems.Count())} items worth {Math.Round(snapshotModel.StashTabs.Sum(s => s.Value), 0)} chaos in " + _timer.ElapsedMilliseconds + " ms.");
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

            Log($"Removed snapshot with ClientId: {snapshotId} in " + _timer.ElapsedMilliseconds + " ms.");
            return snapshotId;
        }

        public async Task RemoveAllSnapshots(string profileClientId)
        {

            var delay = Backoff.DecorrelatedJitterBackoffV2(medianFirstRetryDelay: TimeSpan.FromMilliseconds(250), retryCount: 5);
            var retryPolicy = Policy.Handle<Exception>().WaitAndRetryAsync(delay, (exception, timeSpan, retryCount, context) => {
                Log($"Remove all snapshots failed: {exception.Message}, retrying in {Math.Round(timeSpan.TotalMilliseconds, 0)} ms. Retry count: {retryCount} of 5.");
            });

            await retryPolicy.ExecuteAsync(() => _snapshotService.RemoveAllSnapshots(profileClientId));

            var group = await _groupService.GetGroupForConnection(ConnectionId);
            if (group != null)
            {
                await Clients.OthersInGroup(group.Name).SendAsync("OnRemoveAllSnapshots", ConnectionId, profileClientId);
            }
            Log($"Removed all snapshots for ProfileId: {profileClientId} in " + _timer.ElapsedMilliseconds + " ms.");
        }
        
        public async Task<StashtabModel> AddPricedItems(UpdatePricedItemsModel updateModel)
        {
            var stashTabModel = await _snapshotService.AddPricedItems(updateModel.StashTabId, updateModel.PricedItems);

            var group = await _groupService.GetGroupForConnection(ConnectionId);
            if (group != null)
            {
                updateModel.ConnectionId = ConnectionId;
                await Clients.OthersInGroup(group.Name).SendAsync("OnAddPricedItems", updateModel);
            }

            Log($"Added {updateModel.PricedItems.Count} pricedItems to StashTabId: {updateModel.StashTabId} in " + _timer.ElapsedMilliseconds + " ms.");
            return stashTabModel;
        }

        #region Streams
        //public async Task AddPricedItem(IAsyncEnumerable<PricedItemModel> pricedItems, string stashtabId)
        //{
        //    await foreach (var pricedItem in pricedItems)
        //    {
        //        await _snapshotService.AddPricedItem(stashtabId, pricedItem);
        //    }
        //}

        //public async IAsyncEnumerable<SnapshotModel> RetriveSnapshots(string snapshotId, [EnumeratorCancellation] CancellationToken cancellationToken)
        //{
        //    var snapshots = _snapshotService.GetStashtabs(snapshotId);

        //    foreach (var snapshot in snapshots)
        //    {
        //        // Check the cancellation token regularly so that the server will stop
        //        // producing items if the client disconnects.
        //        cancellationToken.ThrowIfCancellationRequested();

        //        yield return _mapper.Map<SnapshotModel>(snapshot);

        //        // Use the cancellationToken in other APIs that accept cancellation
        //        // tokens so the cancellation can flow down to them.
        //        await Task.Delay(100, cancellationToken);
        //    }
        //}
        #endregion

    }
}
