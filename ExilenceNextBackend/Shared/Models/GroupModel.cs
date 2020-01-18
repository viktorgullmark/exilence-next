using MessagePack;
using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Shared.Models
{
    [MessagePackObject]
    public class GroupModel
    {
        [JsonIgnore]
        [IgnoreMember]
        public int? Id { get; set; }
        [JsonPropertyName("uuid")]
        [Key("uuid")]
        public string ClientId { get; set; }
        [Key("name")]
        public string Name { get; set; }
        [Key("password")]
        public string Password { get; set; }
        [Key("connections")]
        public List<ConnectionModel> Connections { get; set; }
        [Key("profiles")]
        public List<SnapshotProfileModel> Profiles { get; set; }
    }
}
