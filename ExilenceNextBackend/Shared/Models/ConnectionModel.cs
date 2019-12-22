using System;
using System.Collections.Generic;
using System.Text;

namespace Shared.Models
{
    public class ConnectionModel
    {
        public string Id { get; set; }
        public string InstanceName { get; set; }
        public DateTime Created { get; set; }

        public AccountModel Account { get; set; }
    }
}
