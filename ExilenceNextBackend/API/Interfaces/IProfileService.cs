using Shared.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Interfaces
{
    public interface IProfileService
    {
        Task<SnapshotProfileModel> AddProfile(string accountClientId, SnapshotProfileModel profileModel);
    }
}
