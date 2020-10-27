using Microsoft.AspNetCore.SignalR;
using Polly;
using Polly.Contrib.WaitAndRetry;
using Shared.Models;
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
            var snapshotModelWithItems = await _snapshotService.GetSnapshot(latestSnapshot.ClientId);

            Log($"Retrived latest snapshot with worth {snapshotModelWithItems.StashTabs.Sum(s => s.Value)} chaos " + _timer.ElapsedMilliseconds + " ms.");
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
            await _snapshotService.RemoveAllSnapshots(profileClientId);

            var group = await _groupService.GetGroupForConnection(ConnectionId);
            if (group != null)
            {
                await Clients.OthersInGroup(group.Name).SendAsync("OnRemoveAllSnapshots", ConnectionId, profileClientId);
            }
            Log($"Removed all snapshots for ProfileId: {profileClientId} in " + _timer.ElapsedMilliseconds + " ms.");
        }


        public async Task<ExternalPriceModel> AddCustomPrice(ExternalPriceModel externalPriceModel)
        {
            var connection = await _accountService.GetConnection(AccountName);
            

            Log($"Added custom price for {externalPriceModel.Name} value: {externalPriceModel.CustomPrice} chaos in " + _timer.ElapsedMilliseconds + " ms.");
            return externalPriceModel;
        }

    }
}
