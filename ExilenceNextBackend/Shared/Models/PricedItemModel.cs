using MessagePack;
using System.Text.Json.Serialization;

namespace Shared.Models
{
    [MessagePackObject]
    public class PricedItemModel
    {
        [JsonIgnore]
        [IgnoreMember]
        public long? Id { get; set; }
        [JsonPropertyName("uuid")]
        [Key("uuid")]
        public string ClientId { get; set; }
        [Key("inventoryId")]
        public string InventoryId { get; set; }
        [Key("itemId")]
        public string ItemId { get; set; }
        [Key("name")]
        public string Name { get; set; }
        [Key("typeLine")]
        public string TypeLine { get; set; }
        [Key("frameType")]
        public int FrameType { get; set; }
        [Key("calculated")]
        public double Calculated { get; set; }
        [Key("elder")]
        public bool Elder { get; set; }
        [Key("shaper")]
        public bool Shaper { get; set; }
        [Key("icon")]
        public string Icon { get; set; }
        [Key("ilvl")]
        public int Ilvl { get; set; }
        [Key("tier")]
        public int Tier { get; set; }
        [Key("corrupted")]
        public bool Corrupted { get; set; }
        [Key("links")]
        public int Links { get; set; }
        [Key("sockets")]
        public int Sockets { get; set; }
        [Key("quality")]
        public int Quality { get; set; }
        [Key("level")]
        public int Level { get; set; }
        [Key("stackSize")]
        public int StackSize { get; set; }
        [Key("totalStacksize")]
        public int TotalStacksize { get; set; }
        [Key("variant")]
        public string Variant { get; set; }
        [Key("total")]
        public double Total { get; set; }
        [Key("max")]
        public double Max { get; set; }
        [Key("mean")]
        public double Mean { get; set; }
        [Key("mode")]
        public double Mode { get; set; }
        [Key("min")]
        public double Min { get; set; }
        [Key("median")]
        public double Median { get; set; }
        [Key("baseType")]
        public string BaseType { get; set; }
        [Key("count")]
        public int Count { get; set; }
    }
}
