using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Shared.Entities;
using Shared.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Profiles;
using Microsoft.AspNetCore.Mvc;
using MessagePack;

namespace API.Hubs
{
    public partial class BaseHub : Hub
    {
        public async Task<List<SnapshotProfileModel>> GetAllProfiles(string accountId)
        {
            var profileModels = await _accountService.GetAllProfiles(accountId);
            return profileModels;
        }

        public async Task<SnapshotProfileModel> GetProfile(string profileId)
        {
            var profileModel = await _accountService.GetProfile(profileId);
            return profileModel;
        }

        public async Task<SnapshotProfileModel> AddProfile([FromBody]SnapshotProfileModel profileModel)
        {
            profileModel = await _accountService.AddProfile(AccountName, profileModel);

            var group = await _groupService.GetGroupForConnection(ConnectionId);
            if (group != null)
            {
                await Clients.OthersInGroup(group.Name).SendAsync("OnAddProfile", ConnectionId, profileModel);
            }

            LogDebug($"Added profile with name: {profileModel.Name} in " + _timer.ElapsedMilliseconds + " ms.");
            return profileModel;
        }

        public async Task<SnapshotProfileModel> EditProfile([FromBody]SnapshotProfileModel profileModel)
        {
            profileModel = await _accountService.EditProfile(AccountName, profileModel);
            LogDebug($"Updated profile with name: {profileModel.Name} in " + _timer.ElapsedMilliseconds + " ms.");
            return profileModel;
        }

        public async Task<string> RemoveProfile(string profileId)
        {
            var profileModel = await _accountService.RemoveProfile(AccountName, profileId);

            var group = await _groupService.GetGroupForConnection(ConnectionId);
            if (group != null)
            {
                await Clients.OthersInGroup(group.Name).SendAsync("OnRemoveProfile", ConnectionId, profileId);
            }

            LogDebug($"Removed profile with name: {profileModel.Name} in " + _timer.ElapsedMilliseconds + " ms.");
            return profileModel.ClientId;
        }

        public async Task RemoveAllProfiles(string accountId)
        {
            await _accountService.RemoveAllProfiles(accountId);
            
        }

        public async Task<string> ChangeProfile(string profileId)
        {
            var profileModel = await _accountService.ChangeProfile(AccountName, profileId);

             
            var group = await _groupService.GetGroupForConnection(ConnectionId);
            if (group != null)
            {
                await Clients.OthersInGroup(group.Name).SendAsync("OnChangeProfile", ConnectionId, profileModel);
            }

            LogDebug($"Set profile with name: {profileModel.Name} to active in " + _timer.ElapsedMilliseconds + " ms.");
            return profileModel.ClientId;
        }

    }
}
