using Shared.Entities;
using System.Threading.Tasks;

namespace Shared.Interfaces
{   public interface IGroupRepository
    {
        Task<Group> GetGroup(string name);
        Task<Group> AddGroup(Group group);
        Task<Group> RemoveGroup(string name);

        Task SaveChangesAsync();
    }
}