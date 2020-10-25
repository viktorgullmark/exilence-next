using Microsoft.AspNetCore.SignalR;
using Shared.Models;
using Shared.Models.Areas;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace API.Hubs
{
    public partial class BaseHub : Hub
    {
        public async Task<ExtenedAreaInfoModel> AddArea(ExtenedAreaInfoModel areaModel)
        {


            Log($"Type: {areaModel.Type} Area: {areaModel.EventArea.Name}");


            return areaModel;
        }
    }
}
