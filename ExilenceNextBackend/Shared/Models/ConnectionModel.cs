using MessagePack;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace Shared.Models
{
    [MessagePackObject]
    public class ConnectionModel
    {
        [IgnoreMember]
        public int? Id { get; set; }
        [Key("connectionId")]
        public string ConnectionId { get; set; }
        [Key("instanceName")]
        public string InstanceName { get; set; }
        [Key("account")]
        public AccountModel Account { get; set; }
    }
}
