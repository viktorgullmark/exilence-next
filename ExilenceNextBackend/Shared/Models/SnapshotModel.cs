using MessagePack;
using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Shared.Models
{
    [MessagePackObject]
    public class SnapshotModel
    {
        [JsonIgnore]
        [IgnoreMember]
        public int? Id { get; set; }
        [JsonPropertyName("uuid")]
        [Key("uuid")]
        public string ClientId { get; set; }
        [Key("created")]
        public DateTime? Created { get; set; }
        [Key("stashTabs")]
        public List<StashtabModel> StashTabs { get; set; }
    }
}
