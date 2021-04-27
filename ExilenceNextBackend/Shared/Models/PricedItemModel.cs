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
        [Key("itemId")]
        public string ItemId { get; set; }
        [Key("detailsId")]
        public string DetailsId { get; set; }
        [Key("calculated")]
        public double Calculated { get; set; }
        [Key("stackSize")]
        public int StackSize { get; set; }

    }
}
