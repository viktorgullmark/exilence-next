using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Shared.Interfaces
{
    public interface IEconomyRepository
    {
        Task<bool> SnapshotExists(string clientId);
    }
}
