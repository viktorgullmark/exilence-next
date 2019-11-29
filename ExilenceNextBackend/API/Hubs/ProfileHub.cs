using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Shared.Entities;
using Shared.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Profiles;

namespace API.Hubs
{
    public partial class BaseHub : Hub
    {
        public async Task<SnapshotProfileModel> UpdateProfile(string acccountId, SnapshotProfileModel profileModel)
        {
            profileModel = await _profileService.UpdateProfile(acccountId, profileModel);
            return profileModel;
        }
    }
}
