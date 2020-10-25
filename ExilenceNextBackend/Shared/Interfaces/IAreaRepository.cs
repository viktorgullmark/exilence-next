using MongoDB.Driver.Linq;
using Shared.Entities;
using Shared.Entities.Areas;
using System;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace Shared.Interfaces
{
    public interface IAreaRepository
    {
        IMongoQueryable<Snapshot> GetAreas(Expression<Func<ExtenedAreaInfo, bool>> predicate);
        Task AddArea(ExtenedAreaInfo extenedAreaInfoModel);
        Task RemoveAllAreas(string accountId);
    }
}
