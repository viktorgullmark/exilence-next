using System;
using System.Collections.Generic;
using System.Text;

namespace Shared.Models
{
    public class ConnectionModel
    {
        [JsonIgnore]
        public int? Id { get; set; }
        public string ConnectionId { get; set; }
        public string InstanceName { get; set; }
        public DateTime Datestamp { get; set; }

        public AccountModel Account { get; set; }
    }
}
