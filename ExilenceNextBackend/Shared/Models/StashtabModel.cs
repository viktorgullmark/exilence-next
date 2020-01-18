
using MessagePack;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Shared.Models
{
    [MessagePackObject]
    public class StashtabModel
    {
        [JsonIgnore]
        [IgnoreMember]
        public int? Id { get; set; }
        [JsonPropertyName("uuid")]
        [Key("uuid")]
        public string ClientId { get; set; }
        [Key("stashTabId")]
        public string StashTabId { get; set; }
        [Key("name")]
        public string Name { get; set; }
        [Key("index")]
        public int Index { get; set; }
        [Key("color")]
        public string Color { get; set; }
        [Key("value")]
        public double Value { get; set; }
        [Key("pricedItems")]
        public virtual List<PricedItemModel> PricedItems { get; set; }
    }
}
