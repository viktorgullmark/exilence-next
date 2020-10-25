using Shared.Models;
using Shared.Models.Areas;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Interfaces
{
    public interface IAreaService
    {
        Task<ExtenedAreaInfoModel> AddArea(ExtenedAreaInfoModel extenedAreaInfoModel);
    }
}
