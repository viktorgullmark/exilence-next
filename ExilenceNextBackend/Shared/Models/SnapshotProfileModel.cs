using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace Shared.Models
{
    public class SnapshotProfileModel
    {
        [JsonIgnore]
        public int? Id { get; set; }
        [JsonPropertyName("uuid")]
        public string ClientId { get; set; }
        public string Name { get; set; }
        public string ActiveLeagueId { get; set; }
        public DateTime Created { get; set; }
        public string ActivePriceLeagueId { get; set; }
        public List<string> ActiveStashTabIds { get; set; }
        public List<SnapshotModel> Snapshots { get; set; }
        public bool Active { get; set; }
    }
}
