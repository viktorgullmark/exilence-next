using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Shared.Models
{
    public class SnapshotModel
    {
        [JsonIgnore]
        public int? Id { get; set; }
        [JsonPropertyName("uuid")]
        public string ClientId { get; set; }
        public List<StashtabModel> StashTabs { get; set; }
        public DateTime Created { get; set; }
    }
}
