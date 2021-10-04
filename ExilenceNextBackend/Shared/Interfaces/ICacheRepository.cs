using MongoDB.Driver.Linq;
using Shared.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Shared.Interfaces
{
    public interface ICacheRepository
    {
        Task<CacheItem> Get(string key);
        Task Add(CacheItem cacheValue);
    }
}
