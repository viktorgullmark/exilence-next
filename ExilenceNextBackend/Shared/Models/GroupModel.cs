using System;
using System.Collections.Generic;
using System.Text;

namespace Shared.Models
{
    public class GroupModel
    {
        public int? Id { get; set; }
        public string Name { get; set; }
        public virtual ICollection<ConnectionModel> Connections { get; set; }
        public DateTime Created { get; set; }
    }
}
