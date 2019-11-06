using System;
using System.Collections.Generic;
using System.Text;

namespace Shared.Models
{
    public class ConnectionModel
    {
        public int? Id { get; set; }
        public string ConnectionId { get; set; }
        public string InstanceName { get; set; }
        public DateTime Created { get; set; }
    }
}
