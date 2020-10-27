using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Shared.Entities
{
    class ExternalPrice
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string ClientId { get; set; }
        public string Name { get; set; }
        public double? Calculated { get; set; }
        public double? Max { get; set; }
        public double? Mean { get; set; }
        public double? Median { get; set; }
        public double? Min { get; set; }
        public double? Mode { get; set; }
        public int? FrameType { get; set; }
        public string Variant { get; set; }
        public bool? Elder { get; set; }
        public bool? Shaper { get; set; }
        public string BaseType { get; set; }
        public int? Links { get; set; }
        public int? Quality { get; set; }
        public int? Ilvl { get; set; }
        public int? Level { get; set; }
        public bool? Corrupted { get; set; }
        public int? TotalStacksize { get; set; }
        public string Icon { get; set; }
        public int? Tier { get; set; }
        public int Count { get; set; }
        public string DetailsUrl { get; set; }
        public double? CustomPrice { get; set; }
    }
}
