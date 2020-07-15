using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Shared.Entities
{
    public class StashTab
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string ClientId { get; set; } // This is our own id.
        public string StashTabId { get; set; } // This is GGG's Id so it's 64 chars by default.
        public string Name { get; set; }
        public int Index { get; set; }
        public string Color { get; set; }
        public decimal Value { get; set; }
        [BsonIgnore]
        public List<PricedItem> PricedItems { get; set; }

        public string SnapshotClientId { get; set; }
        public string SnapshotProfileClientId { get; set; }  //For easy deletion
    }
}
