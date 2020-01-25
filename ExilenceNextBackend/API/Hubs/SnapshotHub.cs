using MessagePack;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Shared.Entities;
using Shared.Models;
using Shared.TemporaryModels;
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
            await Log($"Retrived snapshot with ClientId: {snapshotModel.ClientId} worth {snapshotModel.StashTabs.Sum(s => s.Value)} chaos.");
            return snapshotModel;
        }

        public async Task<SnapshotModel> GetLatestSnapshotForProfile(string profileId)
        {
            var profileModel = await _accountService.GetProfileWithSnapshots(profileId);
            var latestSnapshot = profileModel.Snapshots.OrderByDescending(snapshot => snapshot.Created).FirstOrDefault();
            var snapshotModelWithItems = await _snapshotService.GetSnapshotWithItems(latestSnapshot.ClientId);

            await Log($"Retrived latest snapshot with ClientId: {snapshotModelWithItems.ClientId} worth {snapshotModelWithItems.StashTabs.Sum(s => s.Value)} chaos.");
            return snapshotModelWithItems;
        }

        public async Task<SnapshotModel> AddSnapshot(SnapshotModel snapshotModel, string profileId)
        {
            snapshotModel = await _snapshotService.AddSnapshot(profileId, snapshotModel);
            await Log($"Added snapshot with ClientId: {snapshotModel.ClientId} containing {snapshotModel.StashTabs.Sum(s => s.PricedItems.Count())} items worth {snapshotModel.StashTabs.Sum(s => s.Value)} chaos.");

            var group = await _groupService.GetGroupForConnection(ConnectionId);
            if (group != null)
            {
                await Clients.OthersInGroup(group.Name).SendAsync("OnAddSnapshot", ConnectionId, profileId, snapshotModel);
            }

            return snapshotModel;
        }

        public async Task<string> RemoveSnapshot(string snapshotId)
        {
            await _snapshotService.RemoveSnapshot(snapshotId);
            await Log($"Removed snapshot with ClientId: {snapshotId}.");

            var group = await _groupService.GetGroupForConnection(ConnectionId);
            if (group != null)
            {
                await Clients.OthersInGroup(group.Name).SendAsync("OnRemoveSnapshot", ConnectionId, snapshotId);
            }

            return snapshotId;
        }

        public async Task RemoveAllSnapshots(string profileClientId)
        {
            await _snapshotService.RemoveAllSnapshots(profileClientId);
            await Log($"Removed snapshot for ProfileId: {profileClientId}");

            var group = await _groupService.GetGroupForConnection(ConnectionId);
            if (group != null)
            {
                await Clients.OthersInGroup(group.Name).SendAsync("OnRemoveAllSnapshots", ConnectionId, profileClientId);
            }
        }
        
        public async Task<StashtabModel> AddPricedItems(UpdatePricedItemsModel updateModel)
        {
            var stashTabModel = await _snapshotService.AddPricedItems(updateModel.StashTabId, updateModel.PricedItems);
            await Log($"Added {updateModel.PricedItems.Count} pricedItems to StashTabId: {updateModel.StashTabId}");

            var group = await _groupService.GetGroupForConnection(ConnectionId);
            if (group != null)
            {
                updateModel.ConnectionId = ConnectionId;
                await Clients.OthersInGroup(group.Name).SendAsync("OnAddPricedItems", updateModel);
            }

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
