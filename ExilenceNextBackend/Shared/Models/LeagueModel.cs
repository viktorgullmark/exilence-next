using MessagePack;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace Shared.Models
{
    [MessagePackObject]
    public class LeagueModel
    {
        [JsonIgnore]
        [IgnoreMember]
        public int? Id { get; set; }
        [JsonPropertyName("uuid")]
        [Key("uuid")]
        public int? ClientId { get; set; }
        [Key("name")]
        public string Name { get; set; }
    }
}
