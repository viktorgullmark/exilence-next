using MessagePack;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace Shared.Models.Areas
{
    [Serializable]
    public class ExtenedAreaInfoModel
    {
        [JsonIgnore]
        [IgnoreMember]
        public int? Id { get; set; }
        public EventAreaModel EventArea { get; set; }
        public AreaEventTypeEnum Type { get; set; }
        public string InstanceServer { get; set; }
        public long Timestamp { get; set; }
        public int Duration { get; set; }
        public List<PricedItemModel> Difference { get; set; }
        public List<PricedItemModel> Inventory { get; set; }
        public List<ExtenedAreaInfoModel> SubAreas { get; set; }
    }
}
