using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Text;

namespace Shared.Entities
{
    public class CacheValue
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Key { get; set; }
        public string Value { get; set; }

        [BsonRequired]
        [BsonElement("expiry")]
        public DateTime ExpireAt { get; set; }

    }
}
