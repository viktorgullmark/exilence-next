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
        public async Task<SnapshotProfileModel> GetProfile(string profileClientId)
        {
            var profileModel = await _accountService.GetProfile(AccountName, profileClientId);
            return profileModel;
        }
        public async Task<SnapshotProfileModel> ProfileExists([FromBody]SnapshotProfileModel profileModel)
        {
            profileModel = await _accountService.ProfileExists(AccountName, profileModel);
            return profileModel;
        }
        public async Task<SnapshotProfileModel> AddProfile([FromBody]SnapshotProfileModel profileModel)
        {
            profileModel = await _accountService.AddProfile(AccountName, profileModel);
            return profileModel;
        }

        public async Task<SnapshotProfileModel> EditProfile([FromBody]SnapshotProfileModel profileModel)
        {
            profileModel = await _accountService.EditProfile(AccountName, profileModel);
            return profileModel;
        }

        public async Task<SnapshotProfileModel> RemoveProfile(string profileClientId)
        {
            var profile = await _accountService.RemoveProfile(AccountName, profileClientId);
            return profile;
        }

    }
}
