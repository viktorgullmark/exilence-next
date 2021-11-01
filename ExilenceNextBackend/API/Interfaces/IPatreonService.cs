using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Interfaces
{
    interface IPatreonService
    {
        Task<bool> IsPatreonSubscriber(string accountName);
    }
}
