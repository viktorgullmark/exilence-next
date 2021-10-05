using Shared.Entities;
using Shared.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Interfaces
{
    public interface ICacheService
    {
        Task<string> Get(string key);
        Task Add(string key, string value, DateTime expireAt);
    }
}