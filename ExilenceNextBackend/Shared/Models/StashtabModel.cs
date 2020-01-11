
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Shared.Models
{
    public class StashtabModel
    {
        [JsonIgnore]
        public int? Id { get; set; }
        [JsonPropertyName("uuid")]
        public string ClientId { get; set; }
        public string StashTabId { get; set; }
        public string Name { get; set; }
        public int Index { get; set; }
        public string Color { get; set; }
        public decimal Value { get; set; }
        public virtual List<PricedItemModel> PricedItems { get; set; }
    }
}
