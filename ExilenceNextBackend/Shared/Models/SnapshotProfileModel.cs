using MessagePack;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace Shared.Models
{
    [MessagePackObject]
    public class SnapshotProfileModel
    {
        [JsonIgnore]
        [IgnoreMember]
        public int? Id { get; set; }
        [JsonPropertyName("uuid")]
        [Key("uuid")]
        public string ClientId { get; set; }
        [Key("name")]
        public string Name { get; set; }
        [Key("activeLeagueId")]
        public string ActiveLeagueId { get; set; }
        [Key("activePriceLeagueId")]
        public string ActivePriceLeagueId { get; set; }
        [Key("includeInventory")]
        public bool IncludeInventory { get; set; }
        [Key("includeEquipment")]
        public bool IncludeEquipment { get; set; }
        [Key("activeCharacterName")]
        public string ActiveCharacterName { get; set; }
        [Key("activeStashTabIds")]
        public List<string> ActiveStashTabIds { get; set; }
        [Key("snapshots")]
        public List<SnapshotModel> Snapshots { get; set; }
        [Key("active")]
        public bool Active { get; set; }

        public SnapshotProfileModel()
        {
            Snapshots = new List<SnapshotModel>();
        }
    }
}
