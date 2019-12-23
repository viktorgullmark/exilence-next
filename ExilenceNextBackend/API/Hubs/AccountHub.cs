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

namespace API.Hubs
{
    public partial class BaseHub : Hub
    {
        public async Task<SnapshotProfileModel> GetProfile(string profileId)
        {
            var profileModel = await _accountService.GetProfile(profileId);
            return profileModel;
        }

        public async Task<SnapshotProfileModel> AddProfile([FromBody]SnapshotProfileModel profileModel)
        {
            profileModel = await _accountService.AddProfile(AccountName, profileModel);
            await Log($"Added profile with name: {profileModel.Name} and id: {profileModel.Id}");
            return profileModel;
        }

        public async Task<SnapshotProfileModel> EditProfile([FromBody]SnapshotProfileModel profileModel)
        {
            profileModel = await _accountService.EditProfile(AccountName, profileModel);
            await Log($"Updated profile with name: {profileModel.Name} and id: {profileModel.Id}");
            return profileModel;
        }

        public async Task<SnapshotProfileModel> RemoveProfile(string profileId)
        {
            var profileModel = await _accountService.RemoveProfile(AccountName, profileId);
            await Log($"Removed profile with name: {profileModel.Name} and id: {profileModel.Id}");
            return profileModel;
        }

    }
}
