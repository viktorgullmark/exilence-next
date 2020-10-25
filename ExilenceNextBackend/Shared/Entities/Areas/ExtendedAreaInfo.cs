using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Text;

namespace Shared.Entities.Areas
{
    public class ExtenedAreaInfo
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public EventArea EventArea { get; set; }
        public AreaEventType Type { get; set; }
        public string InstanceServer { get; set; }
        public long Timestamp { get; set; }
        public int Duration { get; set; }
        public List<PricedItem> Difference { get; set; }
        public List<PricedItem> Inventory { get; set; }
        public List<ExtenedAreaInfo> SubAreas { get; set; }
    }
}
